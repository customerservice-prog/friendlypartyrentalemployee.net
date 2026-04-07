/**
 * Soft cap on POST /pricing-verify per session window (reduces brute-force
 * retries across new attempts). In-memory — resets when the process restarts.
 */
const {
  PRICING_VERIFY_RATE_WINDOW_MS,
  PRICING_VERIFY_MAX_PER_WINDOW,
} = require("../lib/trainingConstants");

const WINDOW_MS = PRICING_VERIFY_RATE_WINDOW_MS;
const MAX_IN_WINDOW = PRICING_VERIFY_MAX_PER_WINDOW;

const windows = new Map();

function pruneExpired(now) {
  if (windows.size <= 3000) return;
  for (const [k, w] of windows) {
    if (now > w.expiresAt) windows.delete(k);
  }
}

function pricingVerifyRateLimit(req, res, next) {
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
        "Too many answer checks in a short time. Wait a few minutes or sign out and try again.",
    });
  }

  w.count += 1;
  windows.set(sessionId, w);
  return next();
}

function clearPricingVerifyWindow(sessionId) {
  if (sessionId) windows.delete(sessionId);
}

module.exports = { pricingVerifyRateLimit, clearPricingVerifyWindow };
