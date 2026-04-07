const fs = require("fs");
const path = require("path");

function loadPricingQuiz() {
  const file = path.join(__dirname, "..", "..", "data", "pricing-quiz.json");
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

/** Human-readable block for the AI system prompt (official quiz / list prices). */
function buildPricingKnowledgeBlock() {
  const Q = loadPricingQuiz();
  return Q.map((row) => {
    const ans = row.o[row.a];
    return `• [${row.s}] ${row.q}\n  → ${ans}`;
  }).join("\n\n");
}

module.exports = {
  loadPricingQuiz,
  buildPricingKnowledgeBlock,
};
