const { scoreHiringLocal } = require("./hiringTestScoreLocal");
const { scoreHiringDriver } = require("./hiringTestScoreDriver");
const { scoreHiringCrew } = require("./hiringTestScoreCrew");

const ANSWER_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
  "q15",
  "rpA",
  "rpB",
  "rpC",
  "rpD",
  "rpE",
  "q16",
  "q17",
  "q18",
  "q19",
  "q20",
];

const LABELS_VA = {
  q1: "Q1 — Company name & physical town",
  q2: "Q2 — Main customer phone",
  q3: "Q3 — Customer service email",
  q4: "Q4 — Street address",
  q5: "Q5 — Eight rental categories",
  q6: "Q6 — Online booking tool",
  q7: "Q7 — Deposit / cancellation",
  q8: "Q8 — Setup time vs rental period",
  q9: "Q9 — Bounce houses plugged in",
  q10: "Q10 — Park setup awareness",
  q11: "Q11 — Date change scenario",
  q12: "Q12 — Angry customer / late driver",
  q13: "Q13 — Bounce house price question",
  q14: "Q14 — Water slide tomorrow",
  q15: "Q15 — Three core promises",
  rpA: "Role-play A — Friendly greeting (what you would say)",
  rpB: "Role-play B — Confused customer / 50 people BBQ",
  rpC: "Role-play C — Upset customer / late delivery",
  rpD: "Role-play D — Price shopper / competitor",
  rpE: "Role-play E — Booking walkthrough",
  q16: "Q16 — 1-star Google review response",
  q17: "Q17 — Same-day bounce house Saturday7am",
  q18: "Q18 — Cleaned equipment / hesitant customer",
  q19: "Q19 — Supplemental / internal (if you assigned one)",
  q20: "Q20 — Brand personality",
};

const LABELS_DRIVER = {
  q1: "Q1 — Company name & physical town",
  q2: "Q2 — Main customer phone",
  q3: "Q3 — Customer service email",
  q4: "Q4 — Street address",
  q5: "Q5 — Pre-trip vehicle & cargo safety",
  q6: "Q6 — Contact when delayed or rerouted",
  q7: "Q7 — Securing inflatables, tents, heavy items",
  q8: "Q8 — Customer not on site for delivery",
  q9: "Q9 — Minor damage noticed while unloading",
  q10: "Q10 — Narrow street parking & safety",
  q11: "Q11 — Construction delay / tight timeline",
  q12: "Q12 — Angry customer / refund demand",
  q13: "Q13 — Wrong or disputed items on truck",
  q14: "Q14 — Heavy cart / steep driveway / solo",
  q15: "Q15 — Three delivery safety priorities",
  rpA: "Role-play A — Dispatch radio check-in",
  rpB: "Role-play B — Customer near truck during unload",
  rpC: "Role-play C — Near miss (property / mirrors)",
  rpD: "Role-play D — Vendor blocking access",
  rpE: "Role-play E — Damaged strap at end of day",
  q16: "Q16 — Incident note (vehicle scratch in lot)",
  q17: "Q17 — Heat wave day precautions",
  q18: "Q18 — Professional appearance on route",
  q19: "Q19 — Supplemental / internal (if you assigned one)",
  q20: "Q20 — Brand personality on the job",
};

const LABELS_CREW = {
  q1: "Q1 — Company name & physical town",
  q2: "Q2 — Main customer phone",
  q3: "Q3 — Customer service email",
  q4: "Q4 — Street address",
  q5: "Q5 — Tent staking / weighting & wind",
  q6: "Q6 — 811 / call-before-you-dig & stakes",
  q7: "Q7 — Wind picks up during install",
  q8: "Q8 — Team lift — when and how",
  q9: "Q9 — Sloped or uneven grass setup",
  q10: "Q10 — Before leaving the install site",
  q11: "Q11 — Customer wants it faster than safe",
  q12: "Q12 — Crowd or kids near work area",
  q13: "Q13 — Lines near overhead power",
  q14: "Q14 — Missing stake / hardware mid-setup",
  q15: "Q15 — Communicating with the lead",
  rpA: "Role-play A — Lead asks for a tool",
  rpB: "Role-play B — Homeowner offers to help hold frame",
  rpC: "Role-play C — Guy line rubbing siding",
  rpD: "Role-play D — Neighbor complaint",
  rpE: "Role-play E — Weather closing in",
  q16: "Q16 — Minor fabric snag at pickup — documentation",
  q17: "Q17 — Mud / soft ground after rain",
  q18: "Q18 — Clean, organized truck gear",
  q19: "Q19 — Supplemental / internal (if you assigned one)",
  q20: "Q20 — Brand personality in the field",
};

const TRACKS = {
  "virtual-assistant": {
    key: "virtual-assistant",
    quizSlug: "hiring-virtual-assistant",
    defaultJobTitle: "VA applicant",
    labels: LABELS_VA,
    score: scoreHiringLocal,
  },
  driver: {
    key: "driver",
    quizSlug: "hiring-driver",
    defaultJobTitle: "Driver applicant",
    labels: LABELS_DRIVER,
    score: scoreHiringDriver,
  },
  crew: {
    key: "crew",
    quizSlug: "hiring-crew",
    defaultJobTitle: "Field crew applicant",
    labels: LABELS_CREW,
    score: scoreHiringCrew,
  },
};

function normalizeTrack(raw) {
  const s = String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z-]/g, "");
  if (s === "driver" || s === "delivery") return "driver";
  if (s === "crew" || s === "field" || s === "tent" || s === "tents") return "crew";
  if (
    s === "virtual-assistant" ||
    s === "virtualassistant" ||
    s === "va" ||
    s === ""
  ) {
    return "virtual-assistant";
  }
  return "virtual-assistant";
}

module.exports = {
  ANSWER_KEYS,
  TRACKS,
  normalizeTrack,
  LABELS_VA,
};
