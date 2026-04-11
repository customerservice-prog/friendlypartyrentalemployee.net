const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "..", "frontend", "quiz-customer-service.html");
let s = fs.readFileSync(p, "utf8");

const c0 = s.indexOf("function choose(ci)");
const c1 = s.indexOf("function done()", c0);
if (c0 < 0 || c1 < 0) {
  console.error("could not find choose/done");
  process.exit(1);
}
const chooseOld = s.slice(c0, c1).replace(/\s+$/, "");

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

if (!s.includes(chooseOld)) {
  console.error("slice mismatch");
  process.exit(1);
}
s = s.replace(chooseOld, chooseNew);

const d0 = s.indexOf("function done() {");
const d1 = s.indexOf("$('btn-start')", d0);
if (d0 < 0 || d1 < 0) {
  console.error("done not found");
  process.exit(1);
}
const doneOldEnd = s.lastIndexOf("      }", d1);
const doneOld = s.slice(d0, doneOldEnd + "      }".length);

const doneNew = `function done() {
        void fetch("/api/training/quiz-activity", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: false }),
        }).catch(function () {});
        clearInterval(timer);
        $('screen-quiz').classList.add('hidden');
        $('screen-results').classList.remove('hidden');
        window.fprStaffQuizApi.summary(QUIZ_SLUG).then(function(sum){
          var score=sum.score,total=sum.total,pct=sum.percent,passed=sum.passed;
          var missedRows=sum.missedQuestions||[];
          $('rkicker').textContent=passed?'Great work — you passed!':'Keep studying!';
          $('rscore').textContent=score+' / '+total;
          $('rscore').style.color=passed?'#0d7a3e':'#b42318';
          $('rpct').textContent=pct+'% correct';
          $('rbadge').innerHTML=passed?'<span class="pass-badge">Pass \u2713</span>':'<span class="fail-badge">Did not pass</span>';
          if(missedRows.length){
            $('revlist').classList.remove('hidden');
            var ri=$('revitems');
            ri.innerHTML='';
            missedRows.forEach(function(m){
              var w=document.createElement('div');
              w.className='revitem';
              w.innerHTML='<div class="revq"></div><div class="revm"></div>';
              w.querySelector('.revq').textContent=m.question;
              w.querySelector('.revm').textContent='Your answer: '+m.yourAnswer;
              ri.appendChild(w);
            });
          } else {
            $('revlist').classList.add('hidden');
          }
          $('savestatus').textContent='Score: '+score+'/'+total+' ('+pct+'%)';
        }).catch(function(){
          $('rkicker').textContent='Quiz complete';
          $('savestatus').textContent='Could not load final score from the server. Try again.';
        });
      }`;

if (!s.includes(doneOld)) {
  console.error("done old mismatch", doneOld.slice(0, 80));
  process.exit(1);
}
s = s.replace(doneOld, doneNew);

fs.writeFileSync(p, s, "utf8");
console.log("fixed customer-service quiz");
