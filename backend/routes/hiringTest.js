const express = require("express");
const { insertSubmission } = require("../db");
const {
  ANSWER_KEYS,
  TRACKS,
  normalizeTrack,
  LABELS_VA,
} = require("../lib/hiringTestTracks");
const {
  consumeHiringSubmitSlotOr429,
} = require("../middleware/hiringSubmitRateLimit");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const HIRING_SLUG = TRACKS["virtual-assistant"].quizSlug;

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
  const trackKey = normalizeTrack(body.track);
  const track = TRACKS[trackKey];
  const defaultTitle = track.defaultJobTitle;
  const jobTitle = String(body.jobTitle || defaultTitle).trim().slice(0, 120);

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

  const scored = track.score(answers);
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
      quizSlug: track.quizSlug,
      score,
      total,
      percent,
      timeTaken: "Online hiring test",
      passed,
      missedQuestions: [],
      integrityReport: {
        version: 1,
        hiringTest: true,
        hiringTrack: trackKey,
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
      hiringTrack: trackKey,
      quizSlug: track.quizSlug,
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

module.exports = { router, HIRING_SLUG, ANSWER_KEYS, LABELS: LABELS_VA };
