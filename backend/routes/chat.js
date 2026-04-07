const express = require("express");
const OpenAI = require("openai");
const { buildPricingKnowledgeBlock } = require("../lib/knowledge");
const { chatRateLimit } = require("../middleware/chatRateLimit");
const { activeTrainingQuizLock } = require("../lib/trainingQuizLock");

const router = express.Router();

/** Wall-clock cap per assistant request (SDK default is 10 minutes). */
function readChatOpenAiTimeoutMs() {
  const raw = process.env.OPENAI_TIMEOUT_MS;
  if (raw == null || String(raw).trim() === "") return 90_000;
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n)) return 90_000;
  return Math.min(Math.max(n, 20_000), 180_000);
}

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const SYSTEM_PROMPT = `You are a friendly, professional training assistant for employees of Friendly Party Rental (friendlypartyrental.com). Your job is to help staff respond accurately to customer questions about quotes, orders, rental items, pricing, and how to talk about products.

Rules:
- Use the REFERENCE PRICE LIST below when the question is about a listed item. Quote those figures exactly when they apply.
- If something is not covered in the reference, say clearly that you do not see it in the training catalog and the employee should confirm with a manager, the live price book, or the shop system before quoting.
- Do not invent prices, policies, delivery rules, or legal terms.
- Prefer short, actionable answers staff can read on a phone. Offer sample customer-facing wording when useful.
- If the employee asks meta questions (e.g. whether you are working), answer briefly and return to rental help.
- Format answers with short paragraphs or bullet points for quick reading on the job.

REFERENCE PRICE LIST (from official employee training quiz):
`;

function messageContentToText(content) {
  if (typeof content === "string") return content;
  if (typeof content === "number" && Number.isFinite(content)) return String(content);
  return null;
}

function readChatModel() {
  const raw = process.env.OPENAI_MODEL;
  if (raw == null || String(raw).trim() === "") return "gpt-4o-mini";
  return String(raw).trim().slice(0, 128);
}

router.post("/", chatRateLimit, async (req, res) => {
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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    return res.status(503).json({
      error: "assistant_unavailable",
      message:
        "The training assistant is not available right now. Try again later or ask your manager.",
    });
  }

  let knowledge;
  try {
    knowledge = buildPricingKnowledgeBlock();
  } catch (e) {
    console.error("knowledge build", e);
    return res.status(500).json({
      error: "knowledge_load_failed",
      message:
        "Training materials could not be loaded. Try again later or ask your manager.",
    });
  }

  const openai = new OpenAI({
    apiKey: String(apiKey).trim(),
    timeout: readChatOpenAiTimeoutMs(),
    /** One retry for transient 429/5xx; timeouts still cap per attempt. */
    maxRetries: 1,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: readChatModel(),
      max_tokens: 1200,
      temperature: 0.35,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + knowledge },
        ...trimmed,
      ],
    });

    const text =
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message
        ? completion.choices[0].message.content || ""
        : "";

    return res.json({
      message: { role: "assistant", content: text.trim() || "(No response)" },
    });
  } catch (err) {
    const code =
      err && typeof err === "object" && err.status != null ? err.status : "";
    console.error(
      "OpenAI chat error",
      err.message || err,
      code !== "" ? "status=" + code : ""
    );
    const isTimeout = err instanceof OpenAI.APIConnectionTimeoutError;
    const isAuth =
      code === 401 ||
      (err.message &&
        /401|invalid.*key|incorrect api key/i.test(String(err.message)));
    const safe = isTimeout
      ? "The assistant took too long to respond. Try a shorter question."
      : isAuth
        ? "Assistant is misconfigured on the server. Use the offline training library or ask your manager to check the API key."
        : "Assistant request failed. Try again in a moment.";
    return res.status(502).json({
      error: isTimeout ? "assistant_timeout" : "assistant_upstream_error",
      message: safe,
    });
  }
});

module.exports = router;
