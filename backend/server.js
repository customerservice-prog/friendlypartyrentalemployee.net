require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const {
  initDb,
  resolveDatabaseUrl,
  listPresentDatabaseEnvKeys,
} = require("./db");
const submitRouter = require("./routes/submit");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
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
  if (!resolveDatabaseUrl()) {
    const found = listPresentDatabaseEnvKeys();
    console.error(
      "No database URL found on this service. The Postgres plugin only injects DATABASE_URL on the *Postgres* service by default — you must *reference* it on your *web* service."
    );
    console.error(
      "Fix: Railway project → open your **Web** service (the one running npm start) → **Variables** → **+ New Variable** → **Add Reference** → select your **PostgreSQL** service → variable **DATABASE_URL** (or **DATABASE_PRIVATE_URL**). Save, then redeploy."
    );
    console.error(
      "Detected DB-related env keys on *this* service (names only):",
      found.length ? found.join(", ") : "(none — expected until you add a reference)"
    );
    process.exit(1);
  }
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    console.warn(
      "SESSION_SECRET is not set; using insecure default — set SESSION_SECRET in production"
    );
  }

  await new Promise((resolve, reject) => {
    const server = app.listen(PORT, LISTEN_HOST, () => {
      console.log(`Server listening on http://${LISTEN_HOST}:${PORT}`);
      resolve();
    });
    server.on("error", reject);
  });

  try {
    await initDb();
    console.log("Database ready");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
