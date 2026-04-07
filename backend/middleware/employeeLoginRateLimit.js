const { createIpWindowLimiter } = require("../lib/ipWindowLimiter");
const {
  LOGIN_RATE_LIMIT_WINDOW_MS,
  EMPLOYEE_LOGIN_MAX_FAILURES,
} = require("../lib/securityConstants");

const limiter = createIpWindowLimiter({
  windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
  maxFailures: EMPLOYEE_LOGIN_MAX_FAILURES,
});

module.exports = {
  isLoginRateLimited: (req) => limiter.isLimited(req),
  noteLoginFailure: (req) => limiter.noteFailure(req),
  clearLoginFailures: (req) => limiter.clear(req),
};
