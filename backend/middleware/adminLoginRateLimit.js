const { createIpWindowLimiter } = require("../lib/ipWindowLimiter");
const {
  LOGIN_RATE_LIMIT_WINDOW_MS,
  ADMIN_LOGIN_MAX_FAILURES,
} = require("../lib/securityConstants");

const limiter = createIpWindowLimiter({
  windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
  maxFailures: ADMIN_LOGIN_MAX_FAILURES,
});

module.exports = {
  isAdminLoginRateLimited: (req) => limiter.isLimited(req),
  noteAdminLoginFailure: (req) => limiter.noteFailure(req),
  clearAdminLoginFailures: (req) => limiter.clear(req),
};
