/**
 * Cap POST /api/chat per session in a rolling window (in-memory; resets on process restart).
 */
const {
  CHAT_ASSISTANT_RATE_WINDOW_MS,
  CHAT_ASSISTANT_MAX_PER_WINDOW,
} = require("../lib/trainingConstants");

const WINDOW_MS = CHAT_ASSISTANT_RATE_WINDOW_MS;
const MAX_IN_WINDOW = CHAT_ASSISTANT_MAX_PER_WINDOW;

const windows = new Map();

function pruneExpired(now) {
  if (windows.size <= 3000) return;
  for (const [k, w] of windows) {
    if (now > w.expiresAt) windows.delete(k);
  }
}

function chatRateLimit(req, res, next) {
  const sessionId = req.sessionID;
  if (!sessionId) return next();

  const now = Date.now();
  pruneExpired(now);

  let w = windows.get(sessionId);
  if (!w || now > w.expiresAt) {
    w = { count: 0, expiresAt: now + WINDOW_MS };
  }

  if (w.count >= MAX_IN_WINDOW) {
    res.set("Cache-Control", "no-store");
    return res.status(429).json({
      error: "rate_limited",
      message:
        "Too many assistant requests in a short time. Wait a few minutes or sign out and back in.",
    });
  }

  w.count += 1;
  windows.set(sessionId, w);
  return next();
}

function clearChatRateWindow(sessionId) {
  if (sessionId) windows.delete(sessionId);
}

module.exports = { chatRateLimit, clearChatRateWindow };
