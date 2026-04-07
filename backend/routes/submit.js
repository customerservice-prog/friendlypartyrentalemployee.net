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

function clampInt(n, lo, hi) {
  const x = parseInt(String(n), 10);
  if (!Number.isFinite(x)) return lo;
  return Math.min(Math.max(x, lo), hi);
}

const INTEGRITY_TIMING_MAX = 120;

/** Browser signals only — trainees are not asked to disclose tools on the quiz. */
function sanitizeIntegrityReport(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    raw = {};
  }
  const o = {
    version: 1,
    quiz: String(raw.quiz || "").trim().slice(0, 32),
    capturedAt: String(raw.capturedAt || "").trim().slice(0, 40),
    tabHiddenCount: clampInt(raw.tabHiddenCount, 0, 50000),
    totalHiddenMs: clampInt(raw.totalHiddenMs, 0, 7200000),
    pasteDuringQuiz: clampInt(raw.pasteDuringQuiz, 0, 100000),
    veryFastAnswerCount: clampInt(raw.veryFastAnswerCount, 0, 5000),
    medianAnswerMs: clampInt(raw.medianAnswerMs, 0, 600000),
  };
  if (Array.isArray(raw.answerTimingsMs)) {
    o.answerTimingsMs = raw.answerTimingsMs
      .slice(0, INTEGRITY_TIMING_MAX)
      .map((n) => clampInt(n, 0, 600000));
  } else {
    o.answerTimingsMs = [];
  }
  o.reviewHints = buildReviewHints(o);
  return o;
}

/** Manager-facing summary — not proof; cannot identify a specific product (e.g. ChatGPT vs Google). */
function buildManagerIntegrityAssessment(o, passed) {
  let riskScore = 0;
  const reasons = [];
  const channels = [];

  if (o.tabHiddenCount >= 4) {
    riskScore += 2;
    reasons.push(
      `Left the quiz page repeatedly (${o.tabHiddenCount} times while the quiz was visible). Often consistent with looking up answers in another tab or app.`
    );
    channels.push("Another browser tab or different application");
  }
  if (o.totalHiddenMs >= 120000) {
    riskScore += 2;
    reasons.push(
      `Long total time with the quiz tab hidden (~${Math.round(
        o.totalHiddenMs / 60000
      )} minutes). Can match extended search or chat sessions.`
    );
    if (!channels.length) {
      channels.push("Another browser tab or different application");
    }
  }
  if (o.pasteDuringQuiz >= 1) {
    riskScore += 2;
    reasons.push(
      `Paste detected during the quiz (${o.pasteDuringQuiz} time(s)). Commonly consistent with copying from search results, notes, AI chat, or documents—not definite proof.`
    );
    channels.push("Clipboard (search, notes, AI chat, email, or document)");
  }
  if (o.veryFastAnswerCount >= 8) {
    riskScore += 2;
    reasons.push(
      `Many answers submitted very soon after each question appeared (${o.veryFastAnswerCount} under ~1.5s). Can match prepared or external answers.`
    );
    if (!channels.length) {
      channels.push("Prepared answers or external source");
    }
  }
  const nTimings = o.answerTimingsMs.length;
  if (nTimings >= 15 && o.medianAnswerMs > 0 && o.medianAnswerMs < 2500) {
    riskScore += 1;
    reasons.push(
      `Median time to answer was very low (${
        Math.round(o.medianAnswerMs / 100) / 10
      }s) across ${nTimings} responses.`
    );
  }
  if (passed && riskScore >= 4) {
    riskScore += 1;
    reasons.push(
      "Quiz was marked passed despite several flags—investigate whether knowledge is genuine."
    );
  }

  if (o.pasteDuringQuiz >= 1 && o.veryFastAnswerCount >= 5) {
    channels.push(
      "Pattern sometimes seen with AI chat or copy-paste workflows (cannot confirm which tool)"
    );
  }

  let riskLevel = "low";
  if (riskScore >= 6) riskLevel = "elevated";
  else if (riskScore >= 3) riskLevel = "moderate";

  const uniqueChannels = [...new Set(channels)];

  let employmentGuidance = "";
  if (riskLevel === "low") {
    employmentGuidance =
      "Hire / continued employment: Automated signals alone do not suggest strong concern. If interview and references match, this submission would not—by itself—argue against hiring or keeping the person. Use your normal process.";
  } else if (riskLevel === "moderate") {
    employmentGuidance =
      "Hire / continued employment: Consider verifying knowledge another way (verbal quiz, supervised retest, or reference check) before a final offer. For current staff, review with HR and document—do not discipline based only on this screen.";
  } else {
    employmentGuidance =
      "Hire / continued employment: Multiple red-flag patterns. For applicants, consider not extending an offer until knowledge is verified independently. For employees, escalate to HR; do not terminate from this report alone—due process and policy still apply.";
  }

  return {
    riskLevel,
    riskScore,
    suspectedChannels:
      uniqueChannels.length > 0
        ? uniqueChannels
        : ["No specific channel indicated by these metrics"],
    reasons,
    toolDisclaimer:
      "The browser cannot determine whether someone used ChatGPT, Google, a friend, written notes, or another tool—only behaviors that sometimes go with unauthorized help.",
    employmentGuidance,
    legalDisclaimer:
      "Not legal advice. These are automated heuristics, not proof. Apply company policy and employment law.",
  };
}

function buildReviewHints(o) {
  const hints = [];
  if (o.tabHiddenCount >= 4) {
    hints.push({
      code: "many_tab_hides",
      label: "Tab or window hidden often during quiz",
      value: o.tabHiddenCount,
    });
  }
  if (o.totalHiddenMs >= 120000) {
    hints.push({
      code: "long_time_hidden",
      label: "Page hidden for a long total time",
      detailMs: o.totalHiddenMs,
    });
  }
  if (o.pasteDuringQuiz >= 1) {
    hints.push({
      code: "paste_events",
      label: "Paste events while quiz was active",
      value: o.pasteDuringQuiz,
    });
  }
  if (o.veryFastAnswerCount >= 8) {
    hints.push({
      code: "very_fast_answers",
      label: "Many answers under ~1.5s after question shown",
      value: o.veryFastAnswerCount,
    });
  }
  if (hints.length === 0) {
    hints.push({
      code: "no_automated_flags",
      label: "No automated review flags (not proof of compliance)",
      value: null,
    });
  }
  return hints;
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

    const integrityReport = sanitizeIntegrityReport(body.integrityReport);
    integrityReport.managerAssessment = buildManagerIntegrityAssessment(
      integrityReport,
      passed
    );

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
      integrityReport,
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
