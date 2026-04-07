const express = require("express");
const {
  clearPricingVerifyWindow,
} = require("../middleware/pricingVerifyRateLimit");
const { clearChatRateWindow } = require("../middleware/chatRateLimit");
const { clearSubmitRateWindow } = require("../middleware/submitRateLimit");
const {
  isLoginRateLimited,
  noteLoginFailure,
  clearLoginFailures,
} = require("../middleware/employeeLoginRateLimit");
const { DEV_EMPLOYEE_PIN_FALLBACK } = require("../lib/devDefaults");
const {
  activeTrainingQuizLock,
  clearTrainingQuizLock,
} = require("../lib/trainingQuizLock");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

function normalizePinFromEnv(raw) {
  if (raw == null) return "";
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function employeePin() {
  const p = process.env.EMPLOYEE_ACCESS_PIN;
  const normalized = normalizePinFromEnv(p);
  if (normalized !== "") return normalized;
  if (process.env.NODE_ENV === "production") return null;
  return DEV_EMPLOYEE_PIN_FALLBACK;
}

router.post("/login", (req, res) => {
  if (isLoginRateLimited(req)) {
    return res.status(429).json({
      ok: false,
      error: "rate_limited",
      message:
        "Too many sign-in attempts from this network. Wait about 15 minutes or try another connection.",
    });
  }
  const expected = employeePin();
  if (expected == null) {
    return res.status(503).json({
      ok: false,
      error: "sign_in_unavailable",
      message:
        "Employee sign-in is not available on the server yet. Ask your manager.",
    });
  }
  const rawPin = req.body && req.body.pin;
  let bodyPin = "";
  if (rawPin == null) {
    bodyPin = "";
  } else if (typeof rawPin === "string") {
    bodyPin = rawPin.trim();
  } else if (typeof rawPin === "number" && Number.isFinite(rawPin)) {
    bodyPin = String(rawPin);
  } else {
    noteLoginFailure(req);
    return res.status(400).json({
      ok: false,
      error: "invalid_pin",
      message: "That PIN is not correct. Try again or ask your manager.",
    });
  }
  if (bodyPin.length > 256) {
    noteLoginFailure(req);
    return res.status(400).json({
      ok: false,
      error: "invalid_pin",
      message: "That PIN is not correct. Try again or ask your manager.",
    });
  }
  if (bodyPin === expected) {
    clearLoginFailures(req);
    req.session.regenerate((err) => {
      if (err) {
        console.error("employee session regenerate", err);
        return res.status(500).json({
          ok: false,
          error: "session_error",
          message: "Could not start your session. Try again.",
        });
      }
      req.session.employeeAuthenticated = true;
      return res.json({ ok: true });
    });
    return;
  }
  noteLoginFailure(req);
  return res.status(401).json({
    ok: false,
    error: "invalid_pin",
    message: "That PIN is not correct. Try again or ask your manager.",
  });
});

router.post("/logout", (req, res) => {
  req.session.employeeAuthenticated = false;
  req.session.pricingVerified = {};
  delete req.session.pricingLastSummary;
  clearTrainingQuizLock(req);
  clearPricingVerifyWindow(req.sessionID);
  clearChatRateWindow(req.sessionID);
  clearSubmitRateWindow(req.sessionID);
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  const quizLock = activeTrainingQuizLock(req);
  res.json({
    employeeAuthenticated: !!req.session.employeeAuthenticated,
    assistantPausedForQuiz: Boolean(quizLock),
    quizAssistantMessage: quizLock
      ? "The training assistant is paused while you have a quiz in progress. Finish or leave the quiz, then try again here."
      : "",
  });
});

module.exports = router;
