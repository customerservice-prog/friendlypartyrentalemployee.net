/**
 * One-off generator: writes backend/lib/staffAssistantQna.generated.js
 * Run: node scripts/gen-staff-assistant-qna.js
 *
 * Produces 100+ varied staff-facing Q&A snippets for the local browser assistant.
 */
const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "..", "backend", "lib", "staffAssistantQna.generated.js");

const blocks = [];

function E(k, q, a) {
  blocks.push({ k, q, a });
}

// --- Core contact & brand (12) ---
E(["phone", "number", "call"], "What is Friendly Party Rental's phone number?", "Main line: **315-884-1498**. For email use **customerservice@friendlypartyrental.com**.");
E(["email", "e-mail", "write"], "What email do customers use?", "**customerservice@friendlypartyrental.com** — give this for written quotes, photos, or follow-ups.");
E(["address", "location", "warehouse"], "Where is the company located?", "**330 Costello Parkway, Minoa, NY 13116** — serving Syracuse and Central NY.");
E(["website", "online", "catalog"], "Where do customers book online?", "**friendlypartyrental.com** — date-based ordering: **friendlypartyrental.com/order-by-date**.");
E(["hours", "open", "close"], "What are store hours?", "Do **not** invent hours. Say: “I'll confirm today's hours with our office” or have them call **315-884-1498**.");
E(["who are you", "company name"], "How should I introduce the company?", "“**Friendly Party Rental** — we deliver and set up tents, inflatables, tables, chairs, and more for events across Central New York.”");
E(["save20", "discount", "coupon"], "What discount code do we promote?", "**SAVE20** at checkout when applicable — confirm current promotions with a manager before guaranteeing.");
E(["pay", "payment", "credit card"], "How does payment work?", "Payment options vary by order type. Collect details, then say: “I'll confirm payment options and schedule with our office.” Escalate to **315-884-1498**.");
E(["invoice", "receipt"], "Customer needs an invoice or receipt.", "Note the order name, date, and items; route to the office for a correct invoice or receipt.");
E(["fax"], "Do we use fax?", "Most customers use email. If they insist on fax, check with the office — do not make up a fax number.");
E(["social media", "facebook", "instagram"], "They ask for our social links.", "Point them to **friendlypartyrental.com** and official listings; don't guess handles.");
E(["bbb", "accredited"], "Are we BBB / accredited?", "Don't invent credentials. Offer **315-884-1498** or manager confirmation.");

// --- Booking & quotes (12) ---
E(["quote", "estimate", "ballpark"], "Customer wants a rough quote.", "Gather **event date, address, guest count (if known), and items**. Say: “I'll build an accurate quote — may I get those details?”");
E(["hold date", "pencil", "tentative"], "Can we hold a date without deposit?", "Say: “I'll check availability and what hold options we have for that date.” Route to shop/manager.");
E(["change order", "add items"], "They want to add items after booking.", "Thank them, list additions, and say: “I'll have our team update your order and confirm pricing.”");
E(["smaller", "downgrade"], "They want fewer items than quoted.", "Confirm the revised list and say: “I'll update the quote to match.”");
E(["written quote", "pdf"], "They want something in writing.", "Offer email follow-up from the office with itemized line items when possible.");
E(["compare packages", "package deal"], "Which package is best?", "Ask guest count, tent need, and budget range. Mention **bundles save vs à la carte**; confirm exact bundle contents with the shop.");
E(["deposit", "down payment"], "How much deposit do they pay?", "**Never invent a percentage or dollar rule.** “I'll confirm deposit terms for your items and date with our office.”");
E(["full payment", "balance due"], "When is balance due?", "Policy varies — escalate: “I'll confirm your payment schedule from your contract or our coordinator.”");
E(["rush fee", "expedite"], "Is there a rush fee?", "If timing is tight, say: “I'll check crew routing and whether any rush charges apply.”");
E(["weekend", "saturday"], "Saturday delivery possible?", "Often yes — **confirm crew and inventory** before promising a window.");
E(["holiday", "july 4", "memorial"], "Holiday weekend booking?", "High demand — check availability early; avoid promising without inventory check.");
E(["multi-day", "rental period"], "Rent for extra days?", "Extensions may be available; quote **per extra day** from the price list or manager.");

// --- Delivery & logistics (12) ---
E(["delivery fee", "delivery charge"], "Is delivery free?", "Fees depend on distance, items, and windows — **don't quote delivery fee from memory.**");
E(["setup", "set up", "install"], "Do you set up equipment?", "**Yes** — professional setup and pickup are core service; confirm job scope in the order.");
E(["pickup", "strike", "tear down"], "What about teardown?", "Crew returns for pickup/strike per schedule — confirm timing with dispatch.");
E(["customer pick up", "will call"], "Can they pick up from warehouse?", "If offered on their items, confirm **weight, vehicle, and pickup slot** with the shop — don't assume.");
E(["curbside", "driveway"], "Drop at curb only?", "Default script: “We typically deliver and set to your event layout — I'll confirm what's included for your order.”");
E(["stairs", "elevator"], "Venue has stairs.", "Flag for crew lead; may affect labor — don't promise until logistics reviews.");
E(["mud", "soft ground"], "Ground is soft or muddy.", "Tent staking and jobsite safety may change — escalate to experienced crew contact.");
E(["access", "narrow"], "Driveway is narrow.", "Note width constraints for truck/trailer; dispatch should sign off.");
E(["time window", "between"], "They need delivery between 9 and 11.", "Log the window; confirm with dispatch rather than guaranteeing.");
E(["early", "before 8"], "Needs very early morning setup.", "May require overtime — check scheduling.");
E(["certificate of insurance", "coi", "venue insurance"], "Venue wants COI.", "“I'll have our coordinator send what's required.” **315-884-1498** / office.");
E(["permit", "town permit"], "Town requires a permit.", "Don't advise on legal requirements beyond training; connect them with management.");

// --- Service & CS tone (10) ---
E(["angry", "yelling"], "Customer is yelling on the phone.", "Stay calm: “I'm here to help — let's solve this together.” Listen, repeat facts, avoid arguing.");
E(["supervisor", "manager", "owner"], "They demand a supervisor.", "“I'll get someone who can help — may I place you briefly on hold or have a callback within [time]?”");
E(["lawyer", "legal", "sue"], "They mention lawyers.", "Do **not** debate liability. “I'll document your concern and have the right person follow up.”");
E(["recording", "record"], "They say the call is recorded.", "Stay professional; avoid off-script promises.");
E(["language", "spanish"], "Language barrier.", "Use clear simple English; offer email for written detail; ask if a manager can assist with bilingual help if available.");
E(["callback", "call me back"], "They want a callback.", "Capture name, number, timezone, and topic; give realistic timeframe.");
E(["wrong number"], "They have the wrong company.", "Politely clarify we're **Friendly Party Rental** (equipment rental) and offer **315-884-1498** if they're unsure.");
E(["job application", "hiring"], "They want a job.", "Direct to official hiring channels or ask a manager — don't interview on the spot.");
E(["spam", "robocall"], "Suspected spam call.", "Keep it brief; don't share internal info.");
E(["repeat caller"], "Same customer calls repeatedly.", "Review notes; escalate if abusive per policy.");

// --- Products — general (no invented $) (18) ---
E(["pole tent", "rope", "stakes"], "What's a pole tent?", "Traditional pole tents use center poles and stakes; great for grass setups. **Exact sizes and prices** are in pricing training.");
E(["frame tent", "no center pole"], "Why frame tent?", "Frame tents can avoid center poles under the canopy — good for certain layouts; confirm inventory.");
E(["sidewall", "walls"], "Do tents include sidewalls?", "Sidewalls are often **add-ons** — confirm itemization on the quote.");
E(["dance floor", "subfloor"], "Dance floor on grass?", "May need subfloor or prep — don't promise; involve lead crew.");
E(["inflatable", "blower"], "Bounce house needs power?", "**Blower requires power** — confirm outlet or generator sizing.");
E(["adult bounce", "weight limit"], "Adults on bounce house?", "Stress **manufacturer rules and safety**; never encourage unsafe use.");
E(["sandbag", "weights", "indoor"], "Bounce indoors without stakes?", "Sandbags/weights may be required — shop confirms.");
E(["generator", "fuel"], "Who fuels the generator?", "Clarify rental terms — customer vs company fuel responsibility.");
E(["chiavari", "gold chair"], "What are Chiavari chairs?", "Elegant event chairs — colors and pricing from training; pairing with linens common.");
E(["throne chair", "king throne"], "Throne pricing?", "Look up in **signed-in pricing FAQ** or quiz materials for exact figures.");
E(["linen size", "tablecloth size"], "What linen fits a 6ft table?", "Use linen sizing chart / coordinator — don't guess dimensions.");
E(["glassware", "dishes"], "Do we rent dishes?", "If not in catalog, say so and offer what we do stock.");
E(["flatware", "silverware"], "Silverware rental?", "Confirm with inventory — varies by location.");
E(["stage", "band"], "Small stage for band?", "Staging pieces may be modular — confirm height, dimensions, load-in.");
E(["pa system", "microphone"], "Sound system?", "If not a standard SKU, escalate — don't invent specs.");
E(["catering equipment"], "Chafing dishes / warmers?", "Check inventory list; offer alternatives if unavailable.");
E(["tent lighting", "chandelier"], "Chandelier in tent?", "May be specialty install — involve events lead.");
E(["outdoor heater", "patio heater"], "Patio heaters?", "We handle climate gear — confirm count, fuel, placement restrictions.");

// --- Safety & compliance (10) ---
E(["weather", "wind", "unsafe"], "Wind advisory — is setup safe?", "**Safety first** — crews follow manufacturer and company rules; never pressure crew to ignore weather.");
E(["electrical", "trip", "breaker"], "Tripping breakers with our gear.", "Stop use; advise venue contact; escalate — avoid diagnosing electrical faults yourself.");
E(["kids unsupervised", "bounce"], "Kids unsupervised near inflatable.", "Remind customer of **supervision rules** from rental agreement language when applicable.");
E(["alcohol", "bar"], "Renting with alcohol service?", "Venue and permit rules vary — customer responsibility; don't give legal advice.");
E(["propane", "fire"], "Propane heater rules.", "Follow manufacturer spacing and ventilation guidance; flag nonstandard venues.");
E(["inspection", "clean"], "Was gear inspected?", "Company standard: **cleaned and inspected before rental** — say that with confidence.");
E(["covid", "sanitize"], "Cleaning / sanitation question.", "Point to company cleaning standards; don't cite outdated health claims.");
E(["ada", "wheelchair"], "ADA accessibility under tent?", "Layout affects access — involve coordinator; don't guarantee compliance yourself.");
E(["emergency", "injury"], "Someone got hurt on equipment.", "**Emergencies: 911 first.** Then document and notify management immediately.");
E(["damage waiver"], "Do we sell damage waiver?", "If your location offers it, explain per training; otherwise don't invent.");

// --- Policies — cautious (10) ---
E(["cancel", "cancellation"], "They need to cancel.", "“I'll note your cancellation request and confirm any fees or credits per your agreement.” Offer **315-884-1498** for billing timing.");
E(["refund", "money back"], "They want a full refund.", "Don't promise. “I'll review with management against your contract and our policy.”");
E(["no show", "didnt show"], "Customer says we no-showed.", "Apologize, gather order # and timeline, escalate immediately to dispatch/manager.");
E(["dirty", "stained"], "Equipment arrived dirty.", "Apologize; document photos if possible; arrange replacement or cleaning per procedure.");
E(["broken", "doesnt work"], "Item doesn't work at event.", "Troubleshoot basics if trained; otherwise dispatch help — don't blame the customer.");
E(["wrong item", "not what i ordered"], "Wrong item delivered.", "Apologize; confirm what was on order vs delivered; fast correction path.");
E(["late pickup", "still here"], "Pickup is late after event.", "Check ETA with dispatch; keep customer updated.");
E(["extra cleaning fee", "damage charge"], "They dispute a damage charge.", "Route to billing/management with documentation — staff don't argue charges on the spot.");
E(["price match", "cheaper elsewhere"], "Will you match a competitor price?", "Don't commit. “I'll see what our team can do” or involve manager.");
E(["contract", "fine print"], "They question contract terms.", "Don't interpret legal language. “I'll have our coordinator walk through that with you.”");

// --- More varied scenarios to reach 100+ ---
const extras = [
  [["catalog", "browse"], "Can I browse before calling?", "Send them to **friendlypartyrental.com** and offer to answer sizing questions.",],
  [["minimum order"], "Is there a minimum order?", "Minimums depend on items and routing — check with office.",],
  [["tip", "gratuity"], "Can I accept a tip?", "Follow company policy; when in doubt, thank them and defer to manager.",],
  [["lost", "stolen"], "Items stolen after delivery.", "File internal report; customer may need police report — escalate.",],
  [["grass", "stakes"], "Can you stake on my lawn?", "Staking may leave marks — set expectations; alternatives may cost more.",],
  [["concrete", "asphalt"], "Setup on pavement?", "May need weights instead of stakes — confirm with crew lead.",],
  [["deck", "patio"], "Tent on wooden deck?", "Structural review required — don't approve without engineer/coordinator sign-off.",],
  [["pool", "pool deck"], "Near a pool.", "Flag slip/trip hazards; follow safety checklist.",],
  [["parking", "where truck"], "Where will trucks park?", "Note loading zone access; confirm with venue.",],
  [["after hours"], "After-hours emergency?", "Use on-call procedure from management — don't give personal cell.",],
  [["duplicate", "two orders"], "Two quotes for same customer?", "Merge notes; avoid conflicting quotes.",],
  [["military", "nonprofit"], "Military or nonprofit discount?", "Only if officially offered — confirm before promising.",],
  [["school", "district"], "School district event.", "May need purchase order — route to office.",],
  [["church", "fellowship"], "Church picnic rentals.", "Common use case — suggest tents, tables, games; confirm date early.",],
  [["festival", "vendor"], "Vendor booth at festival.", "Confirm footprint rules with organizer before quoting tent/canopy.",],
  [["backup plan", "rain plan"], "Outdoor wedding rain plan.", "Discuss tent walls, flooring, or indoor backup; set expectations on fees for changes.",],
  [["sparkler", "send off"], "Sparkler exit safe near tent?", "Fire risk — defer to venue and fire rules; don't greenlight hazards.",],
  [["confetti", "hose"], "Confetti cleanup fees.", "Mention possible cleaning charges if policy says so — verify wording.",],
  [["dj", "band space"], "Space for DJ near dance floor.", "Map power and shelter; confirm dimensions.",],
  [["projector", "screen"], "Outdoor movie audio.", "Tech needs differ — involve specialist coordinator.",],
  [["toddler", "small kids"], "Bounce for toddlers only.", "Use appropriate units and rules; parent supervision required.",],
  [["water slide", "hose", "water"], "Water slide hookup.", "Confirm water source and drainage permission.",],
  [["obstacle course", "grand"], "Large inflatable course.", "May need extra anchors/staffing — shop confirms.",],
  [["snow", "winter"], "Winter tent or heater event.", "Snow load and heater ventilation — escalate to experienced planner.",],
  [["map", "directions"], "Directions to warehouse.", "Give official address; suggest GPS; don't improvise back-road directions.",],
  [["tax", "sales tax"], "Is tax included?", "Quote tax handling per office procedure — don't guess rates.",],
  [["po", "purchase order"], "Pay by purchase order.", "Confirm credit approval process with office.",],
  [["net 30"], "Net 30 terms?", "Commercial terms only if approved — manager decision.",],
  [["donation", "sponsor"], "Donation request.", "Refer to ownership/marketing policy — staff don't authorize donations.",],
  [["media", "news"], "Reporter calling.", "Route to marketing/owner — no on-record quotes without approval.",],
  [["instagram photo", "tag us"], "Customer tags us online.", "Positive engagement OK within brand guidelines — thank them.",],
  [["review", "google review"], "They'll leave a bad review.", "Stay professional; offer resolution path; involve manager if escalated.",],
  [["repeat problem"], "Known problem customer.", "Read account notes; involve manager early.",],
  [["vip", "mayor", "celebrity"], "High-profile event.", "Extra coordination — flag to leadership.",],
  [["neighbor", "noise"], "Neighbor complained about noise.", "Sympathize; suggest volume/time adjustments if applicable; venue rules first.",],
  [["parking ticket"], "Truck got parking ticket.", "Commercial ops issue — customer generally not responsible unless contract says otherwise.",],
  [["damage to property"], "Customer says we damaged driveway.", "Document; no admissions; insurance/legal path through management.",],
  [["mowing", "lawn"], "Should customer mow before tent?", "Short grass helps staking — suggest mowing before install day.",],
  [["sprinkler", "irrigation"], "Sprinkler lines in yard.", "Customer should mark utilities; crew avoids obvious heads — flag risk.",],
  [["dog", "pets"], "Dogs during setup.", "Safety — ask pets be secured during install/strike.",],
  [["power outage"], "Outage during event.", "Generators/backup per contract items — don't promise grid power reliability.",],
  [["extension cord"], "Customer provides cords.", "Check gauge/length limits vs load; prefer company-approved distro when specified.",],
  [["float", "parade"], "Parade float pieces.", "If outside normal inventory, escalate — may not be a service line.",],
  [["race", "5k"], "5K tents at start line.", "Early setup; staking on asphalt may need weights.",],
  [["auction", "benefit"], "Charity auction tent.", "Tables, sound, lighting bundle — confirm nonprofit billing if applicable.",],
  [["grad party", "open house"], "High school grad party.", "Popular combo: tent, tables, lights, games — inventory books early.",],
  [["baby shower"], "Baby shower rentals.", "**Save20** may apply online; suggest tables, chairs, light linens.",],
  [["retirement"], "Retirement party.", "Similar to corporate/family — clarify indoor vs outdoor.",],
  [["engagement"], "Engagement party.", "Smaller footprint often; photo booth upsell appropriate.",],
  [["anniversary"], "Anniversary dinner tent.", "Lighting and linens elevate small tented dinners.",],
  [["family reunion"], "Large family reunion.", "High chair counts + canopies; confirm ADA needs.",],
  [["tailgate"], "Tailgate party.", "Generators + canopies; confirm venue alcohol rules with customer.",],
  [["farm", "barn"], "Barn wedding add-on tent.", "Connector tent or catering prep tent common — measure door heights.",],
  [["winery"], "Winery event.", "Verify venue vendor rules and access windows.",],
  [["park permit", "county park"], "County park reservation.", "Customer often secures permit; we provide COI if required — coordinate early.",],
  [["hoa", "homeowners"], "HOA rules for bounce house.", "Customer obtains HOA approval — we provide specs as needed.",],
  [["apartment", "complex"], "Apartment courtyard.", "Tight access; elevators; noise — check with property manager.",],
  [["roof", "balcony"], "Rooftop / balcony inquiry.", "Usually not applicable for large tents — clarify scope; escalate.",],
  [["last item", "only need one"], "They only need one table.", "Still capture date and delivery — minimum fees might apply.",],
  [["comparison", "home depot"], "Why not buy a tent?", "Highlight **pro install, strike, cleaning, and large inventory** vs one-time retail buy.",],
  [["insurance claim"], "Insurance is paying.", "Billing may differ — office handles documentation.",],
  [["fire marshal"], "Fire marshal inspection.", "Provide specs and setup diagrams via coordinator; crew complies on site.",],
];

for (const [k, q, a] of extras) {
  E(k, q, a);
}

const header = `/* eslint-disable max-len */
/**
 * AUTO-GENERATED by scripts/gen-staff-assistant-qna.js — do not edit by hand.
 * Run: node scripts/gen-staff-assistant-qna.js
 */
module.exports.STAFF_ASSISTANT_QNA_ENTRIES = `;

const footer = `;

module.exports.STAFF_ASSISTANT_QNA_VERSION = 1;
`;

fs.writeFileSync(outPath, header + JSON.stringify(blocks, null, 2) + footer, "utf8");
console.log("Wrote", blocks.length, "entries to", outPath);
