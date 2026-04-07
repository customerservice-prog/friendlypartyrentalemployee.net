const express = require("express");
const { listSubmissions } = require("../db");
const {
  isAdminLoginRateLimited,
  noteAdminLoginFailure,
  clearAdminLoginFailures,
} = require("../middleware/adminLoginRateLimit");
const { SAMPLE_ADMIN_PASSWORD } = require("../lib/devDefaults");

const router = express.Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

function adminPassword() {
  return process.env.ADMIN_PASSWORD || SAMPLE_ADMIN_PASSWORD;
}

router.post("/login", (req, res) => {
  if (isAdminLoginRateLimited(req)) {
    return res.status(429).json({
      ok: false,
      error: "rate_limited",
      message:
        "Too many sign-in attempts from this network. Wait about 15 minutes or try another connection.",
    });
  }
  const raw = req.body && req.body.password;
  if (raw != null && typeof raw !== "string") {
    noteAdminLoginFailure(req);
    return res.status(401).json({
      ok: false,
      error: "Invalid password",
      message: "That password is not correct.",
    });
  }
  const password = raw != null ? raw : "";
  if (password.length > 512) {
    noteAdminLoginFailure(req);
    return res.status(401).json({
      ok: false,
      error: "Invalid password",
      message: "That password is not correct.",
    });
  }
  if (password === adminPassword()) {
    clearAdminLoginFailures(req);
    req.session.regenerate((err) => {
      if (err) {
        console.error("admin session regenerate", err);
        return res.status(500).json({
          ok: false,
          error: "session_error",
          message: "Could not start your session. Try again.",
        });
      }
      req.session.adminAuthenticated = true;
      return res.json({ ok: true });
    });
    return;
  }
  noteAdminLoginFailure(req);
  return res.status(401).json({
    ok: false,
    error: "Invalid password",
    message: "That password is not correct.",
  });
});

router.post("/logout", (req, res) => {
  /** Clear admin only; employee PIN session shares this cookie — avoid nuking training progress. */
  req.session.adminAuthenticated = false;
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  return res.json({ authenticated: !!req.session.adminAuthenticated });
});

router.get("/submissions", async (req, res) => {
  if (!req.session.adminAuthenticated) {
    return res.status(401).json({
      error: "admin_login_required",
      message: "Sign in again with the admin password.",
    });
  }
  try {
    const payload = await listSubmissions();
    return res.json(payload);
  } catch (err) {
    console.error("admin submissions error", err);
    const msg = err && err.message ? String(err.message) : "";
    if (msg.includes("DATABASE_URL")) {
      return res.status(503).json({
        error: "database_not_configured",
        message:
          "Quiz results live in the database. Set DATABASE_URL on the server, then restart the app.",
      });
    }
    return res.status(500).json({
      error: "Failed to load submissions",
      message: "Could not load data. Try again in a moment.",
    });
  }
});

module.exports = router;
