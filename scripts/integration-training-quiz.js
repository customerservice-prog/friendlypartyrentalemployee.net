/**
 * Spins up the app briefly and checks training / quiz-lock flows (no OpenAI call).
 * Usage: from repo root, `node scripts/integration-training-quiz.js`
 */
const { spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const PORT = String(38000 + Math.floor(Math.random() * 1500));
const base = `http://127.0.0.1:${PORT}`;
const PIN = "3707";

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

async function fetchJson(pathname, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  const c = cookieHeader();
  if (c) headers.Cookie = c;
  const res = await fetch(base + pathname, {
    ...opts,
    headers,
  });
  mergeSetCookie(res);
  let body = {};
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch (_) {
      body = { _raw: text };
    }
  }
  return { status: res.status, body };
}

function fail(msg) {
  console.error("FAIL:", msg);
  process.exitCode = 1;
}

async function waitForLive() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(base + "/api/live");
      if (r.ok) return;
    } catch (_) {}
    await sleep(150);
  }
  throw new Error("server did not become ready");
}

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

    let     r = await fetchJson("/api/employee/pricing-faq");
    if (r.status !== 401) {
      return fail(
        `pricing-faq before login expected 401, got ${r.status}`
      );
    }

    r = await fetchJson("/api/training/pricing-questions");
    if (r.status !== 403 || r.body.error !== "quiz_ack_required") {
      return fail(
        `expected quiz_ack_required before ack (anonymous ok), got ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/training/quiz-integrity-ack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`anonymous quiz-integrity-ack: ${r.status}`);
    }
    r = await fetchJson("/api/training/pricing-questions");
    if (r.status !== 200 || !Array.isArray(r.body.questions)) {
      return fail(
        `anonymous pricing-questions after ack: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`
      );
    }

    r = await fetchJson("/api/training/quiz-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true, slug: "customer-service" }),
    });
    if (r.status !== 401) {
      return fail(
        `anonymous non-pricing quiz-activity expected 401, got ${r.status}`
      );
    }

    r = await fetchJson("/api/employee/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: PIN }),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`login failed: ${r.status} ${JSON.stringify(r.body)}`);
    }

    r = await fetchJson("/api/training/pricing-questions");
    if (r.status !== 403 || r.body.error !== "quiz_ack_required") {
      return fail(
        `expected quiz_ack_required before ack, got ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/training/quiz-integrity-ack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`quiz-integrity-ack: ${r.status} ${JSON.stringify(r.body)}`);
    }

    r = await fetchJson("/api/training/pricing-questions");
    if (r.status !== 200 || !Array.isArray(r.body.questions)) {
      return fail(
        `pricing-questions after ack: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`
      );
    }

    r = await fetchJson("/api/employee/me");
    if (r.status !== 200 || r.body.assistantPausedForQuiz !== false) {
      return fail(
        `me unpaused expected: ${r.status} ${JSON.stringify(r.body)}`
      );
    }
    if (typeof r.body.assistantUsesOpenAI !== "boolean") {
      return fail(
        `me missing assistantUsesOpenAI: ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/employee/pricing-faq");
    if (r.status !== 200 || !Array.isArray(r.body.rows)) {
      return fail(
        `pricing-faq: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`
      );
    }
    if (
      !r.body.rows.length ||
      typeof r.body.rows[0].q !== "string" ||
      typeof r.body.rows[0].answer !== "string"
    ) {
      return fail(
        `pricing-faq rows malformed: ${JSON.stringify(r.body).slice(0, 300)}`
      );
    }

    r = await fetchJson("/api/training/quiz-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true, slug: "integration" }),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`quiz-activity start: ${r.status} ${JSON.stringify(r.body)}`);
    }

    r = await fetchJson("/api/employee/me");
    if (
      r.status !== 200 ||
      r.body.assistantPausedForQuiz !== true ||
      !String(r.body.quizAssistantMessage || "").length
    ) {
      return fail(
        `me paused expected: ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is the tent phone?" }],
      }),
    });
    if (r.status !== 403 || r.body.error !== "quiz_in_progress") {
      return fail(
        `chat blocked during quiz expected 403 quiz_in_progress, got ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/training/quiz-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`quiz-activity end: ${r.status} ${JSON.stringify(r.body)}`);
    }

    r = await fetchJson("/api/employee/me");
    if (r.status !== 200 || r.body.assistantPausedForQuiz !== false) {
      return fail(
        `me unpaused after activity clear: ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/training/pricing-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`pricing-reset: ${r.status} ${JSON.stringify(r.body)}`);
    }

    r = await fetchJson("/api/training/quiz-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true, slug: "pricing" }),
    });
    if (r.status !== 200 || !r.body.ok) {
      return fail(`quiz-activity pricing: ${r.status} ${JSON.stringify(r.body)}`);
    }

    r = await fetchJson("/api/training/pricing-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: 0, choiceIndex: 0 }),
    });
    if (r.status !== 200 || typeof r.body.correct !== "boolean") {
      return fail(
        `pricing-verify: ${r.status} ${JSON.stringify(r.body).slice(0, 300)}`
      );
    }

    r = await fetchJson("/api/employee/me");
    if (r.status !== 200 || r.body.assistantPausedForQuiz !== true) {
      return fail(
        `me paused after verify: ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/training/pricing-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (r.status !== 200) {
      return fail(`pricing-reset 2: ${r.status}`);
    }

    r = await fetchJson("/api/employee/me");
    if (r.status !== 200 || r.body.assistantPausedForQuiz !== false) {
      return fail(
        `me unpaused after pricing-reset: ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    r = await fetchJson("/api/training/quiz-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true }),
    });
    if (r.status !== 400) {
      return fail(
        `quiz-activity without slug expected 400, got ${r.status} ${JSON.stringify(r.body)}`
      );
    }

    console.log("OK: integration-training-quiz (all assertions passed)");
  } catch (e) {
    console.error(stderr.slice(-4000));
    fail(e.message || String(e));
  } finally {
    child.kill();
    await sleep(200);
  }
}

main();
