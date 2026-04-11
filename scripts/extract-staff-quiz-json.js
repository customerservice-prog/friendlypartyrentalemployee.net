/**
 * One-shot: pull Q arrays from quiz HTML into data/*.json
 * Run: node scripts/extract-staff-quiz-json.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const front = path.join(root, "frontend");
const dataDir = path.join(root, "data");

function extractPolicies(html) {
  const m = html.match(/var Q=(\[[\s\S]*?\]);var SECS=/);
  if (!m) throw new Error("policies: no Q match");
  return JSON.parse(m[1]);
}

function extractSpacedQ(html) {
  const m = html.match(/var Q = (\[[\s\S]*?\]);[\s\n]*var SECS/);
  if (!m) throw new Error("no Q match");
  return JSON.parse(m[1]);
}

function extractProducts(html) {
  const m = html.match(/var Q=(\[[\s\S]*?\]);var SECS=/);
  if (!m) throw new Error("products: no Q match");
  return JSON.parse(m[1]);
}

const out = [
  ["policies-quiz.json", extractPolicies(fs.readFileSync(path.join(front, "quiz-policies.html"), "utf8"))],
  ["products-quiz.json", extractProducts(fs.readFileSync(path.join(front, "quiz-products.html"), "utf8"))],
  ["customer-service-quiz.json", extractSpacedQ(fs.readFileSync(path.join(front, "quiz-customer-service.html"), "utf8"))],
  ["quote-calls-quiz.json", extractSpacedQ(fs.readFileSync(path.join(front, "quiz-quote-calls.html"), "utf8"))],
];

for (const [name, arr] of out) {
  if (!Array.isArray(arr) || !arr.length) throw new Error(name + ": bad array");
  for (const row of arr) {
    if (typeof row.a !== "number" || !Array.isArray(row.o)) throw new Error(name + ": bad row");
  }
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(arr, null, 2) + "\n", "utf8");
  console.log(name, arr.length);
}
