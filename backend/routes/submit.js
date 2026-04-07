const express = require("express");
const { insertSubmission } = require("../db");
const {
  sendQuizResultEmail,
  DEFAULT_RESULTS_EMAIL,
} = require("../mail");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }

    const score = Number(body.score);
    const total = Number(body.total);
    const percent = Number(body.percent);
    if (
      !Number.isFinite(score) ||
      !Number.isFinite(total) ||
      !Number.isFinite(percent)
    ) {
      return res
        .status(400)
        .json({ error: "score, total, and percent must be numbers" });
    }

    const timeTaken =
      body.timeTaken != null ? String(body.timeTaken) : "0:00";
    const passed = Boolean(body.passed);
    const missedQuestions = Array.isArray(body.missedQuestions)
      ? body.missedQuestions
      : [];

    const row = await insertSubmission({
      name: name.trim(),
      score,
      total,
      percent,
      timeTaken,
      passed,
      missedQuestions,
    });

    let emailSent = false;
    let emailReason = null;
    try {
      const emailResult = await sendQuizResultEmail({
        name: name.trim(),
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
      ? process.env.RESULTS_EMAIL_TO &&
        String(process.env.RESULTS_EMAIL_TO).trim() !== ""
        ? String(process.env.RESULTS_EMAIL_TO).trim()
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
    return res.status(500).json({ error: "Failed to save submission" });
  }
});

module.exports = router;
