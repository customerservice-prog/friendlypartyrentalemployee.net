const { Pool } = require("pg");

let pool = null;

/**
 * Railway / other hosts sometimes expose connection info under different names,
 * or only on the Postgres service until you add a variable *reference* on the app service.
 */
function resolveDatabaseUrl() {
  const env = process.env;
  const direct =
    env.DATABASE_URL ||
    env.DATABASE_PRIVATE_URL ||
    env.POSTGRES_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.RAILWAY_DATABASE_URL;
  if (direct) return direct;

  const host = env.PGHOST || env.POSTGRES_HOST;
  const database = env.PGDATABASE || env.POSTGRES_DB || env.POSTGRES_DATABASE;
  const user = env.PGUSER || env.POSTGRES_USER;
  const password = env.PGPASSWORD ?? env.POSTGRES_PASSWORD;
  const port =
    env.PGPORT || env.POSTGRES_PORT || (host ? "5432" : undefined);

  if (host && database && user != null && password != null && port) {
    const u = encodeURIComponent(String(user));
    const p = encodeURIComponent(String(password));
    return `postgresql://${u}:${p}@${host}:${port}/${database}`;
  }

  return null;
}

function useSsl(databaseUrl) {
  if (process.env.DATABASE_SSL === "false") return false;
  const u = databaseUrl || "";
  if (/localhost|127\.0\.0\.1/i.test(u)) return false;
  return true;
}

function getPool() {
  const connectionString = resolveDatabaseUrl();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
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
}

async function insertSubmission(payload) {
  const p = getPool();
  const {
    name,
    score,
    total,
    percent,
    timeTaken,
    passed,
    missedQuestions,
  } = payload;

  const { rows } = await p.query(
    `INSERT INTO submissions
      (name, score, total, percent, time_taken, passed, missed_questions)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     RETURNING id, created_at`,
    [
      String(name).trim(),
      Number(score),
      Number(total),
      Number(percent),
      String(timeTaken),
      Boolean(passed),
      JSON.stringify(Array.isArray(missedQuestions) ? missedQuestions : []),
    ]
  );
  return rows[0];
}

async function listSubmissions() {
  const p = getPool();
  const { rows } = await p.query(
    `SELECT id, name, score, total, percent, time_taken, passed, missed_questions, created_at
     FROM submissions
     ORDER BY created_at DESC`
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    score: r.score,
    total: r.total,
    percent: r.percent,
    timeTaken: r.time_taken,
    passed: r.passed,
    missedQuestions: r.missed_questions,
    createdAt: r.created_at,
  }));
}

module.exports = {
  getPool,
  resolveDatabaseUrl,
  initDb,
  insertSubmission,
  listSubmissions,
};
