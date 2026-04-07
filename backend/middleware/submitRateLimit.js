/**
 * Cap POST /api/submit per session in a rolling window (in-memory).
 */
const {
  SUBMIT_RATE_WINDOW_MS,
  SUBMIT_MAX_PER_WINDOW,
} = require("../lib/trainingConstants");

const WINDOW_MS = SUBMIT_RATE_WINDOW_MS;
const MAX_IN_WINDOW = SUBMIT_MAX_PER_WINDOW;

const windows = new Map();

function pruneExpired(now) {
  if (windows.size <= 3000) return;
  for (const [k, w] of windows) {
    if (now > w.expiresAt) windows.delete(k);
  }
}

/**
 * Call only after request body/session validation succeeds so typos do not
 * burn the quota. Returns false if 429 was sent.
 */
function consumeSubmitSlotOr429(req, res) {
  const sessionId = req.sessionID;
  if (!sessionId) return true;

  const now = Date.now();
  pruneExpired(now);

  let w = windows.get(sessionId);
  if (!w || now > w.expiresAt) {
    w = { count: 0, expiresAt: now + WINDOW_MS };
  }

  if (w.count >= MAX_IN_WINDOW) {
    res.set("Cache-Control", "no-store");
    res.status(429).json({
      error: "rate_limited",
      message:
        "Too many save attempts in a short time. Wait a few minutes or sign out and try again.",
    });
    return false;
  }

  w.count += 1;
  windows.set(sessionId, w);
  return true;
}

function clearSubmitRateWindow(sessionId) {
  if (sessionId) windows.delete(sessionId);
}

module.exports = { consumeSubmitSlotOr429, clearSubmitRateWindow };
