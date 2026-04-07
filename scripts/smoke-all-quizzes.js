/**
 * Loads every quiz HTML route and verifies staff quiz-activity slugs after PIN login.
 * Usage: from repo root, `node scripts/smoke-all-quizzes.js`
 */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const PORT = String(38500 + Math.floor(Math.random() * 999));
const base = `http://127.0.0.1:${PORT}`;
const PIN = process.env.EMPLOYEE_ACCESS_PIN || "3707";

const jar = {};

function mergeSetCookie(res) {
  const list =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [];
  for (const line of list) {
    const pair = String(line).split(";")[0];
    const i = pair.indexOf("=");
    if (i > 0) {
      jar[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
    }
  }
}

function cookieHeader() {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(pathname, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const c = cookieHeader();
  if (c) headers.Cookie = c;
  const res = await fetch(base + pathname, { ...opts, headers });
  mergeSetCookie(res);
  const text = await res.text();
  return { status: res.status, text };
}

async function fetchJson(pathname, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const c = cookieHeader();
  if (c) headers.Cookie = c;
  const res = await fetch(base + pathname, { ...opts, headers });
  mergeSetCookie(res);
  let body = {};
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch (_) {
      body = { _raw: text.slice(0, 200) };
    }
  }
  return { status: res.status, body };
}

function fail(msg) {
  console.error("FAIL:", msg);
  process.exitCode = 1;
}

async function waitForLive() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(base + "/api/live");
      if (r.ok) return;
    } catch (_) {}
    await sleep(120);
  }
  throw new Error("server did not become ready");
}

const QUIZ_PAGES = [
  ["/quiz-pricing.html", "Pricing quiz"],
  ["/quiz-products.html", "Products Knowledge Quiz"],
  ["/quiz-policies.html", "Policies & Procedures Quiz"],
  ["/quiz-customer-service.html", "Customer Service Quiz"],
  ["/quizzes.html", "Training quizzes"],
];

async function main() {
  const env = {
    ...process.env,
    PORT,
    NODE_ENV: "development",
    EMPLOYEE_ACCESS_PIN: PIN,
  };
  delete env.DATABASE_URL;
  delete env.DATABASE_PRIVATE_URL;

  const child = spawn(process.execPath, ["backend/server.js"], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", (c) => {
    stderr += c.toString();
  });

  try {
    await waitForLive();

    for (const [path, needle] of QUIZ_PAGES) {
      const { status, text } = await fetchText(path);
      if (status !== 200) {
        return fail(`${path} expected 200, got ${status}`);
      }
      if (!text.includes(needle)) {
        return fail(`${path} body missing marker "${needle}"`);
      }
    }

    const pricingQuizPath = path.join(root, "data", "pricing-quiz.json");
    const n = JSON.parse(fs.readFileSync(pricingQuizPath, "utf8")).length;
    let r = await fetchJson("/api/training/quiz-integrity-ack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (r.status !== 200) {
      return fail(`pricing ack: ${r.status}`);
    }
    r = await fetchJson("/api/training/pricing-questions");
    if (r.status !== 200 || !Array.isArray(r.body.questions)) {
      return fail(`pricing-questions: ${r.status}`);
    }
    if (r.body.questions.length !== n) {
      return fail(
        `pricing question count ${r.body.questions.length} !== data file ${n}`
      );
    }

    r = await fetchJson("/api/employee/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: PIN }),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`login: ${r.status} ${JSON.stringify(r.body)}`);
    }

    const staffSlugs = ["products", "policies", "customer-service", "integration"];
    for (const slug of staffSlugs) {
      r = await fetchJson("/api/training/quiz-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true, slug }),
      });
      if (r.status !== 200 || !r.body.ok) {
        return fail(
          `quiz-activity slug=${slug}: ${r.status} ${JSON.stringify(r.body)}`
        );
      }
      /** Clear lock between slugs */
      await fetchJson("/api/training/quiz-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });
    }

    console.log("OK: smoke-all-quizzes (pages + pricing bank + staff quiz-activity)");
  } catch (e) {
    console.error(stderr.slice(-4000));
    fail(e.message || String(e));
  } finally {
    child.kill();
    await sleep(200);
  }
}

main();
