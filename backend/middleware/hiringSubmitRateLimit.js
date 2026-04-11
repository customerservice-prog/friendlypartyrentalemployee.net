/**
 * Cap POST /api/hiring-test/submit per session (rolling window).
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_IN_WINDOW = 6;

const windows = new Map();

function pruneExpired(now) {
  if (windows.size <= 2000) return;
  for (const [k, w] of windows) {
    if (now > w.expiresAt) windows.delete(k);
  }
}

/**
 * @returns {boolean} false if 429 was sent
 */
function consumeHiringSubmitSlotOr429(req, res) {
  const sid = req.sessionID ? String(req.sessionID) : "";
  const ip = req.ip ? String(req.ip) : "";
  const key = sid ? `s:${sid}` : ip ? `ip:${ip}` : "anon";

  const now = Date.now();
  pruneExpired(now);

  let w = windows.get(key);
  if (!w || now > w.expiresAt) {
    w = { count: 0, expiresAt: now + WINDOW_MS };
  }

  if (w.count >= MAX_IN_WINDOW) {
    res.set("Cache-Control", "no-store");
    res.status(429).json({
      error: "rate_limited",
      message:
        "Too many submissions from this browser session. Wait about an hour or try another device.",
    });
    return false;
  }

  w.count += 1;
  windows.set(key, w);
  return true;
}

module.exports = { consumeHiringSubmitSlotOr429 };
