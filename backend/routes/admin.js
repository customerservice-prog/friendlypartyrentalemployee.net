const express = require("express");
const { listSubmissions } = require("../db");

const router = express.Router();

const DEFAULT_PASSWORD = "FriendlyAdmin2024";

function adminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

router.post("/login", (req, res) => {
  const password = req.body && req.body.password;
  if (password === adminPassword()) {
    req.session.adminAuthenticated = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Invalid password" });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  return res.json({ authenticated: !!req.session.adminAuthenticated });
});

router.get("/submissions", async (req, res) => {
  if (!req.session.adminAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const submissions = await listSubmissions();
    return res.json({ submissions });
  } catch (err) {
    console.error("admin submissions error", err);
    return res.status(500).json({ error: "Failed to load submissions" });
  }
});

module.exports = router;
