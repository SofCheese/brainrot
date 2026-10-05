let slides=[],current=0,scene='hook',timer,revealTimer,orbitFrame,angle=0,paused=false,broken=false,dragging=false,dragLast=0,dragDistance=0;const $=id=>document.getElementById(id),clean=s=>s.replace(/<[^>]*>/g,' '),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const chapters=[{name:'Phenomenon',start:0,end:0,copy:'The five-minute promise. The digital culture behind it.',speaker:'Hồng Minh'},{name:'Pain Point',start:1,end:3,copy:'The student. The platform. The question between them.',speaker:'Mike'},{name:'Insight',start:4,end:6,copy:'Five proposed factors, grounded in earlier research.',speaker:'Nguyễn Đức Kiên'},{name:'Solution',start:7,end:19,copy:'402 responses. The evidence. A more intentional choice.',speaker:'Lê Cao Thành · Vũ Chí Kiên'}];const factors=[{code:'AI',label:'Personalisation',img:'shark.png',r:'.222',text:'Perceived recommendation responsiveness is positively associated with BCC.'},{code:'UXF',label:'Seamless viewing',img:'ninja.png',r:'.357',text:'A smoother viewing experience is positively associated with BCC.'},{code:'SI',label:'Peers & trends',img:'ballerina.png',r:'.673',text:'Social Influence has the largest observed bivariate correlation with BCC.'},{code:'PEV',label:'Entertainment',img:'window-wood',r:'.632',text:'Perceived Entertainment Value has the second-largest observed correlation.'},{code:'PS',label:'Immediate relief',img:'window-croc',r:'.430',text:'The tendency to seek immediate digital relief is positively associated with BCC.'}];
function updateTabs(){document.querySelectorAll('.chapter-tab').forEach((b,i)=>{const on=(scene==='deck'&&current>=chapters[i].start&&current<=chapters[i].end)||(scene==='wrap'&&i===3);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}function setScene(s,hash=true){scene=s;clearTimeout(revealTimer);clearInterval(timer);cancelAnimationFrame(orbitFrame);document.body.dataset.scene=s;['hook','intro','quote','topic','hub','wrap'].forEach(id=>$(id).hidden=id!==s);$('notepanel').hidden=true;$('notes').setAttribute('aria-pressed','false');if(hash)history.replaceState(null,'',s==='deck'?'#'+(current+1):'#'+s);updateTabs();if(s==='wrap')startOrbit();if(s==='hook')resetHook();if(s==='intro'){document.body.classList.remove('revealing');$('reveal').hidden=true;$('searchbutton').disabled=false}}function render(){clearInterval(timer);const s=slides[current];$('deck').innerHTML=`<section class="slide ${s.dark?'dark':''} ${s.kind}" aria-label="Slide ${current+1}: ${clean(s.title)}"><div class="kicker"><span>${s.section}</span></div><h1>${s.title}</h1><div class="content">${s.body}</div>${s.source?`<div class="source">${s.source}</div>`:''}</section>`;$('counter').textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;$('chapter').textContent=chapters.find(c=>current>=c.start&&current<=c.end)?.name||s.section;$('progress').style.width=((current+1)/slides.length*100)+'%';$('prev').disabled=false;$('next').disabled=current===slides.length-1;$('speaker').textContent=s.speaker;$('notetext').textContent=s.notes;document.querySelectorAll('.griditem').forEach((b,i)=>b.classList.toggle('active',i===current));updateTabs();}function go(i){if(!slides.length)return;if(i<0){setScene('hub');return}current=Math.max(0,Math.min(slides.length-1,i));if(current===18){setScene('wrap');return}setScene('deck');render()}function next(){
 if(scene==='hook'){if(hookState==='idle')runHook();else if(hookState==='done')setScene('quote')}
 else if(scene==='quote')setScene('intro');
 else if(scene==='intro'){if(document.body.classList.contains('revealing'))setScene('topic');else $('searchform').requestSubmit()}
 else if(scene==='topic')setScene('hub');
 else if(scene==='hub')go(0);
 else if(scene==='wrap')go(19);
 else if(scene==='deck'){if(current===0&&$('attention-flow').hidden)revealFlow();else go(current+1)}
}
function previous(){
 if(scene==='quote')setScene('hook');
 else if(scene==='intro')setScene('quote');
 else if(scene==='topic')setScene('intro');
 else if(scene==='hub')setScene('topic');
 else if(scene==='wrap')go(17);
 else if(scene==='deck')go(current-1);
}
function notes(){if(scene!=='deck')return;const open=$('notepanel').hidden;$('notepanel').hidden=!open;$('notes').setAttribute('aria-pressed',open)}function overview(){if($('grid').open)$('grid').close();else{$('grid').showModal();document.querySelectorAll('.griditem').forEach((b,i)=>b.classList.toggle('active',i===current));document.querySelector('.griditem.active')?.focus()}}async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('full').textContent='Use browser full screen'}}
function placeOrbit(){const el=$('orbital'),w=el.clientWidth,h=el.clientHeight,rx=Math.min(w*.36,415),ry=h*.31;document.querySelectorAll('.orbit-card').forEach((card,i)=>{const a=angle+i*2*Math.PI/factors.length,depth=Math.sin(a),x=Math.cos(a)*rx,y=depth*ry,scale=.77+(depth+1)*.16;card.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale})`;card.style.zIndex=String(Math.round((depth+1)*5)+1);card.style.opacity=String(.65+(depth+1)*.175)})}function startOrbit(){cancelAnimationFrame(orbitFrame);let last=0;function frame(t){if(scene!=='wrap')return;const dt=last?Math.min(40,t-last):16;last=t;if(!paused&&!broken&&!dragging&&!reduced)angle+=dt*.00012;placeOrbit();orbitFrame=requestAnimationFrame(frame)}orbitFrame=requestAnimationFrame(frame)}function readHash(){const h=location.hash.slice(1);if(['hook','intro','quote','topic','hub','wrap'].includes(h)){setScene(h,false);return}if(/^\d+$/.test(h))go(Number(h)-1);else setScene('hook',false)}
async function init(){try{const res=await fetch('slides.json');if(!res.ok)throw Error();slides=await res.json();$('chaptertabs').innerHTML=chapters.map((c,i)=>`<button class="chapter-tab" data-chapter="${i}"><small>${String(i+1).padStart(2,'0')}</small>${c.name}</button>`).join('');$('hubcards').innerHTML=chapters.map((c,i)=>`<button class="hubcard glass" data-chapter="${i}"><span class="number">${String(i+1).padStart(2,'0')}</span><h2>${c.name}</h2></button>`).join('');document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>go(chapters[+b.dataset.chapter].start));$('griditems').innerHTML=slides.map((s,i)=>`<button class="griditem" data-i="${i}"><small>${String(i+1).padStart(2,'0')} / ${s.section}</small><b>${i===18?'Who’s in control?':clean(s.title)}</b></button>`).join('');$('griditems').onclick=e=>{const b=e.target.closest('[data-i]');if(b){go(+b.dataset.i);$('grid').close()}};$('orbitcards').innerHTML=factors.map((f,i)=>`<button class="orbit-card" data-factor="${i}" aria-label="${f.code}: ${f.label}. Show finding.">${f.img.startsWith('window-')?`<div role="img" aria-label="Brainrot character" class="character-window ${f.img}"></div>`:`<img src="${f.img}" alt="Brainrot character">`}<b>${f.code} · r = ${f.r}</b><span>${f.label}</span></button>`).join('');$('orbitcards').onclick=e=>{const card=e.target.closest('[data-factor]');if(card&&dragDistance<10){const f=factors[+card.dataset.factor];$('orbit-detail').textContent=f.text+' r = '+f.r+', p < .001.';paused=true;$('pauseorbit').textContent='Resume orbit';$('pauseorbit').setAttribute('aria-pressed','true')}};readHash()}catch(e){setScene('hub');$('hubcards').innerHTML='<p>The presentation could not load. Please refresh this page.</p>'}}
let hookState='idle';
function resetHook(){hookState='idle';$('hook-clock').textContent='23:00';$('hook-elapsed').textContent='A familiar intention.';$('hook-jump').disabled=false;$('hook-jump').textContent='Let time slip';$('hook-next').hidden=true}
function finishHook(){clearInterval(timer);hookState='done';$('hook-clock').textContent='02:00';$('hook-elapsed').textContent='Three hours later.';$('hook-jump').textContent='Where did the time go?';$('hook-next').hidden=false}
function runHook(){if(hookState!=='idle')return;hookState='running';$('hook-jump').disabled=true;let minutes=1380;if(reduced){finishHook();return}timer=setInterval(()=>{minutes=Math.min(1560,minutes+3);$('hook-clock').textContent=String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');if(minutes>=1560)finishHook()},40)}
function revealFlow(){const flow=$('attention-flow');if(!flow||!flow.hidden)return;flow.hidden=false;$('reveal-flow').setAttribute('aria-expanded','true');$('reveal-flow').textContent='Attention, designed to stay.'}
$('hook-jump').onclick=runHook;
$('hook-next').onclick=()=>setScene('quote');
$('deck').addEventListener('click',e=>{if(scene==='deck'&&current===0&&!e.target.closest('a'))revealFlow()});
$('searchform').onsubmit=e=>{e.preventDefault();document.body.classList.add('revealing');$('reveal').hidden=false;$('searchbutton').disabled=true};
$('reveal-next').onclick=()=>setScene('topic');
$('skipintro').onclick=()=>setScene('quote');
$('quote-next').onclick=()=>setScene('intro');
$('topic-next').onclick=()=>setScene('hub');
$('topic-back').onclick=()=>setScene('intro');
$('begin').onclick=()=>go(0);
$('home').onclick=()=>setScene('hub');
function backToStart(){$('keyword').value='';setScene('hook')}
$('startpage').onclick=backToStart;$('quotestart').onclick=backToStart;
$('jumptoend').onclick=()=>setScene('wrap');$('backchapters').onclick=()=>setScene('hub');$('prev').onclick=previous;$('next').onclick=next;$('notes').onclick=notes;$('closenotes').onclick=notes;$('overview').onclick=overview;$('closegrid').onclick=()=>$('grid').close();$('full').onclick=full;$('pauseorbit').onclick=()=>{paused=!paused;$('pauseorbit').textContent=paused?'Resume orbit':'Pause orbit';$('pauseorbit').setAttribute('aria-pressed',String(paused))};$('breakloop').onclick=()=>{broken=!broken;$('wrap').classList.toggle('loop-broken',broken);$('wrap-title').innerHTML=broken?'Your attention.<br><em>Your choice.</em>':'Who’s in <em>control?</em>';$('wrap-sub').textContent=broken?'Create a stopping point. Keep the choice yours.':'Five forces. One attention.';$('breakloop').textContent=broken?'Replay the loop':'Break the loop';$('orbit-detail').textContent=broken?'The goal: more intentional viewing, with fewer unplanned interruptions.':'Drag to orbit · Select a character to revisit a finding';$('pauseorbit').disabled=broken};$('orbital').addEventListener('pointerdown',e=>{dragging=true;dragLast=e.clientX;dragDistance=0});window.addEventListener('pointermove',e=>{if(dragging){const dx=e.clientX-dragLast;dragDistance+=Math.abs(dx);angle+=dx*.006;dragLast=e.clientX}else if(['intro','topic'].includes(scene)&&!reduced){document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth-.5)*2);document.documentElement.style.setProperty('--my',(e.clientY/innerHeight-.5)*2)}});window.addEventListener('pointerup',()=>dragging=false);window.addEventListener('pointercancel',()=>dragging=false);$('orbital').addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();angle+=e.deltaX*.004}},{passive:false});document.addEventListener('keydown',e=>{if($('grid').open||e.target.closest('input,textarea,select'))return;if(['ArrowRight','PageDown',' '].includes(e.key)&&e.target.tagName!=='BUTTON'){e.preventDefault();next()}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();previous()}else if(e.key==='Home')backToStart();else if(e.key==='End')setScene('wrap');else if(e.key.toLowerCase()==='n')notes();else if(e.key.toLowerCase()==='g')overview();else if(e.key.toLowerCase()==='f')full();else if(e.key==='Escape'&&!$('notepanel').hidden)notes();else if(['1','2','3','4'].includes(e.key))go(chapters[+e.key-1].start)});window.onhashchange=readHash;let tx=0,ty=0;$('deck').addEventListener('touchstart',e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY},{passive:true});$('deck').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*2)dx<0?next():previous()},{passive:true});init();

document.addEventListener('fullscreenchange',()=>{$('full').innerHTML=document.fullscreenElement?'Exit full screen <kbd>F</kbd>':'Full screen <kbd>F</kbd>';requestAnimationFrame(()=>{if(scene==='wrap')placeOrbit()})});

/* Word of the Year: restore the earlier layout after Search. */
(() => {
  const reveal = document.getElementById('reveal');
  if (!reveal) return;

  reveal.innerHTML = `
    <div class="woty-result">
      <h2 class="woty-heading">
        From internet slang<br>
        to <em>Word of the Year.</em>
      </h2>

      <div class="woty-main">
        <strong class="woty-year">2024</strong>

        <div class="woty-description">
          <h3>“brain rot”</h3>
          <p>Oxford Word of the Year</p>
        </div>
      </div>

      <div class="woty-actions">
        <button id="reveal-next" class="primary">
          Continue
        </button>
      </div>
    </div>
  `;

  document.getElementById('reveal-next').onclick = () => {
    setScene('topic');
  };

  const style = document.createElement('style');
  style.id = 'woty-result-style';

  style.textContent = `
    /* Only change the screen after the search result appears. */
    body[data-scene="intro"].revealing .building {
      animation: none;
      opacity: 0.12;
      filter: blur(18px);
    }

    body[data-scene="intro"].revealing #intro {
      padding: 30px;
    }

    body[data-scene="intro"].revealing .search-panel {
      width: min(1500px, 100%);
      min-height: min(680px, 82dvh);
      padding: clamp(28px, 4vw, 65px);
      border-radius: 28px;
      text-align: left;
      background: linear-gradient(
        130deg,
        rgba(143, 96, 58, 0.48),
        rgba(44, 29, 22, 0.85)
      );
      display: flex;
      justify-content: center;
      overflow: visible;
    }

    body[data-scene="intro"].revealing
    .search-panel > .mini-label {
      display: none;
    }

    #intro #reveal {
      width: 100%;
    }

    #intro #reveal .woty-heading {
      margin: 0;
      color: #f6f1e7;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(30px, 3.8vw, 58px);
      font-weight: 700;
      line-height: 1.12;
      letter-spacing: -0.03em;
    }

    #intro #reveal .woty-heading em {
      font-weight: 600;
    }

    #intro #reveal .woty-main {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: clamp(30px, 5vw, 90px);
      margin: clamp(40px, 6vh, 75px) 0;
    }

    #intro #reveal .woty-year {
      display: block;
      flex-shrink: 0;
      color: #f6f1e7;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(110px, 16vw, 250px);
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -0.065em;
    }

    #intro #reveal .woty-description h3 {
      margin: 0 0 20px;
      color: #f6f1e7;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(35px, 4.3vw, 65px);
      font-weight: 700;
      line-height: 1.1;
    }

    #intro #reveal .woty-description p {
      margin: 0;
      color: #f6f1e7;
      font-size: clamp(18px, 2vw, 29px);
      line-height: 1.4;
    }

    #intro #reveal .woty-actions {
      display: flex;
      justify-content: flex-end;
    }

    #intro #reveal #reveal-next {
      margin: 0;
    }

    @media (max-width: 700px) {
      body[data-scene="intro"].revealing #intro {
        padding: 20px 14px;
      }

      body[data-scene="intro"].revealing .search-panel {
        min-height: 0;
        padding: 30px 22px;
        border-radius: 22px;
      }

      #intro #reveal .woty-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 28px;
        margin: 40px 0;
      }

      #intro #reveal .woty-year {
        font-size: clamp(100px, 28vw, 170px);
      }

      #intro #reveal .woty-description h3 {
        margin-bottom: 12px;
      }
    }
  `;

  document.getElementById('woty-result-style')?.remove();
  document.head.appendChild(style);
})();

/* Hide the prompt once the attention flow has appeared. */
(() => {
  const style = document.createElement('style');

  style.textContent = `
    #reveal-flow[aria-expanded="true"] {
      display: none !important;
    }
  `;

  document.head.appendChild(style);
})();

/* Updated Word of the Year layout and entrance animation. */
(() => {
  const reveal = document.getElementById('reveal');
  if (!reveal) return;

  reveal.innerHTML = `
    <div class="word-result">
      <h2 class="word-heading">
        From internet slang<br>
        to <em>Word of the Year.</em>
      </h2>

      <div class="word-layout">
        <strong class="word-big-year">2024</strong>

        <div class="word-right">
          <h3>“brain rot”</h3>
          <p>Oxford Word of the Year</p>

          <div class="word-cast">
            <img
              src="shark.png"
              alt="Brainrot shark character"
              width="120"
              height="140"
            >
            <img
              src="ninja.png"
              alt="Brainrot ninja character"
              width="120"
              height="140"
            >
            <img
              src="ballerina.png"
              alt="Brainrot ballerina character"
              width="120"
              height="140"
            >
          </div>
        </div>
      </div>

      <div class="word-footer">
        <button id="reveal-next" class="primary">
          Continue
        </button>
      </div>
    </div>
  `;

  document.getElementById('reveal-next').onclick = () => {
    setScene('topic');
  };

  const style = document.createElement('style');
  style.id = 'word-result-final-style';

  style.textContent = `
    /* Remove only the unwanted Phenomenon captions. */
    #deck #reveal-flow,
    #deck .phenomenon-stage > .source {
      display: none !important;
    }

    /* Keep the result inside the viewport. */
    body[data-scene="intro"].revealing #intro {
      padding: clamp(14px, 3vh, 30px);
      overflow-x: hidden;
      overflow-y: auto;
    }

    body[data-scene="intro"].revealing .search-panel {
      box-sizing: border-box;
      width: min(1180px, 100%);
      max-width: 100%;
      min-width: 0;
      min-height: 0;
      margin: auto;
      padding: clamp(24px, 4vw, 52px);
      border-radius: 28px;
      text-align: left;
      overflow: hidden;
      background: linear-gradient(
        130deg,
        rgba(139, 93, 57, 0.64),
        rgba(43, 28, 22, 0.92)
      );
      animation: wordPanelIn 700ms ease both;
    }

    body[data-scene="intro"].revealing
    .search-panel > .mini-label {
      display: none;
    }

    body[data-scene="intro"].revealing .building {
      animation: wordBackdropIn 1100ms ease both;
    }

    #intro #reveal {
      width: 100%;
      min-width: 0;
    }

    #intro #reveal .word-heading {
      margin: 0 0 30px;
      color: #f6f1e7;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(28px, 3.4vw, 48px);
      font-weight: 700;
      line-height: 1.12;
      letter-spacing: -0.025em;
    }

    #intro #reveal .word-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
      gap: clamp(24px, 4vw, 64px);
    }

    #intro #reveal .word-big-year {
      display: block;
      min-width: 0;
      color: #f6f1e7;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(100px, 16vw, 210px);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.065em;
    }

    #intro #reveal .word-right {
      min-width: 0;
    }

    #intro #reveal .word-right h3 {
      margin: 0 0 12px;
      color: #f6f1e7;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(32px, 4vw, 56px);
      font-weight: 700;
      line-height: 1.1;
    }

    #intro #reveal .word-right > p {
      margin: 0;
      color: #ead8c0;
      font-size: clamp(17px, 1.8vw, 24px);
      line-height: 1.4;
    }

    #intro #reveal .word-cast {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 28px;
      padding: 8px 3px;
    }

    #intro #reveal .word-cast img {
      display: block;
      width: clamp(70px, 8vw, 112px);
      height: clamp(84px, 9.5vw, 132px);
      min-width: 0;
      object-fit: cover;
      border: 1px solid rgba(255, 241, 219, 0.55);
      border-radius: 18px;
      box-shadow: 0 12px 28px rgba(15, 8, 4, 0.35);
    }

    #intro #reveal .word-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }

    #intro #reveal #reveal-next {
      margin: 0;
    }

    /* Stagger the reveal each time Search is submitted. */
    body.revealing #reveal .word-heading {
      animation: wordRiseIn 650ms 100ms both;
    }

    body.revealing #reveal .word-big-year {
      animation: wordRiseIn 800ms 200ms both;
    }

    body.revealing #reveal .word-right h3,
    body.revealing #reveal .word-right > p {
      animation: wordRiseIn 700ms 350ms both;
    }

    body.revealing #reveal .word-cast img {
      animation: wordCharacterIn 750ms both;
    }

    body.revealing #reveal .word-cast img:nth-child(1) {
      --card-angle: -7deg;
      animation-delay: 500ms;
    }

    body.revealing #reveal .word-cast img:nth-child(2) {
      --card-angle: 4deg;
      animation-delay: 650ms;
    }

    body.revealing #reveal .word-cast img:nth-child(3) {
      --card-angle: -3deg;
      animation-delay: 800ms;
    }

    body.revealing #reveal .word-footer {
      animation: wordRiseIn 600ms 950ms both;
    }

    @keyframes wordPanelIn {
      from {
        opacity: 0;
        transform: translateY(18px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes wordBackdropIn {
      from {
        opacity: 1;
        filter: blur(0);
        transform: scale(1.03);
      }
      to {
        opacity: 0.18;
        filter: blur(12px);
        transform: scale(1.12);
      }
    }

    @keyframes wordRiseIn {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes wordCharacterIn {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.8) rotate(0deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1) rotate(var(--card-angle));
      }
    }

    @media (max-width: 700px) {
      #intro #reveal .word-layout {
        grid-template-columns: 1fr;
        gap: 22px;
      }

      #intro #reveal .word-big-year {
        font-size: clamp(100px, 29vw, 165px);
      }

      #intro #reveal .word-heading {
        margin-bottom: 24px;
      }

      #intro #reveal .word-cast {
        margin-top: 20px;
        gap: 12px;
      }

      #intro #reveal .word-cast img {
        width: clamp(65px, 20vw, 100px);
        height: clamp(80px, 24vw, 120px);
      }
    }

    @media (max-height: 700px) and (min-width: 701px) {
      body[data-scene="intro"].revealing .search-panel {
        padding: 26px 38px;
      }

      #intro #reveal .word-heading {
        font-size: 34px;
        margin-bottom: 22px;
      }

      #intro #reveal .word-big-year {
        font-size: 160px;
      }

      #intro #reveal .word-cast {
        margin-top: 16px;
      }

      #intro #reveal .word-cast img {
        width: 80px;
        height: 96px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      body[data-scene="intro"].revealing .search-panel,
      body[data-scene="intro"].revealing .building,
      body.revealing #reveal .word-heading,
      body.revealing #reveal .word-big-year,
      body.revealing #reveal .word-right h3,
      body.revealing #reveal .word-right > p,
      body.revealing #reveal .word-cast img,
      body.revealing #reveal .word-footer {
        animation: none !important;
      }
    }
  `;

  document.getElementById('word-result-final-style')?.remove();
  document.head.appendChild(style);
})();

/* Add a new Pain Point slide after "A student life". */
(() => {
  if (window.tahtQuestionSlideAdded) return;
  window.tahtQuestionSlideAdded = true;

  const style = document.createElement('style');

  style.textContent = `
    #deck .question-bridge {
      background:
        radial-gradient(
          ellipse at 85% 85%,
          rgba(201, 156, 101, 0.18),
          transparent 60%
        ),
        linear-gradient(
          135deg,
          rgba(91, 59, 38, 0.88),
          rgba(35, 23, 18, 0.96)
        );
    }

    #deck .question-bridge > h1 {
      font-size: clamp(30px, 3.5vw, 50px);
      margin-bottom: 24px;
    }

    #deck .question-bridge .content {
      justify-content: center;
    }

    .question-story {
      width: min(1080px, 100%);
      margin: auto;
    }

    .question-before {
      padding: 20px 26px;
      border: 1px solid rgba(246, 241, 231, 0.2);
      border-radius: 18px;
      background: rgba(255, 245, 226, 0.045);
      animation: questionRise 650ms ease both;
    }

    #deck .question-before p {
      margin: 0 0 8px;
      font-size: 15px;
      color: #cbb69f;
    }

    #deck .question-before blockquote {
      margin: 0;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(23px, 2.5vw, 34px);
      font-weight: 500;
      line-height: 1.3;
      color: #e0cdb8;
    }

    .question-divider {
      width: 1px;
      height: 34px;
      margin: 14px auto;
      background: linear-gradient(
        transparent,
        #dfb986,
        transparent
      );
      animation: questionRise 650ms 150ms both;
    }

    .question-after {
      text-align: center;
      padding: 10px 20px 16px;
      animation: questionRise 800ms 300ms both;
    }

    #deck .question-after > p {
      font-size: 15px;
      color: #d2bda6;
      margin: 0 0 18px;
    }

    #deck .question-after blockquote {
      max-width: 1000px;
      margin: 0 auto;
      font-family: Fraunces, Georgia, serif;
      font-size: clamp(30px, 4vw, 58px);
      font-weight: 600;
      line-height: 1.18;
      letter-spacing: -0.025em;
      color: #f6f1e7;
      text-wrap: balance;
    }

    .question-after em {
      color: #edc797;
      font-weight: 600;
    }

    .question-after strong {
      font-weight: 600;
      color: #edc797;
      text-decoration: underline;
      text-decoration-color: rgba(237, 199, 151, 0.45);
      text-decoration-thickness: 2px;
      text-underline-offset: 7px;
    }

    @keyframes questionRise {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-height: 740px) and (min-width: 801px) {
      #deck .question-bridge > h1 {
        font-size: 34px;
        margin-bottom: 16px;
      }

      .question-before {
        padding: 14px 22px;
      }

      .question-divider {
        height: 20px;
        margin: 10px auto;
      }

      #deck .question-after blockquote {
        font-size: 39px;
      }
    }

    @media (max-width: 800px) {
      .question-before {
        padding: 18px;
      }

      .question-after {
        padding: 8px 0 16px;
      }

      #deck .question-after blockquote {
        font-size: clamp(29px, 6vw, 43px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .question-before,
      .question-divider,
      .question-after {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  function addQuestionSlide() {
    if (!slides.length) return false;

    if (slides.some(item => item.id === 'question-bridge')) {
      return true;
    }

    const anchor = slides.findIndex(item =>
      clean(item.title).includes('A student life.')
    );

    if (anchor < 0) return true;

    const insertionIndex = anchor + 1;

    const newSlide = {
      id: 'question-bridge',
      section: 'Pain Point',
      speaker: slides[anchor].speaker,
      title: 'The question<br><em>behind the scroll.</em>',
      dark: true,
      kind: 'question-bridge',
      source: '',
      body: `
        <div class="question-story">
          <div class="question-before">
            <p>So the problem is not simply:</p>

            <blockquote>
              “Why do students watch short videos?”
            </blockquote>
          </div>

          <div class="question-divider" aria-hidden="true"></div>

          <div class="question-after">
            <p>The more interesting question is:</p>

            <blockquote>
              “What <em>keeps them scrolling</em>
              when they
              <strong>did not originally plan to?</strong>”
            </blockquote>
          </div>
        </div>
      `,
      notes:
        'So the problem is not simply: Why do students watch ' +
        'short videos? The more interesting question is: ' +
        'What keeps them scrolling when they did not originally ' +
        'plan to? Pause on this question, then continue to the ' +
        'next slide to introduce the platform-side and user-side factors.'
    };

    slides.splice(insertionIndex, 0, newSlide);

    /* Keep all four chapter tabs aligned with their slides. */
    chapters.forEach(chapter => {
      if (chapter.start >= insertionIndex) {
        chapter.start += 1;
      }

      if (chapter.end >= insertionIndex) {
        chapter.end += 1;
      }
    });

    /* Preserve the currently displayed slide. */
    if (current >= insertionIndex) {
      current += 1;
    }

    const wrapIndex = slides.findIndex(item =>
      clean(item.title).includes('Before the next video')
    );

    /* Use the updated wrap-up position. */
    go = function (index) {
      if (!slides.length) return;

      if (index < 0) {
        setScene('hub');
        return;
      }

      current = Math.max(
        0,
        Math.min(slides.length - 1, index)
      );

      if (current === wrapIndex) {
        setScene('wrap');
        return;
      }

      setScene('deck');
      render();
    };

    const previousNext = next;
    const previousBack = previous;

    next = function () {
      if (scene === 'wrap') {
        go(wrapIndex + 1);
        return;
      }

      previousNext();
    };

    previous = function () {
      if (scene === 'wrap') {
        go(wrapIndex - 1);
        return;
      }

      previousBack();
    };

    document.getElementById('next').onclick = () => next();
    document.getElementById('prev').onclick = () => previous();

    /* Include the new slide in the slide overview. */
    document.getElementById('griditems').innerHTML = slides
      .map((item, index) => `
        <button class="griditem" data-i="${index}">
          <small>
            ${String(index + 1).padStart(2, '0')}
            / ${item.section}
          </small>
          <b>
            ${
              index === wrapIndex
                ? 'Who’s in control?'
                : clean(item.title)
            }
          </b>
        </button>
      `)
      .join('');

    if (scene === 'deck') {
      go(current);
    } else {
      updateTabs();
    }

    return true;
  }

  /* Wait for the existing presentation data to finish loading. */
  if (!addQuestionSlide()) {
    let attempts = 0;

    const loadingCheck = setInterval(() => {
      attempts += 1;

      if (addQuestionSlide() || attempts >= 600) {
        clearInterval(loadingCheck);
      }
    }, 100);
  }
})();
