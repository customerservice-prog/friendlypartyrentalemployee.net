const fs = require("fs");
const path = require("path");

const SLUG_TO_FILE = {
  policies: "policies-quiz.json",
  products: "products-quiz.json",
  "customer-service": "customer-service-quiz.json",
  "quote-calls": "quote-calls-quiz.json",
};

const STAFF_QUIZ_SLUGS = Object.keys(SLUG_TO_FILE);

function normalizeStaffQuizSlug(raw) {
  const s =
    raw != null
      ? String(raw)
          .trim()
          .replace(/[^a-z0-9-]/gi, "")
          .slice(0, 64)
      : "";
  return s;
}

function isStaffQuizSlug(s) {
  return Object.prototype.hasOwnProperty.call(SLUG_TO_FILE, s);
}

function loadStaffQuiz(slug) {
  const file = SLUG_TO_FILE[slug];
  if (!file) {
    const err = new Error("unknown_staff_quiz");
    err.code = "unknown_staff_quiz";
    throw err;
  }
  const abs = path.join(__dirname, "..", "..", "data", file);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

function stripStaffAnswers(rows) {
  return rows.map(({ s, q, o }) => ({ s, q, o }));
}

module.exports = {
  STAFF_QUIZ_SLUGS,
  normalizeStaffQuizSlug,
  isStaffQuizSlug,
  loadStaffQuiz,
  stripStaffAnswers,
};
