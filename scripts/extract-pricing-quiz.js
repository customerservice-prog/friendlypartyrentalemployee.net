/**
 * Validates data/pricing-quiz.json (source for the pricing quiz API).
 * Historical note: questions used to live in frontend HTML; they now ship as JSON.
 *
 * Run: node scripts/extract-pricing-quiz.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "data", "pricing-quiz.json");

if (!fs.existsSync(out)) {
  console.error("Missing", out);
  process.exit(1);
}

let Q;
try {
  Q = JSON.parse(fs.readFileSync(out, "utf8"));
} catch (e) {
  console.error("Invalid JSON:", out, e.message);
  process.exit(1);
}

if (!Array.isArray(Q) || Q.length === 0) {
  console.error(out, "must be a non-empty array of question objects.");
  process.exit(1);
}

console.log("OK:", out, Q.length, "questions");
