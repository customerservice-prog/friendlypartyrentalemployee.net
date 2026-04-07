
// FPR Training Hub — local assistant (no API key): pricing-FAQ retrieval + keyword topics.
// Loads /api/employee/pricing-faq once (signed-in employees) for quiz-accurate quotes.
(function() {
  'use strict';
  if (window._FPR_BOOTSTRAPPED) return;
  window._FPR_BOOTSTRAPPED = true;

  /** Avoid false positives like "hi" in "this", "tent" in "intent", or "315" inside longer numbers. */
  function tokenMatches(msg, token) {
    var t = String(token).toLowerCase();
    if (t.indexOf(' ') !== -1) {
      return msg.indexOf(t) !== -1;
    }
    if (/^\d+$/.test(t)) {
      return new RegExp('(^|[^0-9])' + t + '([^0-9]|$)').test(msg);
    }
    var esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var plural = t.length >= 4 ? 's?' : '';
    return new RegExp(
      '(^|[^a-z0-9])' + esc + plural + '([^a-z0-9]|$)',
      'i'
    ).test(msg);
  }

  function patternMatches(msg, tokens) {
    for (var j = 0; j < tokens.length; j++) {
      if (tokenMatches(msg, tokens[j])) return true;
    }
    return false;
  }

  var STOP_WORDS = {
    the: 1, and: 1, for: 1, are: 1, but: 1, not: 1, you: 1, all: 1, can: 1,
    was: 1, one: 1, our: 1, out: 1, day: 1, get: 1, has: 1, his: 1, how: 1,
    its: 1, may: 1, new: 1, now: 1, see: 1, two: 1, who: 1, did: 1, let: 1,
    put: 1, say: 1, she: 1, too: 1, use: 1, any: 1, ask: 1, way: 1, could: 1,
    would: 1, should: 1, from: 1, they: 1, them: 1, this: 1, that: 1, with: 1,
    have: 1, will: 1, your: 1, what: 1, when: 1, where: 1, which: 1, does: 1,
    about: 1, into: 1, just: 1, over: 1, also: 1, back: 1, after: 1, work: 1,
    here: 1, only: 1, come: 1, some: 1, call: 1, take: 1, tell: 1, want: 1,
    need: 1, help: 1, give: 1, much: 1, many: 1, customer: 1, customers: 1,
    staff: 1, employee: 1, train: 1, training: 1, their: 1, there: 1, then: 1,
    than: 1, been: 1, being: 1, ever: 1, even: 1, each: 1, both: 1, most: 1,
    other: 1, such: 1, very: 1, well: 1, were: 1, had: 1, her: 1, him: 1,
  };

  function allDimsIn(str) {
    var s = String(str).toLowerCase();
    var out = [];
    var seen = {};
    var re = /(\d+)\s*['′']?\s*x\s*(\d+)/gi;
    var m;
    while ((m = re.exec(s)) !== null) {
      var key = m[1] + 'x' + m[2];
      if (!seen[key]) {
        seen[key] = 1;
        out.push(key);
      }
    }
    return out;
  }

  function extractFaqTerms(userMessage) {
    var msg = (userMessage || '').toLowerCase();
    var dims = allDimsIn(msg);
    var words = msg.split(/[^a-z0-9]+/).filter(function(w) {
      return w.length >= 3 && !STOP_WORDS[w];
    });
    var uniq = {};
    var w2 = [];
    for (var i = 0; i < words.length; i++) {
      if (!uniq[words[i]]) {
        uniq[words[i]] = 1;
        w2.push(words[i]);
      }
    }
    return { dims: dims, words: w2 };
  }

  function compactDims(str) {
    return String(str)
      .toLowerCase()
      .replace(/['′\s]/g, '')
      .replace(/×/g, 'x');
  }

  function scoreFaqRow(terms, row) {
    var hay = (row.s + ' ' + row.q + ' ' + row.answer).toLowerCase();
    var cHay = compactDims(hay);
    var score = 0;
    var dimHit = false;
    var d;
    for (d = 0; d < terms.dims.length; d++) {
      var dc = compactDims(terms.dims[d]);
      if (dc && cHay.indexOf(dc) !== -1) {
        score += 14;
        dimHit = true;
      }
    }
    var w;
    for (w = 0; w < terms.words.length; w++) {
      if (tokenMatches(hay, terms.words[w])) {
        score += 2;
      }
    }
    return { score: score, dimHit: dimHit };
  }

  function priceIntentMsg(userMessage) {
    return /how\s+much|price|pricing|cost|quote|rent\s+for|rental\s+price|\$/i.test(
      String(userMessage || '')
    );
  }

  function scoreStaffEntry(terms, userMsgLower, entry) {
    var hay = (entry.k.join(' ') + ' ' + entry.q + ' ' + entry.a).toLowerCase();
    var cHay = compactDims(hay);
    var score = 0;
    var dimHit = false;
    var d;
    for (d = 0; d < terms.dims.length; d++) {
      var dc = compactDims(terms.dims[d]);
      if (dc && cHay.indexOf(dc) !== -1) {
        score += 12;
        dimHit = true;
      }
    }
    var w;
    for (w = 0; w < terms.words.length; w++) {
      if (tokenMatches(hay, terms.words[w])) {
        score += 2;
      }
    }
    var i;
    for (i = 0; i < entry.k.length; i++) {
      var kw = entry.k[i];
      if (typeof kw !== 'string') continue;
      var kl = kw.toLowerCase();
      if (kl.indexOf(' ') !== -1) {
        if (userMsgLower.indexOf(kl) !== -1) {
          score += 6;
        }
      } else if (tokenMatches(userMsgLower, kl)) {
        score += 5;
      }
    }
    return { score: score, dimHit: dimHit };
  }

  function formatStaffAnswer(entry) {
    return (
      '**Training library** (staff Q&A)\n\n**Scenario:** ' +
      entry.q +
      '\n**Suggested reply:** ' +
      entry.a +
      '\n\n_Confirm with a manager when liability, contracts, or live pricing are in play._'
    );
  }

  /** Search official pricing + ~100+ staff training entries before pattern fallback. */
  function tryUnifiedKnowledgeAnswer(userMessage) {
    var rows = window.__FPR_PRICING_FAQ;
    var staff = window.__FPR_STAFF_QNA;
    if ((!rows || !rows.length) && (!staff || !staff.length)) return null;
    rows = rows || [];
    staff = staff || [];
    var terms = extractFaqTerms(userMessage);
    if (terms.words.length === 0 && terms.dims.length === 0) return null;
    var userMsgLower = String(userMessage || '').toLowerCase();
    var wantPrice = priceIntentMsg(userMessage);
    var candidates = [];
    var i;
    var sc;
    for (i = 0; i < rows.length; i++) {
      sc = scoreFaqRow(terms, rows[i]);
      if (sc.score > 0) {
        var pScore = sc.score + (wantPrice ? 3 : 0);
        candidates.push({
          kind: 'p',
          score: pScore,
          dimHit: sc.dimHit,
          row: rows[i],
        });
      }
    }
    for (i = 0; i < staff.length; i++) {
      sc = scoreStaffEntry(terms, userMsgLower, staff[i]);
      if (sc.score > 0) {
        candidates.push({
          kind: 's',
          score: sc.score,
          dimHit: sc.dimHit,
          entry: staff[i],
        });
      }
    }
    if (!candidates.length) return null;
    candidates.sort(function(a, b) {
      return b.score - a.score;
    });
    var best = candidates[0];
    if (wantPrice && best.kind === 's') {
      var alt = null;
      for (i = 0; i < candidates.length; i++) {
        if (candidates[i].kind === 'p' && candidates[i].score >= best.score - 4) {
          if (!alt || candidates[i].score > alt.score) {
            alt = candidates[i];
          }
        }
      }
      if (alt) {
        best = alt;
      }
    }
    var minAccept = best.dimHit ? 5 : 7;
    if (best.kind === 's') {
      minAccept = Math.max(minAccept, 6);
    }
    if (terms.words.length >= 4 && best.score >= 8) {
      minAccept = Math.min(minAccept, 6);
    }
    if (best.score < minAccept) return null;
    var bestScore = best.score;
    var top = [best];
    for (var j = 1; j < candidates.length && top.length < 3; j++) {
      if (
        candidates[j].score >= bestScore - 2 &&
        candidates[j].score >= minAccept
      ) {
        top.push(candidates[j]);
      }
    }
    if (top.length === 1) {
      if (top[0].kind === 'p') {
        var row = top[0].row;
        return (
          'From the **official pricing training** (' +
          row.s +
          '):\n\n**Q:** ' +
          row.q +
          '\n**Answer to quote:** **' +
          row.answer +
          '**\n\nIf this is not an exact fit, confirm with a manager or the live catalog before promising a price.'
        );
      }
      return formatStaffAnswer(top[0].entry);
    }
    var parts = [];
    var k;
    for (k = 0; k < top.length; k++) {
      if (top[k].kind === 'p') {
        var rk = top[k].row;
        parts.push(
          '• **' + rk.s + '** (pricing) — ' + rk.q + ' → **' + rk.answer + '**'
        );
      } else {
        parts.push(
          '• (training) **' + top[k].entry.q + '** — ' + top[k].entry.a
        );
      }
    }
    return (
      'Closest **training matches** (pick what fits):\n\n' +
      parts.join('\n\n') +
      '\n\nConfirm details before quoting or promising policy.'
    );
  }

  window.__FPR_PRICING_FAQ = window.__FPR_PRICING_FAQ || null;
  window.__FPR_STAFF_QNA = window.__FPR_STAFF_QNA || null;
  window.__FPR_ASSISTANT_KB_PROMISE = window.__FPR_ASSISTANT_KB_PROMISE || null;

  window.FPR_PRICING_FAQ_LOAD = function() {
    if (window.__FPR_ASSISTANT_KB_DONE) {
      return Promise.resolve();
    }
    if (window.__FPR_ASSISTANT_KB_PROMISE) {
      return window.__FPR_ASSISTANT_KB_PROMISE;
    }
    window.__FPR_ASSISTANT_KB_PROMISE = fetch(
      '/api/employee/assistant-knowledge',
      { credentials: 'same-origin' }
    )
      .then(function(res) {
        if (!res.ok) {
          throw new Error('assistant-knowledge_http_' + res.status);
        }
        return res.json();
      })
      .then(function(data) {
        window.__FPR_PRICING_FAQ =
          data && Array.isArray(data.pricingRows) ? data.pricingRows : [];
        window.__FPR_STAFF_QNA =
          data && Array.isArray(data.staffQna) ? data.staffQna : [];
        window.__FPR_ASSISTANT_KB_DONE = true;
      })
      .catch(function() {
        window.__FPR_PRICING_FAQ = [];
        window.__FPR_STAFF_QNA = [];
      })
      .finally(function() {
        window.__FPR_ASSISTANT_KB_PROMISE = null;
      });
    return window.__FPR_ASSISTANT_KB_PROMISE;
  };

  /**
   * Fast path: official pricing rows + staff Q&A only (no pattern fallback).
   * Call after FPR_PRICING_FAQ_LOAD() so KB is populated.
   */
  window.FPR_TRY_KNOWLEDGE_LOOKUP = function(userMessage) {
    return tryUnifiedKnowledgeAnswer(userMessage);
  };

  /** Client-side cap so a stuck OpenAI call does not freeze the UI (server may wait longer). */
  var CHAT_FETCH_MS = 65000;

  window.FPR_ASSISTANT_REPLY = async function(messages) {
    var signal = null;
    var to = null;
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      signal = AbortSignal.timeout(CHAT_FETCH_MS);
    } else {
      var ctl = new AbortController();
      to = setTimeout(function() {
        ctl.abort();
      }, CHAT_FETCH_MS);
      signal = ctl.signal;
    }
    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages }),
        signal: signal,
      });
      if (to) clearTimeout(to);
      var data = await res.json().catch(function() {
        return {};
      });
      if (res.status === 403) {
        return {
          ok: false,
          content: null,
          status: 403,
          message:
            data.message ||
            'The training assistant is paused while you have a quiz in progress.',
        };
      }
      if (
        res.ok &&
        data.message &&
        typeof data.message.content === 'string'
      ) {
        var c = data.message.content.trim();
        return {
          ok: true,
          content: c || '(No response)',
          status: res.status,
        };
      }
      return {
        ok: false,
        content: null,
        status: res.status,
        message: data.message || '',
      };
    } catch (err) {
      if (to) clearTimeout(to);
      var aborted =
        err &&
        (err.name === 'AbortError' ||
          err.name === 'TimeoutError' ||
          String(err.message || '').indexOf('aborted') !== -1);
      return {
        ok: false,
        content: null,
        status: 0,
        message: aborted
          ? 'Assistant request timed out.'
          : '',
        error: aborted ? 'timeout' : 'network',
      };
    }
  };

  window.FPR_LOCAL_AI = function(userMessage) {
    var msg = (userMessage || '').toLowerCase();
    var faqHit = tryUnifiedKnowledgeAnswer(userMessage);
    if (faqHit) return faqHit;

    var patterns = [
      {t:['phone','315','call us','contact number'],r:'Our phone is **315-884-1498**. Email: customerservice@friendlypartyrental.com. Address: 330 Costello Parkway, Minoa, NY 13116.'},
      {t:['address','location','where are you','costello','minoa'],r:'We are at **330 Costello Parkway, Minoa, NY 13116**. Serving Syracuse and surrounding Central New York.'},
      {t:['email','customerservice'],r:'Email: **customerservice@friendlypartyrental.com** · Phone: 315-884-1498'},
      {t:['website','online catalog','friendlypartyrental.com','web site'],r:'Customers can browse and book at **friendlypartyrental.com** — order-by-date flow: friendlypartyrental.com/order-by-date'},
      {t:['hours','open','closed','when do you close'],r:'Give the customer **315-884-1498** or email customerservice@friendlypartyrental.com for current hours and availability. Do not invent store hours.'},
      {t:['discount','coupon','save20','promo code'],r:'Use code **SAVE20** at checkout for a discount! We also offer package deals for additional savings.'},
      {t:['tent','tents','canopy','canopies','pole tent','frame tent'],r:'Tents in training include **20x20 through large pole/frame sizes** plus EZ pop-up canopies. For **exact rent prices**, ask the local assistant after sign-in (it loads the pricing quiz) or check your pricing study materials.\n\nSetup & takedown: professional crew. Quote: **315-884-1498**.'},
      {t:['table','tables','banquet','round table','cocktail table'],r:'Tables: 6ft rectangular, 5ft round, 8ft banquet/cocktail styles — **exact dollar amounts** are in the pricing training; use the assistant lookup or quiz cards when signed in.\n\nCall **315-884-1498** for bundles.'},
      {t:['chair','chairs','seating','throne','chiavari','folding chair'],r:'Chairs: standard/resin folding, throne, chiavari, etc. **Prices are in official training** — signed-in lookup pulls quiz-accurate figures.\n\n**315-884-1498**'},
      {t:['bounce house','waterslide','inflatable','obstacle','moonwalk'],r:'Bounce houses, waterslides, obstacle courses — **Safety #1**, inspected before every rental. Sizes/themes: get details and pricing from training or **315-884-1498**.'},
      {t:['linen','tablecloth','chair cover','runner'],r:'Linens: colors, tablecloths, chair covers, runners. Pricing is itemized in training; confirm color availability with the shop.\n\n**315-884-1498**'},
      {t:['concession','popcorn','cotton candy','snow cone','nacho','hot dog','sno cone'],r:'Concessions: popcorn, cotton candy, snow cone, hot dog steamer, nacho machines! **315-884-1498** for packages.'},
      {t:['package','bundle','combo'],r:'Package deals bundle tables + chairs + tent + linens for savings. Build quotes with a manager or **315-884-1498**.'},
      {t:['dance floor','dancing','dancefloor'],r:'Dance floor sections (incl. portable/LED) — sizes and rates are in pricing training.\n\n**315-884-1498**'},
      {t:['generator','power','watts'],r:'Generator rentals for outdoor events — sizing depends on load. Escalate technical sizing to the shop or **315-884-1498**.'},
      {t:['photo booth','photobooth'],r:'Photo booth rentals for weddings and parties. **315-884-1498**'},
      {t:['foam machine','foam party'],r:'Foam machine rentals for foam parties! **315-884-1498**.'},
      {t:['movie screen','outdoor movie','projector'],r:'Inflatable movie screen rentals for outdoor movie nights. **315-884-1498**.'},
      {t:['lighting','lights','uplighting','string light','market light'],r:'Lighting: string lights, uplighting, LED, spots. **315-884-1498** for layout help.'},
      {t:['heater','heating','cooling','air condition','fan','propane heater'],r:'Heating & cooling: propane/electric heaters, fans, portables. **315-884-1498**'},
      {t:['yard game','cornhole','jenga','bocce','ladder toss'],r:'Yard games: cornhole, Giant Jenga, ladder toss, bocce. **315-884-1498**.'},
      {t:['stage','riser','platform'],r:'Staging/portable sections — confirm inventory and pricing with the shop or **315-884-1498**.'},
      {t:['bar','portable bar','beverage'],r:'Portable bars & serving pieces — check availability and add-on pricing in training or with **315-884-1498**.'},
      {t:['tuxedo','suit rental'],r:'If they mean **party equipment**, steer to our rental catalog. For formalwear tux shops, that is a different industry — politely clarify what they need.'},
      {t:['deliver','delivery','setup','pick up','pickup','strike'],r:'**We deliver, set up, and pick up.** Same-day weekend options may be available depending on schedule—confirm with dispatch/shop, not from memory.\n\nScript: “We’ll confirm delivery window and setup time with our team.”'},
      {t:['same day','last minute','rush','tomorrow'],r:'Rush and same-day depend on **inventory and crew**. Take the request, then check with the shop or manager before promising.\n\n**315-884-1498**'},
      {t:['book','reserve','reservation','order online','hold date'],r:'Booking: **friendlypartyrental.com/order-by-date** or call **315-884-1498**. Walk them through dates + items; double-check availability.'},
      {t:['price','pricing','cost','how much','quote','estimate'],r:'For **quiz-accurate list prices**, use this assistant while signed in (it matches the official pricing training) or quote from your study materials.\n\nIf unsure: “Let me confirm that figure with our price list / manager before I lock it in.” **315-884-1498**'},
      {t:['deposit','down payment','pay upfront'],r:'Deposit/payment rules vary by order — **do not invent terms**. Say: “I’ll confirm the deposit schedule for your items and date with our office.” Escalate to **315-884-1498** or a manager.'},
      {t:['cancel','cancellation','refund','rain check'],r:'Cancellation and refund policy — **quote only what training/manager provides**. Default script: “I want to get the policy exactly right for your contract—I'll confirm with our office.” **315-884-1498**'},
      {t:['damage','broken','missing','stolen','not working'],r:'Stay calm and empathetic. **Do not admit fault or promise insurance outcomes.** “I'm sorry that happened—I'm going to document this and have our team follow up.” Escalate per company procedure.'},
      {t:['complaint','angry','upset','terrible','unacceptable','speak to manager'],r:'Listen first. “I’m really sorry you’re dealing with this—I’m here to help.” Gather facts (order #, date, items). **Do not argue or guarantee refunds.** Offer manager callback / **315-884-1498**.'},
      {t:['competitor','someone else cheaper','other company'],r:'Stay professional. Highlight **clean equipment, on-time delivery, full setup**, and Google reputation—never bash competitors. Offer manager/owner follow-up on large deals.'},
      {t:['insurance','liability','permit','certificate'],r:'Permits, COI, and liability questions are **not** guesswork. “I’ll have our coordinator confirm what we can provide for your venue.” Route to **315-884-1498** / manager.'},
      {t:['how many people','guest count','capacity','head count'],r:'Capacity depends on tent size, layout, and tables—use company layout guides or ask a lead for layout math. **315-884-1498** for planning help.'},
      {t:['wedding','reception','bride'],r:'Weddings: tents, white chairs, linens, dance floor, uplighting, photo booth. Offer coordinator-style tone; confirm dates early.\n\n**315-884-1498**'},
      {
        t: [
          'birthday',
          'birthday party',
          'graduation',
          'sweet 16',
          'kids party',
          'party ideas',
          'quince',
        ],
        r:
          'Parties: bounce houses, tables, chairs, concessions, games.\n\n**315-884-1498**',
      },
      {t:['corporate','business','company picnic','job fair','fundraiser'],r:'Corporate & fundraisers: tables, chairs, tents, linens, generators, staging.\n\n**315-884-1498**'},
      {t:['policy','policies','procedure','rules','guideline'],r:'For written policies (booking, safety, HR), use the **Policies quiz** in this training hub or ask a manager—don’t invent rules on the phone.'},
      {t:['script','sample','what do i say','wording','phrase','talk track'],r:'Key scripts:\n📞 **Greeting:** “Thank you for calling Friendly Party Rental—how can I help you today?”\n💰 **Pricing:** “I can help with pricing—what items are you interested in, and what’s your event date?”\n📋 **Quote:** “I can put a quote together—may I get your name, event date, and delivery area?”\n😊 **Closing:** “Is there anything else I can help with? We appreciate your business!”'},
      {t:['service area','syracuse','cicero','manlius','camillus','dewitt','liverpool','cny','central new york'],r:'Serving **Syracuse and Central NY**: Minoa, Cicero, Manlius, Camillus, DeWitt, Liverpool, and more. Confirm unusual distances with dispatch.'},
      {t:['clean','sanitize','inspected','safe','covid'],r:'Equipment is **professionally cleaned and inspected before every rental**. Safety (especially inflatables) is priority #1.'},
      {t:['review','rating','google','stars','bbb'],r:'Strong Google reputation (training cites **4.7★ / 78 reviews**—verify live star count if the customer asks for “right now”). Highlight on-time delivery + clean gear.'},
      {t:['hello','hi','hey','good morning','good afternoon'],r:'Hello! I’m the **Friendly Party Rental** training helper. Ask about rentals, **pricing (I can match quiz answers when you’re signed in)**, booking scripts, or delivery—**315-884-1498** for the live team.'},
      {t:['what do you rent','what do you offer','catalog','inventory list','full list'],r:'**Catalog overview:**\n⛺ Tents & canopies\n🪑 Tables & chairs\n🛋️ Linens\n🎪 Bounce houses & slides\n🍿 Concessions & add-ons\n💃 Dance floors, yard games, photo booth, foam, movie screen\n💡 Lighting, climate, generators\n\n**Browse:** friendlypartyrental.com · **315-884-1498**'},
    ];
    var i;
    for (i = 0; i < patterns.length; i++) {
      if (patternMatches(msg, patterns[i].t)) {
        return patterns[i].r;
      }
    }
    return (
      "I’m the **Friendly Party Rental** training assistant (runs **entirely in your browser**—no cloud AI).\n\n" +
      '**Tips:**\n' +
      '• Sign in so I can load **official pricing quiz answers** for item questions.\n' +
      '• Name the item and size (e.g. “20x30 pole tent”, “white resin chair”).\n' +
      '• For policies, deposits, or complaints, use manager-approved language and **315-884-1498**.\n\n' +
      '📞 **315-884-1498** · customerservice@friendlypartyrental.com'
    );
  };
})();
