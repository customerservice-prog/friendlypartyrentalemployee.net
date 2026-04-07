/**
 * Ensures the generated staff Q&A library exists and meets minimum size.
 * Run via: npm run test:assistant-training
 */
const {
  STAFF_ASSISTANT_QNA_ENTRIES,
  STAFF_ASSISTANT_QNA_VERSION,
} = require("../backend/lib/staffAssistantQna.generated.js");

const n = STAFF_ASSISTANT_QNA_ENTRIES.length;
if (n < 100) {
  console.error("FAIL: STAFF_ASSISTANT_QNA_ENTRIES expected >= 100, got", n);
  process.exitCode = 1;
  process.exit(1);
}
for (let i = 0; i < Math.min(n, 500); i++) {
  const e = STAFF_ASSISTANT_QNA_ENTRIES[i];
  if (
    !e ||
    !Array.isArray(e.k) ||
    !e.k.length ||
    typeof e.q !== "string" ||
    typeof e.a !== "string"
  ) {
    console.error("FAIL: malformed entry at index", i, e);
    process.exit(1);
  }
}
console.log(
  "OK: assistant-training",
  n,
  "entries, version",
  STAFF_ASSISTANT_QNA_VERSION
);
