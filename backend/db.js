const { Pool } = require("pg");

let pool = null;

function useSsl(databaseUrl) {
  if (process.env.DATABASE_SSL === "false") return false;
  const u = databaseUrl || "";
  if (/localhost|127\.0\.0\.1/i.test(u)) return false;
  return true;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl(process.env.DATABASE_URL)
        ? { rejectUnauthorized: false }
        : false,
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
  initDb,
  insertSubmission,
  listSubmissions,
};
