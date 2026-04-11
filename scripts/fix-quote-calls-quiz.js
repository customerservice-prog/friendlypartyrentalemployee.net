const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "frontend", "quiz-quote-calls.html");
let s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");

s = s.replace(
  /<script src="\/js\/quiz-active-guard\.js"><\/script>\r?\n    <script>/,
  '<script src="/js/quiz-active-guard.js"></script>\n    <script src="/js/staff-quiz-api.js"></script>\n    <script>'
);

const qMark = s.indexOf("var Q = [");
const secsIdx = qMark >= 0 ? s.indexOf("var SECS = 720", qMark) : -1;
const chunk = qMark >= 0 && secsIdx > qMark ? s.slice(qMark, secsIdx) : "";
const relClose = chunk ? chunk.lastIndexOf("];") : -1;
if (qMark < 0 || secsIdx < 0 || relClose < 0) {
  console.error("Q array not found");
  process.exit(1);
}
const afterQ = s.slice(qMark + relClose + 2);
s =
  s.slice(0, qMark) +
  "var QUIZ_SLUG = \"quote-calls\";\n      var Q = [];\n" +
  afterQ;

const c0 = s.indexOf("function choose(ci)");
const c1 = s.indexOf("function done()", c0);
const chooseNew = `function choose(ci) {
        var q=Q[idx]; var btns=$('opts').querySelectorAll('.opt');
        btns.forEach(function(b){b.disabled=true;});
        window.fprStaffQuizApi.verify(QUIZ_SLUG, idx, ci).then(function(data){
          var ok=!!data.correct;
          answers[idx]={wasCorrect:ok,question:q.q,yourAnswer:q.o[ci]};
          btns.forEach(function(b,i){if(ok&&i===ci)b.classList.add('correct');else if(!ok&&i===ci)b.classList.add('wrong');else b.classList.add('dim');});
          var fb=$('fb');fb.className='fb show '+(ok?'ok':'bad');
          fb.textContent=ok?'\u2713 Correct!':'\u2717 Not quite \u2014 keep studying and try again.';
          $('nwrap').className='nwrap show';
          $('btn-next').textContent=(idx===Q.length-1)?'See results':'Next question';
        }).catch(function(){
          btns.forEach(function(b){b.disabled=false;});
          alert('Could not verify your answer. Check your connection and try again.');
        });
      }`;

s = s.slice(0, c0) + chooseNew + s.slice(c1);

const d0 = s.indexOf("function done() {");
const d1 = s.indexOf('$("btn-start")', d0);
const doneOld = s.slice(
  d0,
  s.lastIndexOf("      }", d1) + "      }".length
);

const doneNew = `function done() {
        void fetch("/api/training/quiz-activity", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: false }),
        }).catch(function () {});
        clearInterval(timer);
        timer = null;
        $("screen-quiz").classList.add("hidden");
        $("screen-results").classList.remove("hidden");
        if (window.trainQuizHardGuard) window.trainQuizHardGuard(null);
        window.fprStaffQuizApi.summary(QUIZ_SLUG).then(function (sum) {
          var score = sum.score;
          var total = sum.total;
          var pct = sum.percent;
          var passed = sum.passed;
          var missedPayload = sum.missedQuestions || [];
          saveCompletion({
            v: 1,
            score: score,
            total: total,
            pct: pct,
            passed: passed,
            missed: missedPayload,
            completedAt: Date.now(),
          });
          renderResults(score, total, pct, passed, missedPayload);
        }).catch(function () {
          $("savestatus").textContent =
            "Could not load final score from the server. Try again.";
        });
      }`;

if (!s.includes(doneOld)) {
  console.error("done slice failed");
  process.exit(1);
}
s = s.replace(doneOld, doneNew);

const startOld = `$("btn-start").addEventListener("click", function () {
        var already = loadStoredCompletion();
        if (already) {
          showCompletedScreen(already);
          return;
        }
        if (!$("emp-name").value.trim()) {
          $("emp-name").focus();
          return;
        }
        var ack = $("quiz-integrity-ack");
        if (!ack || !ack.checked) {
          if (ack) ack.focus();
          return;
        }
        fetch('/api/training/quiz-activity',{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({ active:true, slug:'quote-calls' }),
        }).then(function(res){
          if(!res.ok){
            alert('Could not start the quiz session. Check your connection and try again.');
            return;
          }
          idx=0;left=SECS;answers=[];
          $('screen-intro').classList.add('hidden');
          $('screen-quiz').classList.remove('hidden');
          if(window.trainQuizHardGuard)window.trainQuizHardGuard($('screen-quiz'));
          updTimer();
          timer=setInterval(tick,1000);
          showQ();
        }).catch(function(){
          alert('Could not start the quiz session. Check your connection and try again.');
        });
      });`;

const startNew = `$("btn-start").addEventListener("click", function () {
        var already = loadStoredCompletion();
        if (already) {
          showCompletedScreen(already);
          return;
        }
        if (!$("emp-name").value.trim()) {
          $("emp-name").focus();
          return;
        }
        var ack = $("quiz-integrity-ack");
        if (!ack || !ack.checked) {
          if (ack) ack.focus();
          return;
        }
        window.fprStaffQuizApi
          .resetServer(QUIZ_SLUG)
          .then(function () {
            return fetch("/api/training/quiz-activity", {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ active: true, slug: QUIZ_SLUG }),
            });
          })
          .then(function (res) {
            if (!res.ok) throw new Error();
            return window.fprStaffQuizApi.fetchQuestions(QUIZ_SLUG);
          })
          .then(function (data) {
            Q = data.questions;
            if (!Q.length) throw new Error();
            idx = 0;
            left = SECS;
            answers = [];
            $("screen-intro").classList.add("hidden");
            $("screen-quiz").classList.remove("hidden");
            if (window.trainQuizHardGuard)
              window.trainQuizHardGuard($("screen-quiz"));
            updTimer();
            timer = setInterval(tick, 1000);
            showQ();
          })
          .catch(function () {
            alert(
              "Could not start the quiz session. Check your connection and try again."
            );
          });
      });`;

if (!s.includes(startOld)) {
  console.error("start handler not found");
  process.exit(1);
}
s = s.replace(startOld, startNew);

fs.writeFileSync(p, s, "utf8");
console.log("fixed quote-calls quiz");
