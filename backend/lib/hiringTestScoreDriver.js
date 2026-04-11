const {
  hasAnyWord,
  riskyRefundLanguage,
  scoreByLength,
  scoreCompanyBasics,
} = require("./hiringScoreCommon");

function scoreHiringDriver(answers) {
  const notes = [];
  let pts = scoreCompanyBasics(answers, notes);

  const q5 = answers.q5 || "";
  if (
    (hasAnyWord(q5, ["tire", "lights", "brake", "mirror", "fluid", "oil", "horn", "registration"]) ||
      hasAnyWord(q5, ["walkaround", "walk around", "pretrip", "pre-trip", "inspection"])) &&
    hasAnyWord(q5, ["strap", "tie", "secure", "load", "cargo", "bind", "tarp", "bulkhead"])
  ) {
    pts += 8;
  } else if (hasAnyWord(q5, ["inspect", "check"])) {
    pts += 5;
    notes.push("Q5: spell out vehicle walk-around plus cargo securement.");
  } else {
    notes.push("Q5: weak on pre-trip and securing load.");
  }

  const q6 = answers.q6 || "";
  if (hasAnyWord(q6, ["dispatch", "office", "manager", "supervisor"])) {
    pts += 5;
  } else if (hasAnyWord(q6, ["call", "text", "radio"])) {
    pts += 3;
    notes.push("Q6: name dispatch/office as first contact when delayed.");
  } else {
    notes.push("Q6: contact chain for delays/reroutes unclear.");
  }

  const q7 = answers.q7 || "";
  if (
    hasAnyWord(q7, ["strap", "ratchet", "tie", "dunnage", "blanket", "secure", "tarp", "net"])
  ) {
    pts += 4;
  } else {
    notes.push("Q7: describe how items are tied/secured.");
  }

  const q8 = answers.q8 || "";
  if (
    hasAnyWord(q8, ["dispatch", "office", "call", "text"]) &&
    hasAnyWord(q8, ["wait", "attempt", "message", "photo", "note", "door", "tag"])
  ) {
    pts += 4;
  } else if (hasAnyWord(q8, ["dispatch", "customer"])) {
    pts += 2;
    notes.push("Q8: no-contact delivery steps thin.");
  } else {
    notes.push("Q8: need protocol when customer is absent.");
  }

  const q9 = answers.q9 || "";
  if (hasAnyWord(q9, ["photo", "picture"]) && hasAnyWord(q9, ["dispatch", "office", "manager", "note", "document"])) {
    pts += 4;
  } else if (hasAnyWord(q9, ["dispatch", "damage", "report"])) {
    pts += 2;
    notes.push("Q9: document damage and notify dispatch before leaving.");
  } else {
    notes.push("Q9: damage reporting unclear.");
  }

  const q10 = answers.q10 || "";
  if (
    hasAnyWord(q10, ["hazard", "cone", "flash", "signal", "mirror", "caution"]) ||
    (hasAnyWord(q10, ["park"]) && hasAnyWord(q10, ["legal", "safe", "visibility"]))
  ) {
    pts += 4;
  } else {
    notes.push("Q10: tight-street / pedestrian safety thin.");
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
      words: ["copy", "roger", "thank", "heading", "route", "safe", "touch"],
      label: "Role-play A (dispatch check-in)",
    },
    {
      key: "rpB",
      words: ["thank", "slow", "caution", "eye", "clear", "safe", "signal"],
      label: "Role-play B (customer near truck)",
    },
    {
      key: "rpC",
      words: ["stop", "check", "mirror", "damage", "report", "dispatch", "note"],
      label: "Role-play C (near miss)",
    },
    {
      key: "rpD",
      words: ["polite", "dispatch", "wait", "safe", "alternate", "neighbor"],
      label: "Role-play D (blocked access)",
    },
    {
      key: "rpE",
      words: ["report", "replace", "strap", "damage", "unsafe", "dispatch", "inspect"],
      label: "Role-play E (damaged strap)",
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
      notes.push(`${label}: add a fuller on-the-job response.`);
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
    if (key === "q16" && hasAnyWord(s, ["date", "time", "location", "dispatch", "photo", "damage"])) {
      p = Math.min(3, p + 1);
    }
    if (key === "q17" && hasAnyWord(s, ["water", "shade", "rest", "hydrat", "heat", "equipment"])) {
      p = Math.min(3, p + 1);
    }
    if (key === "q18" && hasAnyWord(s, ["professional", "trust", "brand", "customer", "uniform"])) {
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
  if (rating >= 85) band = "Strong automated fit signals — still verify road judgment manually.";
  else if (rating >= 70) band = "Acceptable range — verify weak areas noted below.";
  else if (rating >= 55) band = "Mixed — several gaps or thin answers; interview carefully.";
  else band = "Low automated score — many misses or very short answers; likely needs more prep.";

  const summary =
    `Rule-based score: ${rating}/100 (driver track, no cloud AI). ${band}` +
    (notes.length
      ? ` Flags: ${notes.slice(0, 6).join(" ")}${notes.length > 6 ? " …" : ""}`
      : "");

  return { rating, summary, notes };
}

module.exports = { scoreHiringDriver };
