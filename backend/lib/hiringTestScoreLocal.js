/**
 * Rule-based VA hiring score (0–100). No external APIs or API keys.
 * Uses official company facts + length/substance heuristics on open answers.
 */

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

/** @param {string} s @param {string[]} words — any match counts */
function hasAnyWord(s, words) {
  const n = norm(s);
  return words.some((w) => n.includes(w.toLowerCase()));
}

/** @param {string} s @param {string[]} words — all must match (substring in normCompact for alnum) */
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

/**
 * @param {Record<string, string>} answers
 * @returns {{ rating: number, summary: string, notes: string[] }}
 */
function scoreHiringLocal(answers) {
  const notes = [];
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
    notes.push("Q2: partial phone — verify 315-884-1499 (or office line 1498).");
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
    notes.push("Q4: address partly right — confirm full street + ZIP.");
  } else {
    notes.push("Q4: expected 330 Costello Parkway, Minoa, NY 13116.");
  }

  const catWords = [
    "tent",
    "table",
    "chair",
    "linen",
    "bounce",
    "inflatable",
    "dance",
    "stage",
    "dish",
    "concession",
    "generator",
    "heater",
    "fan",
    "wedding",
    "drape",
    "backdrop",
    "lighting",
    "china",
    "glassware",
    "flooring",
    "audio",
    "grill",
  ];
  const q5 = norm(answers.q5 || "");
  let catHits = 0;
  for (const w of catWords) {
    if (q5.includes(w)) catHits++;
  }
  if (catHits >= 8) pts += 8;
  else if (catHits >= 5) {
    pts += 5;
    notes.push("Q5: list more distinct rental categories from the site.");
  } else if (catHits >= 3) {
    pts += 2;
    notes.push("Q5: weak category coverage.");
  } else {
    notes.push("Q5: need ~8 real rental categories.");
  }

  const q6 = answers.q6 || "";
  if (
    hasAnyWord(q6, [
      "order by date",
      "order-by-date",
      "orderbydate",
      "book online",
      "online booking",
      "website",
      "friendlypartyrental.com",
      "calendar",
    ])
  ) {
    pts += 5;
  } else {
    notes.push("Q6: mention order-by-date / online booking on the site.");
  }

  const q7 = answers.q7 || "";
  if (
    hasAnyWord(q7, ["deposit", "credit", "policy", "cancellation", "non-refundable", "nonrefundable"]) &&
    !riskyRefundLanguage(q7)
  ) {
    pts += 4;
  } else if (hasAnyWord(q7, ["deposit", "cancel"])) {
    pts += 2;
    notes.push("Q7: clarify deposit / cancellation vs store credit.");
  } else {
    notes.push("Q7: weak on deposit / cancellation policy.");
  }
  if (riskyRefundLanguage(q7)) {
    pts = Math.max(0, pts - 3);
    notes.push("Q7: avoid promising refunds you cannot authorize.");
  }

  const q8 = answers.q8 || "";
  if (
    hasAnyWord(q8, ["setup", "set up", "set-up"]) &&
    hasAnyWord(q8, ["not", "doesn't", "does not", "separate", "outside", "before", "after", "rental period", "rental time"])
  ) {
    pts += 4;
  } else if (hasAnyWord(q8, ["setup", "rental"])) {
    pts += 2;
    notes.push("Q8: clarify whether setup time counts toward rental period.");
  } else {
    notes.push("Q8: setup time vs rental period unclear.");
  }

  const q9 = answers.q9 || "";
  if (
    hasAnyWord(q9, ["yes", "plug", "outlet", "blower", "electric", "power", "stay on"])
  ) {
    pts += 4;
  } else {
    notes.push("Q9: inflatables need continuous power / blower.");
  }

  const q10 = answers.q10 || "";
  if (
    hasAnyWord(q10, ["park"]) &&
    hasAnyWord(q10, ["permit", "insurance", "reservation", "town", "village", "rules", "fee"])
  ) {
    pts += 4;
  } else if (hasAnyWord(q10, ["park", "permit", "insurance"])) {
    pts += 2;
    notes.push("Q10: expand park logistics (permits, insurance, etc.).");
  } else {
    notes.push("Q10: park setups usually need permits / venue rules.");
  }

  for (const key of ["q11", "q12", "q13", "q14", "q15"]) {
    const s = answers[key] || "";
    let p = scoreByLength(s, [
      { min: 200, pts: 4 },
      { min: 120, pts: 3 },
      { min: 70, pts: 2 },
      { min: 40, pts: 1 },
      { min: 1, pts: 0 },
    ]);
    if (riskyRefundLanguage(s)) {
      p = Math.max(0, p - 2);
      notes.push(`${key.toUpperCase()}: review refund language with a manager.`);
    }
    pts += p;
  }

  const rpChecks = [
    {
      key: "rpA",
      words: ["thank", "friendly", "help", "calling", "assist", "welcome"],
      label: "Role-play A (greeting)",
    },
    {
      key: "rpB",
      words: ["?", "how many", "date", "when", "where", "tell me", "what kind", "guest"],
      label: "Role-play B (discovery)",
    },
    {
      key: "rpC",
      words: ["sorry", "apolog", "understand", "driver", "check", "status", "help"],
      label: "Role-play C (service recovery)",
    },
    {
      key: "rpD",
      words: ["quality", "clean", "professional", "experience", "value", "service", "insured"],
      label: "Role-play D (value)",
    },
    {
      key: "rpE",
      words: ["website", "book", "order", "step", "date", "online", "link", "cart"],
      label: "Role-play E (booking help)",
    },
  ];

  for (const { key, words, label } of rpChecks) {
    const s = answers[key] || "";
    let p = scoreByLength(s, [
      { min: 180, pts: 3 },
      { min: 100, pts: 2 },
      { min: 50, pts: 1 },
      { min: 1, pts: 0 },
    ]);
    if (hasAnyWord(s, words)) p = Math.min(3, p + 1);
    if (key === "rpD" && /\bbeat\b.*\bprice\b/i.test(s) && !hasAnyWord(s, ["manager", "office", "check"])) {
      p = Math.max(0, p - 1);
      notes.push("Role-play D: avoid guaranteeing to beat competitor pricing without office approval.");
    }
    pts += p;
    if (p === 0) {
      notes.push(`${label}: add a fuller scripted response (tone + specifics).`);
    }
  }

  for (const key of ["q16", "q17", "q18"]) {
    const s = answers[key] || "";
    let p = scoreByLength(s, [
      { min: 280, pts: 3 },
      { min: 160, pts: 2 },
      { min: 90, pts: 1 },
      { min: 1, pts: 0 },
    ]);
    if (key === "q16" && hasAnyWord(s, ["sorry", "apolog", "thank you", "reach out", "resolve"])) {
      p = Math.min(3, p + 1);
    }
    if (key === "q17" && hasAnyWord(s, ["check", "availability", "driver", "dispatch", "office", "schedule"])) {
      p = Math.min(3, p + 1);
    }
    if (key === "q18" && hasAnyWord(s, ["clean", "inspect", "safe", "sanitize", "quality"])) {
      p = Math.min(3, p + 1);
    }
    pts += p;
  }

  const s19 = answers.q19 || "";
  pts += scoreByLength(s19, [
    { min: 200, pts: 2 },
    { min: 120, pts: 1 },
    { min: 1, pts: 0 },
  ]);
  const s20 = answers.q20 || "";
  pts += scoreByLength(s20, [
    { min: 200, pts: 3 },
    { min: 120, pts: 2 },
    { min: 60, pts: 1 },
    { min: 1, pts: 0 },
  ]);

  const rating = Math.min(100, Math.max(0, Math.round(pts)));

  let band;
  if (rating >= 85) band = "Strong automated fit signals — still review tone and judgment manually.";
  else if (rating >= 70) band = "Acceptable range — verify weak areas noted below.";
  else if (rating >= 55) band = "Mixed — several gaps or thin answers; interview carefully.";
  else band = "Low automated score — many misses or very short answers; likely needs more prep.";

  const summary =
    `Rule-based score: ${rating}/100 (no cloud AI). ${band}` +
    (notes.length
      ? ` Flags: ${notes.slice(0, 6).join(" ")}${notes.length > 6 ? " …" : ""}`
      : "");

  return { rating, summary, notes };
}

module.exports = { scoreHiringLocal };
