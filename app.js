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
