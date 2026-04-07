/**
 * Built-in fallbacks when env vars are unset. Production boot warns if these
 * sample values (or missing secrets) are still relied on where unsafe.
 */
module.exports = {
  DEV_SESSION_SECRET_FALLBACK:
    "dev-only-change-me-in-production-min-32-chars",
  SAMPLE_ADMIN_PASSWORD: "FriendlyAdmin2024",
  /**
   * When NODE_ENV is not production and EMPLOYEE_ACCESS_PIN is unset.
   * Set EMPLOYEE_ACCESS_PIN in production (never rely on this value live).
   */
  DEV_EMPLOYEE_PIN_FALLBACK: "3707",
};
