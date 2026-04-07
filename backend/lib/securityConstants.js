/** Shared limits for in-memory IP login throttling (see ipWindowLimiter). */
module.exports = {
  LOGIN_RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  EMPLOYEE_LOGIN_MAX_FAILURES: 40,
  ADMIN_LOGIN_MAX_FAILURES: 30,
};
