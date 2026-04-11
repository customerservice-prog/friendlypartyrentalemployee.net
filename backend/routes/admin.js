const express = require("express");
const {
  listSubmissions,
  resolveDatabaseUrl,
  listPresentDatabaseEnvKeys,
} = require("../db");
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
    const quiz = String(req.query.quiz || "").trim();
    const sort = String(req.query.sort || "").trim();
    const quizSlug =
      quiz.replace(/[^a-z0-9-]/gi, "").slice(0, 64) || null;
    const payload = await listSubmissions({
      quizSlug: quizSlug || null,
      sort: sort === "ai_rating" ? "ai_rating" : "recent",
    });
    return res.json(payload);
  } catch (err) {
    console.error("admin submissions error", err);
    const notConfigured =
      (err && err.code === "DB_NOT_CONFIGURED") || !resolveDatabaseUrl();

    if (notConfigured) {
      const found = listPresentDatabaseEnvKeys();
      const hint =
        found.length > 0
          ? ` Partial database env detected (${found.slice(0, 6).join(", ")}${found.length > 6 ? ", …" : ""}) — connection string may be incomplete or on the wrong service.`
          : "";
      return res.status(503).json({
        error: "database_not_configured",
        message:
          "Quiz results need PostgreSQL linked to **this** app. In Render/Railway/your host: add or reference DATABASE_URL (sometimes DATABASE_PRIVATE_URL) on the **web** service, redeploy, then open this page again." +
          hint,
      });
    }

    const detail =
      err && err.message ? String(err.message).slice(0, 240) : "unknown error";
    return res.status(503).json({
      error: "database_unavailable",
      message:
        "Could not read from the database (connection, credentials, or SSL). Check DATABASE_URL and that Postgres is reachable. If it persists, see server logs. " +
        `(${detail})`,
    });
  }
});

module.exports = router;
