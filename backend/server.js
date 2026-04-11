require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pkg = require(path.join(__dirname, "..", "package.json"));

console.log(
  "[boot] friendly-party-rental-quiz",
  "node=" + process.version,
  "app=" + pkg.name + "@" + pkg.version,
  "cwd=" + process.cwd()
);

const express = require("express");
const session = require("express-session");
const {
  initDb,
  closePool,
  resolveDatabaseUrl,
  listPresentDatabaseEnvKeys,
  pingDatabase,
} = require("./db");
const submitRouter = require("./routes/submit");
const adminRouter = require("./routes/admin");
const employeeRouter = require("./routes/employee");
const {
  trainingPublicRouter,
  trainingStaffRouter,
} = require("./routes/training");
const chatRouter = require("./routes/chat");
const {
  requireEmployee,
  requireEmployeeUnlessApplicantPricingSubmit,
} = require("./middleware/requireEmployee");
const {
  DEV_SESSION_SECRET_FALLBACK,
  SAMPLE_ADMIN_PASSWORD,
  DEV_EMPLOYEE_PIN_FALLBACK,
} = require("./lib/devDefaults");

const app = express();
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  /** Reduces cross-origin window references; safe for same-origin staff UI. */
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  if (process.env.NODE_ENV === "production") {
    const proto = String(req.get("x-forwarded-proto") || "")
      .split(",")[0]
      .trim();
    const https = req.secure || proto === "https";
    if (https) {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=15552000; includeSubDomains"
      );
    }
  }
  next();
});

/** Liveness for PaaS (no DB) — use this as Railway Healthcheck Path so deploys succeed even while DB is misconfigured. */
function sendLiveJson(res) {
  res.set("Cache-Control", "no-store");
  res.status(200).json({
    ok: true,
    version: pkg.version,
    name: pkg.name,
  });
}

app.get("/api/live", (_req, res) => {
  sendLiveJson(res);
});

/** Some load balancers probe HEAD; mirror GET success without a body. */
app.head("/api/live", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).end();
});

/** Public: lets training UIs show setup hints without leaking secrets. */
app.get("/api/setup-status", (_req, res) => {
  res.set("Cache-Control", "no-store");
  const configured = Boolean(resolveDatabaseUrl());
  const keys = listPresentDatabaseEnvKeys();
  res.json({
    databaseConfigured: configured,
    databaseEnvHintsPresent: keys.length > 0,
    databaseEnvKeyCount: keys.length,
  });
});

function readPort() {
  const raw = process.env.PORT;
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return 3000;
  }
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1 || n > 65535) {
    console.warn(`Invalid PORT "${raw}", using 3000`);
    return 3000;
  }
  return n;
}

/** Long timeout for slow POST bodies (e.g. future uploads); align with reverse proxy if needed. */
function readHttpRequestTimeoutMs() {
  const raw = process.env.HTTP_REQUEST_TIMEOUT_MS;
  if (raw == null || String(raw).trim() === "") return 420_000;
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n)) return 420_000;
  return Math.min(Math.max(n, 120_000), 900_000);
}

/** Railway and most PaaS require listening on all interfaces, not only localhost. */
const LISTEN_HOST = process.env.LISTEN_HOST || "0.0.0.0";
const rootDir = path.join(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
/** Applied to HTML (static + explicit routes) so crawlers see it even when they skip meta tags. */
const X_ROBOTS_TAG = "noindex, nofollow";

/**
 * Trust `X-Forwarded-For` only when a reverse proxy is in front (Railway, etc.).
 * If Node is reachable directly with `trust proxy` on, clients can spoof IPs and weaken login rate limits.
 */
function readTrustProxySetting() {
  const raw = process.env.TRUST_PROXY;
  if (raw === "false" || raw === "0") return false;
  if (raw === "true" || raw === "1") return 1;
  const n = parseInt(String(raw || ""), 10);
  if (Number.isFinite(n) && n >= 1 && n <= 32) return n;
  return process.env.NODE_ENV === "production" ? 1 : false;
}

const trustProxySetting = readTrustProxySetting();
app.set("trust proxy", trustProxySetting);

app.use(
  session({
    name: "fpr_staff_sid",
    secret: process.env.SESSION_SECRET || DEV_SESSION_SECRET_FALLBACK,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json({ limit: "512kb" }));

app.use("/api/employee", employeeRouter);

/** Readiness: Postgres URL + `SELECT 1`. Use for monitoring; Railway deploy healthcheck should use `/api/live`. */
async function runHealthCheck(res, isHead) {
  res.set("Cache-Control", "no-store");
  try {
    if (!resolveDatabaseUrl()) {
      if (isHead) return res.status(503).end();
      return res.status(503).json({
        ok: false,
        reason: "no_database_url",
        message: "Training service is not fully configured yet.",
      });
    }
    await pingDatabase();
    if (isHead) return res.status(200).end();
    return res.json({ ok: true, version: pkg.version });
  } catch (err) {
    console.error("GET /api/health:", err.message);
    if (isHead) return res.status(503).end();
    return res.status(503).json({
      ok: false,
      reason: "database_unavailable",
      message: "Training data is temporarily unavailable. Try again in a few minutes.",
    });
  }
}

app.get("/api/health", (_req, res) => {
  runHealthCheck(res, false).catch((e) => {
    console.error("/api/health:", e);
    if (!res.headersSent) {
      res.status(500).end();
    }
  });
});

app.head("/api/health", (_req, res) => {
  runHealthCheck(res, true).catch((e) => {
    console.error("/api/health HEAD:", e);
    if (!res.headersSent) {
      res.status(500).end();
    }
  });
});

function sendTrainPage(res, htmlBasename) {
  const base =
    htmlBasename == null ? "" : String(htmlBasename).split(/[/\\]/)[0];
  if (!/^[-a-z0-9]+\.html$/i.test(base)) {
    console.error("sendTrainPage rejected basename:", htmlBasename);
    if (!res.headersSent) {
      return res.status(500).type("text/plain").send("Training page unavailable.");
    }
    return;
  }
  res.set("X-Robots-Tag", X_ROBOTS_TAG);
  res.set("Cache-Control", "no-store, private");
  const abs = path.join(frontendDir, base);
  res.sendFile(abs, (err) => {
    if (err && !res.headersSent) {
      console.error("sendTrainPage", base, err.message);
      res.status(500).type("text/plain").send("Training page unavailable.");
    }
  });
}

/** Same-origin relative paths only (open-redirect safe). */
function safeEmployeeReturnPath(raw) {
  const t = raw == null ? "" : String(raw).trim();
  if (!t || !t.startsWith("/") || t.startsWith("//")) return null;
  if (t.includes("\\")) return null;
  if (t.length > 512) return null;
  return t;
}

/**
 * Express `strict routing` is off by default, so `/welcome/` hits `app.get("/welcome")`.
 * Normalize a few staff URLs so bookmarks/proxies that add a trailing `/` still work.
 */
const CANONICAL_NO_TRAILING_SLASH = new Set(["/welcome", "/employee-login"]);

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const pathOnly = String(req.url || "").split("?")[0];
  if (pathOnly.length <= 1 || !pathOnly.endsWith("/")) return next();
  const base = pathOnly.replace(/\/+$/, "") || "/";
  if (!CANONICAL_NO_TRAILING_SLASH.has(base)) return next();
  const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  return res.redirect(301, base + q);
});

app.get("/", (req, res) => {
  if (req.session && req.session.employeeAuthenticated) {
    const ret = safeEmployeeReturnPath(req.query.return);
    /** Skip useless 302 to `/` (avoids redirect churn with `?return=/`). */
    if (ret && ret !== "/") return res.redirect(302, ret);
    return sendTrainPage(res, "hub.html");
  }
  return sendTrainPage(res, "welcome.html");
});

/** Bookmark-friendly staff entry (same HTML as GET / when logged out). */
app.get("/welcome", (req, res) => {
  if (req.session && req.session.employeeAuthenticated) {
    return res.redirect(302, "/");
  }
  return sendTrainPage(res, "welcome.html");
});

/** Legacy / mistaken entry: frontend/index.html must not become the home page. */
app.get("/index.html", (req, res) => {
  res.redirect(302, "/");
});

/**
 * Explicit `.html` paths: serve the file directly (no redirect). Redirect-only
 * chains confused some browsers/proxies on localhost; direct send matches static hosts.
 */
const htmlDirectPaths = new Map([
  ["/welcome.html", "welcome.html"],
  ["/employee-login.html", "employee-login.html"],
  ["/quizzes.html", "quizzes.html"],
  ["/assistant.html", "assistant.html"],
  ["/admin.html", "admin.html"],
  ["/quiz-pricing.html", "quiz-pricing.html"],
  ["/quiz-products.html", "quiz-products.html"],
  ["/quiz-policies.html", "quiz-policies.html"],
  ["/quiz-customer-service.html", "quiz-customer-service.html"],
  ["/quiz-quote-calls.html", "quiz-quote-calls.html"],
]);
for (const [urlPath, basename] of htmlDirectPaths) {
  app.get(urlPath, (_req, res) => sendTrainPage(res, basename));
}

app.get("/hub.html", (req, res) => {
  const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(302, "/" + q);
});

app.get("/admin", (_req, res) => {
  sendTrainPage(res, "admin.html");
});

app.get("/quizzes", (_req, res) => {
  sendTrainPage(res, "quizzes.html");
});

app.get("/assistant", (_req, res) => {
  sendTrainPage(res, "assistant.html");
});

/** Former multi-specialist page — one assistant now; keep bookmarks working. */
app.get("/ai-team", (_req, res) => {
  res.redirect(302, "/assistant");
});

app.get("/ai-team.html", (_req, res) => {
  res.redirect(302, "/assistant");
});

app.get("/employee-login", (_req, res) => {
  sendTrainPage(res, "employee-login.html");
});

app.get("/quiz-pricing", (_req, res) => {
  sendTrainPage(res, "quiz-pricing.html");
});

app.get("/quiz-products", (_req, res) => {
  sendTrainPage(res, "quiz-products.html");
});

app.get("/quiz-policies", (_req, res) => {
  sendTrainPage(res, "quiz-policies.html");
});

app.get("/quiz-customer-service", (_req, res) => {
  sendTrainPage(res, "quiz-customer-service.html");
});

app.get("/quiz-quote-calls", (_req, res) => {
  sendTrainPage(res, "quiz-quote-calls.html");
});

/**
 * Static assets. `index: false` prevents GET / from serving frontend/index.html
 * (that stub only redirects to "/" and would loop with `app.get("/")`).
 */
app.use(
  express.static(frontendDir, {
    index: false,
    setHeaders(res, filePath) {
      const lower = String(filePath).toLowerCase();
      if (lower.endsWith(".html")) {
        res.setHeader("X-Robots-Tag", X_ROBOTS_TAG);
        res.setHeader("Cache-Control", "no-store, private");
      }
    },
  })
);

/** Unknown pages: valid HTML 404 with a clear link home (avoids odd browser errors). */
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return next();
  }
  if (pathStartsWithApi(req)) {
    return next();
  }
  res.set("Cache-Control", "no-store");
  res.status(404).type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Page not found — Friendly Party Rental training</title>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem;background:#0f172a;color:#e2e8f0;line-height:1.5">
<p>This address is not part of the staff training site.</p>
<p><a href="/" style="color:#f5e6a8;font-weight:600">Open staff training home</a></p>
</body>
</html>`);
});

app.use("/api/training", trainingPublicRouter);
app.use("/api/training", requireEmployee, trainingStaffRouter);
app.use("/api/chat", requireEmployee, chatRouter);
app.use(
  "/api/submit",
  requireEmployeeUnlessApplicantPricingSubmit,
  submitRouter
);
app.use("/api/admin", adminRouter);

function pathStartsWithApi(req) {
  const p = req.originalUrl ? String(req.originalUrl).split("?")[0] : "";
  return p === "/api" || p.startsWith("/api/");
}

/** Unknown `/api/*` → JSON (after all API routers). */
app.use((req, res, next) => {
  if (!pathStartsWithApi(req)) {
    return next();
  }
  res.set("Cache-Control", "no-store");
  return res.status(404).json({
    error: "not_found",
    message: "Unknown API route.",
  });
});

/** Malformed JSON / body too large for API requests. */
app.use((err, req, res, next) => {
  if (!pathStartsWithApi(req)) {
    return next(err);
  }
  if (res.headersSent) {
    return next(err);
  }
  res.set("Cache-Control", "no-store");
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "payload_too_large",
      message: "Request is too large. Try a shorter message or fewer fields.",
    });
  }
  if (err.status === 400 && err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "invalid_json",
      message: "Request body must be valid JSON.",
    });
  }
  return next(err);
});

/** Last resort for unhandled errors on API routes. */
app.use((err, req, res, next) => {
  if (!pathStartsWithApi(req)) {
    return next(err);
  }
  if (res.headersSent) {
    return next(err);
  }
  console.error("Unhandled API error:", err);
  res.set("Cache-Control", "no-store");
  return res.status(500).json({
    error: "internal_error",
    message: "Something went wrong. Try again later.",
  });
});

const HTTP_SHUTDOWN_MS = 15_000;
const POOL_SHUTDOWN_MS = 8_000;

function registerGracefulShutdown(httpServer) {
  let shuttingDown = false;

  const run = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log("[shutdown] signal=" + signal);

    const httpDone = new Promise((resolve) => {
      httpServer.close(() => resolve());
    });
    const httpTimeout = new Promise((resolve) => {
      setTimeout(() => {
        console.warn(
          "[shutdown] HTTP close timed out — continuing database cleanup."
        );
        resolve();
      }, HTTP_SHUTDOWN_MS);
    });
    await Promise.race([httpDone, httpTimeout]);

    try {
      const poolDone = closePool();
      const poolTimeout = new Promise((resolve) => {
        setTimeout(() => {
          console.warn(
            "[shutdown] database pool end timed out — forcing exit."
          );
          resolve();
        }, POOL_SHUTDOWN_MS);
      });
      await Promise.race([poolDone, poolTimeout]);
    } catch (e) {
      console.error("[shutdown] database pool:", e.message);
    }
    process.exit(0);
  };

  process.once("SIGTERM", () => {
    run("SIGTERM").catch((err) => {
      console.error("[shutdown] error:", err);
      process.exit(1);
    });
  });
  process.once("SIGINT", () => {
    run("SIGINT").catch((err) => {
      console.error("[shutdown] error:", err);
      process.exit(1);
    });
  });
}

async function start() {
  const quizDataPath = path.join(rootDir, "data", "pricing-quiz.json");
  if (!fs.existsSync(quizDataPath)) {
    console.error(
      "Missing data/pricing-quiz.json — pricing quiz and AI knowledge block will fail until this file is on the server."
    );
  } else {
    try {
      const { loadPricingQuiz } = require("./lib/knowledge");
      const rows = loadPricingQuiz();
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("quiz must be a non-empty array");
      }
      console.log(`[boot] pricing quiz: ${rows.length} questions`);
    } catch (e) {
      console.error(
        "Pricing quiz data invalid or unreadable — check data/pricing-quiz.json:",
        e.message
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    const sec = process.env.SESSION_SECRET;
    if (
      !sec ||
      String(sec).trim() === "" ||
      sec === DEV_SESSION_SECRET_FALLBACK
    ) {
      console.warn(
        "SESSION_SECRET must be set to a long random secret in production (not the dev placeholder)."
      );
    }
    const adminPw = process.env.ADMIN_PASSWORD;
    if (!adminPw || String(adminPw).trim() === SAMPLE_ADMIN_PASSWORD) {
      console.warn(
        "ADMIN_PASSWORD is unset or still the sample default — set a strong unique password in production."
      );
    }
    const pin = process.env.EMPLOYEE_ACCESS_PIN;
    if (!pin || String(pin).trim() === "") {
      console.warn(
        "EMPLOYEE_ACCESS_PIN is not set — employee training login will fail until you add it."
      );
    } else if (String(pin).trim() === DEV_EMPLOYEE_PIN_FALLBACK) {
      console.warn(
        "EMPLOYEE_ACCESS_PIN matches the dev-only fallback — set a unique team PIN in production."
      );
    }
  }

  const listenPort = readPort();

  const httpServer = await new Promise((resolve, reject) => {
    const server = app.listen(listenPort, LISTEN_HOST, () => {
      console.log(
        `Server listening on http://${LISTEN_HOST}:${listenPort} (process.env.PORT=${JSON.stringify(process.env.PORT)})`
      );
      console.log(
        `[boot] trustProxy=${JSON.stringify(trustProxySetting)} (set TRUST_PROXY=false if the app has no reverse proxy)`
      );
      resolve(server);
    });
    server.on("error", reject);
  });

  /** Generous HTTP timeouts for slow clients / large payloads. */
  const reqMs = readHttpRequestTimeoutMs();
  httpServer.requestTimeout = reqMs;
  httpServer.headersTimeout = reqMs + 1_000;

  registerGracefulShutdown(httpServer);

  if (!resolveDatabaseUrl()) {
    const found = listPresentDatabaseEnvKeys();
    console.error(
      "No database URL on this service. Add a **Reference** from your **Web** service Variables to Postgres **DATABASE_URL** (or **DATABASE_PRIVATE_URL**)."
    );
    console.error(
      "Detected DB-related env keys (names only):",
      found.length ? found.join(", ") : "(none)"
    );
    console.error(
      "/api/health returns 503 until DATABASE_URL is set (quiz save/admin need DB). Deploy uses /api/live."
    );
    return;
  }

  try {
    await initDb();
    console.log("Database ready");
  } catch (err) {
    console.error("Database initialization failed:", err);
    console.error(
      "/api/health will return 503 until the database accepts connections."
    );
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("[process] unhandledRejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[process] uncaughtException:", err);
  process.exit(1);
});

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
