/** Client IP for rate limiting (use with `app.set("trust proxy", 1)` behind proxies). */
function clientIp(req) {
  const raw = req.ip || req.socket?.remoteAddress || "unknown";
  const s = String(raw).trim();
  return s || "unknown";
}

/**
 * Failed-attempt counter per IP with rolling expiry (in-memory).
 * @param {{ windowMs: number, maxFailures: number, pruneAtSize?: number }} opts
 */
function createIpWindowLimiter({
  windowMs,
  maxFailures,
  pruneAtSize = 5000,
}) {
  const attempts = new Map();

  function prune(now) {
    if (attempts.size <= pruneAtSize) return;
    for (const [k, v] of attempts) {
      if (now > v.expiresAt) attempts.delete(k);
    }
  }

  return {
    isLimited(req) {
      const ip = clientIp(req);
      const now = Date.now();
      prune(now);
      const a = attempts.get(ip);
      if (!a || now > a.expiresAt) return false;
      return a.failures >= maxFailures;
    },
    noteFailure(req) {
      const ip = clientIp(req);
      const now = Date.now();
      prune(now);
      let a = attempts.get(ip);
      if (!a || now > a.expiresAt) {
        a = { failures: 0, expiresAt: now + windowMs };
      }
      a.failures += 1;
      attempts.set(ip, a);
    },
    clear(req) {
      attempts.delete(clientIp(req));
    },
  };
}

module.exports = { createIpWindowLimiter, clientIp };
