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

// --- Training assistant / tech troubleshooting (staff) ---
E(
  ["not responding", "broken", "not working", "error", "timeout", "assistant down"],
  "The AI training assistant is not answering for me.",
  "Checklist: (1) **Sign in** with your employee PIN on the hub. (2) If a **quiz is open**, finish or leave it — chat is **paused during quizzes**. (3) Ask with **specific words** (item + size + date) so the offline library can match. (4) For list prices, stay signed in so **pricing + staff Q&A** loads. (5) Live cloud AI depends on server setup — if it fails you still get **offline answers**. Call **315-884-1498** for live operations help."
);
E(
  ["openai", "chatgpt", "cloud ai"],
  "Does the training chat use ChatGPT?",
  "When enabled on the server, **optional cloud AI** may answer after the **local training library** tries first. The browser cannot tell which vendor. **Official quiz prices** still come from our loaded pricing data — not guesses."
);
E(
  ["offline", "without internet", "library"],
  "Does the assistant work without cloud AI?",
  "Yes. **Signed-in** staff load **official pricing rows** and **staff Q&A** into the browser. That works even when live AI is off or slow."
);
E(
  ["short answer", "too long", "faster"],
  "The bot talks too much.",
  "Ask: “**One sentence:** …” For prices, name the **item and size** (e.g. “20x30 pole tent price”)."
);

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

// --- Round expansion: sizing, upsells, payments, seasons, specialty gear ---
const round2 = [
  [
    ["tent size", "how big", "guest count", "capacity"],
    "How do I pick the right tent size?",
    "Ask **guest count**, **seated vs standing**, and **layout** (buffet, dance floor, band). Use company layout guides or a lead for math — don't wing capacity. **315-884-1498** for planning help.",
  ],
  [
    ["popup", "pop up", "pop-up", "ez up", "canopy 10x10"],
    "Customer asks about small pop-up / EZ canopy.",
    "EZ-style **pop-up canopies** are common for vendors and small shade — **exact inventory and prices** come from signed-in pricing / coordinator. Confirm wind rules with customer.",
  ],
  [
    ["white tent", "wedding tent"],
    "They want a white tent for a wedding.",
    "Confirm **frame vs pole**, **size**, and **sidewalls/lighting** upsells. White weddings often pair **chiavari or white resin chairs** + linens — bundle with shop.",
  ],
  [
    ["clear tent", "transparent"],
    "Do we have clear-top tents?",
    "If in inventory, quote from **price list or manager**; if not, offer standard frame/pole options. Never promise specialty structures from memory.",
  ],
  [
    ["napkin", "charger", "plate setting"],
    "Chargers / napkin fold / place settings.",
    "Confirm what **we stock** vs what caterer brings. Offer linens and basics per training; **don't invent** formal place-setting packages.",
  ],
  [
    ["sweetheart table", "head table"],
    "Sweetheart or head table setup.",
    "Common wedding add-on — note table size, chairs, backdrop/pipe-drape if applicable, and **linens**. Confirm with coordinator.",
  ],
  [
    ["pipe and drape", "backdrop", "draping"],
    "Pipe and drape or fabric backdrop.",
    "May be a specialty line — check inventory and labor. **Quote with shop**, not from memory.",
  ],
  [
    ["fog machine", "haze", "bubble machine", "cold spark"],
    "Fog, bubbles, cold spark effects.",
    "**Venue rules vary** — many ban fog/haze. Confirm what's allowed before promising. Route technical specs to events lead.",
  ],
  [
    ["stanchion", "velvet rope", "crowd control"],
    "Stanchions or crowd control.",
    "If stocked, add to quote; otherwise suggest alternatives. Confirm **count and layout**.",
  ],
  [
    ["811", "call before you dig", "utilities", "underground"],
    "Customer asks about underground utilities.",
    "For any staking/digging concern, advise them to **contact 811 / local utility locate** per local rules — you don't interpret locate law. Flag for crew.",
  ],
  [
    ["overnight", "leave overnight", "multi night"],
    "Gear stays overnight at venue.",
    "Confirm **rental period and security** in writing. Customer responsible for **theft/vandalism** per agreement language — don't paraphrase legal terms; office confirms.",
  ],
  [
    ["customer help", "can i set up myself"],
    "Customer wants to set up themselves.",
    "Our model is usually **pro delivery & setup** for safety and warranty. If **will-call** exists for their items, shop defines scope — don't authorize DIY for gear that requires crew.",
  ],
  [
    ["photo request", "picture of tent"],
    "They want photos of equipment.",
    "Point to **website gallery** or offer email from office with **approved** photos — don't dig up personal phone pics.",
  ],
  [
    ["walk through", "site visit"],
    "Site visit before event.",
    "If offered, schedule through office/dispatch — **don't promise** a free site visit without approval.",
  ],
  [
    ["venmo", "zelle", "cashapp", "apple pay"],
    "Pay with Venmo / Zelle / Cash App.",
    "Only accept methods **your office actually uses**. Default: “I'll confirm how we can take payment for your order.”",
  ],
  [
    ["ach", "wire transfer", "bank transfer"],
    "Pay by ACH or wire.",
    "Commercial / large orders may allow it — **office provides instructions**. Never text routing numbers from memory.",
  ],
  [
    ["double charge", "charged twice"],
    "Customer says they were charged twice.",
    "Gather **amounts, dates, last 4 of card**; apologize; **billing** resolves — don't debit/credit promises on the call.",
  ],
  [
    ["gift card", "gift certificate"],
    "Gift certificates?",
    "If the company offers them, explain process; if not, say so and offer **other payment** paths.",
  ],
  [
    ["referral", "tell a friend"],
    "Referral program?",
    "Only describe programs that **officially exist** — otherwise thank them and suggest reviews/word of mouth without promising rewards.",
  ],
  [
    ["rain out", "forecast", "postpone"],
    "Rain in forecast — will we postpone?",
    "Don't guarantee weather decisions. “We'll follow our agreement and coordinator guidance for your order.” Escalate to **315-884-1498** / manager.",
  ],
  [
    ["halloween", "trunk or treat", "fall festival"],
    "School fall festival / trunk-or-treat.",
    "Popular picks: **canopies, tables, games, concessions**. Confirm **time window** and **power** for inflatables.",
  ],
  [
    ["holiday party", "christmas party", "office party"],
    "Corporate holiday party.",
    "Bundle **tables, chairs, linens, lighting, dance floor options**; book early in December.",
  ],
  [
    ["trivia", "karaoke"],
    "They want trivia or karaoke setup.",
    "Clarify if we supply **AV** or only furniture/tent — often **partial**. Escalate AV packages.",
  ],
  [
    ["live band", "how much space"],
    "How much space for a live band?",
    "Varies by headcount and gear — involve coordinator. Note **stage**, **power drops**, **shelter**.",
  ],
  [
    ["food truck", "catering tent"],
    "Food truck + tent combo.",
    "Map **separate power**, **service flow**, and **guest seating**. Confirm truck dimensions and arrival window with customer.",
  ],
];

for (const [k, q, a] of round2) {
  E(k, q, a);
}

const round3 = [
  [
    ["cocktail", "high top", "high-top", "standing table"],
    "Cocktail / high-top tables for mingling.",
    "Ask **how many** and **indoor vs outdoor**. Pair with **bar stools** only if you stock them — confirm inventory. Quote from **price list** when signed in.",
  ],
  [
    ["kids table", "children table", "short table"],
    "Kids' seating or kids' tables.",
    "Clarify **ages and count**; match **table height** to chairs. Some events mix kids at standard tables — confirm layout with customer.",
  ],
  [
    ["umbrella", "patio umbrella"],
    "Do we rent patio umbrellas?",
    "If in catalog, quote it; if not, offer **pop-up canopy** alternatives. Don't promise styles we don't carry.",
  ],
  [
    ["cathedral", "window sidewall"],
    "Sidewalls with windows / cathedral walls.",
    "Often an **add-on** to tents — confirm style and **count of sections** with shop before quoting.",
  ],
  [
    ["tent air conditioning", "tent ac", "cooling tent"],
    "AC inside a tent.",
    "Specialty **climate** gear may apply — sizing and power need **crew/coordinator** sign-off. Never guarantee comfort from memory.",
  ],
  [
    ["misting fan", "cooling fan"],
    "Misting or cooling fans outdoors.",
    "Popular for summer — confirm **water source**, **electrical**, and **venue rules**. Quote per inventory.",
  ],
  [
    ["slip and slide", "water games"],
    "Slip-and-slide or big water attractions.",
    "Confirm **insurance, venue rules, drainage, and staffing**. Large water pieces may be restricted — escalate to shop.",
  ],
  [
    ["dunk tank", "dunking booth"],
    "Dunk tank rental.",
    "If offered, review **safety, water, setup surface, and supervision** with shop — not a casual upsell without approval.",
  ],
  [
    ["mechanical bull", "bull ride"],
    "Mechanical bull or similar ride.",
    "Often specialty — **availability, operator, and insurance** are manager-level. Don't promise on the first call without check.",
  ],
  [
    ["arcade", "arcade game"],
    "Arcade games or carnival games.",
    "Different from standard inventory — verify **what we actually carry** (e.g. yard games vs full arcade).",
  ],
  [
    ["giant jenga", "yard game package"],
    "Package of yard games only.",
    "Bundle **cornhole, giant games, etc.** with tables/chairs for picnics — confirm **counts** and **delivery window**.",
  ],
  [
    ["helium", "balloon filling"],
    "Do we fill helium or supply helium tanks?",
    "Only say yes if **officially offered** — many shops **do not** handle balloons. Default: “I'll check whether we supply helium for your date.”",
  ],
  [
    ["aisle runner", "wedding aisle"],
    "Wedding aisle runner.",
    "May be linens/specialty — confirm **length, surface, and stakes/tape rules** with coordinator.",
  ],
  [
    ["ceremony only", "chairs only ceremony"],
    "Ceremony chairs only (short rental).",
    "Still capture **date, venue access, strike time**. Minimums may apply — office confirms.",
  ],
  [
    ["memorial", "celebration of life", "repast"],
    "Memorial or celebration-of-life reception.",
    "Use **empathetic tone**. Suggest **simple tent, tables, chairs, coffee** bundles; confirm **timing** and **venue rules**.",
  ],
  [
    ["quinceanera", "quince"],
    "Quinceañera party rentals.",
    "Often **throne chair, tent, dance floor, uplighting, linens** — confirm **colors** and **timeline** early.",
  ],
  [
    ["bar mitzvah", "bat mitzvah"],
    "Bar or bat mitzvah celebration.",
    "Similar to large parties: **seating, tent, dance floor, AV** needs — involve coordinator for tight schedules.",
  ],
  [
    ["prom", "after prom", "school dance"],
    "School prom or after-prom.",
    "Confirm **venue contract**, **end time**, and **adult supervision** requirements. Photo booth / lighting common upsells.",
  ],
  [
    ["employee portal", "training pin", "quiz hub"],
    "Where do staff sign in for training?",
    "Direct them to the **training hub** on your site (manager shares the **employee PIN**). Quizzes may require **integrity acknowledgment** before starting.",
  ],
  [
    ["sold out", "out of stock", "not available"],
    "Item is sold out for their date.",
    "Apologize; offer **next-closest substitute** or **alternate date** — **never** promise inventory without checking the system.",
  ],
  [
    ["upgrade", "better chair", "nicer chair"],
    "Customer wants to upgrade chairs last minute.",
    "Check **inventory and price delta**; confirm **delivery/change fee** policy with office before promising.",
  ],
  [
    ["folding chair vs resin", "which chair"],
    "Folding vs resin chair — what's the difference?",
    "**Resin** often looks sharper for events; **metal folding** is utilitarian. Quote both from **training/price list**; explain **comfort and look** honestly.",
  ],
  [
    ["buffet layout", "serving table"],
    "How to lay out tables for a buffet?",
    "Suggest **flow** (start → sides → mains) and **linens**; **exact counts** depend on guest # — involve lead if large.",
  ],
  [
    ["wifi", "internet", "hotspot"],
    "Customer needs WiFi for POS or streaming at event.",
    "We typically **don't** guarantee internet — they should arrange **venue WiFi or cellular hotspot**. Don't sell network services unless officially offered.",
  ],
  [
    ["charcuterie board", "grazing table"],
    "Charcuterie / grazing table hardware.",
    "Rent **tables, linens, chill setups** if applicable — **food** is usually caterer. Clarify scope.",
  ],
];

for (const [k, q, a] of round3) {
  E(k, q, a);
}

const round4 = [
  [
    ["farm table", "harvest table", "rustic table"],
    "Customer wants farm / harvest tables.",
    "Confirm **inventory and dimensions** — often paired with **cross-back or bench** seating. Quote from **price list**; rustic weddings book early.",
  ],
  [
    ["cross back", "vineyard chair", "x back"],
    "Cross-back or vineyard-style chairs.",
    "Upsell for **rustic / wine-country** look — verify **colors in stock** vs customer sample photo.",
  ],
  [
    ["bench seating", "picnic bench"],
    "Benches instead of chairs.",
    "Great for **casual or farm tables** — confirm **capacity per bench** and **ADA** considerations with coordinator.",
  ],
  [
    ["serpentine", "half moon", "curved table"],
    "Serpentine or curved banquet tables.",
    "Used for **buffets or displays** — confirm **how many sections** and **linen** style with shop.",
  ],
  [
    ["king table", "long head table"],
    "One very long head table.",
    "May need **multiple linens** or **joins** — map **length** and **delivery path** (doors/halls).",
  ],
  [
    ["spandex cover", "stretch cover"],
    "Spandex / stretch covers for tables or stages.",
    "If stocked, match **table shape and size** exactly — awkward fits go to coordinator.",
  ],
  [
    ["fitted linen", "floor length"],
    "Floor-length linens vs short.",
    "Ask **formal level** and **trip hazard** rules at venue. Quote **per size** from training — don't guess yardage.",
  ],
  [
    ["led table", "glow furniture", "illuminated"],
    "LED / glowing cocktail tables or bars.",
    "Specialty — confirm **battery vs plug**, **count**, and **venue rules**. Often needs events lead approval.",
  ],
  [
    ["mirror ball", "disco ball"],
    "Disco or mirror ball.",
    "If AV/lighting inventory includes it, add **rigging/safety** notes — otherwise escalate to AV coordinator.",
  ],
  [
    ["monogram", "gobo", "custom lighting"],
    "Custom monogram or gobo projection.",
    "Usually **ordered art + timing** — don't promise same-week art. **Shop/manufacturer** confirms spec.",
  ],
  [
    ["pole wrap", "pole drape", "leg skirt"],
    "Hiding tent poles or dressing legs.",
    "Offer **draping/pole covers** if in catalog — confirm **color** and **which tent type**.",
  ],
  [
    ["rush order", "this week", "need it soon"],
    "Customer needs everything in a few days.",
    "Check **inventory + crew** before yes. “I'll confirm what's available for your date and our next open install slot.”",
  ],
  [
    ["next day", "tomorrow rental"],
    "Can we deliver tomorrow?",
    "Possible only if **inventory and routing** allow — **never** promise without dispatch. Weekend Saturdays fill fast.",
  ],
  [
    ["weekday discount", "friday cheaper"],
    "Is weekday cheaper than Saturday?",
    "Pricing rules vary — “I'll confirm rates for your specific date and items.” Don't invent day-of-week discounts.",
  ],
  [
    ["stairs fee", "long carry"],
    "Extra fee for stairs or long carry?",
    "Labor adders may apply — **only quote what office/dispatch approves**.",
  ],
  [
    ["mileage", "far away", "out of town"],
    "Delivery many miles away.",
    "Distance and **drive time** affect routing — log **full address** early; **fee** from office, not memory.",
  ],
  [
    ["mud return", "dirty return", "not cleaned"],
    "Returned equipment is extremely muddy.",
    "Note condition; **cleaning fees** may apply per policy — customer service stays neutral; billing decides.",
  ],
  [
    ["dead grass", "yellow lawn", "ruined lawn"],
    "Customer says tent killed the grass.",
    "Empathize; **no fault admissions**. “I'll document this and have our team review photos and timeline.” Escalate.",
  ],
  [
    ["stake holes", "holes in yard"],
    "Holes left from stakes after pickup.",
    "Normal staking can disturb turf — set **expectations at booking** when possible. Document if dispute.",
  ],
  [
    ["artificial turf", "astro turf", "fake grass"],
    "Tent on artificial turf.",
    "**Staking often not allowed** — may need **weights** and **floor protection**. Must involve **experienced crew** before promising.",
  ],
  [
    ["golf course", "country club"],
    "Venue is a golf course or country club.",
    "Expect **strict load-in routes, timing, and COI**. Get **venue contact** and **rules sheet** early.",
  ],
  [
    ["museum", "historic site"],
    "Historic building or museum grounds.",
    "**Floor protection, noise, and footprint** rules are strict — coordinator + venue facility contact required.",
  ],
  [
    ["gym floor", "school gym"],
    "Event in a school gym — floor protection.",
    "Confirm **allowed wheels**, **floor covers**, and **tape rules** with facility manager — wrong answer can cost repairs.",
  ],
  [
    ["trade show", "10x10 booth"],
    "Trade show 10x10 booth rental.",
    "Confirm **height limits, drape color, and pipe dimensions** with show contractor — our **pipe & drape** may or may not match spec.",
  ],
  [
    ["additional insured", "additionally insured"],
    "Venue wants to be additional insured on COI.",
    "“I'll have our coordinator send the certificate with the wording **the venue provided**.” **Don't** edit legal certificate text yourself.",
  ],
];

for (const [k, q, a] of round4) {
  E(k, q, a);
}

const round5 = [
  [
    ["escort cards", "place cards", "seating chart"],
    "Escort card or seating chart table setup.",
    "Rent **table + linen + easel or mirror** if in inventory — **printing/design** is customer or planner. Confirm **size** and **outdoor wind** plan.",
  ],
  [
    ["gift table", "card box"],
    "Gift and card table at wedding.",
    "Standard **6ft or round** with linen; remind customer **security** is their responsibility unless venue provides it.",
  ],
  [
    ["champagne wall", "donut wall", "display wall"],
    "Champagne wall / donut wall / display backdrop.",
    "If stocked, quote **unit + install**; if not, offer **pipe & drape or step-and-repeat** alternatives. **Food handling** stays with caterer.",
  ],
  [
    ["wedding arch", "ceremony arch", "metal arch"],
    "Arches for ceremony backdrop.",
    "Separate from tent — confirm **height, width, anchoring**, and **florist attachment rules**. Wind plan for outdoor.",
  ],
  [
    ["chuppah", "mandap", "cultural ceremony"],
    "Cultural ceremony structure (chuppah / mandap style).",
    "Treat as **custom layout + anchoring** — involve coordinator; confirm **dimensions** with officiant or planner.",
  ],
  [
    ["portable toilet", "porta potty", "restroom trailer"],
    "Customer needs restrooms.",
    "If **not** your line, politely say so and suggest **venue restrooms** or **approved restroom vendor**. Don't book third-party unless office does.",
  ],
  [
    ["wheelchair ramp", "ada ramp", "accessible entrance"],
    "Wheelchair ramp into tent.",
    "**Accessibility** may require **rated ramps and landing** — only promise what **engineering/coordinator** approves.",
  ],
  [
    ["micro wedding", "elopement", "small wedding"],
    "Very small wedding (20–40 guests).",
    "Still confirm **date, tent or no tent, chair count, weather**. **Minimums** may apply — office clarifies.",
  ],
  [
    ["rehearsal dinner", "welcome night"],
    "Rehearsal dinner rentals (day before).",
    "Capture **separate date** if different from wedding — **inventory conflict** check is critical.",
  ],
  [
    ["byob", "bring your own alcohol"],
    "Customer wants BYOB at the tent.",
    "**Alcohol rules vary by venue and contract** — don't give legal OK. “I'll confirm what's allowed for your site and our agreement.”",
  ],
  [
    ["cash bar", "open bar"],
    "Cash bar vs open bar setup.",
    "We rent **bars and equipment**, not liquor service, unless licensed/contracted — clarify **who serves** and **venue policy**.",
  ],
  [
    ["minors drinking", "underage"],
    "Worried about minors and alcohol on site.",
    "**Not** something to troubleshoot casually — escalate to **manager**; staff **don't** supervise liquor compliance.",
  ],
  [
    ["crew tip", "tip the drivers"],
    "Can customer tip delivery crew?",
    "If allowed, **gratitude is optional** — follow **company policy** (some firms discourage cash on truck). Don't solicit tips.",
  ],
  [
    ["crew meal", "feed the crew"],
    "Customer offers to feed the crew.",
    "Appreciate offer; **routing and breaks** are dispatch — customer should **not** delay install for long meals without approval.",
  ],
  [
    ["lightning", "thunderstorm", "severe weather"],
    "Thunderstorm during setup or event.",
    "**Safety first** — crews pause or evacuate per protocol. Inflatables must **deflate** in wind per manufacturer — don't debate with customer.",
  ],
  [
    ["frozen ground", "winter install"],
    "Frozen ground — can we still stake?",
    "Staking may be **unsafe or impossible** — **weights and alternate anchoring** need crew lead. Winter jobs need extra planning.",
  ],
  [
    ["propane fire pit", "fire bowl"],
    "Propane fire pit at event.",
    "**Venue ban** is common — confirm **open flame rules** before quoting. Never promise fire features without shop approval.",
  ],
  [
    ["silent disco", "headphone party"],
    "Silent disco headphones.",
    "If **not** inventory, say so — may partner with AV vendor. Clarify **power, quantity, and return** expectations.",
  ],
  [
    ["movie license", "show a film", "copyright"],
    "Outdoor movie licensing.",
    "**Public performance rights** are customer/event responsibility — we rent **screen/projector** only; don't advise on licensing law.",
  ],
  [
    ["lantern release", "dove release"],
    "Sky lantern or live bird release.",
    "Many venues **ban** releases — **fire/mess/welfare** issues. Defer to **venue and laws**; don't greenlight.",
  ],
  [
    ["farmers market", "weekly tent"],
    "Weekly farmers market booth tent.",
    "Confirm **commitment length**, **wind ratings**, and **weighting** — recurring jobs need **contract**, not verbal.",
  ],
  [
    ["tax exempt", "nonprofit tax"],
    "Nonprofit claims tax exemption.",
    "**Valid exemption certificate** on file with office — staff **don't** decide tax; **billing** applies rules.",
  ],
  [
    ["w9", "w-9", "vendor form"],
    "Customer needs our W-9.",
    "Route to **accounting/office** — **never** email a W-9 from memory or unofficial PDF.",
  ],
  [
    ["charity discount", "501c3"],
    "Registered charity wants free or deep discount.",
    "Only **approved** programs — “I'll pass this to management with your documentation.” Staff don't authorize.",
  ],
  [
    ["photo only", "no guest seating"],
    "They only need a photo-shoot backdrop, no guests.",
    "Still need **delivery window and strike** — small orders may have **minimum** charges; office confirms.",
  ],
];

for (const [k, q, a] of round5) {
  E(k, q, a);
}

const round6 = [
  [
    ["lounge furniture", "couch rental", "accent chair"],
    "Lounge groupings / soft seating.",
    "If offered, confirm **pieces, colors, indoor vs outdoor**, and **delivery path**. Weather **covers** may be needed for upholstered items outside.",
  ],
  [
    ["ottoman", "coffee table lounge"],
    "Ottomans and coffee tables for lounge areas.",
    "Match **height** to seating; confirm **quantity** with planner sketch — avoid guessing a “standard” grouping.",
  ],
  [
    ["pergola", "sail shade", "shade sail"],
    "Pergola or shade-sail structure (not a tent).",
    "Clarify **what we actually rent** — may be **canopy/tent** only. Don't promise **permanent-style** builds without shop sign-off.",
  ],
  [
    ["solid wall", "white sidewall"],
    "Solid vs clear sidewalls.",
    "**Solid** = privacy/wind; **clear** = views — both affect **layout and HVAC**. Quote per **linear foot / sections** from training or coordinator.",
  ],
  [
    ["glass doors", "french doors tent"],
    "Glass or French-style tent entrance.",
    "Often **specialty** — confirm **SKU, hardware, and floor transition**. Wind load matters.",
  ],
  [
    ["catering tent", "prep tent", "kitchen tent"],
    "Catering prep tent behind house / venue.",
    "Ask **caterer dimensions, ventilation, fire marshal rules**. May need **walls, lighting, and power** plan — escalate early.",
  ],
  [
    ["handwash", "sink station", "portable sink"],
    "Portable hand-washing stations.",
    "If in inventory, confirm **water fill, grey water, and count** — common for **outdoor food** setups.",
  ],
  [
    ["red carpet", "VIP entrance"],
    "Red carpet runner entrance.",
    "Quote **length and surface tape rules**; outdoor wind may need **weights or adhesive** approved by venue.",
  ],
  [
    ["step and repeat", "photo backdrop", "logo wall"],
    "Step-and-repeat / branded backdrop.",
    "Confirm **banner size** vs **frame inventory**; **graphics** are customer/planner supplied unless print is a service line.",
  ],
  [
    ["inflatable arch", "start line arch"],
    "Inflatable branded arch for race or entrance.",
    "**Anchoring and wind rating** critical — operator may be required. Check **what's in inventory** before quoting.",
  ],
  [
    ["power strip", "surge protector"],
    "Can we run everything off power strips?",
    "Default: **Don't overload**. **Distro and gauges** must match load — customer **home extension cords** are often **not** acceptable for big draws.",
  ],
  [
    ["extension cord", "customer cord"],
    "Customer wants to use their own extension cords.",
    "Advise **only per shop guidance** — wrong cord gauge creates **fire/trip** risk; crew can refuse unsafe hookups.",
  ],
  [
    ["generator included", "does price include power"],
    "Is a generator included with inflatable / tent?",
    "**Rarely automatic** — confirm **rental line items** in quote. Never say “included” unless **contract** shows it.",
  ],
  [
    ["podium", "lectern"],
    "Podium or lectern for speeches.",
    "If stocked, note **indoor vs outdoor** and **mic clip** compatibility — **mic may be separate** inventory line.",
  ],
  [
    ["stage skirt", "stage skirting"],
    "Skirting for stage risers.",
    "Match **stage perimeter** and **color**; confirm **labor** to install if applicable.",
  ],
  [
    ["ada viewing", "wheelchair viewing area"],
    "Reserved viewing area for wheelchair guests.",
    "Coordinate **clear sightlines** with layout lead — may affect **chair removal** or **platform** design.",
  ],
  [
    ["verbal quote", "you said on phone"],
    "Customer says verbal quote was lower.",
    "Stay calm: “**Written quotes** control pricing — I'll pull your file and reconcile.” Don't argue numbers from memory.",
  ],
  [
    ["quote expired", "old quote"],
    "Their quote is months old — still valid?",
    "**Pricing and inventory change** — “I'll refresh this quote for your date.” Don't honor stale totals without office approval.",
  ],
  [
    ["price increase", "more expensive now"],
    "Why did price go up since last year?",
    "**Costs and labor** change — keep tone factual. Offer **updated line items**; escalate if hostile.",
  ],
  [
    ["hold without pay", "no deposit yet"],
    "Can you hold gear without deposit?",
    "**Holds** follow office policy — don't promise long holds **without payment**; offer to **send quote + payment link**.",
  ],
  [
    ["narrow gate", "fence gate", "tight access"],
    "Yard gate too narrow for tent parts.",
    "Flag **panel sizes** for crew — may need **alternate entry** or **smaller tent style**. Site visit or photos help.",
  ],
  [
    ["shared driveway", "neighbor driveway"],
    "Setup across neighbor property line.",
    "**Permission** must be explicit — staff don't negotiate property disputes. Escalate to customer + manager.",
  ],
  [
    ["septic field", "leach field"],
    "Tent over septic drain field.",
    "**Avoid heavy staking/load** — **weights or alternate layout** may be required. **Coordinator + homeowner** decide.",
  ],
  [
    ["well cap", "well head"],
    "Well head in the yard near tent.",
    "**Protect cap** and **staking** footprint — mark location for crew; don't guess safe distances.",
  ],
  [
    ["pool deck", "screened pool cage"],
    "Event next pool / lanai (Florida-style question).",
    "**Wind, anchoring, and enclosure rules** are strict — never promise **hardware into pool deck** without engineering/coordinator review.",
  ],
];

for (const [k, q, a] of round6) {
  E(k, q, a);
}

const round7 = [
  [
    ["graduation ceremony", "commencement outdoor"],
    "Outdoor graduation ceremony rentals.",
    "Plan **chairs, stage/risers, sound access, rain backup**, and **ADA seating**. School often needs **PO and insurance** early.",
  ],
  [
    ["awards banquet", "sports banquet"],
    "Sports awards or end-of-season banquet.",
    "Typical: **tables, chairs, linens, stage head table, backdrop**. Confirm **attendance** and **AV for microphone**.",
  ],
  [
    ["booster club", "pto", "pta"],
    "PTO / booster club fundraiser.",
    "May need **tax-exempt paperwork** — route to office. Bundle **games + tables + tent** once budget confirmed.",
  ],
  [
    ["opening day", "little league", "t-ball"],
    "Little league opening day or field event.",
    "Often **canopies, tables, PA (if applicable)** — wind plans for **umbrellas/canopies** near fields.",
  ],
  [
    ["soccer tournament", "field day"],
    "Soccer tournament or field-day shade.",
    "Multiple **small canopies** may beat one giant tent — confirm **vendor count** and **stakes vs weights** on turf.",
  ],
  [
    ["turf field", "artificial turf field"],
    "Setup on synthetic turf athletic field.",
    "**Staking usually prohibited** — **weights only** and **floor protection** for vehicle paths. **Athletic director** must approve.",
  ],
  [
    ["bike rack", "bicycle parking"],
    "Bike parking at event.",
    "If we rent **racks**, confirm **count**; otherwise suggest **venue** solutions — don't promise municipal racks.",
  ],
  [
    ["coat rack", "hanging coats"],
    "Coat check / coat racks for winter event.",
    "Quote **rack count + hangers** if in inventory; **attendant** is customer/venue unless staffed service exists.",
  ],
  [
    ["warming tent", "winter event tent"],
    "Warming tent for cold-weather outdoor event.",
    "**Heaters + ventilation + egress** must be engineered — quote **tent + heat package** only with **crew approval**.",
  ],
  [
    ["water barrel", "ballast barrel"],
    "Water barrels for tent ballast.",
    "If used, confirm **fill/drain on site**, **weight math**, and **venue rules** — **never** exceed engineered ballast plan.",
  ],
  [
    ["concrete wedge", "wedge anchor"],
    "Anchoring tent to concrete or asphalt.",
    "**Drill anchors** may need **venue approval** and **patch responsibility** — only **trained crew** per company policy.",
  ],
  [
    ["security deposit", "damage deposit"],
    "Security deposit vs damage waiver.",
    "Explain only per **contract language** — staff **don't** negotiate deposit amounts ad hoc; **billing** sets terms.",
  ],
  [
    ["smoking", "cigarette", "vape"],
    "Smoking or vaping under/near tent.",
    "**Fabric and heaters** are fire-sensitive — default: follow **venue rules** and **manufacturer warnings**; advise **away from tent walls**.",
  ],
  [
    ["drone", "uav"],
    "Drone flying over our setup.",
    "Not our **permission** to grant — **FAA/venue/photographer** handle that. We **don't** take liability for drone ops.",
  ],
  [
    ["film crew", "tv news", "filming"],
    "TV news or film crew at event.",
    "Route **media** questions to **management** — staff **don't** sign releases or promise B-roll access to equipment.",
  ],
  [
    ["influencer", "free rental exchange"],
    "Influencer wants free rentals for posts.",
    "**Marketing decision only** — “I'll pass to our marketing/owner.” Don't commit gear or dates.",
  ],
  [
    ["political rally", "campaign event"],
    "Political or campaign rally.",
    "Treat as **high-profile logistics** — **security, permits, load times** with manager involvement; stay **neutral** in tone.",
  ],
  [
    ["polling place", "election day"],
    "Equipment for polling or community voting site.",
    "**Official booking** usually through **county/board** — confirm **ADA, queue lines, and hours**; use **stanchions/tables** as spec'd.",
  ],
  [
    ["lost and found"],
    "Lost and found after event.",
    "Document items; follow **company lost-and-found policy** — **don't** promise shipping without billing approval.",
  ],
  [
    ["allergy", "latex balloon"],
    "Allergies — latex balloons or décor.",
    "If customer cites **latex allergy**, flag **no latex** to planner; we may still have **non-balloon** décor routes.",
  ],
  [
    ["stroller", "diaper changing"],
    "Family festival — strollers everywhere.",
    "Suggest **wider aisles** in layout; **safety** is customer's crowd management — we provide **space plan inputs** only.",
  ],
  [
    ["petting zoo", "animals on site"],
    "Farm animals or petting zoo next to tent.",
    "**Biohazard/mess** near flooring — coordinate **turf protection** and **spacing** with vendor; not our vendor unless we offer.",
  ],
  [
    ["fireworks", "sparkler alternative"],
    "Customer wants fireworks near tent.",
    "**Most venues restrict** fireworks near structures — defer to **venue + fire official**; suggest **approved alternatives** cautiously.",
  ],
  [
    ["insurance claim", "ladder fell"],
    "Incident with equipment — possible claim.",
    "**No admissions**. “I'm documenting details for our team.” Collect **photos, time, contacts**; escalate immediately.",
  ],
  [
    ["osha", "inspector", "regulation"],
    "Customer cites OSHA / inspectors on site.",
    "Don't debate regs — “Our crews follow **company safety procedures**.” Route **technical** questions to **management**.",
  ],
];

for (const [k, q, a] of round7) {
  E(k, q, a);
}

const round8 = [
  [
    ["napkin color", "swatch", "linen match"],
    "Customer wants napkins to match a swatch / wedding color.",
    "Offer to **compare to in-stock linen colors** — **dye-lot matches** aren't guaranteed. Coordinator may order **specific** lines if available.",
  ],
  [
    ["paper napkin", "disposable"],
    "Paper vs cloth napkins.",
    "**Cloth** = upscale / rental fee; **paper** may be caterer-supplied. Clarify **who provides** what on the quote.",
  ],
  [
    ["charger only", "plate charger"],
    "Charger plates without full china.",
    "Common for **plated caterer** — confirm **count** matches seats + head table. Return **clean** expectations per contract.",
  ],
  [
    ["water goblet", "wine glass", "stemware"],
    "Stemware — water vs wine glasses.",
    "Quote **per piece** from inventory; confirm **caterer pouring** vs **self-serve**. **Loss/breakage** terms in contract.",
  ],
  [
    ["coffee urn", "coffee service"],
    "Coffee service rentals (urns, percolators).",
    "Confirm **110V power**, **cups**, and **cream/sugar** responsibility (often caterer). **Quantity** = guest count × hours.",
  ],
  [
    ["beverage dispenser", "drink dispenser"],
    "Beverage dispensers for lemonade / iced tea.",
    "If stocked, confirm **capacity, count, ice**, and **drip trays** — outdoor **bugs** may need **lids**.",
  ],
  [
    ["punch bowl"],
    "Punch bowl rental.",
    "Verify **bowl + ladle + cups** package; **alcohol punch** rules follow **venue and caterer**.",
  ],
  [
    ["ice chest", "ice bin", "beverage tub"],
    "Ice bins / galvanized tubs for drinks.",
    "Quote **count**; **ice purchase** is often customer or venue — we rent **containers** unless ice is a product line.",
  ],
  [
    ["cooler rental", "rolling cooler"],
    "Coolers for backup cold storage.",
    "Confirm **interior dimensions** and **drain** after event — **clean return** policy applies.",
  ],
  [
    ["slush machine", "margarita machine"],
    "Frozen drink machine (slush / margarita).",
    "Clarify **mix/supplies**, **alcohol legality**, and **power**. Often **shop** assigns **SKU + syrups** — don't promise flavors from memory.",
  ],
  [
    ["cotton candy sugar", "floss sugar"],
    "Cotton candy supplies — sugar / cones.",
    "If machine is rental line, confirm **supply pack** is on quote — **restock cost** for long events.",
  ],
  [
    ["snow cone syrup", "sno cone flavor"],
    "Snow cone syrup flavors.",
    "Match **machine order** to **syrup kit**; confirm **spoons/straws** if applicable.",
  ],
  [
    ["popcorn kit", "popcorn supplies"],
    "Popcorn machine supplies (oil, kernels, bags).",
    "Bundle **consumables** with machine rental when offered; **allergy** note for shared equipment.",
  ],
  [
    ["hot dog steamer", "roller grill"],
    "Hot dog equipment — steamer vs roller.",
    "Confirm **which SKU**, **power**, and **food handling** (customer/caterer). **Grease** cleanup rules on return.",
  ],
  [
    ["nacho cheese", "nacho warmer"],
    "Nachos — cheese warmer and chips.",
    "Confirm **cheese bags / chips** supply package; **refill** policy for long festivals.",
  ],
  [
    ["string lights", "bistro lights", "cafe lights"],
    "String / bistro lighting in tent or yard.",
    "Ask **coverage area**, **dimming**, and **power drops** — **labor** to hang may be separate line item.",
  ],
  [
    ["edison bulb", "filament light"],
    "Edison-style string lights.",
    "Aesthetic choice — confirm **inventory style** vs customer photo; **outdoor wet rating** where needed.",
  ],
  [
    ["uplight", "uplighting", "color wash"],
    "Wireless uplights / color wash.",
    "Confirm **how many fixtures**, **battery vs wired**, and **color** (white vs RGB). Venue may limit **laser/color**.",
  ],
  [
    ["ceiling liner", "tent liner"],
    "Tent ceiling liner (white draped ceiling).",
    "Specialty install — **labor + tent compatibility** must match; **height loss** inside tent matters for chandeliers.",
  ],
  [
    ["white dance floor", "black dance floor"],
    "White or black dance floor finish.",
    "**SKU-specific** — confirm **square footage**, **subfloor** needs, and **shoe warnings** (heels can scratch some finishes).",
  ],
  [
    ["portable stage", "24 inch stage"],
    "Low portable stage for band or head table.",
    "Confirm **size modules**, **stairs**, **skirting**, and **weight load** — **engineer stamp** may be required for large builds.",
  ],
  [
    ["dj riser", "subwoofer"],
    "DJ riser or space for subs.",
    "Map **vibration** concerns for **historic floors**; **outdoor** subs need **weather plan**.",
  ],
  [
    ["aisle carpet", "indoor aisle"],
    "Carpet runner for indoor ceremony aisle.",
    "Confirm **length, width, color**, and **tape vs tack** rules of **venue floor**.",
  ],
  [
    ["bar height", "portable bar"],
    "Standard bar height vs counter height.",
    "Match **stools** if any — clarify **service side** vs **guest side**; **LED bar** may differ heights.",
  ],
  [
    ["champagne tower", "coupe glass"],
    "Champagne tower / stacked coupes.",
    "**Glass count + pour timing** with caterer — **not** our pour unless contracted; **spill/slip** risk on dance floor nearby.",
  ],
];

for (const [k, q, a] of round8) {
  E(k, q, a);
}

const round9 = [
  [
    ["metric", "meters", "centimeters"],
    "Customer gives tent size in meters / metric.",
    "Convert carefully or ask for **feet** — round numbers for **quotes** should match **inventory SKUs** (usually ft). Double-check with coordinator.",
  ],
  [
    ["bad reception", "breaking up", "cant hear"],
    "Bad cell connection on sales call.",
    "Offer to **switch to email/text** for name/date/address; repeat critical details slowly; send **written recap** after.",
  ],
  [
    ["speakerphone", "in the car"],
    "Customer is driving on speaker.",
    "Keep it brief; suggest **callback when parked** before confirming **legal/contract** details.",
  ],
  [
    ["language", "accent", "repeat slower"],
    "Hard to understand — accent or language barrier.",
    "Slow down, simple words, **email backup**; offer **manager/bilingual** help if available — never mock or show frustration.",
  ],
  [
    ["wrong email", "sent quote wrong address"],
    "Quote went to wrong email — privacy concern.",
    "**Stop** — verify identity before resending; **redact** or recall if possible; follow **office security** steps.",
  ],
  [
    ["delete my data", "privacy", "gdpr"],
    "Customer wants data deleted / privacy request.",
    "Don't promise on the spot — “I'll route this to **management** for our records policy.” Document **ticket**.",
  ],
  [
    ["text okay", "is texting allowed"],
    "Customer prefers SMS for planning.",
    "Only use **approved business texting** — if personal cells are discouraged, give **office line** and **email**.",
  ],
  [
    ["photo of contract", "send picture"],
    "Customer texts a photo of signed contract.",
    "Ask them to **email HQ** for filing — **SMS** may not be official archive; verify **order number**.",
  ],
  [
    ["voicemail script", "leave message"],
    "What should I say on voicemail callbacks?",
    "Template: **name, business, callback #, order/date topic** — keep under **30 seconds**.",
  ],
  [
    ["banner", "vinyl banner", "mesh banner"],
    "Outdoor vinyl / mesh banner with grommets.",
    "Confirm **size, finishing, wind slits**, and **install hardware** — **who hangs** (us vs customer).",
  ],
  [
    ["feather flag", "swooper flag", "wind flag"],
    "Feather / swooper advertising flags.",
    "**Base type** matters (ground spike vs rolling base); **wind limits** — confirm **SKU** before promising outdoors.",
  ],
  [
    ["a-frame sign", "sandwich board"],
    "A-frame or sandwich-board signs.",
    "Check **venue sidewalk rules** — some towns **ban** certain placements; **weight/wind** for outdoor.",
  ],
  [
    ["traffic cone", "cones", "deluxe cones"],
    "Traffic cones for parking or crowd flow.",
    "Quote **count** and **reflective vs standard**; **pickup** vs **delivery** on large quantities.",
  ],
  [
    ["barricade", "bike rack barricade", "steel barrier"],
    "Crowd barricades / metal bike-rack style fencing.",
    "May be specialty — confirm **linear feet**, **delivery**, and **connection hardware**.",
  ],
  [
    ["trash can", "garbage can", "waste bin"],
    "Trash / recycling containers for event.",
    "If stocked, confirm **liner policy** and **haul-off** — **venue** may require **specific carting**.",
  ],
  [
    ["handicap parking", "ada parking cones"],
    "Blocking ADA spaces for delivery.",
    "**Never** block **ADA stalls** — coordinate **loading zone** with **venue/security**; cones ≠ permission.",
  ],
  [
    ["generator quiet", "silent generator"],
    "Customer wants a quiet generator.",
    "Compare **inverter vs standard** inventory if available — **dBA claims** only from **spec sheet**, not memory.",
  ],
  [
    ["fuel delivery", "refuel generator"],
    "Generator ran out of fuel mid-event.",
    "**Emergency dispatch** per on-call procedure — don't promise **free refuel**; document **contract fuel terms**.",
  ],
  [
    ["extension time", "keep longer"],
    "Event running late — keep rentals longer.",
    "**Extension** may incur **per-day** charges — check **inventory** for next job; **dispatch** approves.",
  ],
  [
    ["early strike", "pickup early"],
    "They want pickup earlier than scheduled.",
    "Check **crew routing** — early may be **possible** or may incur **fee**; don't guarantee without dispatch.",
  ],
  [
    ["partial strike", "take tent leave tables"],
    "Pick up some items but leave others overnight.",
    "Log **clear list** — **partial strikes** confuse crews; **manager** must sign off on **split billing**.",
  ],
  [
    ["moisture", "condensation", "tent dripping"],
    "Condensation dripping inside tent.",
    "Explain **humidity + temperature** can cause **sweating** — **heaters, rain, and venting** interplay; **not always a leak**. Escalate if **active leak** suspected.",
  ],
  [
    ["wind flap", "noisy tent"],
    "Tent walls flapping loudly in wind.",
    "**Safety review** — may need **sidewalls down**, **extra ballast**, or **partial close**. Customer safety > aesthetics.",
  ],
  [
    ["bugs", "mosquitos", "flies tent"],
    "Bugs bad inside lit tent at night.",
    "Suggest **venue pest plan**; **lighting placement** can attract insects — **caterer/venue** often handles treatments, not us.",
  ],
  [
    ["zipline", "rope course"],
    "Customer asks about zip-line or ropes course.",
    "**Almost certainly not** our product line — clarify we're **party rental**, not adventure attractions, unless shop says otherwise.",
  ],
];

for (const [k, q, a] of round9) {
  E(k, q, a);
}

const round10 = [
  [
    ["inventory list", "full catalog pdf"],
    "Customer wants a full inventory PDF / every SKU.",
    "Point to **friendlypartyrental.com** for browsing; **custom spreadsheets** go through **office** — staff don't email unofficial lists.",
  ],
  [
    ["line item", "itemized invoice"],
    "They want every line item explained.",
    "Walk through **quote line-by-line**; anything **unclear** gets a note to **coordinator** — don't invent internal codes.",
  ],
  [
    ["po number", "purchase order number"],
    "Add their PO# to the order.",
    "Capture **exact PO string**; **billing** attaches it — wrong PO delays **AP** for schools and companies.",
  ],
  [
    ["vendor setup", "supplier portal"],
    "Customer asks us to register in their vendor portal.",
    "**Accounting** handles **vendor packets** — take **contact email** and **deadline**; don't upload tax docs yourself unless trained.",
  ],
  [
    ["certificate of origin", "msds"],
    "They want MSDS / hazmat sheets on tents.",
    "Tents aren't **consumer chemicals** — if they need **flammability letters** for venue, route to **office** for **official docs**.",
  ],
  [
    ["eu customer", "international card"],
    "International customer or foreign credit card.",
    "**Payment acceptance** is office policy — don't promise **card types**; offer **wire/ACH** if approved.",
  ],
  [
    ["split payment", "two cards"],
    "Split payment across two cards.",
    "If allowed, **billing** processes — collect **amounts per card** clearly; **no** split verbal without system confirmation.",
  ],
  [
    ["parents paying", "third party pay"],
    "Someone else (parent / boss) pays deposit.",
    "**Billing name** and **cardholder consent** matter for **chargebacks** — follow **fraud policy**; get **authorization** form if required.",
  ],
  [
    ["chargeback", "disputed charge"],
    "Customer filed a chargeback.",
    "**Stop** phone debate — forward to **billing** with **order #** and **timeline**; preserve **signed agreement** references.",
  ],
  [
    ["insurance rider", "equipment insurance"],
    "Customer wants to insure rented equipment on their policy.",
    "They may need **serial values** or **replacement cost** — only **office** provides **official values**; **not** from memory.",
  ],
  [
    ["subrent", "cross rent", "broker"],
    "Another rental company wants to cross-rent our gear.",
    "**Only management** approves **subrents** — collect **company, COI, pickup logistics**; staff don't commit inventory.",
  ],
  [
    ["film set", "production company"],
    "Movie or TV production rental.",
    "**High liability** — **COI, schedule slips, and OT** common; involve **events lead** early; **union rules** may affect labor.",
  ],
  [
    ["parade float", "parade staging"],
    "Parade staging / city parade logistics.",
    "**Permits and police** gate timing — confirm **load-in windows** before quoting **large footprint**.",
  ],
  [
    ["marathon", "start line arch timer"],
    "Marathon / 5K start-finish infrastructure.",
    "Coordinate **city permits**, **timing company**, and **wind plan** for arches — **multi-vendor** jobs need a **single POC**.",
  ],
  [
    ["concert venue", "festival gate"],
    "Festival perimeter or gate rentals.",
    "**Barricade linear feet** + **entry choke** design — escalate to **large-events** lead; **security** is customer/venue.",
  ],
  [
    ["hotel loading dock", "freight elevator"],
    "Ballroom at hotel — loading dock rules.",
    "Get **dock times**, **freight elevator dimensions**, and **union move-in** notes — surprises **void** tight installs.",
  ],
  [
    ["warehouse walk in", "will call hours"],
    "Customer will-call pickup hours.",
    "State only **published** will-call windows — **after-hours** pickup needs **scheduled approval**.",
  ],
  [
    ["return dirty", "wipe down"],
    "How clean must returns be?",
    "Follow **contract check-in language** — **mud/food** may trigger **fees**; explain **good faith wipe** vs **full wash**.",
  ],
  [
    ["missing piece", "small part lost"],
    "Customer lost stakes / small hardware.",
    "**Replacement cost** per **missing-items** schedule — **don't waive** fees without **manager**; document **count at pickup**.",
  ],
  [
    ["paint on tent", "decor tape damage"],
    "Tape or décor damaged tent fabric.",
    "**Photos + manager** — repair bills follow **contract**; **no** fault debate on the phone.",
  ],
  [
    ["goat", "livestock"],
    "Live animals in/near tent.",
    "**Venue + liability** — not our scope unless **specific insured** attraction; **manure/welfare** issues escalate.",
  ],
  [
    ["foam party chemicals", "biodegradable foam"],
    "Foam party chemical safety question.",
    "**SDS and manufacturer dilution** only — staff **don't** mix chemicals; **events lead** pairs **machine + product**.",
  ],
  [
    ["kite", "drone light show"],
    "Drone light show or kites overhead.",
    "**Airspace + venue** approval — we **don't** coordinate FAA; focus only on **ground hazards** to our structures.",
  ],
  [
    ["scissor lift", "boom lift"],
    "Customer wants to hang lights with their lift.",
    "**Only qualified operators** — our crew may **refuse** shared lifts without **safety plan**; **venue lift rules** apply.",
  ],
  [
    ["forklift customer", "fork lift"],
    "Customer has a forklift to unload truck.",
    "**Liability + spotter** rules — **driver signature** and **dock plan**; don’t bypass **trained crew** policy without manager.",
  ],
];

for (const [k, q, a] of round10) {
  E(k, q, a);
}

const round11 = [
  [
    ["livestream backdrop", "zoom background", "webcam backdrop"],
    "Streamer / Zoom / hybrid meeting backdrop.",
    "**Pipe & drape, step-and-repeat, or branded panel** — confirm **camera width, height, and glare** (matte vs shiny).",
  ],
  [
    ["podcast backdrop", "photo press wall"],
    "Podcast or press conference backdrop.",
    "Match **mic placement** and **logo size** to **frame**; **sound-dampening** is usually AV, not tent fabric.",
  ],
  [
    ["watch party", "outdoor tv", "projector super bowl"],
    "Outdoor watch party — big screen / projector.",
    "Clarify if we rent **screen + projector + power** or only **tent/seating**; **sports broadcast rights** are customer's problem.",
  ],
  [
    ["handheld mic", "wired microphone"],
    "Extra handheld microphones quantity.",
    "Confirm **mixer compatibility** with client's AV — we **don't** guess **XLR vs wireless** without inventory check.",
  ],
  [
    ["flag stand", "presentation flags"],
    "Flag stands next to podium.",
    "**Inventory-specific** — **weighted base** for outdoor; **venue** may restrict certain flags.",
  ],
  [
    ["bunting", "patriotic decor", "fourth of july"],
    "Patriotic bunting / July 4th décor rentals.",
    "If stocked, quote **linear feet + install**; **fireworks proximity** stays separate safety topic.",
  ],
  [
    ["pumpkin patch", "farm fall festival"],
    "Fall farm festival / pumpkin patch tenting.",
    "**High dust/mud** — plan **floor and cleaning**; **traffic spikes** may need **barricades**.",
  ],
  [
    ["christmas tree lot", "tree sale tent"],
    "Christmas tree sales lot — tent or heat.",
    "**Heater spacing + ventilation** critical around **greens** — only **approved heat** per shop; **fire lane** clearances.",
  ],
  [
    ["santa set", "santa chair throne"],
    "Santa photo set — chair and backdrop.",
    "Often **throne + backdrop + queue stanchions**; confirm **mall rules** if applicable.",
  ],
  [
    ["easter egg hunt", "spring field day"],
    "Easter egg hunt / spring outdoor party.",
    "**Canopy clusters** for registration; **kid-height tables** — **allergy** note if candy handed out by others.",
  ],
  [
    ["new years eve", "nye party"],
    "New Year's Eve rental timing.",
    "**Late-night strike** or **next-day** pickup may be **premium** — confirm **calendar pricing** with office.",
  ],
  [
    ["unlevel yard", "slope", "hill"],
    "Sloped or uneven lawn for tent.",
    "**Leg adjustments / leveling** may be limited — **engineered subfloor** or **alternate pad** might be needed; **site visit**.",
  ],
  [
    ["shim", "leveling blocks"],
    "Leveling blocks / shims under staging.",
    "Only **approved methods** — **not** random cribbing that shifts; **crew lead** decides.",
  ],
  [
    ["plywood subfloor", "raised floor"],
    "Plywood or modular subfloor over mud.",
    "**SKU + labor** heavy — **weight on grass** and **trip edges** need plan; **manager** signs off.",
  ],
  [
    ["weight limit table", "how much weight table"],
    "How much weight can tables hold?",
    "Give only **published load guidance** — **no guessing** for **cakes, engines, or stacks**; escalate unusual loads.",
  ],
  [
    ["smoke smell", "cigarette smell tent"],
    "Tent smells like smoke from prior event.",
    "**Don't promise** odor removal on the phone — **cleaning fees / swap** decided by **shop**; document before dispatch.",
  ],
  [
    ["musty smell", "mildew smell"],
    "Customer reports musty smell when tent opens.",
    "**Inspection** required — could be **storage moisture**; **swap** vs **treat** is **operations** decision.",
  ],
  [
    ["mosquito misting", "bug fogger"],
    "Customer wants to fog or mist for mosquitos inside tent.",
    "**Respiratory + chemical** risks — **not** staff-applied unless **licensed program**; defer to **pest pro**.",
  ],
  [
    ["floodplain", "high water"],
    "Site near floodplain or stream.",
    "**Weather + egress** risk — **permits** may block structures; **manager** reviews **hydrology** notes.",
  ],
  [
    ["retaining wall", "tiered yard"],
    "Terraced yard with retaining walls.",
    "**Staking near walls** can stress masonry — **engineering** may forbid; **weights + layout** alternative.",
  ],
  [
    ["gaming event", "lan party", "esports"],
    "LAN party or esports event tables/power.",
    "**Power density** extreme — **not** just one house cord; **electrician / distro** plan required; escalate.",
  ],
  [
    ["led wall", "jumbotron"],
    "LED video wall / jumbotron rental.",
    "**Usually specialty vendor** — confirm if we **broker** or **decline**; **rigging** is engineer territory.",
  ],
  [
    ["ice resurfacer", "hockey rink"],
    "Winter event on/near ice rink.",
    "**Slip + temp + condensation** — likely **nonstandard**; only **events lead** approves layout.",
  ],
  [
    ["helicopter", "aerial drop"],
    "Helicopter candy drop or landing nearby.",
    "**Air ops + FAA + venue** — **not** coordinated by rentals phone agent; **safety perimeter** for tent stakes matters.",
  ],
  [
    ["balloon arch install", "organic balloon"],
    "Organic balloon arch installation.",
    "If **balloons** aren't our service, refer to **balloon pro** — we may only provide **frame/pipe** when applicable.",
  ],
];

for (const [k, q, a] of round11) {
  E(k, q, a);
}

const round12 = [
  [
    ["duplicate booking", "double booked"],
    "Worried we double-booked their date.",
    "Apologize; **immediately** verify in system with **order #** — if conflict exists, **manager** resolves **substitution or credit**; don't guess.",
  ],
  [
    ["wrong tent delivered", "smaller tent"],
    "Wrong tent size showed up.",
    "**Stop work** if safe; **photos + dispatcher** — **correct SKU** and **timeline** only from operations; **no blame** on the phone.",
  ],
  [
    ["crew late", "not here yet"],
    "Setup crew is late — customer angry.",
    "Acknowledge; **dispatch ETA** is source of truth — give **updated window** when available; **no fabricated** times.",
  ],
  [
    ["crew rude", "unprofessional"],
    "Customer complains crew was rude.",
    "**No debate**. “I'm sorry — I'll report this to management for follow-up.” Collect **facts**, not emotions.",
  ],
  [
    ["photos before event", "preview setup"],
    "Can we see photos of tent before guests arrive?",
    "We **don't guarantee** progress photos — **ask dispatcher** if crew can snap **safe** shots; **privacy** of other jobs applies.",
  ],
  [
    ["drone photo our tent", "aerial photo"],
    "Customer wants drone shots of finished tent.",
    "**Their drone, their permits** — we **don't** authorize airspace; warn about **lines/stakes** underfoot.",
  ],
  [
    ["wedding planner", "day of coordinator"],
    "Wedding planner will be day-of coordinator.",
    "Get **planner name + cell** on file — **crew instructions** go through **dispatch**; planner doesn't override **safety**.",
  ],
  [
    ["florist access", "vendor load in"],
    "Florist needs early access same morning.",
    "**Load-in matrix** — who arrives when — goes to **dispatch**; **stacking trades** causes conflict without a **schedule**.",
  ],
  [
    ["caterer kitchen power", "temp kitchen"],
    "Caterer needs temp kitchen tent + heavy power.",
    "**Amp draw** math required — **not** “extra generator guess”; **electrician** or **events engineer** signs off.",
  ],
  [
    ["buffet line traffic", "serving order"],
    "How should buffet face guest flow?",
    "Suggest **single-sided vs double** with **planner** — **fire egress** can't be blocked; **stanchions** help queues.",
  ],
  [
    ["cake table", "dessert table"],
    "Dedicated cake / dessert table.",
    "**Stable level surface**, **linen**, **shade/heat** plan — **not** in direct sun for **fondant**; **AC draft** caution.",
  ],
  [
    ["dj needs table", "dj table size"],
    "What table does DJ need?",
    "Ask **DJ rider** or **equipment footprint** — **6ft** common but **not universal**; **power + cover** if rain.",
  ],
  [
    ["band green room", "artist holding"],
    "Band wants a green room tent or holding area.",
    "**Separate small tent or curtained zone** — **climate, lockable?**, **noise** to neighbors; quote with **manager**.",
  ],
  [
    ["after party second venue"],
    "After-party at different address same night.",
    "**Second delivery** may need **second contract** — **crew hours** and **truck** routing; don't append verbally.",
  ],
  [
    ["noise ordinance", "sound curfew"],
    "Town noise curfew at 10pm.",
    "**Amplified sound** must respect **ordinance** — **DJ/band** manages levels; we **don't** police decibels but share **venue rules**.",
  ],
  [
    ["sparkler send off time", "sparkler exit"],
    "Sparkler exit timing with photographer.",
    "**Venue + fire** rules first — **length** of sparklers and **bucket of sand** for duds; **not** our product to supervise.",
  ],
  [
    ["send off tunnel", "arch of people"],
    "Guests form tunnel for exit — spacing.",
    "Suggest **stanchions** or **aisle width** so **dresses** don't snag; **safety** over Pinterest layout.",
  ],
  [
    ["valet parking", "parking attendant"],
    "Customer asks if we arrange valet.",
    "**Transport/valet** not core unless **office** partners — refer to **venue** or **specialty vendor**.",
  ],
  [
    ["shuttle bus", "guest transportation"],
    "Shuttle buses from hotel to venue.",
    "Logistics **outside equipment rental** — we can note **drop loop** clearance for **large buses**.",
  ],
  [
    ["horse trailer", "equestrian"],
    "Horse event near tent — trailers parking.",
    "**Turning radius** and **mud** matter — **separate** from guest tenting; **coordinate gate** with **property owner**.",
  ],
  [
    ["car show", "automotive meet"],
    "Car show — canopies between vehicles.",
    "**Fire lane** and **spacing** — **weights** not stakes on **asphalt** without approval; **city permit** common.",
  ],
  [
    ["swap meet", "flea market vendor"],
    "Swap meet vendor tent package.",
    "**Repeating weekly** vs one-off — **contract terms** and **wind** responsibility; **minimum footprint** fees possible.",
  ],
  [
    ["gun show", "weapons expo"],
    "Gun show or weapons expo rentals.",
    "**High compliance** venue — **only management** quotes; **security + insurance** beyond normal; **no** casual phone promise.",
  ],
  [
    ["tattoo convention", "body art expo"],
    "Convention needing booths / pipe & drape.",
    "**Grid layout + power** per vendor — **multi-day** labor; **events lead** pricing.",
  ],
  [
    ["storage tent", "job site shelter"],
    "Construction job-site storage tent.",
    "**Long-term wind/snow** loads differ from **weekend party** — **commercial temp structure** review; **manager** only.",
  ],
];

for (const [k, q, a] of round12) {
  E(k, q, a);
}

const round13 = [
  [
    ["first amendment", "free speech rally"],
    "First Amendment / protest / rally infrastructure.",
    "**Permits, security, and liability** are beyond a normal quote — **only management** with **legal** review; **neutral** tone on the phone.",
  ],
  [
    ["religious service", "tent church"],
    "Outdoor religious service under tent.",
    "**Seating count, sound, ADA**, and **communion / ritual** spacing — involve **planner/officiant**; **respectful** scheduling for strike.",
  ],
  [
    ["funeral procession", "graveside"],
    "Graveside or procession tent (brief).",
    "**Short windows** — confirm **strike time** with **funeral director**; **compact canopy** may fit better than full pole tent.",
  ],
  [
    ["military ceremony", "retreat flag"],
    "Military ceremony or honor guard.",
    "**Flag protocol** is theirs — we provide **staging/chairs** per order; **no** uniform or protocol coaching.",
  ],
  [
    ["naturalization", "citizenship ceremony"],
    "Government or citizenship ceremony.",
    "**Agency PO + security** — escalate to **office**; **exact SKU** from contract, not impulse quotes.",
  ],
  [
    ["auction tent", "bid paddles"],
    "Live auction under tent — sightlines.",
    "**Riser, lighting on items**, **power for auctioneer mic** — **AV** often separate vendor; **layout** with nonprofit lead.",
  ],
  [
    ["gala seated dinner", "rounds of 10"],
    "Gala plated dinner — rounds of 10.",
    "Map **service aisles** and **head table**; confirm **linen** level with **caterer plate size**.",
  ],
  [
    ["sommelier", "wine service"],
    "Wine service stations.",
    "**Tables + ice bins + dump buckets** if applicable — **liquor license** is venue/caterer; we **don't** pour.",
  ],
  [
    ["raw bar", "oyster bar"],
    "Seafood raw bar setup.",
    "**Chilling, drainage, food safety** — **caterer** designs; we rent **tables/small tent** as ordered.",
  ],
  [
    ["brunch", "morning after wedding"],
    "Morning-after wedding brunch tent.",
    "**Earlier crew** and **coffee power** — may be **second billable day**; confirm **strike from night before**.",
  ],
  [
    ["tea party", "baby tea"],
    "Formal tea or garden tea party.",
    "**Smaller tables**, **mixed seating**, **shade** — confirm **cup/saucer** source (caterer vs rental china if offered).",
  ],
  [
    ["luau", "tiki"],
    "Luau / tiki theme décor questions.",
    "Theming is **planner/floral** — we rent **structures, tables, lights**; **open flame / torches** follow **venue + fire** rules.",
  ],
  [
    ["western theme", "hay bale"],
    "Western theme — hay bales for seating.",
    "**Hay** may be **allergen/mess** and **fire** concern — confirm **venue approval**; **bench or chair** safer default.",
  ],
  [
    ["ice sculpture", "ice luge"],
    "Ice sculpture or ice luge melting.",
    "**Drain + floor protection** under **ice** — **time-to-melt** affects **layout**; refer **ice artist** for specs.",
  ],
  [
    ["confetti cannon", "co2 burst"],
    "Co2 confetti cannons or bursts.",
    "**Indoor/venue rules** and **cleanup fees** — many venues **ban** loose confetti; **coordination** with DJ/AV.",
  ],
  [
    ["livestream guest", "zoom wedding"],
    "Hybrid wedding — Zoom screen for remote guests.",
    "**Dedicated table, power, uplight**, and **audible speaker** for vows — **upload speed** is customer/venue IT.",
  ],
  [
    ["sign language", "interpreter"],
    "ASL interpreter placement.",
    "**Sightlines** near **couple** or **stage** — reserve **fenced floor space**; **planner** sets program.",
  ],
  [
    ["wheelchair route", "curb ramp"],
    "Wheelchair route from parking to tent.",
    "**Surface, slope, mud after rain** — we note **tent entry** height; **venue** owns **parking path** fixes.",
  ],
  [
    ["oxygen", "medical tent"],
    "Medical tent or first-aid station.",
    "**Licensed medical** partners define needs — we **don't** advise clinical layout; **emergency vehicle access** keep clear.",
  ],
  [
    ["cool room", "walk in cooler"],
    "Walk-in cooler trailer on site.",
    "**Usually specialty vendor** — confirm **power, level pad, ADA around doors**; may be **brokered**, not inventory.",
  ],
  [
    ["green room talent", "celebrity trailer"],
    "Celebrity / talent trailer coordination.",
    "**High security** — **no** unpublished talent info; **routing** and **privacy screening** via **production lead**.",
  ],
  [
    ["rain plan b", "plan b tent"],
    "Book a backup tent “just in case.”",
    "**Holds cost money** — office defines **deposit/hold policy**; **weather calls** follow **contract cutoff** language.",
  ],
  [
    ["dismantle early", "strike early"],
    "Venue forces early strike vs contract.",
    "**Contract hours** rule — **overage** may bill; get **written venue notice**; escalate to **manager** if dispute.",
  ],
  [
    ["noise complaint mid event", "police called"],
    "Police called for noise during event.",
    "**Stay calm** — **venue host** and **planner** lead; our crew **reduces** generator/lift noise if asked; **no** arguments with law enforcement.",
  ],
  [
    ["neighbor complaint before event"],
    "Neighbor calls before event about tent on property line.",
    "**Property line** is **customer** issue — we **don't** mediate; suggest **survey/pin** clarity before install.",
  ],
];

for (const [k, q, a] of round13) {
  E(k, q, a);
}

const round14 = [
  [
    ["school field", "athletic field"],
    "School wants tent on turf practice field.",
    "**Athletic director** approval + **no stakes** policy — plan **weights** and **protective decking** for heavy traffic paths.",
  ],
  [
    ["bleachers", "grandstand"],
    "Tent near bleachers or stadium.",
    "**Egress** and **crowd flow** — don't block **stairs** or **ADA ramps**; **sound** may bounce — note for planner.",
  ],
  [
    ["track and field", "running track"],
    "Setup next to rubber running track.",
    "**No spikes/stakes** on track — **mats or weights** only; **facility manager** signs off on any **vehicle creep**.",
  ],
  [
    ["tennis court", "pickleball"],
    "Tent on or beside tennis/pickleball courts.",
    "**Surface protection** mandatory — **no anchors** through court; **wind** on open courts is harsh — **ballast plan**.",
  ],
  [
    ["marina dock", "boat dock"],
    "Event adjacent to dock or marina.",
    "**Corrosion/slip** and **hose tripping** — **power** distances; **park rules** for **tent setback** from water.",
  ],
  [
    ["vineyard row", "winery between vines"],
    "Tent between vineyard rows.",
    "**Row width** and **irrigation lines** — **no stakes** near lines; **ag manager** must approve **footprint**.",
  ],
  [
    ["apple orchard", "pumpkin farm field"],
    "U-pick farm or orchard event.",
    "**Mud season**, **tractor access**, and **PHI/bio** — **family traffic** vs **equipment paths**; **insurance** may require **addendum**.",
  ],
  [
    ["zoo event", "zoo after hours"],
    "After-hours zoo or animal park event.",
    "**Animal stress / noise / lighting** rules — **only** with **venue events** team; **our** scope is **structures/furniture** per contract.",
  ],
  [
    ["airport vicinity", "flight path"],
    "Venue near airport — tall tent or inflatables.",
    "**Height restrictions** may apply — **venue** provides limits; **never** promise **max height** without **written** clearance.",
  ],
  [
    ["train tracks", "railroad adjacent"],
    "Site next to active rail line.",
    "**Vibration + noise + trespass** — **setback** from **right-of-way**; **flag any** fence gaps for **safety** briefing.",
  ],
  [
    ["highway visibility", "road frontage"],
    "Visible from highway — sign regulations.",
    "**DOT/local sign codes** — customer **permits** for **banners/flags**; we **don't** permit on their behalf.",
  ],
  [
    ["cell tower", "rf interference"],
    "Worried about cell / RF interference with AV.",
    "**AV vendor** troubleshoots — **not** rental equipment issue unless **our** powered items **cause** hum (rare); **escalate** to AV.",
  ],
  [
    ["archaeological", "historic burial"],
    "Historic site / possible archaeological sensitivity.",
    "**No casual staking** — **site archaeologist** or **SHPO** rules; **manager** only quotes after **written** OK.",
  ],
  [
    ["native land", "tribal land"],
    "Event on tribal or treaty land.",
    "**Tribal permits** separate from **county** — **don't** guess; customer **liaison** with **nation**; **office** reviews contract.",
  ],
  [
    ["light pollution", "dark sky"],
    "Dark-sky or astronomy-adjacent venue wants minimal light.",
    "**Uplight/walls** may be restricted — offer **dimmed** or **curfew** plan; **battery** small path lights vs floods.",
  ],
  [
    ["beehive", "apiary"],
    "Customer keeps bees near tent site.",
    "**Food service** proximity — **stings** risk; **relocate hive discussion** is **homeowner**, not us; note for **crew allergies**.",
  ],
  [
    ["chicken coop", "livestock yard"],
    "Small hobby farm next to install.",
    "**Biosecurity** and **dog/leash** — **crew** stays on **agreed path**; **manure** wheels cleaned per **farm rules** if asked.",
  ],
  [
    ["alligator", "wildlife florida"],
    "Wildlife (e.g. alligators) near water feature.",
    "**Venue safety** briefing — **not** our expertise; **no** swimming or **water-edge** décor without **venue approval**.",
  ],
  [
    ["dust storm", "high wind dust"],
    "Dust bowl conditions on dry fairgrounds.",
    "**Eye/respirator** for crew per **policy**; **zip sidewalls** may help; **cancellation** thresholds in **contract**.",
  ],
  [
    ["hail", "severe hail"],
    "Forecast includes hail.",
    "**Insurance / acts of God** language — **don't** promise **replacement mid-event**; **safety** > property when **sky** threatens.",
  ],
  [
    ["tornado watch", "tornado warning"],
    "Tornado watch/warning during event.",
    "**Venue shelter plan** — **deflate inflatables**, **clear guests** per **emergency** protocol; **crew** follows **company** storm rules.",
  ],
  [
    ["heat advisory", "heat index"],
    "Extreme heat advisory.",
    "**Hydration, shade, misting fans** if available — **generator** capacity; **elder/child** guests: flag for **planner**.",
  ],
  [
    ["air quality", "smoke wildfire"],
    "Wildfire smoke or poor air quality.",
    "**Outdoor event** may need **contingency** — **HEPA/indoor** not our scope; **refund policy** is **contract/management**.",
  ],
  [
    ["tick", "lyme"],
    "Ticks / Lyme — outdoor grassy site.",
    "**Advisory** only: **long grass** near woods — suggest **repellent** and **post-event check**; **not** medical advice.",
  ],
  [
    ["poison ivy", "sumac"],
    "Crew/customer worried about poison ivy at site.",
    "**Flag growth** during **site visit photos** — **crew PPE** per policy; **removal** is **property owner**, not rental default.",
  ],
];

for (const [k, q, a] of round14) {
  E(k, q, a);
}

const round15 = [
  [
    ["rfp", "request for proposal"],
    "School or government RFP process.",
    "**Formal bids** go through **office** — collect **due date, scope PDF, insurance mins**; staff **don't** sign RFP responses alone.",
  ],
  [
    ["sole source", "piggyback contract"],
    "Customer asks for sole-source or piggyback on another contract.",
    "**Legal/procurement** only — ”I'll send this to our office for **compliance** review.”",
  ],
  [
    ["prevailing wage", "davis bacon"],
    "Prevailing wage / public works labor rules.",
    "**Not** determined on the sales line — **estimating** and **HR** handle **certified payroll** if applicable.",
  ],
  [
    ["bonded", "performance bond"],
    "Customer requires performance bond.",
    "**Bond capacity** is **ownership/finance** — quote **deposit/retainer** paths only per **policy**; **no** verbal bond promise.",
  ],
  [
    ["coi sample", "certificate template"],
    "Email me a blank COI template.",
    "Send **official template** from **office** only — **no** homemade COI; **holder name** must match **venue request**.",
  ],
  [
    ["spanish contract", "contrato", "translate contract"],
    "Spanish-language contract request.",
    "**English master** usually governs — **translated** copies via **approved** vendor; **staff** don't translate legal clauses.",
  ],
  [
    ["canada border", "cross border"],
    "Gear crossing US/Canada border.",
    "**Customs/broker** is **customer** or **specialty logistics** — **not** standard delivery quote.",
  ],
  [
    ["storage between", "warehouse hold"],
    "Hold my rentals in your warehouse between Saturday and Sunday.",
    "**Warehouse storage** may incur **fee** — **availability** is **ops** decision; **inventory** may **ship to next job**.",
  ],
  [
    ["rain date discount", "postponement fee"],
    "Postponement from rain — new date fee.",
    "**Contract** defines **reschedule** fees — **don't waive** on the phone; **manager** approves **goodwill**.",
  ],
  [
    ["credit memo", "account credit"],
    "Apply last year's credit memo to this order.",
    "**Accounting** applies credits — verify **open balance** and **expiration**; **don't** promise dollars without **ledger** check.",
  ],
  [
    ["price lock", "lock in price"],
    "Lock price for 12 months.",
    "**Price locks** are **policy-specific** — default: **quotes expire** as printed; **annual contract** via **sales lead**.",
  ],
  [
    ["escalation clause", "fuel surcharge"],
    "Fuel surcharge on invoice.",
    "If **contract** allows **surcharge**, cite **clause**; otherwise **billing** must approve — **no** surprise line items.",
  ],
  [
    ["damage waiver vs insurance", "ldw"],
    "Difference between damage waiver and real insurance.",
    "Explain only per **written** program — **not** insurance advice; **coverage gaps** go to **customer's** broker.",
  ],
  [
    ["subrogation waiver", "waiver of subrogation"],
    "Venue wants waiver of subrogation.",
    "**COI endorsement** request — **office + broker**; **timeline** may be **days**, not **same hour**.",
  ],
  [
    ["named insured", "additional insured wording"],
    "Exact COI wording mismatch — venue rejected certificate.",
    "Forward **verbatim** **venue paragraph** to **coordinator** — **don't** paraphrase **legal** wording on email.",
  ],
  [
    ["union load in", "iats"],
    "Union load-in rules at venue.",
    "**Stagehands / dock** may be **union only** — our **labor** stops where **contract** says; **customer** pays **labor bill** per venue.",
  ],
  [
    ["rigging points", "ceiling hang"],
    "Hang lighting from ceiling rig points.",
    "**Venue structural** and **certified rigger** — **not** tent crew by default; **separate vendor** and **load calc**.",
  ],
  [
    ["sprinkler head", "fire sprinkle"],
    "Decor touching sprinkler heads in ballroom.",
    "**Fire marshal** rules — **keep clear** zones; **height** of tent liner vs **heads** needs **facility** sign-off.",
  ],
  [
    ["asbestos", "lead paint"],
    "Older building — asbestos or lead concern.",
    "**Stop** and **escalate** — **no** drilling or disturbing **historic** finishes without **abatement** clearance.",
  ],
  [
    ["hazmat pickup", "fuel spill"],
    "Fuel or chemical spill near equipment.",
    "**911** if **immediate** danger — **SDS** for **our** chemicals only; **site spill** is **HazMat** coordinator.",
  ],
  [
    ["cctv", "security camera"],
    "Customer asks if we record on-site video.",
    "**Company policy** only — **don't** assume **dash/body cams**; **privacy** notice for **crews** is **HR**.",
  ],
  [
    ["nda", "non disclosure"],
    "Sign their NDA before quoting celebrity event.",
    "**Only authorized signer** — forward to **legal/owner**; **don't** sign **personal** NDA as staff.",
  ],
  [
    ["embargo date", "surprise party"],
    "Surprise party — embargo outreach until date.",
    "**Internal note** “**no vendor calls** to guest of honor #” — still log **real contact** for **delivery**.",
  ],
  [
    ["gift kickback", "vendor kickback"],
    "Planner offers kickback for steering business.",
    "**Decline** — **ethics policy**; report to **management**; **no** informal **commissions**.",
  ],
  [
    ["bribe", "cash under table"],
    "Customer hints at under-table cash.",
    "**Refuse** — **compliance**; **no** humor; end conversation if **pressure** continues; **report**.",
  ],
];

for (const [k, q, a] of round15) {
  E(k, q, a);
}

const round16 = [
  [
    ["same day invoice", "need invoice today"],
    "Customer needs invoice same day as event.",
    "**Billing turnaround** varies — capture **email for AP** and **PO#**; **don't** promise **instant** PDF without **accounting** confirmation.",
  ],
  [
    ["net terms", "net45", "net 60"],
    "Customer demands Net 45 / Net 60.",
    "**Credit app** required — **only finance** approves terms; **verbal** net terms **invalid**.",
  ],
  [
    ["early pay discount", "2 10 net 30"],
    "Early-pay discount on invoice.",
    "If **policy** exists, cite **exact** terms; otherwise **no** ad-hoc discounts without **manager**.",
  ],
  [
    ["sales tax id", "resale certificate"],
    "Drop sales tax — we have resale certificate.",
    "**Valid cert on file** before **tax-exempt** billing — **accounts** verifies; **don't** zero tax from a **phone photo** alone.",
  ],
  [
    ["multi state nexus", "remote sales tax"],
    "Which state gets the sales tax?",
    "**Multi-jurisdiction** rules are **accounting** — staff **quote subtotal** and note “**tax per contract**.”",
  ],
  [
    ["currency cad", "pay in canadian"],
    "Pay in Canadian dollars or foreign currency.",
    "**USD** default unless **office** agrees **FX** — **no** Venmo-to-personal in **foreign** currency.",
  ],
  [
    ["paypal", "paypal goods"],
    "Pay via PayPal.",
    "**Only official** company PayPal — **never** personal; **fees** may pass through per **policy**.",
  ],
  [
    ["square", "tap to pay"],
    "Tap-to-pay on delivery.",
    "**Card-present** only if **device + policy** allow — **driver** follows **training**; **no** manual card **over phone** if prohibited.",
  ],
  [
    ["check on delivery", "cod check"],
    "COD check to driver.",
    "**Acceptance** per **AR policy** — **driver** may **decline** **starter** or **third-party** checks; **exact** amount only.",
  ],
  [
    ["stop payment", "check bounced"],
    "Customers check bounced or stop-paid.",
    "**Accounting** collects — **don't argue**; **service hold** on future orders until **cleared**.",
  ],
  [
    ["lien", "mechanics lien"],
    "Threatening mechanic's lien on our gear.",
    "**Legal** immediately — **no** threatening back; **document** **all** comms; **ownership** of gear is **ours** unless **sold**.",
  ],
  [
    ["bankruptcy", "chapter 11"],
    "Customer or venue in bankruptcy.",
    "**Stop** extending **credit** — **legal** instructs **next steps**; **deposits** may be **restricted**.",
  ],
  [
    ["garnishment", "wage garnishment"],
    "Garnishment notice for employee who ordered.",
    "**HR/legal** — **not** sales; **don't** discuss **payroll** with **creditor** callers.",
  ],
  [
    ["fraud order", "stolen card"],
    "Suspicious rush order / maybe stolen card.",
    "**Fraud playbook** — verify **billing/shipping** match, **callback** known **org** number; **decline** if **red flags**.",
  ],
  [
    ["identity theft", "not my order"],
    "Caller says order wasn't them — identity theft.",
    "**Freeze** further **contact** using stolen PII — **security** + **accounting**; **document** **dispute** ref.",
  ],
  [
    ["eu gdpr", "delete my data"],
    "EU resident GDPR data request.",
    "**Privacy** inbox only — **timeline** per **policy**; **don't** mass-export **PII** from **CRM** personally.",
  ],
  [
    ["ccpa", "california privacy"],
    "California privacy rights request.",
    "**Same** as **formal privacy** channel — **no** one-off delete of **DB** rows by **frontline**.",
  ],
  [
    ["subprocessor", "dpa"],
    "Customer needs DPA / subprocessor list.",
    "**Legal** provides **DPA** — **standard quotes** don't include **DP terms** unless **enterprise** contract.",
  ],
  [
    ["soc2", "iso 27001"],
    "Customer needs SOC2 / ISO certs.",
    "We issue **what exists** — **don't** claim **certifications** we **lack**; **security** FAQ from **IT/management**.",
  ],
  [
    ["pen test", "security questionnaire"],
    "Fill security questionnaire 200 questions.",
    "**Enterprise** process — **forward** to **IT**; **not** a **same-day** phone task.",
  ],
  [
    ["force majeure", "act of god clause"],
    "Customer cites force majeure to cancel free.",
    "**Contract** language governs — **credit vs forfeit**; **no** binding interpretation on **phone**; **legal** if disputed.",
  ],
  [
    ["liquidated damages", "ld clause"],
    "Venue contract mentions liquidated damages for late strike.",
    "**Our** contract with customer must **allocate** **who pays** **LD** — **manager** reviews **venue rider**.",
  ],
  [
    ["indemnify", "hold harmless broad"],
    "Broad hold-harmless / indemnify us for everything.",
    "**Insurance + legal** review **one-sided** indemnities — **sales** doesn't **strike** clauses.",
  ],
  [
    ["arbitration", "class action waiver"],
    "Customer refuses arbitration clause.",
    "**Legal** only — note **objection**; **don't** rewrite **MSA** in **email**.",
  ],
  [
    ["minor signed contract", "under 18"],
    "Contract signed by someone under 18.",
    "**Guardian/co-signer** likely required — **voidability** risk; **manager** + **legal** for **weddings** with **young** signers.",
  ],
];

for (const [k, q, a] of round16) {
  E(k, q, a);
}

const round17 = [
  [
    ["kid chair", "kiddie chair", "children chair"],
    "Children's chairs vs adult chairs.",
    "Confirm **counts by age** — **folding kid chairs** if stocked; else **mixed** seating with **shorter legs** at tables.",
  ],
  [
    ["booster seat", "high chair"],
    "High chairs or booster seats for dinner.",
    "**Inventory-specific** — many rental lines **don't** stock **high chairs**; suggest **venue/caterer** or **parent brings**.",
  ],
  [
    ["stroller parking", "stroller corral"],
    "Stroller parking at tented wedding.",
    "**Roped zone** or **sidelines** — **not** blocking **egress**; **weather** cover optional.",
  ],
  [
    ["playpen", "pack n play"],
    "Rent a pack-n-play or play yard.",
    "**Baby gear** often **not** rental inventory — **retail** buy or **guest** brings; **liability** for **sleep** gear is **high**.",
  ],
  [
    ["sensory friendly", "autism friendly"],
    "Sensory-friendly event — quieter zone.",
    "**Side tent** or **curtained corner** with **lower lights**; **noise** plan with **DJ**; **no** medical guarantees.",
  ],
  [
    ["nursing mothers", "lactation space"],
    "Private space for nursing.",
    "**Small tent or curtained area** + **chair**; **power** if pump; **signage** for **privacy**.",
  ],
  [
    ["veteran discount", "military id"],
    "Military or veteran discount.",
    "**Only** if **official** promo exists — ID check process via **manager**; **don't** invent **%** on the call.",
  ],
  [
    ["teacher discount", "educator"],
    "Teacher / school staff discount.",
    "**Policy-based** — **ID** + **approved** code; otherwise **polite decline**.",
  ],
  [
    ["first responder", "nurse week"],
    "First-responder appreciation discount.",
    "**Marketing calendar** only — forward to **promotions**; **no** **off-the-cuff** free add-ons.",
  ],
  [
    ["loyalty points", "repeat customer rewards"],
    "I'm a repeat customer — points or perks?",
    "**CRM note** only unless **program** exists — “I'll **flag** your account for the office.”",
  ],
  [
    ["yelp review", "review for discount"],
    "Leave review for discount.",
    "**Ethics**: **no** pay-for-review — **Google** TOS risk; **decline** **quid pro quo**; **thank** organic reviews.",
  ],
  [
    ["tiktok", "reel", "film crew small"],
    "Content creator films our setup for TikTok.",
    "**Media release** is **marketing/owner** — **no** **free gear** for **exposure** without **contract**.",
  ],
  [
    ["wedding insurance", "event insurance"],
    "Should they buy wedding insurance?",
    "**General** info only — “**Many couples** carry **event** coverage”; **not** **agent** advice; **our** COI is **liability**, not their **cancellation**.",
  ],
  [
    ["weather insurance", "rain insurance"],
    "Rain insurance for outdoor wedding.",
    "**Third-party** policies — **we don't sell**; **refund** rules remain **our contract**.",
  ],
  [
    ["planner commission", "referral fee planner"],
    "Wedding planner asks for vendor commission.",
    "**Only** per **signed** **referral** agreements — **finance** tracks; **verbal** commission **%** without paperwork is **void**.",
  ],
  [
    ["venue preferred vendor", "kickback venue"],
    "Venue says we must use their preferred list.",
    "**Customer choice** — if **freedom** clause, **OK**; if **exclusive**, **venue** contracts with **them**, not us arguing.",
  ],
  [
    ["corkage", "cake cut fee"],
    "Venue corkage / cake-cutting fee grumble.",
    "**Venue rules**, not ours — **sympathize**; **don't** **bash** **venue** partners.",
  ],
  [
    ["shuttle late", "bus late guests"],
    "Shuttle bus ran late — dinner delayed.",
    "**Timeline** is **planner** — we **hold** **hot** **holding** gear if contracted; **no** **refund** **for** **bus** **vendor**.",
  ],
  [
    ["photo timeline drift", "running late wedding"],
    "Wedding running 45 minutes late — crew waiting.",
    "**OT** per **contract** after **grace**; **dispatch** logs **clock**; **no** **open-ended** **free** **waits**.",
  ],
  [
    ["power blink", "generator stumbled"],
    "Lights flickered — generator stumbled.",
    "**Load** may have **spiked** — **AV** should **sequence** **turn-on**; **crew** checks **fuel/breaker** if **our** **gen**.",
  ],
  [
    ["extension trip house", "house breaker trip"],
    "House breaker tripped powering our gear.",
    "**Reduce** **load** — **separate** **circuits**; **licensed electrician** if **panel** issue — **don't** **reset** **unknown** **panels** **repeatedly**.",
  ],
  [
    ["fuel smell generator", "exhaust fume"],
    "Guests smell generator exhaust.",
    "**Relocate** **gen** **downwind** **farther** if safe; **never** **indoors**; **CO** **risk** — **priority** **safety**.",
  ],
  [
    ["guy wire", "stake trip hazard"],
    "Guy-wires or stakes are trip hazards.",
    "**Bright** **flags**, **covers**, or **route** **reroute** per **safety**; **night** **path** **lighting** suggestion.",
  ],
  [
    ["generator theft", "fuel theft"],
    "Someone siphoned generator fuel overnight.",
    "**Police report** + **photos** — **customer** site **security** unless **contract** says **otherwise**; **billing** **fuel** **top-up**.",
  ],
  [
    ["vandalism tent", "graffiti tent"],
    "Tent vandalized overnight at site.",
    "**Police** + **insurance** — **repair** **vs** **replace** by **ops**; **customer** **may** bear **deductible** per **agreement**.",
  ],
];

for (const [k, q, a] of round17) {
  E(k, q, a);
}

const round18 = [
  [
    ["aisle width", "how wide aisle"],
    "How wide should aisles be between tables?",
    "Depends on **chair depth** and **service** — **36–48 in+** common for **servers**; **fire marshal** may **mandate** **wider**; **planner** confirms.",
  ],
  [
    ["sweetheart table", "head table shape"],
    "Sweetheart table shape — round vs rectangular.",
    "**Floor plan** from **planner** — **linen** size follows **table** SKU; **backdrop** depth affects **aisle**.",
  ],
  [
    ["king table u shape"],
    "U-shaped or king-table seating.",
    "**Many tables + linens** — **delivery path** for **building** the **U**; **speech** sightlines to **head**.",
  ],
  [
    ["assigned seating chart", "escort print"],
    "Who prints escort cards?",
    "**Stationer or planner** unless **we** offer **print** — **rent** **holders/trays** only if in **inventory**.",
  ],
  [
    ["napkin fold", "pocket napkin"],
    "Specific napkin fold style.",
    "**Catering** or **venue** often **folds** — rental **napkins** may be **bulk**; **don't** promise **origami**.",
  ],
  [
    ["chair sash", "bow on chair"],
    "Sashes or bows on every chair.",
    "**Labor** line item if **we** tie — **count** = **chairs**; **color** dye-lot with **linens**.",
  ],
  [
    ["mantle drape", "fireplace decor"],
    "Drape over indoor fireplace mantel.",
    "**Heat / code** — **no** **fabric** on **active** **fire**; **venue** decides **pilot** **on/off**.",
  ],
  [
    ["ceiling hook", "rig from ceiling"],
    "Hang décor from ballroom ceiling hooks.",
    "**Rated points** + **certified** **rigger** — **weight** form; **not** **tent** **crew** default.",
  ],
  [
    ["ballroom columns", "wrap columns"],
    "Wrap venue columns in fabric.",
    "**Venue** approval + **fire** **retardant** certs if required — **pipe** **wrap** **quote** from **specialty** if needed.",
  ],
  [
    ["outdoor rug", "artificial grass rug"],
    "Outdoor rug or turf runner on grass.",
    "**Trip** edges + **moisture** under **rug** — **stakes** **can't** go **through** **rug** **without** **plan**.",
  ],
  [
    ["heater near linen", "fire near drape"],
    "Heater placement near drapes or linens.",
    "**Manufacturer** **clearance** — **rotate** to **aim** **away** from **fabric**; **refusal** to **run** **unsafe** **setup**.",
  ],
  [
    ["candle real flame", "open flame centerpiece"],
    "Real candles in centerpieces.",
    "**Venue** often **bans**; **LED** **substitute** — **don't** **approve** **open** **flame** **yourself**.",
  ],
  [
    ["sparkler bucket", "sand bucket"],
    "Sand bucket for used sparklers.",
    "**Metal** **can** with **sand** or **water** per **fire** plan — **we** may supply **bucket** if **SKU**; **not** **babysit** **burn**.",
  ],
  [
    ["cold spark machine"],
    "Cold spark indoor pyro effect.",
    "**Licensed** **pyro** **vendor** — **venue** **permit**; **not** **standard** **rental** **SKU** **without** **shop**.",
  ],
  [
    ["dry ice", "fog low lying"],
    "Low-lying fog with dry ice.",
    "**Venue** **air** **quality** + **alarms** — **specialty** **operator**; **CO2/O2** **risk** in **basements**.",
  ],
  [
    ["laser show", "laser dj"],
    "Laser beams from DJ.",
    "**FDA/aviation** **rules** — **haze** **may** **trip** **smoke** **alarms**; **venue** **contract** governs.",
  ],
  [
    ["virtual guest", "zoom tablet"],
    "Tablet for Zoom guest at head table.",
    "**Power + Wi-Fi + mic** routing — **AV** table; **echo** **test** **before** **ceremony**.",
  ],
  [
    ["photo booth backdrop only"],
    "Backdrop stand without photo booth.",
    "**Pipe** **or** **stand** **rental** — **dimensions** for **step-and-repeat**; **wind** **weight** if **outdoor**.",
  ],
  [
    ["selfie station", "ring light"],
    "Selfie station with ring light.",
    "**Power** + **table**; **camera** is **customer** unless **we** **bundle** **equipment**.",
  ],
  [
    ["live painter", "event painter"],
    "Live wedding painter needs easel space.",
    "**10x10** **shade** + **light** + **trip** hazard **for** **guests** — **corner** placement.",
  ],
  [
    ["pet attendants", "dog wedding"],
    "Dog in ceremony — water bowl and tie-out.",
    "**No** **stake** **through** **irrigation**; **handler** is **customer**; **backup** **plan** if **barking**.",
  ],
  [
    ["ice sculpture drip pan"],
    "Drip pan size for ice sculpture.",
    "**Match** **artist** **spec** — **drain** **directed** **away** from **dance** **floor**.",
  ],
  [
    ["donut wall stands", "donut peg board"],
    "Donut wall stand rental.",
    "**Capacity** **#** **holes** vs **order** — **grease** **on** **linens** **risk**; **table** **liner** suggestion.",
  ],
  [
    ["champagne saber", "saber bottle"],
    "Champagne sabrage at event.",
    "**Glass** **shards** **risk** — **venue** **OK**? **Outdoor** preferred; **not** **our** **skill** **unless** **hired** **sommelier**.",
  ],
  [
    ["rice throw", "bird seed toss"],
    "Rice or birdseed toss after ceremony.",
    "**Venue** **bans** **sometimes** — **slip** **hazard**; **biodegradable** **petals** **or** **bubbles** **alternatives**.",
  ],
];

for (const [k, q, a] of round18) {
  E(k, q, a);
}

const round19 = [
  [
    ["inventory screenshot", "send me photos of chairs"],
    "Customer wants photos of exact chairs in warehouse.",
    "**Official** gallery or **scheduled** **walk-through** — **don't** **DM** random **warehouse** **pics** **without** **policy**.",
  ],
  [
    ["floor plan cad", "autocad layout"],
    "Venue sent CAD — can we load into layout?",
    "Forward **file** to **events** **design** — **frontline** **doesn't** **draft** **CAD**; **turnaround** **quoted** **by** **lead**.",
  ],
  [
    ["pipe and drape height", "drape ceiling height"],
    "Pipe-and-drape section height vs ballroom ceiling.",
    "**Upright** **SKU** max height — **within** **sprinkler** **clearance**; **facility** **sign-off**.",
  ],
  [
    ["drape color black", "velvet drape"],
    "Black velvet drape vs standard banjo.",
    "**SKU** **names** match **inventory** — **swatch** **or** **planner** **sample** before **promising** **blackout**.",
  ],
  [
    ["stage stairs handrail"],
    "Portable stage stairs need handrail.",
    "**Code** may **require** **rail** above **height** — **shop** **adds** **rail** **SKU**; **not** **optional** if **inspector** says **no**.",
  ],
  [
    ["wheelchair lift stage", "ada lift"],
    "Wheelchair lift to stage.",
    "**Specialty** **vendor** — **we** may **supply** **ramp** **modules** **only** if **in** **catalog**; **ADA** **path** **engineered**.",
  ],
  [
    ["clear acrylic podium", "ghost podium"],
    "Clear acrylic lectern.",
    "**Scratch** **care** on **transport** — **cleaning** **fee** if **return** **hazed**; **confirm** **SKU**.",
  ],
  [
    ["white leather lounge", "vip couch"],
    "White VIP leather lounge pieces.",
    "**Cover** **in** **rain** **or** **provide** **tent** **flap** — **stain** **fee** in **contract** language.",
  ],
  [
    ["ottoman with storage"],
    "Ottoman that opens for storage.",
    "**Security** **—** **don't** **promise** **lockable** **unless** **SKU** says **lock**; **items** **left** **inside** **not** **our** **vault**.",
  ],
  [
    ["charging station table", "usb table"],
    "Tables built-in USB charging.",
    "**If** **stocked**, confirm **amp** **budget** per **table**; **extension** **off** **house** **may** **trip**.",
  ],
  [
    ["wifi cradlepoint", "cellular router"],
    "Rent cellular router for Wi-Fi.",
    "**IT** **specialty** **—** **data** **plan** **is** **carrier**; **we** **may** **not** **offer**; **venue** **first**.",
  ],
  [
    ["satellite internet", "starlink event"],
    "Satellite internet dish at outdoor event.",
    "**Sky** **view** **+** **tripod** **footprint** **—** **not** **tent** **default**; **third** **party** **IT**.",
  ],
  [
    ["satellite bar trailer", "tap truck"],
    "Beer trailer or tap truck next to tent.",
    "**Separate** **contract** **with** **trailer** **vendor** **—** **clearance** **for** **tow** **in**; **power** **tie-in**.",
  ],
  [
    ["food truck height", "awning truck"],
    "Food truck awning hits tent edge.",
    "**Setbacks** **planned** **before** **install** **—** **dispatch** **needs** **truck** **dims**.",
  ],
  [
    ["kosher catering", "separate kitchen tent"],
    "Separate kitchen tent for kosher prep.",
    "**Dedicated** **tent** **+** **gear** **or** **wash** **protocol** **—** **caterer** **directs**; **we** **quote** **structure**.",
  ],
  [
    ["halal", "dietary station"],
    "Halal station layout separation.",
    "**Layout** **spacing** **with** **caterer** **—** **not** **religious** **authority**; **follow** **caterer** **map**.",
  ],
  [
    ["nut free wedding", "allergy aware"],
    "Nut-free wedding cross-contact worry.",
    "**Food** **is** **caterer** **—** **we** **provide** **clean** **linens** **if** **ordered**; **no** **allergy** **cert** on **rental** **forks**.",
  ],
  [
    ["gluten free buffet labels"],
    "Buffet cards for gluten-free items.",
    "**Stationery** **is** **caterer** **or** **planner** **—** **we** **don't** **label** **food** **contents**.",
  ],
  [
    ["open flame cooking", "live cooking station"],
    "Live fire cooking under tent edge.",
    "**NFPA** **+** **venue** — **hood** or **outdoor** **offset** required; **our** **fabric** **distance** **rules**.",
  ],
  [
    ["hibachi tent", "teppanyaki"],
    "Hibachi grill in tented reception.",
    "**Grease** **fire** **risk** **—** **vent** **+** **extinguisher** **plan**; **often** **outside** **flap** **or** **uncovered** **corner**.",
  ],
  [
    ["oyster shucking station", "shucker"],
    "Oyster shucker station shell disposal.",
    "**Trash** **+** **ice** **bin** **—** **sharp** **shell** **gloves** **are** **caterer**; **floor** **protection** **from** **wet**.",
  ],
  [
    ["raw bar ice calculator"],
    "How much ice for raw bar?",
    "**Caterer** **rule** **of** **thumb** **—** **we** **rent** **bins** **not** **ice** **math** unless **we** **sell** **ice**.",
  ],
  [
    ["coffee cart", "espresso cart"],
    "Espresso cart power need.",
    "**20–30A+** **often** **—** **vendor** **spec** **sheet**; **house** **power** **may** **fail** **on** **two** **machines**.",
  ],
  [
    ["smoothie bike", "pedal power blender"],
    "Human-powered blender bike.",
    "**Novelty** **—** **availability** **tiny**; **liability** **waiver** **with** **operator** **vendor**.",
  ],
  [
    ["hydration station", "water dispenser refill"],
    "Large water jugs for hydration station.",
    "**Table** **+** **dispenser** **if** **stocked** **—** **jugs** **filled** **by** **caterer** **or** **customer**.",
  ],
];

for (const [k, q, a] of round19) {
  E(k, q, a);
}

const round20 = [
  [
    ["load in dock height", "loading dock clearance"],
    "Loading dock height vs our truck.",
    "Get **dock level**, **bump clearance**, and **freight elevator** dims — **equipment** that **won't** **fit** needs **alternate** **route**.",
  ],
  [
    ["freight elevator weight", "elevator lbs"],
    "Freight elevator weight limit for dance floor panels.",
    "**Scale** **panels** per **vendor** **spec** — **split** **loads** across **trips**; **overloading** **voids** **liability**.",
  ],
  [
    ["bubble wrap floor", "floor protection film"],
    "Temporary floor protection film in venue.",
    "**Venue** **may** **supply** — **we** **tape** **only** per **facility** **rules**; **adhesive** **damage** **fees** risk.",
  ],
  [
    ["marble floor", "historic tile"],
    "Setup on polished marble or historic tile.",
    "**No** **drag** **skids** — **lay** **approved** **protection** first; **crew** **soft** **wheels** **only** **if** **policy** allows.",
  ],
  [
    ["carpet venue", "deep pile carpet"],
    "Ballroom deep-pile carpet — tables sinking.",
    "**Pads** or **ply** **under** **heavy** **bases** if **permitted**; **indentation** **disputes** **→** **venue** **contract**.",
  ],
  [
    ["sprung floor", "dance studio floor"],
    "Dance studio sprung wood floor.",
    "**No** **stakes**, **minimal** **point** **load** — **weights** **and** **wide** **footprints**; **studio** **owner** **sign-off**.",
  ],
  [
    ["ice arena concrete", "rink slab"],
    "Event on de-iced rink slab.",
    "**Slip** **+** **meltwater** **drain** — **subfloor** **for** **guest** **heels**; **rug** **perimeter** **trip** **check**.",
  ],
  [
    ["sand venue", "beach corporate"],
    "Corporate event on compacted sand.",
    "**Weights** **not** **stakes**; **corrosion** **rinse** **plan** for **metal** **bases**; **wind** **exposure** **high**.",
  ],
  [
    ["solar farm field", "utility field"],
    "Event near solar array or utility field.",
    "**Easement** **+** **security** — **may** **be** **off-limits**; **only** **written** **site** **approval**.",
  ],
  [
    ["parking garage ceiling", "low clearance"],
    "Route through low parking garage.",
    "Measure **van** **+** **loaded** **height** — **air** **deflector** down; **one** **wrong** **beam** **hit** **trashes** **schedule**.",
  ],
  [
    ["one way street", "council permit load"],
    "Load on one-way city street — permit?",
    "**Traffic** **plan** is **customer** **or** **city** — **we** **follow** **posted** **cordons** **only**.",
  ],
  [
    ["overnight truck parking", "truck stay on site"],
    "Can delivery truck stay overnight?",
    "**Venue** **and** **city** **ordinance** — **often** **no**; **crew** **returns** **day** **2** unless **contracted** **staging**.",
  ],
  [
    ["dumpster corral", "waste corral"],
    "Hide dumpster with drape or fence.",
    "**Pipe** **drape** **or** **screens** — **odor** **still** **exists**; **don't** **promise** **scent** **control**.",
  ],
  [
    ["compostable plates", "eco disposables"],
    "Only compostable disposables policy.",
    "**Caterer** **choice** — **we** **supply** **tables** **only**; **sorting** **bins** **if** **customer** **orders** **waste** **package**.",
  ],
  [
    ["zero waste event"],
    "Venue requires zero-waste event.",
    "**Hauler** **+** **caterer** **own** **zero-waste** — **rental** **side** **is** **reuse** **of** **our** **inventory**; **no** **foam** **from** **us** **if** **banned**.",
  ],
  [
    ["led bulb color temp", "warm white"],
    "String lights 2700K vs 4000K.",
    "**SKU** **spec** **only** — **don't** **match** **by** **eye** **over** **phone**; **order** **samples** **or** **trust** **inventory** **tag**.",
  ],
  [
    ["dimmer rack string lights"],
    "Dim string lights on dimmer rack.",
    "**Compatibility** **of** **LED** **drivers** — **flicker** **risk**; **AV** **electrician** **sequences** **turn** **on**.",
  ],
  [
    ["battery uplight runtime"],
    "How long do wireless uplights last?",
    "**Manufacturer** **hours** **at** **full** **—** **quote** **spares** **or** **swap** **plan** **for** **long** **receptions**.",
  ],
  [
    ["gobo metal glass", "steel gobo"],
    "Breakup gobo vs custom steel gobo.",
    "**Source** **gobo** **from** **lighting** **vendor** — **size** **for** **fixture** **gate**; **our** **team** **doesn't** **machine** **metal**.",
  ],
  [
    ["followspot operator"],
    "Rent follow spot for awards.",
    "**Licensed** **operator** **+** **fixture** **package** — **usually** **AV** **sub** **vendor**.",
  ],
  [
    ["stinger cable", "socapex"],
    "Socapex / multicable for stage.",
    "**Heavy** **current** **—** **only** **qualified** **distro** **crew**; **customer** **cords** **rejected** **if** **under** **gauge**.",
  ],
  [
    ["distro cam lock"],
    "Cam-lok feeder to distro.",
    "**Company** **truck** **packages** **only** — **tie-in** **at** **venue** **disconnect** **requires** **electrician**.",
  ],
  [
    ["house power tie in"],
    "Tie into building disconnect for event power.",
    "**Licensed** **electrical** **only** — **not** **general** **labor**; **venue** **may** **bill** **for** **tie-in** **window**.",
  ],
  [
    ["parallel generator sync"],
    "Parallel two generators for redundancy.",
    "**Paralleling** **gear** **+** **tech** **—** **not** **two** **gens** **plugged** **together** **ad** **hoc**; **engineer** **signs**.",
  ],
  [
    ["fuel cube", "external fuel tank"],
    "External fuel cube for long generator run.",
    "**UL** **tank** **rules** **+** **spill** **containment** — **permits** **in** **some** **cities**; **refuel** **contract** **hours**.",
  ],
];

for (const [k, q, a] of round20) {
  E(k, q, a);
}

const round21 = [
  [
    ["color run powder", "holi powder"],
    "Color powder run near tent and gear.",
    "**Fine dust** **clogs** **zipper** **and** **blower** **filters** — **avoid** **staging** **in** **throw** **zone**; **charge** **deep** **clean** **if** **exposed**.",
  ],
  [
    ["foam color stain", "colored foam"],
    "Colored foam party stains vinyl or chairs.",
    "**Pigment** **may** **stain** — **contract** **cleaning** **clause**; **test** **patch** **on** **customer** **by** **shop** **only**.",
  ],
  [
    ["slime station kids"],
    "Kids slime-making station near rentals.",
    "**Glue/borax** **spills** — **plastic** **floor** **shield**; **no** **slime** **on** **upholstered** **lounge** **without** **cover**.",
  ],
  [
    ["tie dye station"],
    "Outdoor tie-dye craft station.",
    "**Dye** **splatter** — **downwind** **away** **from** **linens**; **disposable** **table** **covers** **mandatory**.",
  ],
  [
    ["paint and sip", "acrylic pour"],
    "Paint party near rented furniture.",
    "**Drop** **cloths** **+** **no** **carpet** **without** **venue** **OK**; **brush** **water** **bucket** **away** **from** **power**.",
  ],
  [
    ["glitter bar", "body glitter"],
    "Glitter station — cleanup nightmare.",
    "**Microplastic** **+** **venue** **ban** **possible** — **outdoor** **prefer**; **vacuum** **fee** **scheduled** **post-event**.",
  ],
  [
    ["confetti cannon indoor"],
    "Electric confetti cannon indoors.",
    "**Venue** **must** **approve** — **ceiling** **height** **+** **sprinkler** **masking**; **operator** **only**.",
  ],
  [
    ["snow machine faux"],
    "Fake snow machine for party.",
    "**Fluid** **type** **+** **slip** **film** **on** **floor** — **traction** **mats** **near** **dance** **entry**.",
  ],
  [
    ["bubble machine floor"],
    "Bubble fluid makes dance floor slick.",
    "**Stop** **bubbles** **before** **dancing** **or** **reroute** **machine**; **mop** **with** **venue** **chemical** **OK**.",
  ],
  [
    ["co2 jet cryo"],
    "CO2 cryo jets on dance floor.",
    "**Overspray** **cold** **burn** **risk** — **distance** **per** **vendor** **spec**; **alarm** **interlock** **with** **HVAC**.",
  ],
  [
    ["inflatable games mud"],
    "Inflatable obstacle after rain — mud.",
    "**Extra** **tarp** **runway** **to** **blower**; **crew** **may** **delay** **inflate** until **surface** **safe**.",
  ],
  [
    ["dunk tank drain"],
    "Where dunk tank drains after event.",
    "**Sanitary** **vs** **storm** **—** **city** **rules**; **customer** **gets** **permit** **path**; **we** **don't** **dump** **gray** **water** **illegally**.",
  ],
  [
    ["waterslide recycle water"],
    "Water slide recirc pump water dirty.",
    "**Health** **department** **rules** **for** **public** **events** — **cater** **may** **need** **fresh** **fill**.",
  ],
  [
    ["pony ride circle", "petting pen fence"],
    "Temporary fence for pony ring.",
    "**Panel** **fence** **rental** **if** **SKU**; **height** **for** **species**; **liability** **with** **animal** **vendor**.",
  ],
  [
    ["carousel mini", "carnival ride"],
    "Mini carnival ride on grass.",
    "**Level** **pad** **+** **engineering** **stamp** **often** **required**; **not** **our** **ride** **unless** **brokered**.",
  ],
  [
    ["ferris wheel small"],
    "Portable wheel footprint near tent.",
    "**Setback** **from** **stakes** **and** **guy** **wires** — **composite** **layout** **by** **GC** **or** **event** **engineer**.",
  ],
  [
    ["aframe sandwich sign wind"],
    "Sandwich boards blowing over in wind.",
    "**Weights** **or** **lay** **flat** **threshold** **wind**; **injury** **liability** **if** **not** **secured**.",
  ],
  [
    ["yard sign stakes", "directional arrows"],
    "Coroplast signs with stakes in hard ground.",
    "**Pre-soak** **holes** **or** **drill** **pilot** **—** **utility** **strike** **risk**; **811** **already** **cited** **elsewhere**.",
  ],
  [
    ["balloon tie weight", "latex helium"],
    "Helium bunch tie-down weight per balloon.",
    "**Not** **our** **balloon** **SKU** **usually** — **weights** **per** **code** **indoor**; **outdoor** **still** **tether**.",
  ],
  [
    ["piñata indoor"],
    "Piñata indoors under tent.",
    "**Swing** **arc** **clear** **lights** **and** **sprinklers**; **candy** **slip** **—** **broom** **plan**.",
  ],
  [
    ["axe throwing mobile"],
    "Mobile axe lane next to tent.",
    "**Setback** **+** **fencing** **—** **alcohol** **proximity** **rules**; **we** **don't** **operate** **axes**.",
  ],
  [
    ["escape room trailer"],
    "Escape-room trailer parked beside party.",
    "**Separate** **vendor** **cord** **routing** — **clear** **extinguisher** **access** **between** **structures**.",
  ],
  [
    ["photo 360 spinner", "orbit booth"],
    "360 spinner platform weight.",
    "**Distributed** **load** **on** **floor** — **level** **+** **cable** **trip** **hazard** **tape**.",
  ],
  [
    ["silent headphone count"],
    "How many silent-disco headsets to order.",
    "**Peak** **concurrent** **users** **+** **10%** **spares** **—** **frequency** **plan** **by** **vendor**.",
  ],
  [
    ["karaoke license", "ascap karaoke"],
    "Do we need license for karaoke?",
    "**Public** **performance** **of** **recordings** **—** **venue** **license** **or** **customer**; **we** **rent** **mics** **only**.",
  ],
];

for (const [k, q, a] of round21) {
  E(k, q, a);
}

const round22 = [
  [
    ["branded tent top", "logo tent peak"],
    "Print our logo on the tent top.",
    "**Custom** **print** **—** **weeks** **lead** **time** **and** **wind** **rated** **material** **spec**; **only** **office** **quotes** **after** **art** **approval**.",
  ],
  [
    ["mesh banner tent leg", "vinyl leg wrap"],
    "Brand wraps on tent legs.",
    "**Attachment** **without** **piercing** **vinyl** **—** **clips** **or** **sleeves** **per** **shop**; **remove** **before** **strike** **if** **reused**.",
  ],
  [
    ["sponsorship tier a b c"],
    "Sponsor tiers for festival tents.",
    "**Package** **inventory** **bundles** **—** **sales** **lead** **owns** **pricing**; **don't** **verbally** **grant** **category** **exclusivity**.",
  ],
  [
    ["naming rights arch"],
    "Sponsor name on inflatable arch.",
    "**Art** **proof** **+** **manufacturer** **PMS** **match**; **install** **window** **before** **runners** **arrive**.",
  ],
  [
    ["program insert ad"],
    "Can we buy ad space in printed program?",
    "**Not** **our** **publication** **—** **event** **organizer** **or** **charity**; **we** **stay** **vendor** **neutral** **in** **calls**.",
  ],
  [
    ["exclusivity beverage"],
    "Exclusive pour rights with tent package.",
    "**Legal** **with** **beverage** **sponsor** **—** **we** **don't** **negotiate** **exclusivity** **clauses** **as** **equipment** **vendor**.",
  ],
  [
    ["competitor gear on site"],
    "Another rental company's chairs in same room.",
    "**Customer** **choice** **—** **don't** **trash** **competitors**; **coordinate** **layout** **conflicts** **with** **planner**.",
  ],
  [
    ["coi competing vendor"],
    "Venue wants our COI because other vendor lacks.",
    "**We** **provide** **only** **our** **policy** **—** **don't** **cover** **other** **vendor's** **omissions**.",
  ],
  [
    ["damage who pays mixed rental"],
    "Chair damaged — two rental companies on site.",
    "**Tag** **with** **your** **asset** **ID** **at** **delivery** **photos**; **dispute** **goes** **billing** **with** **evidence**.",
  ],
  [
    ["ghost vendor no show"],
    "Other vendor never showed — can we fill in cheap?",
    "**Surge** **pricing** **still** **follows** **rate** **card** **unless** **manager** **authorizes** **goodwill**; **no** **shade** **at** **fellow** **vendor**.",
  ],
  [
    ["load grid shared dock"],
    "Shared loading dock schedule tight.",
    "**15-minute** **slots** **—** **missed** **slot** **may** **bump** **to** **night** **load** **fee**; **dispatcher** **plans** **truck** **stack**.",
  ],
  [
    ["dock supervisor signature"],
    "Dock supervisor must sign bill of lading.",
    "**Driver** **obtains** **signature** **photo** **—** **customer** **proxy** **only** **if** **pre-approved** **in** **writing**.",
  ],
  [
    ["lift gate broken truck"],
    "Truck lift-gate failed at delivery.",
    "**Alternate** **offload** **plan** **—** **fork** **on** **site** **or** **manual** **team** **OT**; **document** **equipment** **failure** **for** **fleet**.",
  ],
  [
    ["vehicle height bridge"],
    "Low bridge on GPS route to venue.",
    "**Commercial** **vehicle** **height** **card** **in** **cab** **—** **reroute** **before** **strike** **clearance** **issue**.",
  ],
  [
    ["overwidth permit escort"],
    "Wide load permit for truss.",
    "**DOT** **escort** **cars** **—** **customer** **pays** **permit** **or** **included** **in** **heavy** **haul** **quote** **only** **if** **stated**.",
  ],
  [
    ["crew hotel block"],
    "Out-of-town crew hotel rooms.",
    "**Per** **diem** **contract** **line** **—** **not** **auto** **in** **local** **quote**; **travel** **package** **by** **estimating**.",
  ],
  [
    ["crew meal buyout"],
    "Client wants to cater crew lunch on site.",
    "**Accept** **if** **no** **delay** **to** **install** **—** **OSHA** **rest** **still** **required**; **dispatch** **communicates** **break** **windows**.",
  ],
  [
    ["union steward site"],
    "Union steward stops our unload.",
    "**Stop** **work** **politely** **—** **call** **dispatcher** **+** **customer** **GC**; **don't** **argue** **jurisdiction** **on** **dock**.",
  ],
  [
    ["right to work state"],
    "We're in right-to-work state — union?",
    "**Venue** **CBAs** **still** **bind** **labor** **rules** **on** **that** **property** **—** **don't** **give** **legal** **labor** **advice**.",
  ],
  [
    ["tip pool house"],
    "Venue adds mandatory service charge.",
    "**Transparent** **in** **customer** **invoice** **—** **not** **our** **line** **item** **unless** **we** **collect** **as** **pass-through** **per** **contract**.",
  ],
  [
    ["service charge tax"],
    "Is service charge taxable?",
    "**Accounting** **rule** **by** **state** **—** **quote** **subtotal** **and** **let** **finance** **apply** **tax** **matrix**.",
  ],
  [
    ["gratuity auto event"],
    "Auto gratuity for large event staff.",
    "**If** **labor** **is** **ours**, **policy** **defines** **%;** **if** **caterer's**, **not** **our** **conversation**.",
  ],
  [
    ["cash bar kit"],
    "Rent cash-drawer lockbox for bar.",
    "**Security** **—** **armored** **pickup** **not** **included**; **venue** **liquor** **license** **holder** **owns** **cash** **controls**.",
  ],
  [
    ["id scanner rental"],
    "ID scanner for 21+ wristband.",
    "**Compliance** **tool** **—** **buy** **through** **approved** **vendor** **if** **we** **don't** **stock**; **privacy** **policy** **for** **data**.",
  ],
  [
    ["wristband color meaning"],
    "Color wristbands for drink tiers.",
    "**Customer** **prints** **legend** **signs** **—** **we** **may** **supply** **unprinted** **bands** **only** **if** **SKU** **exists**.",
  ],
];

for (const [k, q, a] of round22) {
  E(k, q, a);
}

const round23 = [
  [
    ["inventory serial", "asset tag photo"],
    "Customer wants serial photos of chairs delivered.",
    "**Delivery** **photos** **per** **policy** **—** **asset** **tags** in **frame**; **no** **warehouse** **screenshots** **of** **unrelated** **stock**.",
  ],
  [
    ["color batch dye lot"],
    "Linens must match dye lot from last year.",
    "**New** **order** **may** **differ** **slightly** **—** **swatch** **compare** **or** **fresh** **full** **set** **quote**; **don't** **promise** **perfect** **match**.",
  ],
  [
    ["spandex wrinkle steam"],
    "Can you steam spandex covers on site?",
    "**Heat** **limits** **on** **stretch** **fabric** **—** **only** **trained** **linen** **tech** **per** **shop**; **burn** **risk**.",
  ],
  [
    ["velvet nap crush"],
    "Crushed velvet nap marks after folding.",
    "**Steam** **hang** **time** **—** **not** **guaranteed** **perfect** **before** **guest** **photos**; **planner** **buffers** **timing**.",
  ],
  [
    ["sequin linen shedding"],
    "Sequin tablecloth shedding glitter.",
    "**Indoor** **cleanup** **fee** **possible**; **outdoor** **wind** **amplifies** **loss** **—** **disclose** **shed** **risk**.",
  ],
  [
    ["mirror table scratch"],
    "Mirror top table scratched after event.",
    "**PHOTOS** **at** **delivery** **vs** **pickup** **—** **cover** **during** **use** **rules** **in** **contract**; **avoid** **guess** **on** **fault**.",
  ],
  [
    ["acrylic ghost chair scratch"],
    "Clear chairs look scuffed — charge?",
    "**Many** **show** **micro** **marks** **under** **light** **—** **set** **expectation** **at** **booking**; **damage** **vs** **wear** **by** **manager**.",
  ],
  [
    ["resin chair weight limit"],
    "Can two people sit on one resin folding?",
    "**No** **—** **one** **rated** **occupant** **per** **chair**; **collapse** **injury** **and** **damage** **risk**.",
  ],
  [
    ["banquet table brace"],
    "Long banquet table sagging in middle.",
    "**Leg** **brace** **or** **center** **support** **SKU** **required** **beyond** **span** **limit** **—** **layout** **from** **spec** **sheet**.",
  ],
  [
    ["folding table hinge pinch"],
    "Kid pinched finger in folding table hinge.",
    "**First** **aid** **—** **document** **—** **supervise** **kids** **around** **setup**; **OSHA** **≠** **party** **but** **empathy** **and** **report**.",
  ],
  [
    ["glass top table wind"],
    "Glass tabletop outdoor — wind flip risk?",
    "**Remove** **or** **lower** **if** **gust** **forecast** **high** **—** **shatter** **hazard**; **weights** **on** **base** **only** **per** **design**.",
  ],
  [
    ["umbrella hole grommet table"],
    "Patio table umbrella hole vs our linen.",
    "**Cut** **linen** **only** **if** **sold** **as** **custom** **—** **stock** **may** **not** **fit** **center** **hole** **without** **alteration** **fee**.",
  ],
  [
    ["charger plate stack height"],
    "How high can we stack chargers in crate?",
    "**Mfg** **carton** **limit** **—** **chip** **edges** **if** **overstacked**; **driver** **refuses** **unsafe** **load**.",
  ],
  [
    ["flatware count missing forks"],
    "Returned flatware short 12 forks.",
    "**Count** **sheet** **at** **check-in** — **replace** **loss** **per** **schedule** **fee**; **no** **instant** **accusation** **of** **theft**.",
  ],
  [
    ["china chip ring edge"],
    "Small chip on plate rim — still usable?",
    "**Pull** **from** **service** **set** **—** **guest** **cut** **risk**; **damage** **bucket** **for** **shop** **repair** **or** **scrap**.",
  ],
  [
    ["stemware polish streak"],
    "Wine glasses look streaky from dishwasher.",
    "**Polish** **cloth** **finish** **for** **high** **end** **—** **time** **labor** **line** **if** **contracted**; **tap** **water** **spots** **vs** **lip** **stick**.",
  ],
  [
    ["thermos coffee urn drip"],
    "Coffee urn tap drips on linen.",
    "**Drip** **tray** **required** **—** **replace** **faulty** **spigot** **before** **event** **if** **found** **at** **prep**.",
  ],
  [
    ["chafing dish wind outdoor"],
    "Chafing dishes won't stay lit outdoors.",
    "**Wind** **guard** **or** **move** **under** **sidewall** **flap** **—** **open** **flame** **ban** **may** **force** **electric** **chafer**.",
  ],
  [
    ["percolator coffee weak"],
    "Percolator coffee too weak for crowd.",
    "**Ratio** **is** **caterer** **recipe** **—** **we** **rent** **urn** **capacity** **not** **taste** **QA**.",
  ],
  [
    ["popcorn grease floor"],
    "Popcorn machine grease on dance floor.",
    "**Absorbent** **+** **degrease** **approved** **by** **venue** **floor** **warranty** **—** **cleaning** **fee**.",
  ],
  [
    ["sno cone syrup sticky turf"],
    "Syrup on artificial turf after snow cones.",
    "**Rinse** **plan** **—** **turf** **may** **stain** **sweet** **dye**; **mat** **under** **machine** **mandatory**.",
  ],
  [
    ["hot dog roller grease trap"],
    "Grease overflow from roller grill.",
    "**Empty** **trap** **between** **shifts** **—** **fire** **risk** **if** **ignored**; **operator** **training** **card** **on** **file**.",
  ],
  [
    ["nacho cheese burn"],
    "Guest burned on nacho cheese pump.",
    "**First aid** **if** **needed** — **document**; **machine** **shield** **and** **warning** **sign** **per** **vendor** **manual** **placement**.",
  ],
  [
    ["slush machine alcohol"],
    "Customer wants to pour vodka in slush machine.",
    "**Licensed** **operator** **+** **recipe** **from** **manufacturer** **—** **we** **don't** **authorize** **ad** **hoc** **abuse** **of** **equipment**.",
  ],
  [
    ["cotton candy sugar ants"],
    "Ants swarmed cotton candy cart.",
    "**Close** **carts** **overnight** **—** **pest** **is** **site** **issue** **for** **perimeter** **treatment** **—** **not** **instant** **our** **fix**.",
  ],
];

for (const [k, q, a] of round23) {
  E(k, q, a);
}

const round24 = [
  [
    ["tent sidewall mud line", "mud wicking"],
    "Mud wicking up tent sidewall fabric.",
    "**Perimeter** **drainage** **or** **french** **channel** **—** **don't** **promise** **bone-dry** **edge** **in** **heavy** **rain**; **floor** **cover** **ridge**.",
  ],
  [
    ["gutter tent rain"],
    "Rain gutter between two tents.",
    "**Engineered** **valley** **—** **only** **shop** **SKU** **+** **install**; **DIY** **tarps** **void** **wind** **rating**.",
  ],
  [
    ["snow load tent"],
    "How much snow can tent hold?",
    "**Engineering** **table** **per** **model** **—** **never** **guess** **inches**; **melt/refreeze** **ice** **adds** **load**.",
  ],
  [
    ["frost on vinyl tent"],
    "Morning frost on clear tent windows.",
    "**Normal** **condensation** **cycle** **—** **don't** **scrape** **with** **metal**; **vents** **may** **help** **overnight**.",
  ],
  [
    ["condensation drip stage"],
    "Water dripping on stage from tent roof.",
    "**Cold** **night** **+** **warm** **body** **heat** **below** **—** **liner** **gap** **or** **dehumid** **plan** **with** **coordinator**.",
  ],
  [
    ["center pole dance floor"],
    "Center pole in middle of dance floor.",
    "**Pole** **tent** **layout** **math** **—** **may** **need** **frame** **tent** **or** **smaller** **dance** **ring** **around** **pole** **cover**.",
  ],
  [
    ["subfloor height door threshold"],
    "Raised subfloor blocks ballroom door.",
    "**ADA** **threshold** **ramps** **—** **measure** **door** **swing** **before** **build**; **fire** **door** **must** **close**.",
  ],
  [
    ["marquee entrance tent"],
    "Small entrance marquee before main tent.",
    "**Connector** **tunnel** **rain** **plan** **—** **puddle** **mat** **+** **lighting** **transition**.",
  ],
  [
    ["revolving door venue"],
    "Load through hotel revolving door.",
    "**Crew** **uses** **service** **entrance** **—** **panels** **don't** **fit** **revolver**; **coordinate** **dock** **with** **CS**.",
  ],
  [
    ["service elevator size"],
    "Will dance floor panels fit service elevator?",
    "**Diagonal** **and** **weight** **limit** **—** **dry** **run** **measure** **during** **site** **visit** **photo** **with** **tape**.",
  ],
  [
    ["basement load narrow stair"],
    "Basement ballroom via narrow stairs only.",
    "**Hand** **carry** **labor** **hours** **—** **quote** **extra** **porter** **time**; **no** **guarantee** **all** **SKUs** **fit**.",
  ],
  [
    ["rooftop terrace weight"],
    "Rooftop terrace structural limit.",
    "**Engineer** **letter** **per** **venue** **—** **ballast** **only** **if** **stakes** **forbidden**; **we** **don't** **sign** **structural** **approvals**.",
  ],
  [
    ["courtyard no truck access"],
    "Courtyard event — trucks can't enter.",
    "**Hand** **cart** **distance** **from** **street** **—** **time** **buffer** **large**; **customer** **permits** **closures**.",
  ],
  [
    ["barge river event"],
    "Equipment to riverfront via barge.",
    "**Marine** **logistics** **vendor** **—** **out** **of** **standard** **truck** **quote** **unless** **brokered**.",
  ],
  [
    ["ferry island wedding"],
    "Island venue — ferry schedule for strike.",
    "**Last** **boat** **cutoff** **—** **crews** **may** **need** **overnight** **hold** **or** **two-day** **rent** **in** **contract**.",
  ],
  [
    ["national park permit"],
    "Event in national park boundary.",
    "**NPS** **permit** **window** **tiny** **—** **only** **bid** **after** **written** **park** **approval**; **Leave** **No** **Trace** **rules**.",
  ],
  [
    ["wilderness fire ban"],
    "Open fire ban — propane heat still okay?",
    "**County** **stage** **level** **ban** **—** **don't** **interpret** **law**; **electric** **heat** **only** **if** **signed** **OK**.",
  ],
  [
    ["lightning hold protocol"],
    "Corporate picnic lightning hold — deflate inflatables?",
    "**Manufacturer** **+** **company** **storm** **SOP** **—** **guests** **evac** **to** **cars** **or** **building** **first**.",
  ],
  [
    ["heat illness guest"],
    "Guest heat exhaustion at outdoor tent.",
    "**911** **if** **altered** **mental** **status** **—** **shade/water** **while** **waiting**; **our** **staff** **are** **not** **medics**.",
  ],
  [
    ["hypothermia spring event"],
    "Cold spring rain — guest shivering.",
    "**Warmer** **rental** **or** **move** **indoors** **fragment** **—** **not** **fault** **debate** **on** **phone**.",
  ],
  [
    ["bee swarm tent peak"],
    "Bees clustering at tent peak daylight.",
    "**Keep** **guests** **clear** **—** **professional** **removal** **or** **wait** **till** **they** **move**; **don't** **spray** **pesticide** **on** **our** **vinyl** **without** **shop** **OK**.",
  ],
  [
    ["bird nest tent leg"],
    "Bird nested in folded leg before deploy.",
    "**Wildlife** **rules** **may** **forbid** **disturb** **during** **season** **—** **swap** **leg** **or** **delay** **with** **biologist** **advice**.",
  ],
  [
    ["snake under deck"],
    "Snake sighting under staging.",
    "**Stop** **work** **near** **—** **animal** **control**; **crew** **doesn't** **capture** **venomous** **species**.",
  ],
  [
    ["flash flood arroyo"],
    "Desert wash flash flood risk venue.",
    "**NO** **setup** **in** **active** **channel** **—** **alternate** **pad** **elevation** **map** **mandatory**.",
  ],
  [
    ["tidal beach event"],
    "Beach tent near tide line.",
    "**Tide** **chart** **in** **contract** **—** **strike** **before** **surge** **reaches** **ballast**; **salt** **rinse** **gear** **after**.",
  ],
];

for (const [k, q, a] of round24) {
  E(k, q, a);
}

const header = `/* eslint-disable max-len */
/**
 * AUTO-GENERATED by scripts/gen-staff-assistant-qna.js — do not edit by hand.
 * Run: node scripts/gen-staff-assistant-qna.js
 */
module.exports.STAFF_ASSISTANT_QNA_ENTRIES = `;

const footer = `;

module.exports.STAFF_ASSISTANT_QNA_VERSION = 25;
`;

fs.writeFileSync(outPath, header + JSON.stringify(blocks, null, 2) + footer, "utf8");
console.log("Wrote", blocks.length, "entries to", outPath);
