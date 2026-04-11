const { Pool } = require("pg");

let pool = null;

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s !== "") return s;
  }
  return null;
}

/**
 * Railway / other hosts sometimes expose connection info under different names,
 * or only on the Postgres service until you add a variable *reference* on the app service.
 */
function resolveDatabaseUrl() {
  const env = process.env;
  const direct = firstNonEmpty(
    env.DATABASE_URL,
    env.DATABASE_PRIVATE_URL,
    env.DATABASE_PUBLIC_URL,
    env.POSTGRES_URL,
    env.POSTGRES_PRISMA_URL,
    env.POSTGRES_URL_NON_POOLING,
    env.DATABASE_URL_UNPOOLED,
    env.RAILWAY_DATABASE_URL,
    env.PGURL,
    env.DB_URL,
    env.DATABASE_CONNECTION_URI
  );
  if (direct) return direct;

  const host = firstNonEmpty(env.PGHOST, env.POSTGRES_HOST);
  const database = firstNonEmpty(
    env.PGDATABASE,
    env.POSTGRES_DB,
    env.POSTGRES_DATABASE
  );
  const user = firstNonEmpty(env.PGUSER, env.POSTGRES_USER);
  const password = firstNonEmpty(
    env.PGPASSWORD,
    env.POSTGRES_PASSWORD
  );
  const port =
    firstNonEmpty(env.PGPORT, env.POSTGRES_PORT) ||
    (host ? "5432" : undefined);

  if (host && database && user && password && port) {
    const u = encodeURIComponent(String(user));
    const p = encodeURIComponent(String(password));
    return `postgresql://${u}:${p}@${host}:${port}/${database}`;
  }

  return null;
}

/** Names only — helps debug Railway without printing secrets. */
function listPresentDatabaseEnvKeys() {
  const keys = [
    "DATABASE_URL",
    "DATABASE_PRIVATE_URL",
    "DATABASE_PUBLIC_URL",
    "POSTGRES_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
    "RAILWAY_DATABASE_URL",
    "PGURL",
    "DB_URL",
    "DATABASE_CONNECTION_URI",
    "PGHOST",
    "PGUSER",
    "PGPASSWORD",
    "PGDATABASE",
    "PGPORT",
    "POSTGRES_HOST",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
  ];
  return keys.filter(
    (k) => process.env[k] != null && String(process.env[k]).trim() !== ""
  );
}

function useSsl(databaseUrl) {
  if (process.env.DATABASE_SSL === "false") return false;
  const u = databaseUrl || "";
  if (/localhost|127\.0\.0\.1/i.test(u)) return false;
  return true;
}

/** Thrown when no Postgres URL can be resolved (used by admin API messaging). */
function databaseNotConfiguredError() {
  const err = new Error(
    "Postgres is not configured (no DATABASE_URL or equivalent env vars)"
  );
  err.code = "DB_NOT_CONFIGURED";
  return err;
}

function getPool() {
  const connectionString = resolveDatabaseUrl();
  if (!connectionString) {
    throw databaseNotConfiguredError();
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: useSsl(connectionString)
        ? { rejectUnauthorized: false }
        : false,
      connectionTimeoutMillis: 15_000,
      idleTimeoutMillis: 30_000,
      max: 10,
    });
  }
  return pool;
}

async function pingDatabase() {
  const p = getPool();
  await p.query("SELECT 1 AS ok");
}

async function initDb() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percent INTEGER NOT NULL,
      time_taken TEXT NOT NULL,
      passed BOOLEAN NOT NULL,
      missed_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '';
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS job_title TEXT NOT NULL DEFAULT '';
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS quiz_slug TEXT NOT NULL DEFAULT 'pricing';
  `);
  await p.query(`
    CREATE INDEX IF NOT EXISTS idx_submissions_created_at
    ON submissions (created_at DESC);
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS integrity_report JSONB NOT NULL DEFAULT '{}'::jsonb;
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_rating INTEGER;
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ai_feedback TEXT;
  `);
  await p.query(`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS hiring_answers JSONB NOT NULL DEFAULT '{}'::jsonb;
  `);
}

async function insertSubmission(payload) {
  const p = getPool();
  const {
    name,
    email,
    jobTitle,
    quizSlug,
    score,
    total,
    percent,
    timeTaken,
    passed,
    missedQuestions,
    integrityReport,
    aiRating,
    aiFeedback,
    hiringAnswers,
  } = payload;

  const slug = String(quizSlug || "pricing")
    .trim()
    .replace(/[^a-z0-9-]/gi, "")
    .slice(0, 64) || "pricing";

  const reportJson = JSON.stringify(
    integrityReport && typeof integrityReport === "object"
      ? integrityReport
      : {}
  );

  let aiRatingVal = null;
  if (aiRating != null && aiRating !== "") {
    const n = Number(aiRating);
    if (Number.isFinite(n)) aiRatingVal = Math.round(n);
  }
  const aiFb =
    aiFeedback != null && String(aiFeedback).trim()
      ? String(aiFeedback).trim().slice(0, 12000)
      : null;
  const hireJson = JSON.stringify(
    hiringAnswers && typeof hiringAnswers === "object" && !Array.isArray(hiringAnswers)
      ? hiringAnswers
      : {}
  );

  const { rows } = await p.query(
    `INSERT INTO submissions
      (name, email, job_title, quiz_slug, score, total, percent, time_taken, passed, missed_questions, integrity_report, ai_rating, ai_feedback, hiring_answers)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12, $13, $14::jsonb)
     RETURNING id, created_at`,
    [
      String(name).trim(),
      String(email || "").trim(),
      String(jobTitle || "").trim(),
      slug,
      Number(score),
      Number(total),
      Number(percent),
      String(timeTaken),
      Boolean(passed),
      JSON.stringify(Array.isArray(missedQuestions) ? missedQuestions : []),
      reportJson,
      aiRatingVal,
      aiFb,
      hireJson,
    ]
  );
  return rows[0];
}

async function closePool() {
  if (!pool) return;
  const p = pool;
  pool = null;
  await p.end();
}

/** Keeps admin dashboard responsive if the table grows very large. */
const LIST_SUBMISSIONS_MAX = 2000;

/**
 * @param {{ quizSlug?: string | null, sort?: "recent" | "ai_rating" }} [options]
 */
async function listSubmissions(options = {}) {
  const p = getPool();
  const rawSlug = options.quizSlug != null ? String(options.quizSlug).trim() : "";
  const quizSlug = rawSlug ? rawSlug.replace(/[^a-z0-9-]/gi, "").slice(0, 64) : "";
  const sortAi = options.sort === "ai_rating";

  const conds = [];
  const vals = [];
  let n = 1;
  if (quizSlug) {
    conds.push(`quiz_slug = $${n++}`);
    vals.push(quizSlug);
  }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const orderBy = sortAi
    ? `ai_rating DESC NULLS LAST, created_at DESC`
    : `created_at DESC`;
  vals.push(LIST_SUBMISSIONS_MAX);
  const limitPh = `$${n}`;

  const { rows } = await p.query(
    `SELECT id, name, email, job_title, quiz_slug, score, total, percent, time_taken, passed, missed_questions, integrity_report,
            ai_rating, ai_feedback, hiring_answers, created_at,
            COUNT(*) OVER() AS full_count
     FROM submissions
     ${where}
     ORDER BY ${orderBy}
     LIMIT ${limitPh}`,
    vals
  );
  const totalInDb = rows.length ? Number(rows[0].full_count) : 0;
  const truncated =
    rows.length === LIST_SUBMISSIONS_MAX && totalInDb > LIST_SUBMISSIONS_MAX;
  const submissions = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email || "",
    jobTitle: r.job_title || "",
    quizSlug: r.quiz_slug || "pricing",
    score: r.score,
    total: r.total,
    percent: r.percent,
    timeTaken: r.time_taken,
    passed: r.passed,
    missedQuestions: r.missed_questions,
    integrityReport:
      r.integrity_report && typeof r.integrity_report === "object"
        ? r.integrity_report
        : {},
    aiRating: r.ai_rating != null ? Number(r.ai_rating) : null,
    aiFeedback: r.ai_feedback != null ? String(r.ai_feedback) : null,
    hiringAnswers:
      r.hiring_answers && typeof r.hiring_answers === "object"
        ? r.hiring_answers
        : {},
    createdAt: r.created_at,
  }));
  return {
    submissions,
    truncated,
    listCap: LIST_SUBMISSIONS_MAX,
    totalInDb,
  };
}

module.exports = {
  getPool,
  closePool,
  resolveDatabaseUrl,
  listPresentDatabaseEnvKeys,
  pingDatabase,
  initDb,
  insertSubmission,
  listSubmissions,
  LIST_SUBMISSIONS_MAX,
};
