/**
 * Canonical pricing quiz HTML lives in frontend/quiz-pricing.html.
 * Applies path normalizations (.html → extensionless routes) so reruns
 * do not restore outdated links after manual edits.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const target = path.join(root, "frontend", "quiz-pricing.html");
let html = fs.readFileSync(target, "utf8");

if (!html.includes("/api/training/pricing-questions")) {
  throw new Error("quiz-pricing.html must load questions from /api/training/pricing-questions");
}

const steps = [
  ["/employee-login.html", "/employee-login"],
  ['/employee-login?return=', "/?return="],
  ["/quiz-pricing.html", "/quiz-pricing"],
  ["/assistant.html", "/assistant"],
];

let changed = false;
for (const [from, to] of steps) {
  if (html.includes(from)) {
    html = html.split(from).join(to);
    changed = true;
  }
}

fs.writeFileSync(target, html);
console.log(
  changed ? "Normalized legacy paths in quiz-pricing.html" : "quiz-pricing.html unchanged (paths OK)"
);
