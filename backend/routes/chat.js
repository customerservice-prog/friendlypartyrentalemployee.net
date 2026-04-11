/**
 * POST /api/chat — kept for rate limits, quiz-lock tests, and legacy clients.
 * The product assistant runs entirely in the browser from official pricing + staff Q&A
 * (see /api/employee/assistant-knowledge). No external AI API keys are used.
 */
const express = require("express");
const { chatRateLimit } = require("../middleware/chatRateLimit");
const { activeTrainingQuizLock } = require("../lib/trainingQuizLock");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

function messageContentToText(content) {
  if (typeof content === "string") return content;
  if (typeof content === "number" && Number.isFinite(content)) return String(content);
  return null;
}

router.post("/", chatRateLimit, (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: "messages array required",
      message: "Invalid assistant request.",
    });
  }

  const trimmed = messages
    .slice(-30)
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => {
      const text = messageContentToText(m.content);
      if (text == null) return null;
      const content = text.slice(0, 12000);
      if (!content.length) return null;
      return { role: m.role, content };
    })
    .filter(Boolean);

  if (!trimmed.length) {
    return res.status(400).json({ error: "no valid messages" });
  }

  if (activeTrainingQuizLock(req)) {
    return res.status(403).json({
      error: "quiz_in_progress",
      message:
        "The training assistant is paused while a quiz is in progress. Finish or leave the quiz, then try again.",
    });
  }

  return res.status(503).json({
    error: "assistant_unavailable",
    message:
      "Answers come from the training assistant in your browser (official pricing and staff Q&A). Use the chat on this page—no cloud service is required.",
  });
});

module.exports = router;
