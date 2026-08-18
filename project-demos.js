const missionGrid = document.querySelector('.mission-grid');
if (!missionGrid) throw new Error('Project grid not found');

const style = document.createElement('style');
style.textContent = `
.mission-grid{align-items:start!important;grid-auto-flow:row dense}
.mission{min-height:560px!important;grid-row:auto!important;transition:border-color .35s,box-shadow .35s,background .35s,transform .35s!important}
.mission--featured{min-height:560px!important;grid-row:auto!important}
.mission--featured .mission__visual{height:170px!important}
.mission--featured .mission__visual>b{font-size:130px!important;bottom:-22px!important}
.mission.demo-open{grid-column:1/-1!important;min-height:auto!important}
.mission.demo-open .mission__visual{height:150px!important}
.project-demo-intro{margin-top:auto;padding-top:18px;border-top:1px solid rgba(255,255,255,.075)}
.project-demo-intro__label{font:7px var(--mono);letter-spacing:.13em;color:var(--gold);margin-bottom:7px}
.project-demo-intro p{margin:0 0 12px!important;color:#777!important;font:8px/1.65 var(--mono)!important;max-width:560px}
.project-demo-toggle{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;padding:11px 12px;border:1px solid rgba(215,169,79,.24);background:rgba(215,169,79,.035);color:#c8b27c;font:8px var(--mono);letter-spacing:.1em;cursor:pointer}
.project-demo-toggle:hover{border-color:rgba(215,169,79,.48);background:rgba(215,169,79,.07)}
.project-demo-panel{display:none;margin-top:12px;padding:15px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(145deg,rgba(12,12,12,.93),rgba(4,4,4,.97));position:relative;z-index:3}
.mission.demo-open .project-demo-panel{display:block;animation:demoIn .35s ease both}
@keyframes demoIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.project-demo-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:14px}
.project-demo-head h4{margin:0 0 5px;font:600 17px var(--sans);color:#f2f0e9}
.project-demo-head p{margin:0!important;color:#797972!important;font:8px/1.55 var(--mono)!important;max-width:650px}
.project-proof{flex:0 0 auto;padding:5px 7px;border:1px solid rgba(125,255,178,.22);color:#7dffb2;font:7px var(--mono);letter-spacing:.08em}
.demo-workspace{min-height:220px;border:1px solid rgba(255,255,255,.07);background:radial-gradient(circle at 75% 15%,rgba(215,169,79,.07),transparent 36%),#070707;position:relative;overflow:hidden;padding:14px}
.demo-console{position:absolute;left:12px;right:12px;bottom:12px;padding:8px 10px;border:1px solid rgba(255,255,255,.075);background:rgba(0,0,0,.76);font:8px/1.5 var(--mono);color:#777}
.demo-console .ok{color:#7dffb2}.demo-console .gold{color:var(--gold)}.demo-console .warn{color:#d2a56e}
.demo-run{margin-top:10px;padding:9px 11px;border:1px solid rgba(215,169,79,.28);background:#0b0a08;color:var(--gold);font:8px var(--mono);letter-spacing:.1em;cursor:pointer}
.demo-run:hover{background:rgba(215,169,79,.075)}
.demo-images{position:absolute;inset:10px 10px 48px;display:grid;place-items:center}.demo-images img{max-width:100%;max-height:100%;object-fit:contain}.demo-badge{position:absolute;left:18px;top:18px;padding:5px 7px;background:rgba(0,0,0,.78);border:1px solid rgba(215,169,79,.25);color:var(--gold);font:7px var(--mono);letter-spacing:.1em;z-index:2}
.demo-list{display:grid;gap:7px;padding-bottom:42px}.demo-row{display:grid;grid-template-columns:100px 1fr auto;gap:9px;align-items:center;padding:9px;border:1px solid #202020;font:8px var(--mono);color:#777}.demo-row strong{font-weight:400;color:#bbb}.demo-bar{height:4px;background:#171717}.demo-bar i{display:block;height:100%;background:var(--gold)}.accept{color:#7dffb2!important}.reject{color:#aa6161!important}
.demo-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:30px 0 12px}.demo-flow div{padding:18px 6px;border:1px solid #222;text-align:center;font:7px var(--mono);color:#666;transition:.28s}.demo-flow div.run{border-color:var(--gold);color:var(--gold);background:rgba(215,169,79,.055)}.demo-flow div.done{border-color:rgba(125,255,178,.32);color:#7dffb2}.demo-note{font:7px/1.65 var(--mono);color:#70706a}
.demo-bits{display:grid;gap:10px;padding-bottom:42px}.demo-switches{display:flex;gap:5px;flex-wrap:wrap}.demo-switches button,.demo-bit{padding:7px 9px;border:1px solid #222;background:#0b0b0b;color:#777;font:8px var(--mono);cursor:pointer}.demo-switches button.active,.demo-bit.on{border-color:var(--gold);background:var(--gold);color:#080706}.demo-bit-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}.demo-rank{display:grid;gap:7px;padding-bottom:42px}.demo-rank-row{display:grid;grid-template-columns:28px 1fr 50px;gap:8px;padding:9px;border:1px solid #202020;font:8px var(--mono);color:#777}.demo-rank-row strong{color:var(--gold);font-weight:400}
.project-source-link{display:inline-flex;margin-top:10px;color:#8d8b84;font:7px var(--mono);letter-spacing:.09em}.project-source-link:hover{color:var(--gold)}
@media(max-width:900px){.mission-grid{grid-template-columns:1fr!important}.mission.demo-open{grid-column:1!important}.project-demo-head{flex-direction:column}.project-proof{align-self:flex-start}.demo-flow{grid-template-columns:1fr 1fr}.demo-workspace{min-height:230px}}
`;
document.head.appendChild(style);

const projects = [
  {
    name:'AI UI-to-Code Converter',
    test:'Replay a real saved OpenCV/OCR run from screenshot preprocessing to detected UI elements.',
    proof:'REAL SAVED OUTPUT',
    type:'ui'
  },
  {
    name:'Explainable AI Portal',
    test:'Try the documented CV → skills → matching flow and see why each candidate matches an offer.',
    proof:'WORKFLOW TEST',
    type:'xai'
  },
  {
    name:'Data Automation',
    test:'Validate import rows for duplicate IDs and missing store data before database insertion.',
    proof:'DATA-IMPORT TEST',
    type:'data'
  },
  {
    name:'Hidden Markov Model',
    test:'Replay the actual project pipeline from the 365-day sequence through model selection and decoding.',
    proof:'REPORT-BACKED REPLAY',
    type:'hmm'
  },
  {
    name:'PadelVision AI',
    test:'Choose a stroke, toggle observed movement directions, then compare them with the project reference.',
    proof:'REAL ENGINE LOGIC',
    type:'padel'
  },
  {
    name:'VeriPath AI',
    test:'Choose a profile and run the real compatibility formula against the synthetic demo catalogue.',
    proof:'REAL RANKING LOGIC',
    type:'path'
  },
  {
    name:'Distributed ML Pipeline',
    test:'Run the real Stage-1 target heuristic and watch the ingest → clean → train → explain service flow.',
    proof:'SOURCE-BACKED TEST',
    type:'pipe'
  }
];

const uiStages=[
 ['INPUT','https://raw.githubusercontent.com/anischelly26/ui-to-html-css-translator/master/input/ui_screenshot.png'],
 ['GRAYSCALE','https://raw.githubusercontent.com/anischelly26/ui-to-html-css-translator/master/output/1_grayscale.png'],
 ['ENHANCED','https://raw.githubusercontent.com/anischelly26/ui-to-html-css-translator/master/output/2_enhanced.png'],
 ['THRESHOLD','https://raw.githubusercontent.com/anischelly26/ui-to-html-css-translator/master/output/3_threshold.png'],
 ['DETECTED','https://raw.githubusercontent.com/anischelly26/ui-to-html-css-translator/master/output/detected.png'],
 ['ELEMENT DEBUG','https://raw.githubusercontent.com/anischelly26/ui-to-html-css-translator/master/output/element_debug.png']
];
const padelRefs=[
 ['FOREHAND','Preparation · RIGHT_SHOULDER',[0,1,0,0,0,0]],
 ['SERVE','Contact · RIGHT_WRIST',[0,0,1,0,0,0]],
 ['BANDEJA','Preparation · RIGHT_SHOULDER',[0,0,0,1,1,0]],
 ['VIBORA','Acceleration · RIGHT_WRIST',[0,0,1,0,1,0]]
];
const catalogue=[
 ['AI and Intelligent Systems','France','Computing & AI','Artificial Intelligence','Advanced intelligent software systems','ai machine learning software data',9000,.78],
 ['Software Product Engineering','Germany','Computing & AI','Software Engineering','Software architecture product distributed systems','software backend cloud product',6000,.76],
 ['Data Science for Decision Making','Netherlands','Data & Information Studies','Data Science','Data modelling analytics decision systems','data analytics python decision',12000,.74],
 ['Digital Innovation and Product Management','France','Business & Management','Innovation Management','Technology product strategy innovation','product innovation management technology',10500,.70],
 ['Human Centered AI','Sweden','Computing & AI','Human-Centered AI','Explainability interaction responsible design','xai ux ai responsible',8000,.72],
 ['Computer Vision and Robotics','Spain','Computing & AI','Computer Vision','Visual intelligence perception robotics','computer vision robotics image ai',7000,.68],
 ['Sports Data and Intelligent Performance','Spain','Health & Sport','Sports Analytics','Performance analytics intelligent coaching','sports analytics biomechanics ai',6500,.64]
];
const profiles={
  ai:{skills:['python','machine learning','software','computer vision'],interests:['ai','intelligent systems'],career:'ai software engineer',background:'software engineering',domains:['Computing & AI'],countries:['France'],budget:10000},
  product:{skills:['software','javascript','product'],interests:['innovation','technology'],career:'product engineer',background:'software engineering',domains:['Business & Management'],countries:['France'],budget:11000},
  sports:{skills:['python','ai','computer vision'],interests:['sports analytics','movement'],career:'sports ai engineer',background:'software engineering',domains:['Health & Sport'],countries:['Spain'],budget:7000}
};
function tokens(x){return new Set((String(x).toLowerCase().match(/[a-z0-9]+/g)||[]))}
function sim(a,b){const A=tokens(a),B=tokens(b),U=new Set([...A,...B]);let hit=0;A.forEach(x=>{if(B.has(x))hit++});return hit/Math.max(1,U.size)}
function scoreProgram(profile,row){const user=[...profile.skills,...profile.interests,profile.career,profile.background].join(' ');const text=[row[0],row[2],row[3],row[4],row[5]].join(' ');const semantic=sim(user,text);const domain=Math.max(...profile.domains.map(d=>sim(d,row[2])),0);const career=sim(profile.career,text);const country=profile.countries.length?(profile.countries.includes(row[1])?1:.35):1;let affordability=.55;if(row[6]&&profile.budget)affordability=row[6]<=profile.budget?1:Math.max(0,1-(row[6]-profile.budget)/Math.max(profile.budget,1));return 100*(semantic*.40+domain*.18+career*.15+country*.08+affordability*.10+row[7]*.09)}
function directionMatch(o,e){const O=new Set(),E=new Set();o.forEach((v,i)=>{if(v)O.add(i)});e.forEach((v,i)=>{if(v)E.add(i)});if(!E.size)return O.size?0:1;const U=new Set([...O,...E]);let hit=0;O.forEach(i=>{if(E.has(i))hit++});return hit/U.size}

function demoMarkup(type){
  if(type==='ui') return `<div class="demo-workspace"><span class="demo-badge">INPUT</span><div class="demo-images"><img src="${uiStages[0][1]}" alt="UI pipeline input"></div><div class="demo-console">Real project artifact ready.</div></div><button class="demo-run">REPLAY REAL RUN</button>`;
  if(type==='xai') return `<div class="demo-workspace"><div class="demo-list">${[['A',['React','Node.js','MongoDB','NLP']],['B',['React','Node.js']],['C',['MongoDB','NLP','Ranking']]].map(([n,s])=>`<div class="demo-row"><span>Candidate ${n}</span><span>${s.join(' · ')}</span><strong>${s.length}/5</strong></div>`).join('')}</div><div class="demo-console">Offer: React · Node.js · MongoDB · NLP · Ranking</div></div><button class="demo-run">RUN MATCH TEST</button>`;
  if(type==='data') return `<div class="demo-workspace"><div class="demo-list">${[['TX-101','Tunis-01'],['TX-102','Tunis-02'],['TX-102','Tunis-02'],['TX-103','']].map((r,i)=>`<div class="demo-row" data-import="${i}"><span>${r[0]}</span><span>${r[1]||'MISSING STORE'}</span><strong>WAIT</strong></div>`).join('')}</div><div class="demo-console">Test integrity before insertion.</div></div><button class="demo-run">VALIDATE IMPORT</button>`;
  if(type==='hmm') return `<div class="demo-workspace"><div class="demo-flow"><div>365D DATA</div><div>SPLIT</div><div>BAUM-WELCH</div><div>AIC / BIC</div></div><div class="demo-note">Gaussian HMM · Viterbi decoding · forward likelihood · forecasting</div><div class="demo-console">Project pipeline ready.</div></div><button class="demo-run">REPLAY PIPELINE</button>`;
  if(type==='padel') return `<div class="demo-workspace"><div class="demo-bits"><div class="demo-switches">${padelRefs.map((r,i)=>`<button data-ref="${i}" class="${i===0?'active':''}">${r[0]}</button>`).join('')}</div><div class="demo-note" data-padel-note>${padelRefs[0][1]} · expected ${padelRefs[0][2].join('')}</div><div class="demo-bit-grid">${['X+','X−','Y+','Y−','Z+','Z−'].map((x,i)=>`<button class="demo-bit" data-bit="${i}">${x}</button>`).join('')}</div></div><div class="demo-console">Toggle movement directions, then compare.</div></div><button class="demo-run">COMPARE MOVEMENT</button>`;
  if(type==='path') return `<div class="demo-workspace"><div class="demo-rank"><div class="demo-switches">${Object.keys(profiles).map(k=>`<button data-profile="${k}" class="${k==='ai'?'active':''}">${k.toUpperCase()}</button>`).join('')}</div><div class="demo-note">40% semantic · 18% domain · 15% career · 8% country · 10% affordability · 9% data quality</div><div data-ranking></div></div><div class="demo-console">Choose a profile and rank programmes.</div></div><button class="demo-run">RUN RANKING</button>`;
  return `<div class="demo-workspace"><div class="demo-flow"><div>INGEST</div><div>CLEAN</div><div>TRAIN</div><div>EXPLAIN</div></div><div class="demo-note" data-pipe>Target candidates: customer_id · age · monthly_charges · churn</div><div class="demo-console">Stage-1 source-backed test ready.</div></div><button class="demo-run">RUN PIPELINE TEST</button>`;
}

function wireDemo(panel,type){
  const run=panel.querySelector('.demo-run');
  const consoleEl=panel.querySelector('.demo-console');
  if(type==='ui'){
    run.addEventListener('click',()=>{let i=0;const img=panel.querySelector('img'),badge=panel.querySelector('.demo-badge');run.disabled=true;const timer=setInterval(()=>{i++;if(i<uiStages.length){badge.textContent=uiStages[i][0];img.src=uiStages[i][1];consoleEl.innerHTML=`<span class="gold">${uiStages[i][0]}</span> · real saved artifact`}else{clearInterval(timer);run.disabled=false;consoleEl.innerHTML='<span class="ok">RUN COMPLETE</span> · OpenCV/OCR preprocessing and detection replayed'}},500)});
  }
  if(type==='xai'){
    run.addEventListener('click',()=>{panel.querySelectorAll('.demo-row').forEach(row=>{const n=Number(row.querySelector('strong').textContent.split('/')[0]);row.children[1].innerHTML=`<div class="demo-bar"><i style="width:${n/5*100}%"></i></div>`});consoleEl.innerHTML='<span class="ok">MATCH FLOW COMPLETE</span> · matched-skill coverage is visible; no fake private model score'});
  }
  if(type==='data'){
    run.addEventListener('click',()=>{const raw=[['TX-101','Tunis-01'],['TX-102','Tunis-02'],['TX-102','Tunis-02'],['TX-103','']];const seen=new Set();let a=0,r=0;panel.querySelectorAll('[data-import]').forEach((el,i)=>{let result='ACCEPT';if(seen.has(raw[i][0]))result='DUPLICATE';else if(!raw[i][1])result='MISSING STORE';else{seen.add(raw[i][0]);a++}if(result!=='ACCEPT')r++;const s=el.querySelector('strong');s.textContent=result;s.className=result==='ACCEPT'?'accept':'reject'});consoleEl.innerHTML=`<span class="ok">${a} accepted</span> · <span class="warn">${r} rejected</span>`});
  }
  if(type==='hmm'){
    run.addEventListener('click',()=>{const steps=[...panel.querySelectorAll('.demo-flow div')];let i=0;const timer=setInterval(()=>{if(i>0)steps[i-1].className='done';if(i<steps.length){steps[i].className='run';i++}else{clearInterval(timer);consoleEl.innerHTML='<span class="ok">K = 3 selected</span> · AIC/BIC → Viterbi → forward evaluation'}},420)});
  }
  if(type==='padel'){
    let ref=0;const observed=[0,0,0,0,0,0];panel.querySelectorAll('[data-ref]').forEach(b=>b.addEventListener('click',()=>{ref=Number(b.dataset.ref);observed.fill(0);panel.querySelectorAll('[data-ref]').forEach(x=>x.classList.toggle('active',x===b));panel.querySelectorAll('[data-bit]').forEach(x=>x.classList.remove('on'));panel.querySelector('[data-padel-note]').textContent=`${padelRefs[ref][1]} · expected ${padelRefs[ref][2].join('')}`}));panel.querySelectorAll('[data-bit]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.bit);observed[i]=observed[i]?0:1;b.classList.toggle('on',Boolean(observed[i]))}));run.addEventListener('click',()=>{const expected=padelRefs[ref][2],score=directionMatch(observed,expected);const label=score===1?'Correct':score>=.5?'Partial':'Incorrect';consoleEl.innerHTML=`<span class="${score>=.5?'ok':'warn'}">${label} · ${(score*100).toFixed(0)}%</span> · observed ${observed.join('')} vs expected ${expected.join('')}`});
  }
  if(type==='path'){
    let key='ai';panel.querySelectorAll('[data-profile]').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.profile;panel.querySelectorAll('[data-profile]').forEach(x=>x.classList.toggle('active',x===b))}));run.addEventListener('click',()=>{const ranked=catalogue.map(row=>({row,score:scoreProgram(profiles[key],row)})).sort((a,b)=>b.score-a.score).slice(0,3);panel.querySelector('[data-ranking]').innerHTML=ranked.map((x,i)=>`<div class="demo-rank-row"><span>0${i+1}</span><span>${x.row[0]}<br><span class="demo-note">${x.row[1]} · €${x.row[6]}</span></span><strong>${x.score.toFixed(1)}</strong></div>`).join('');consoleEl.innerHTML='<span class="ok">RANKED WITH PROJECT FORMULA</span> · catalogue is synthetic_demo'});
  }
  if(type==='pipe'){
    run.addEventListener('click',()=>{const negative=['id','uuid','guid','pk','key','created_at','updated_at','timestamp','email','url','link','image','path','hash','token','index'];function h(name,u){if(negative.some(k=>name.includes(k)))return 0;let s=name==='churn'?.95:0;if(u===2)s+=.15;else if(u>=3&&u<=20)s+=.10;else if(u===1)s-=.5;return Math.max(0,Math.min(1,s))}const cols=[['customer_id',40],['age',28],['monthly_charges',38],['churn',2]];panel.querySelector('[data-pipe]').innerHTML=cols.map(([n,u])=>`${n}: <span class="${n==='churn'?'gold':''}">${h(n,u).toFixed(2)}</span>`).join(' · ');const steps=[...panel.querySelectorAll('.demo-flow div')];let i=0;const timer=setInterval(()=>{if(i>0)steps[i-1].className='done';if(i<steps.length){steps[i].className='run';i++}else{clearInterval(timer);consoleEl.innerHTML='<span class="ok">churn heuristic = 1.00</span> · then clean → train → explain'}},350)});
  }
}

const cards=[...missionGrid.querySelectorAll('.mission')].slice(0,7);
cards.forEach((card,i)=>{
  const p=projects[i];
  const intro=document.createElement('div');
  intro.className='project-demo-intro';
  intro.innerHTML=`<div class="project-demo-intro__label">INTERACTIVE PROJECT TEST</div><p>${p.test}</p><span class="project-demo-toggle" role="button" tabindex="0">TRY ${p.name.toUpperCase()} <b>＋</b></span><div class="project-demo-panel"><div class="project-demo-head"><div><h4>${p.name}</h4><p>${p.test}</p></div><span class="project-proof">${p.proof}</span></div>${demoMarkup(p.type)}</div>`;
  card.appendChild(intro);
  const toggle=intro.querySelector('.project-demo-toggle');
  const panel=intro.querySelector('.project-demo-panel');
  const act=()=>{
    document.querySelectorAll('.mission.demo-open').forEach(other=>{if(other!==card){other.classList.remove('demo-open');const t=other.querySelector('.project-demo-toggle b');if(t)t.textContent='＋'}});
    const open=card.classList.toggle('demo-open');
    toggle.querySelector('b').textContent=open?'−':'＋';
    if(open)setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'center'}),60);
  };
  toggle.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();act()});
  toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();act()}});
  panel.addEventListener('click',e=>{e.preventDefault();e.stopPropagation()});
  wireDemo(panel,p.type);
});
