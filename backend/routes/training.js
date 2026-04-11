const express = require("express");
const { loadPricingQuiz } = require("../lib/knowledge");
const {
  PRICING_PASS_PERCENT,
  QUIZ_INTEGRITY_ACK_TTL_MS,
} = require("../lib/trainingConstants");
const {
  touchTrainingQuizLock,
  clearTrainingQuizLock,
} = require("../lib/trainingQuizLock");
const {
  pricingVerifyRateLimit,
  clearPricingVerifyWindow,
} = require("../middleware/pricingVerifyRateLimit");
const { clearSubmitRateWindow } = require("../middleware/submitRateLimit");
const {
  loadStaffQuiz,
  stripStaffAnswers,
  isStaffQuizSlug,
  normalizeStaffQuizSlug,
} = require("../lib/staffQuizzes");

function noStore(_req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}

function quizRows() {
  return loadPricingQuiz();
}

/** Public-facing question shape (no answer key). */
function stripAnswers(rows) {
  return rows.map(({ s, q, o }) => ({ s, q, o }));
}

function quizIntegrityAckValid(req) {
  const t = req.session && req.session.quizIntegrityAckAt;
  if (typeof t !== "number" || !Number.isFinite(t)) return false;
  return Date.now() - t <= QUIZ_INTEGRITY_ACK_TTL_MS;
}

function normalizeActivitySlug(body) {
  const slug =
    body.slug != null
      ? String(body.slug).trim().replace(/[^a-z0-9-]/gi, "").slice(0, 64)
      : "";
  return slug;
}

function postQuizActivityFull(req, res) {
  const body = req.body || {};
  if (body.active === false || body.active === "false") {
    clearTrainingQuizLock(req);
    return res.json({ ok: true });
  }
  const slug = normalizeActivitySlug(body);
  if (!slug.length) {
    return res.status(400).json({
      error: "bad_slug",
      message: "Missing quiz identifier.",
    });
  }
  touchTrainingQuizLock(req, slug);
  return res.json({ ok: true });
}

function verifyPayload(rows, i, c) {
  const item = rows[i];
  const correctIdx = item.a;
  const correct = c === correctIdx;
  return {
    correct,
  };
}

/** Pricing quiz APIs for applicants (no staff PIN). Session still tracks attempts. */
const trainingPublicRouter = express.Router();
trainingPublicRouter.use(noStore);

trainingPublicRouter.post("/quiz-integrity-ack", (req, res) => {
  req.session.quizIntegrityAckAt = Date.now();
  res.json({ ok: true });
});

/**
 * Unauthenticated users may only start pricing; staff slugs fall through to
 * the protected router (requireEmployee + full handler).
 */
trainingPublicRouter.post("/quiz-activity", (req, res, next) => {
  const body = req.body || {};
  if (body.active === false || body.active === "false") {
    return postQuizActivityFull(req, res);
  }
  const slug = normalizeActivitySlug(body);
  if (slug === "pricing") {
    touchTrainingQuizLock(req, slug);
    return res.json({ ok: true });
  }
  next();
});

trainingPublicRouter.get("/pricing-questions", (req, res) => {
  try {
    if (!quizIntegrityAckValid(req)) {
      return res.status(403).json({
        error: "quiz_ack_required",
        message:
          "Confirm the quiz integrity rules on the quiz page, then start again.",
      });
    }
    const rows = quizRows();
    res.json({
      questions: stripAnswers(rows),
      passPercent: PRICING_PASS_PERCENT,
    });
  } catch (e) {
    console.error("training pricing-questions", e);
    res.status(500).json({
      error: "failed_to_load_questions",
      message:
        "Quiz could not be loaded. Try again later or ask your manager.",
    });
  }
});

trainingPublicRouter.post("/pricing-reset", (req, res) => {
  req.session.pricingVerified = {};
  delete req.session.pricingLastSummary;
  clearTrainingQuizLock(req);
  clearPricingVerifyWindow(req.sessionID);
  clearSubmitRateWindow(req.sessionID);
  res.json({ ok: true });
});

trainingPublicRouter.post(
  "/pricing-verify",
  pricingVerifyRateLimit,
  (req, res) => {
    try {
      const rows = quizRows();
      const n = rows.length;
      const body = req.body || {};
      const i = Number(body.index);
      let c = body.choiceIndex;
      if (c === null || c === undefined) c = -1;
      c = Number(c);

      if (!Number.isInteger(i) || i < 0 || i >= n) {
        return res.status(400).json({
          error: "bad_index",
          message: "Invalid question. Refresh and start the quiz again.",
        });
      }
      if (
        c !== -1 &&
        (!Number.isInteger(c) || c < 0 || c >= rows[i].o.length)
      ) {
        return res.status(400).json({
          error: "bad_choice",
          message: "Invalid answer selection. Refresh and try again.",
        });
      }

      req.session.pricingVerified = req.session.pricingVerified || {};
      const prev = req.session.pricingVerified[i];
      if (prev !== undefined) {
        if (prev !== c) {
          return res.status(409).json({ error: "answer_locked" });
        }
        touchTrainingQuizLock(req, "pricing");
        return res.json(verifyPayload(rows, i, c));
      }
      req.session.pricingVerified[i] = c;
      touchTrainingQuizLock(req, "pricing");
      return res.json(verifyPayload(rows, i, c));
    } catch (e) {
      console.error("training pricing-verify", e);
      return res.status(500).json({
        error: "verify_failed",
        message: "Could not record your answer. Try again in a moment.",
      });
    }
  }
);

trainingPublicRouter.post("/pricing-summary", (req, res) => {
  try {
    const rows = quizRows();
    const n = rows.length;
    const v = req.session.pricingVerified || {};

    let score = 0;
    const missedQuestions = [];
    for (let i = 0; i < n; i++) {
      const c = v[i];
      if (!Number.isInteger(c)) {
        return res.status(400).json({
          error: "incomplete",
          answered: Object.keys(v).length,
          expected: n,
          message:
            "Not all questions were answered on the server. Finish every question or refresh and start over.",
        });
      }
      const item = rows[i];
      if (c !== -1 && (c < 0 || c >= item.o.length)) {
        return res.status(400).json({ error: "bad_session" });
      }
      const correctIdx = item.a;
      if (c === correctIdx) score++;
      else {
        missedQuestions.push({
          question: item.q,
          yourAnswer:
            c === -1 ? "(no answer)" : String(item.o[c] ?? ""),
          correctAnswer: String(item.o[correctIdx]),
        });
      }
    }

    const total = n;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= PRICING_PASS_PERCENT;

    const missedQuestionsPublic = missedQuestions.map((m) => ({
      question: m.question,
      yourAnswer: m.yourAnswer,
    }));

    req.session.pricingLastSummary = {
      score,
      total,
      percent,
      passed,
      missedQuestions,
      at: Date.now(),
    };

    clearTrainingQuizLock(req);

    return res.json({
      score,
      total,
      percent,
      passed,
      missedQuestions: missedQuestionsPublic,
    });
  } catch (e) {
    console.error("training pricing-summary", e);
    return res.status(500).json({
      error: "summary_failed",
      message: "Could not calculate your score. Try again in a moment.",
    });
  }
});

/** Staff-only quiz-activity slugs (customer-service, products, …). */
const trainingStaffRouter = express.Router();
trainingStaffRouter.use(noStore);
trainingStaffRouter.post("/quiz-activity", postQuizActivityFull);

function staffQuizBucket(req, slug) {
  req.session.staffQuizSessions = req.session.staffQuizSessions || {};
  if (!req.session.staffQuizSessions[slug]) {
    req.session.staffQuizSessions[slug] = { verified: {} };
  }
  return req.session.staffQuizSessions[slug];
}

trainingStaffRouter.get("/staff-quiz-questions", (req, res) => {
  const slug = normalizeStaffQuizSlug(req.query.slug);
  if (!isStaffQuizSlug(slug)) {
    return res.status(400).json({
      error: "bad_slug",
      message: "Unknown quiz.",
    });
  }
  try {
    const rows = loadStaffQuiz(slug);
    res.json({
      questions: stripStaffAnswers(rows),
      passPercent: PRICING_PASS_PERCENT,
    });
  } catch (e) {
    console.error("training staff-quiz-questions", slug, e);
    res.status(500).json({
      error: "failed_to_load_questions",
      message: "Quiz could not be loaded. Try again or ask your manager.",
    });
  }
});

trainingStaffRouter.post("/staff-quiz-reset", (req, res) => {
  const slug = normalizeStaffQuizSlug((req.body || {}).slug);
  if (!isStaffQuizSlug(slug)) {
    return res.status(400).json({
      error: "bad_slug",
      message: "Unknown quiz.",
    });
  }
  const bucket = staffQuizBucket(req, slug);
  bucket.verified = {};
  req.session.staffQuizLastSummary = req.session.staffQuizLastSummary || {};
  delete req.session.staffQuizLastSummary[slug];
  clearTrainingQuizLock(req);
  clearPricingVerifyWindow(req.sessionID);
  res.json({ ok: true });
});

trainingStaffRouter.post(
  "/staff-quiz-verify",
  pricingVerifyRateLimit,
  (req, res) => {
    const slug = normalizeStaffQuizSlug((req.body || {}).slug);
    if (!isStaffQuizSlug(slug)) {
      return res.status(400).json({
        error: "bad_slug",
        message: "Unknown quiz.",
      });
    }
    try {
      const rows = loadStaffQuiz(slug);
      const n = rows.length;
      const body = req.body || {};
      const i = Number(body.index);
      let c = body.choiceIndex;
      if (c === null || c === undefined) c = -1;
      c = Number(c);

      if (!Number.isInteger(i) || i < 0 || i >= n) {
        return res.status(400).json({
          error: "bad_index",
          message: "Invalid question. Refresh and start the quiz again.",
        });
      }
      if (
        c !== -1 &&
        (!Number.isInteger(c) || c < 0 || c >= rows[i].o.length)
      ) {
        return res.status(400).json({
          error: "bad_choice",
          message: "Invalid answer selection. Refresh and try again.",
        });
      }

      const bucket = staffQuizBucket(req, slug);
      const verified = bucket.verified;
      const prev = verified[i];
      if (prev !== undefined) {
        if (prev !== c) {
          return res.status(409).json({ error: "answer_locked" });
        }
        touchTrainingQuizLock(req, slug);
        return res.json(verifyPayload(rows, i, c));
      }
      verified[i] = c;
      touchTrainingQuizLock(req, slug);
      return res.json(verifyPayload(rows, i, c));
    } catch (e) {
      console.error("training staff-quiz-verify", slug, e);
      res.status(500).json({
        error: "verify_failed",
        message: "Could not record your answer. Try again in a moment.",
      });
    }
  }
);

trainingStaffRouter.post("/staff-quiz-summary", (req, res) => {
  const slug = normalizeStaffQuizSlug((req.body || {}).slug);
  if (!isStaffQuizSlug(slug)) {
    return res.status(400).json({
      error: "bad_slug",
      message: "Unknown quiz.",
    });
  }
  try {
    const rows = loadStaffQuiz(slug);
    const n = rows.length;
    const bucket = staffQuizBucket(req, slug);
    const v = bucket.verified;

    let score = 0;
    const missedQuestions = [];
    for (let i = 0; i < n; i++) {
      const c = v[i];
      if (!Number.isInteger(c)) {
        return res.status(400).json({
          error: "incomplete",
          answered: Object.keys(v).length,
          expected: n,
          message:
            "Not all questions were answered on the server. Finish every question or refresh and start over.",
        });
      }
      const item = rows[i];
      if (c !== -1 && (c < 0 || c >= item.o.length)) {
        return res.status(400).json({ error: "bad_session" });
      }
      const correctIdx = item.a;
      if (c === correctIdx) score++;
      else {
        missedQuestions.push({
          question: item.q,
          yourAnswer:
            c === -1 ? "(no answer)" : String(item.o[c] ?? ""),
          correctAnswer: String(item.o[correctIdx]),
        });
      }
    }

    const total = n;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= PRICING_PASS_PERCENT;

    const missedQuestionsPublic = missedQuestions.map((m) => ({
      question: m.question,
      yourAnswer: m.yourAnswer,
    }));

    req.session.staffQuizLastSummary = req.session.staffQuizLastSummary || {};
    req.session.staffQuizLastSummary[slug] = {
      score,
      total,
      percent,
      passed,
      missedQuestions,
      at: Date.now(),
    };

    clearTrainingQuizLock(req);

    return res.json({
      score,
      total,
      percent,
      passed,
      missedQuestions: missedQuestionsPublic,
    });
  } catch (e) {
    console.error("training staff-quiz-summary", slug, e);
    res.status(500).json({
      error: "summary_failed",
      message: "Could not calculate your score. Try again in a moment.",
    });
  }
});

module.exports = {
  trainingPublicRouter,
  trainingStaffRouter,
};
