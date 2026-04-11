/** Shared helpers for rule-based hiring scores (no API keys). */

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normCompact(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function digitsOnly(s) {
  return String(s || "").replace(/\D/g, "");
}

function hasAnyWord(s, words) {
  const n = norm(s);
  return words.some((w) => n.includes(w.toLowerCase()));
}

function hasAllCompact(s, parts) {
  const n = normCompact(s);
  return parts.every((p) => n.includes(normCompact(p)));
}

const RISKY_PROMISE = [
  "full refund",
  "100% refund",
  "money back guarantee",
  "we'll refund everything",
  "i guarantee a refund",
];

function riskyRefundLanguage(s) {
  const n = norm(s);
  return RISKY_PROMISE.some((p) => n.includes(p));
}

function scoreByLength(s, tiers) {
  const L = String(s || "").trim().length;
  for (const t of tiers) {
    if (L >= t.min) return t.pts;
  }
  return 0;
}

/** Company basics: Friendly Party / Minoa, phone, email, address — same checks across delivery/crew tracks. */
function scoreCompanyBasics(answers, notes) {
  let pts = 0;
  const q1 = answers.q1 || "";
  if (hasAnyWord(q1, ["minoa"]) && hasAnyWord(q1, ["friendly", "friendly party"])) {
    pts += 5;
  } else if (hasAnyWord(q1, ["minoa"])) {
    pts += 3;
    notes.push("Q1: town OK; company name unclear.");
  } else {
    notes.push("Q1: expected Minoa + Friendly Party Rental.");
  }

  const d = digitsOnly(answers.q2 || "");
  if (d.includes("3158841499") || d.includes("3158841498")) {
    pts += 5;
  } else if (d.includes("315884")) {
    pts += 2;
    notes.push("Q2: partial phone.");
  } else {
    notes.push("Q2: main line not detected.");
  }

  const q3 = normCompact(answers.q3 || "");
  if (q3.includes("customerservice") && q3.includes("friendlypartyrental")) {
    pts += 5;
  } else {
    notes.push("Q3: expected customerservice@friendlypartyrental.com.");
  }

  const q4 = answers.q4 || "";
  if (
    hasAllCompact(q4, ["330", "costello", "minoa"]) ||
    (hasAnyWord(q4, ["330 costello", "costello parkway"]) &&
      hasAnyWord(q4, ["minoa", "13116"]))
  ) {
    pts += 6;
  } else if (hasAnyWord(q4, ["costello", "minoa"])) {
    pts += 3;
    notes.push("Q4: address partly right.");
  } else {
    notes.push("Q4: expected 330 Costello Parkway, Minoa, NY 13116.");
  }
  return pts;
}

module.exports = {
  norm,
  normCompact,
  digitsOnly,
  hasAnyWord,
  hasAllCompact,
  riskyRefundLanguage,
  scoreByLength,
  scoreCompanyBasics,
};
