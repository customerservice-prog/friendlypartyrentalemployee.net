require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const {
  initDb,
  resolveDatabaseUrl,
  listPresentDatabaseEnvKeys,
  pingDatabase,
} = require("./db");
const submitRouter = require("./routes/submit");
const adminRouter = require("./routes/admin");

const app = express();

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

/** Railway and most PaaS require listening on all interfaces, not only localhost. */
const LISTEN_HOST = process.env.LISTEN_HOST || "0.0.0.0";
const rootDir = path.join(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");

app.set("trust proxy", 1);

app.use(
  session({
    name: "friendly_admin_sid",
    secret:
      process.env.SESSION_SECRET ||
      "dev-only-change-me-in-production-min-32-chars",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json({ limit: "512kb" }));

/** Railway counts deploy as healthy only on HTTP 200; we require a working Postgres URL + ping. */
app.get("/api/health", async (_req, res) => {
  try {
    if (!resolveDatabaseUrl()) {
      return res.status(503).json({ ok: false, reason: "no_database_url" });
    }
    await pingDatabase();
    return res.json({ ok: true });
  } catch (err) {
    console.error("GET /api/health:", err.message);
    return res.status(503).json({ ok: false, reason: "database_unavailable" });
  }
});

app.use(express.static(frontendDir));

app.use("/api/submit", submitRouter);
app.use("/api/admin", adminRouter);

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(frontendDir, "admin.html"));
});

async function start() {
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    console.warn(
      "SESSION_SECRET is not set; using insecure default — set SESSION_SECRET in production"
    );
  }

  const listenPort = readPort();

  await new Promise((resolve, reject) => {
    const server = app.listen(listenPort, LISTEN_HOST, () => {
      console.log(
        `Server listening on http://${LISTEN_HOST}:${listenPort} (process.env.PORT=${JSON.stringify(process.env.PORT)})`
      );
      resolve();
    });
    server.on("error", reject);
  });

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
      "/api/health will return 503 until DATABASE_URL is set — deploy will stay unhealthy."
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

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
