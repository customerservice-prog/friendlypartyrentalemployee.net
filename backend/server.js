require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const { initDb } = require("./db");
const submitRouter = require("./routes/submit");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
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
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL must be set");
    process.exit(1);
  }
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    console.warn(
      "SESSION_SECRET is not set; using insecure default — set SESSION_SECRET in production"
    );
  }
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
