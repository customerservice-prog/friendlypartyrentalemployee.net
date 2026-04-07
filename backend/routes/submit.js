const express = require("express");
const { PRICING_SUMMARY_SUBMIT_TTL_MS } = require("../lib/trainingConstants");
const { insertSubmission } = require("../db");
const {
  sendQuizResultEmail,
  DEFAULT_RESULTS_EMAIL,
} = require("../mail");
const {
  consumeSubmitSlotOr429,
} = require("../middleware/submitRateLimit");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

function isReasonableEmail(s) {
  const t = String(s).trim();
  if (t.length > 254 || t.length < 3) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

const MISSED_FIELD_MAX = 4000;
const MISSED_LIST_MAX_ITEMS = 200;

function sanitizeMissedQuestions(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MISSED_LIST_MAX_ITEMS)
    .map((m) => {
      if (!m || typeof m !== "object") return null;
      return {
        question: String(m.question ?? "").slice(0, MISSED_FIELD_MAX),
        yourAnswer: String(m.yourAnswer ?? "").slice(0, MISSED_FIELD_MAX),
        correctAnswer: String(m.correctAnswer ?? "").slice(0, MISSED_FIELD_MAX),
      };
    })
    .filter(Boolean);
}

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "name is required",
        message: "Enter your name on the quiz intro screen.",
      });
    }
    const nameTrimmed = name.trim().slice(0, 200);
    if (!nameTrimmed) {
      return res.status(400).json({
        error: "name is required",
        message: "Enter your name on the quiz intro screen.",
      });
    }

    const emailRaw = body.email;
    if (!emailRaw || typeof emailRaw !== "string" || !emailRaw.trim()) {
      return res.status(400).json({
        error: "email is required",
        message: "Enter your work email on the quiz intro screen.",
      });
    }
    const email = emailRaw.trim();
    if (!isReasonableEmail(email)) {
      return res.status(400).json({
        error: "valid email is required",
        message: "Use a valid work email address.",
      });
    }

    const jobTitleRaw = body.jobTitle;
    if (
      jobTitleRaw == null ||
      typeof jobTitleRaw !== "string" ||
      !jobTitleRaw.trim()
    ) {
      return res.status(400).json({
        error: "job title is required",
        message: "Enter your job title on the quiz intro screen.",
      });
    }
    const jobTitle = jobTitleRaw.trim().slice(0, 200);

    const score = Number(body.score);
    const total = Number(body.total);
    const percent = Number(body.percent);
    if (
      !Number.isFinite(score) ||
      !Number.isFinite(total) ||
      !Number.isFinite(percent)
    ) {
      return res.status(400).json({
        error: "score, total, and percent must be numbers",
        message:
          "Score data was invalid. Go back to the quiz results and try saving again.",
      });
    }
    if (
      !Number.isInteger(score) ||
      !Number.isInteger(total) ||
      !Number.isInteger(percent)
    ) {
      return res.status(400).json({
        error: "invalid_score_shape",
        message:
          "Score data was invalid. Go back to the quiz results and try saving again.",
      });
    }
    if (
      total < 1 ||
      total > 5000 ||
      score < 0 ||
      score > total ||
      percent < 0 ||
      percent > 100
    ) {
      return res.status(400).json({
        error: "invalid_score_bounds",
        message:
          "Score data was invalid. Go back to the quiz results and try saving again.",
      });
    }
    const pctExpected = Math.round((score / total) * 100);
    if (percent !== pctExpected) {
      return res.status(400).json({
        error: "percent_mismatch",
        message:
          "Score data was inconsistent. Go back to the quiz results and try saving again.",
      });
    }

    const timeTaken = (
      body.timeTaken != null ? String(body.timeTaken) : "0:00"
    ).slice(0, 32);
    const passed = Boolean(body.passed);
    let missedQuestions = Array.isArray(body.missedQuestions)
      ? body.missedQuestions
      : [];

    const quizSlug =
      body.quizSlug != null && String(body.quizSlug).trim() !== ""
        ? String(body.quizSlug).trim()
        : "pricing";

    const slugNorm =
      String(quizSlug)
        .trim()
        .replace(/[^a-z0-9-]/gi, "")
        .slice(0, 64) || "pricing";

    if (slugNorm === "pricing") {
      const last = req.session.pricingLastSummary;
      if (!last || typeof last.at !== "number") {
        return res.status(400).json({
          error: "session_quiz_required",
          message:
            "Open the pricing quiz, finish it, and load your results before saving.",
        });
      }
      if (Date.now() - last.at > PRICING_SUMMARY_SUBMIT_TTL_MS) {
        return res.status(400).json({
          error: "quiz_session_expired",
          message:
            "Results expired — go back to the pricing quiz, finish it again, then save.",
        });
      }
      if (
        last.score !== score ||
        last.total !== total ||
        last.percent !== percent ||
        last.passed !== passed
      ) {
        return res.status(400).json({
          error: "score_mismatch",
          message:
            "Score data did not match the server. Refresh and complete the quiz again.",
        });
      }
      missedQuestions = sanitizeMissedQuestions(last.missedQuestions);
    } else {
      missedQuestions = sanitizeMissedQuestions(missedQuestions);
    }

    if (!consumeSubmitSlotOr429(req, res)) {
      return;
    }

    const row = await insertSubmission({
      name: nameTrimmed,
      email,
      jobTitle,
      quizSlug,
      score,
      total,
      percent,
      timeTaken,
      passed,
      missedQuestions,
    });

    if (slugNorm === "pricing") {
      delete req.session.pricingLastSummary;
    }

    let emailSent = false;
    let emailReason = null;
    let emailResult = null;
    try {
      emailResult = await sendQuizResultEmail({
        name: nameTrimmed,
        employeeEmail: email,
        jobTitle,
        quizSlug,
        score,
        total,
        percent,
        timeTaken,
        passed,
        missedQuestions,
        submissionId: row.id,
      });
      emailSent = !!emailResult.sent;
      emailReason = emailResult.reason || null;
    } catch (mailErr) {
      console.error("sendQuizResultEmail failed", mailErr);
    }

    const notifyEmail = emailSent
      ? emailResult && emailResult.to
        ? emailResult.to
        : DEFAULT_RESULTS_EMAIL
      : null;

    return res.status(201).json({
      ok: true,
      id: row.id,
      createdAt: row.created_at,
      emailSent,
      emailReason,
      notifyEmail,
    });
  } catch (err) {
    console.error("submit error", err);
    return res.status(500).json({
      error: "Failed to save submission",
      message:
        "Results could not be saved. Check your connection or try again — ask your manager if it keeps happening.",
    });
  }
});

module.exports = router;
