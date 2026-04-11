const {
  hasAnyWord,
  riskyRefundLanguage,
  scoreByLength,
  scoreCompanyBasics,
} = require("./hiringScoreCommon");

function scoreHiringCrew(answers) {
  const notes = [];
  let pts = scoreCompanyBasics(answers, notes);

  const q5 = answers.q5 || "";
  if (
    hasAnyWord(q5, ["stake", "weight", "ballast", "anchor", "wind", "uplift", "guy", "secure"])
  ) {
    pts += 8;
  } else if (hasAnyWord(q5, ["safe", "tent"])) {
    pts += 4;
    notes.push("Q5: explain staking vs weighting and wind risk.");
  } else {
    notes.push("Q5: staking/weighting rationale weak.");
  }

  const q6 = answers.q6 || "";
  if (
    hasAnyWord(q6, ["811", "dig", "utility", "gas", "electric", "locate", "mark"])
  ) {
    pts += 5;
  } else {
    notes.push("Q6: mention 811 / utilities before driving stakes.");
  }

  const q7 = answers.q7 || "";
  if (
    hasAnyWord(q7, ["wind", "weather", "secure", "pause", "lead", "dispatch", "dismantle"])
  ) {
    pts += 4;
  } else {
    notes.push("Q7: wind pickup protocol thin.");
  }

  const q8 = answers.q8 || "";
  if (
    hasAnyWord(q8, ["team", "two", "lift", "legs", "communicate", "plan", "path"])
  ) {
    pts += 4;
  } else {
    notes.push("Q8: team lift basics missing.");
  }

  const q9 = answers.q9 || "";
  if (
    hasAnyWord(q9, ["level", "slope", "trip", "stake", "guy", "shim", "uneven"])
  ) {
    pts += 4;
  } else {
    notes.push("Q9: uneven ground / tripping hazards thin.");
  }

  const q10 = answers.q10 || "";
  if (
    hasAnyWord(q10, ["walk", "inspect", "tidy", "debris", "customer", "photo", "complete"]) &&
    hasAnyWord(q10, ["safe", "secure", "tension", "stake"])
  ) {
    pts += 4;
  } else if (hasAnyWord(q10, ["check", "clean"])) {
    pts += 2;
    notes.push("Q10: expand final walk-through + safety sign-off.");
  } else {
    notes.push("Q10: site close-out unclear.");
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
      words: ["yes", "on my way", "which", "tool", "truck", "lead"],
      label: "Role-play A (tool request)",
    },
    {
      key: "rpB",
      words: ["thank", "insurance", "liability", "safe", "trained", "crew", "lead"],
      label: "Role-play B (homeowner help)",
    },
    {
      key: "rpC",
      words: ["pad", "adjust", "relocate", "lead", "damage", "protect"],
      label: "Role-play C (siding rub)",
    },
    {
      key: "rpD",
      words: ["sorry", "work", "hours", "dispatch", "lead", "quiet", "finish"],
      label: "Role-play D (neighbor complaint)",
    },
    {
      key: "rpE",
      words: ["lightning", "wind", "secure", "lead", "dispatch", "pause", "safe"],
      label: "Role-play E (weather)",
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
    pts += p;
    if (p === 0) {
      notes.push(`${label}: add a fuller field response.`);
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
    if (key === "q16" && hasAnyWord(s, ["photo", "note", "dispatch", "lead", "damage", "customer"])) {
      p = Math.min(3, p + 1);
    }
    if (key === "q17" && hasAnyWord(s, ["mud", "soft", "anchor", "weight", "mat", "lead", "water"])) {
      p = Math.min(3, p + 1);
    }
    if (key === "q18" && hasAnyWord(s, ["organize", "inspect", "next", "crew", "safe", "efficient"])) {
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
  if (rating >= 85) band = "Strong automated fit signals — still verify field safety habits manually.";
  else if (rating >= 70) band = "Acceptable range — verify weak areas noted below.";
  else if (rating >= 55) band = "Mixed — several gaps or thin answers; interview carefully.";
  else band = "Low automated score — many misses or very short answers; likely needs more prep.";

  const summary =
    `Rule-based score: ${rating}/100 (field crew track, no cloud AI). ${band}` +
    (notes.length
      ? ` Flags: ${notes.slice(0, 6).join(" ")}${notes.length > 6 ? " …" : ""}`
      : "");

  return { rating, summary, notes };
}

module.exports = { scoreHiringCrew };
