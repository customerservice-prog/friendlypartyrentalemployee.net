/**
 * Single source of truth for pricing-quiz rules shared by training + submit routes.
 * Frontend quiz timer is 20 minutes (see quiz-pricing.html); submit TTL adds buffer.
 */
module.exports = {
  PRICING_PASS_PERCENT: 80,
  /** After POST /quiz-integrity-ack, GET /pricing-questions is allowed for this long. */
  QUIZ_INTEGRITY_ACK_TTL_MS: 4 * 60 * 60 * 1000,
  /**
   * While a quiz lock is fresh, POST /api/chat and browser assistants stay paused.
   * Priced longer than the longest timed quiz; pricing verify refreshes `at` each answer.
   */
  TRAINING_QUIZ_CHAT_LOCK_TTL_MS: 26 * 60 * 1000,
  /** After /pricing-summary, how long /api/submit may use the server-held result. */
  PRICING_SUMMARY_SUBMIT_TTL_MS: 25 * 60 * 1000,
  /** Aligns with pricing quiz duration; rate-limit window for /pricing-verify. */
  PRICING_VERIFY_RATE_WINDOW_MS: 20 * 60 * 1000,
  PRICING_VERIFY_MAX_PER_WINDOW: 200,
  /** Per-session rolling window for POST /api/chat (cost + abuse guard). */
  CHAT_ASSISTANT_RATE_WINDOW_MS: 15 * 60 * 1000,
  CHAT_ASSISTANT_MAX_PER_WINDOW: 80,
  /** Per-session rolling window for POST /api/submit (abuse / accidental retries). */
  SUBMIT_RATE_WINDOW_MS: 15 * 60 * 1000,
  SUBMIT_MAX_PER_WINDOW: 30,
};
