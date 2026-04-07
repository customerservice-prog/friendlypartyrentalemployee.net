
// FPR Training Hub — local pattern-matching assistant for instant in-browser replies.
// Include: <script src="/js/fpr-ai-bootstrap.js"></script>
// Exposes window.FPR_LOCAL_AI(message) for assistant + AI Team pages.
// Note: fetch is not patched — employee sign-in and scored quizzes still use the server.

(function() {
  'use strict';
  if (window._FPR_BOOTSTRAPPED) return;
  window._FPR_BOOTSTRAPPED = true;

  window.FPR_LOCAL_AI = function(userMessage) {
    var msg = (userMessage || '').toLowerCase();
    var patterns = [
      {t:['phone','315','call us','contact number'],r:'Our phone is **315-884-1498**. Email: customerservice@friendlypartyrental.com. Address: 330 Costello Parkway, Minoa, NY 13116.'},
      {t:['address','location','where are you','costello'],r:'We are at **330 Costello Parkway, Minoa, NY 13116**. Serving Syracuse and surrounding Central New York.'},
      {t:['email','customerservice'],r:'Email: **customerservice@friendlypartyrental.com** · Phone: 315-884-1498'},
      {t:['discount','coupon','save20','promo code'],r:'Use code **SAVE20** at checkout for a discount! We also offer package deals for additional savings.'},
      {t:['tent','tents','canopy','canopies'],r:'Tents available:\n• 20x30 pole tent\n• 20x40 pole tent\n• 30x40 pole tent\n• 30x60 pole tent\n• Frame tents\n\nAll include professional setup & takedown! Call 315-884-1498.'},
      {t:['table','tables'],r:'Tables: 6ft rectangular, 5ft round, 8ft rectangular, high top cocktail tables. All professionally cleaned. Call 315-884-1498.'},
      {t:['chair','chairs','seating','throne'],r:'Chairs: standard folding, white folding (popular for weddings!), throne chairs, chiavari chairs. Call 315-884-1498.'},
      {t:['bounce house','waterslide','inflatable','obstacle'],r:'Bounce houses, waterslides, obstacle courses! Safety #1 — inspected before every rental. Call 315-884-1498.'},
      {t:['linen','tablecloth','chair cover'],r:'Linens: white, black, colored tablecloths, chair covers, runners. Call 315-884-1498 for colors.'},
      {t:['concession','popcorn','cotton candy','snow cone','nacho','hot dog'],r:'Concessions: popcorn, cotton candy, snow cone, hot dog steamer, nacho machines! Call 315-884-1498.'},
      {t:['package','bundle','combo'],r:'Package deals bundle tables + chairs + tent + linens for great savings! Call 315-884-1498.'},
      {t:['dance floor','dancing'],r:'Dance floors: portable, LED, stage sections. Call 315-884-1498.'},
      {t:['generator','power'],r:'Generator rentals for outdoor events! Call 315-884-1498 for sizing.'},
      {t:['photo booth','photobooth'],r:'Photo booth rentals for any event! Call 315-884-1498.'},
      {t:['foam machine','foam party'],r:'Foam machine rentals for foam parties! Call 315-884-1498.'},
      {t:['movie screen','outdoor movie'],r:'Inflatable movie screen rentals for outdoor movie nights! Call 315-884-1498.'},
      {t:['lighting','lights','uplighting'],r:'Lighting: string lights, uplighting, LED lights, spotlights. Call 315-884-1498.'},
      {t:['heater','heating','cooling','air condition'],r:'Heating & cooling: propane heaters, electric heaters, fans, AC units. Call 315-884-1498.'},
      {t:['yard game','cornhole','jenga','bocce'],r:'Yard games: cornhole, Giant Jenga, ladder toss, bocce ball. Call 315-884-1498.'},
      {t:['deliver','setup','pick up','same day weekend'],r:'We deliver, set up, and pick up! Same-day weekend service available. We show up when we say we will!'},
      {t:['book','reserve','order online'],r:'Book at friendlypartyrental.com/order-by-date or call 315-884-1498!'},
      {t:['price','pricing','cost','how much','quote'],r:'For accurate pricing: call 315-884-1498 or visit friendlypartyrental.com. Use code SAVE20 for a discount!'},
      {t:['wedding','reception'],r:'We love weddings! Tents, white chairs, linens, dance floor, uplighting, photo booth. Call 315-884-1498!'},
      {t:['birthday','party','graduation'],r:'Perfect for parties! Bounce houses, tables, chairs, concessions, yard games. Call 315-884-1498!'},
      {t:['corporate','business','job fair'],r:'Great for corporate events! Tables, chairs, tents, linens, generators. Call 315-884-1498!'},
      {t:['script','sample','what do i say','wording','phrase'],r:'Key scripts:\n📞 Greeting: "Thank you for calling Friendly Party Rental! How can I help you today?"\n💰 Pricing: "I can help with pricing! What items and what is your event date?"\n📋 Quote: "I can put together a quote! Name, event date, and items needed?"\n😊 Closing: "Is there anything else I can help with? We look forward to your event!"'},
      {t:['service area','syracuse','minoa','cicero','manlius','camillus','dewitt','liverpool'],r:'Serving Syracuse and surrounding CNY: Minoa, Cicero, Manlius, Camillus, DeWitt, Liverpool and more!'},
      {t:['clean','sanitize','inspected','safe'],r:'All equipment professionally cleaned and inspected before EVERY rental. Clean, event-ready equipment is our standard!'},
      {t:['review','rating','google','stars'],r:'4.7 stars on Google with 78 reviews! Customers love our clean equipment and on-time delivery.'},
      {t:['hello','hi','hey','good morning'],r:"Hello! I'm the Friendly Party Rental AI, trained on all company info! Ask me about rentals, pricing, booking, or customer service scripts."},
      {t:['what do you rent','what do you offer','catalog','services'],r:'Full catalog:\n⛺ Tents (20x30 to 30x60)\n🪑 Tables & Chairs (all styles)\n🛋️ Linens\n🎪 Bounce Houses & Waterslides\n🍿 Concessions\n💃 Dance Floors\n🎉 Yard Games, Photo Booth, Foam Machine, Movie Screen\n💡 Lighting, Heating/Cooling, Generators\n\nBook at friendlypartyrental.com!'},
    ];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].t.some(function(t) { return msg.indexOf(t) !== -1; })) {
        return patterns[i].r;
      }
    }
    return "I'm the Friendly Party Rental AI assistant!\n\nAsk me about:\n• Rentals (tents, tables, chairs, bounce houses...)\n• Pricing & booking\n• Customer service scripts\n• Delivery & policies\n\n📞 Direct: **315-884-1498**";
  };
})();
