const express = require("express");
const { insertSubmission } = require("../db");
const { scoreHiringLocal } = require("../lib/hiringTestScoreLocal");
const {
  consumeHiringSubmitSlotOr429,
} = require("../middleware/hiringSubmitRateLimit");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const HIRING_SLUG = "hiring-virtual-assistant";

const ANSWER_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
  "q15",
  "rpA",
  "rpB",
  "rpC",
  "rpD",
  "rpE",
  "q16",
  "q17",
  "q18",
  "q19",
  "q20",
];

const LABELS = {
  q1: "Q1 — Company name & physical town",
  q2: "Q2 — Main customer phone",
  q3: "Q3 — Customer service email",
  q4: "Q4 — Street address",
  q5: "Q5 — Eight rental categories",
  q6: "Q6 — Online booking tool",
  q7: "Q7 — Deposit / cancellation",
  q8: "Q8 — Setup time vs rental period",
  q9: "Q9 — Bounce houses plugged in",
  q10: "Q10 — Park setup awareness",
  q11: "Q11 — Date change scenario",
  q12: "Q12 — Angry customer / late driver",
  q13: "Q13 — Bounce house price question",
  q14: "Q14 — Water slide tomorrow",
  q15: "Q15 — Three core promises",
  rpA: "Role-play A — Friendly greeting (what you would say)",
  rpB: "Role-play B — Confused customer / 50 people BBQ",
  rpC: "Role-play C — Upset customer / late delivery",
  rpD: "Role-play D — Price shopper / competitor",
  rpE: "Role-play E — Booking walkthrough",
  q16: "Q16 — 1-star Google review response",
  q17: "Q17 — Same-day bounce house Saturday7am",
  q18: "Q18 — Cleaned equipment / hesitant customer",
  q19: "Q19 — Internal / anti-cheat question",
  q20: "Q20 — Brand personality",
};

const FIELD_MAX = 6000;

function isReasonableEmail(s) {
  const t = String(s).trim();
  if (t.length > 254 || t.length < 3) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function sanitizeAnswers(raw) {
  const out = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const k of ANSWER_KEYS) {
    const v = raw[k];
    if (v == null) continue;
    const s = String(v).trim();
    if (!s) continue;
    out[k] = s.slice(0, FIELD_MAX);
  }
  return out;
}

function answersComplete(obj) {
  for (const k of ANSWER_KEYS) {
    if (!obj[k] || !String(obj[k]).trim()) return false;
  }
  return true;
}

router.post("/submit", async (req, res) => {
  req.session._hiringTouched = Date.now();

  const body = req.body || {};
  const name = String(body.name || "").trim().slice(0, 200);
  const email = String(body.email || "").trim().slice(0, 254);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const jobTitle = String(body.jobTitle || "VA applicant").trim().slice(0, 120);

  if (!name || name.length < 2) {
    return res.status(400).json({
      error: "bad_name",
      message: "Enter your full name.",
    });
  }
  if (!isReasonableEmail(email)) {
    return res.status(400).json({
      error: "bad_email",
      message: "Enter a valid email address.",
    });
  }

  const answers = sanitizeAnswers(body.answers);
  if (!answersComplete(answers)) {
    return res.status(400).json({
      error: "incomplete_answers",
      message: "Answer every question in the form before submitting.",
    });
  }

  if (!consumeHiringSubmitSlotOr429(req, res)) {
    return;
  }

  const scored = scoreHiringLocal(answers);
  const aiRating = scored.rating;
  const aiSummary = scored.summary;

  const score = aiRating;
  const total = 100;
  const percent = aiRating;
  const passed = aiRating >= 80;

  const hiringPayload = {
    ...answers,
    _phone: phone || undefined,
  };

  try {
    const row = await insertSubmission({
      name,
      email,
      jobTitle,
      quizSlug: HIRING_SLUG,
      score,
      total,
      percent,
      timeTaken: "Online hiring test",
      passed,
      missedQuestions: [],
      integrityReport: {
        version: 1,
        hiringTest: true,
        keysAnswered: ANSWER_KEYS.length,
      },
      aiRating,
      aiFeedback: aiSummary,
      hiringAnswers: hiringPayload,
    });

    return res.status(201).json({
      ok: true,
      id: row.id,
      createdAt: row.created_at,
      aiRating,
      aiSummary,
      scoringAvailable: true,
      scoringMethod: "local_rules",
    });
  } catch (err) {
    console.error("hiring submit db", err);
    const notConfigured =
      (err && err.code === "DB_NOT_CONFIGURED") ||
      String(err.message || "").includes("Postgres");
    if (notConfigured) {
      return res.status(503).json({
        error: "database_not_configured",
        message:
          "This site cannot save applications yet (database not connected). Email the hiring manager directly.",
      });
    }
    return res.status(500).json({
      error: "save_failed",
      message: "Could not save your application. Try again later.",
    });
  }
});

module.exports = { router, HIRING_SLUG, ANSWER_KEYS, LABELS };
