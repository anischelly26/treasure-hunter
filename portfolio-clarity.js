const lab = document.querySelector('.hero-demo');
if (!lab) throw new Error('Project lab not found');

const projects = [
  {
    name:'AI UI-to-Code Converter',
    context:'VERMEG · COMPUTER VISION / OCR',
    desc:'Python prototype that analyzes a UI screenshot with OpenCV and OCR, detects interface elements, and reconstructs editable HTML/CSS.',
    test:'Replays actual images saved by the project: input → grayscale → enhancement → threshold → detected elements → generated output.',
    proof:'REAL SAVED REPOSITORY OUTPUT'
  },
  {
    name:'Explainable AI Internship & PFE Portal',
    context:'ORANGE DIGITAL CENTER × MEDTECH',
    desc:'Full-stack workflow for CV upload, parsing, skill extraction, offer matching, candidate ranking, and human-readable shortlisting explanations.',
    test:'Shows a transparent skill-matching harness based on the documented workflow. It does not pretend that a private ranking formula is available.',
    proof:'DOCUMENTED WORKFLOW TEST'
  },
  {
    name:'Sales Data Centralization',
    context:'MONOPRIX HQ · DATA MANAGEMENT',
    desc:'Python + database workflow that centralizes sales files and reduces repetitive manual data handling while preserving integrity and consistency.',
    test:'Validates sample import rows for duplicate identifiers and missing store data before database insertion.',
    proof:'DOCUMENTED DATA-IMPORT TEST'
  },
  {
    name:'Hidden Markov Weather Analysis',
    context:'MEDTECH · ARTIFICIAL INTELLIGENCE',
    desc:'Gaussian HMM project using a reproducible 365-day synthetic temperature series to infer hidden weather states and forecast transitions.',
    test:'Replays the real workflow: sequential split → Baum-Welch → AIC/BIC model selection → Viterbi decoding → forward evaluation.',
    proof:'REPORT-BACKED PIPELINE REPLAY'
  },
  {
    name:'PadelVision AI',
    context:'COMPUTER VISION · SPORTS AI',
    desc:'Sports-coaching prototype that maps pose landmarks to stroke-specific movement references and compares observed movement directions.',
    test:'Choose a real stroke reference, toggle the six observed movement directions, and run the project’s active-direction matching rule.',
    proof:'REAL ENGINE LOGIC'
  },
  {
    name:'VeriPath AI',
    context:'RECOMMENDATION SYSTEM',
    desc:'Transparent study-abroad decision-support system ranking programmes by interests, domain fit, career direction, country, affordability and data quality.',
    test:'Runs the real compatibility formula on the project’s explicitly synthetic demo catalogue and shows the resulting ranking.',
    proof:'REAL ENGINE + SYNTHETIC CATALOGUE'
  },
  {
    name:'Distributed ML Pipeline',
    context:'FASTAPI · ML SERVICES',
    desc:'Four-stage ML architecture for dataset profiling, cleaning/feature engineering, multi-model training/evaluation, and explainable reporting.',
    test:'Runs the real Stage-1 target-name heuristic and visualizes the actual ingest → clean → train → explain service sequence.',
    proof:'REAL SOURCE-BACKED PARTIAL TEST'
  }
];

const style=document.createElement('style');
style.textContent=`
.hero-demo{width:min(650px,46vw)!important}
.hero-demo__head>b{font-size:8px;letter-spacing:.12em}
.demo-picker{display:none!important}
.project-guide{border:1px solid rgba(255,255,255,.08);background:linear-gradient(135deg,rgba(215,169,79,.045),rgba(255,255,255,.012));padding:12px 13px;margin-bottom:10px}
.project-guide__nav{display:grid;grid-template-columns:32px 1fr 32px;gap:6px;margin-bottom:10px}
.project-guide__nav button,.project-guide__nav select{height:33px;border:1px solid rgba(255,255,255,.1);background:#0a0a0a;color:#8d8d87;font:8px var(--mono);cursor:pointer}
.project-guide__nav button:hover{border-color:rgba(215,169,79,.55);color:var(--gold)}
.project-guide__nav select{width:100%;padding:0 8px;outline:none}
.project-guide__meta{display:flex;justify-content:space-between;gap:10px;font:7px var(--mono);letter-spacing:.1em;color:#777}
.project-guide__meta b{font-weight:400;color:var(--gold)}
.project-guide h3{margin:8px 0 6px;font:600 17px var(--sans);letter-spacing:-.02em;color:#f3f1eb}
.project-guide p{margin:0;color:#88857e;font:8px var(--mono);line-height:1.65}
.project-guide__test{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07);color:#b4b0a8!important}
.project-guide__test span{color:#7dffb2}
.project-guide__proof{display:inline-flex;margin-top:8px;padding:4px 6px;border:1px solid rgba(125,255,178,.2);color:#7dffb2;font:7px var(--mono);letter-spacing:.08em}
.demo-meta{align-items:flex-end}
.demo-title{font-size:8px!important}.demo-sub{max-width:300px;line-height:1.4}
@media(max-width:1000px){.hero-demo{width:100%!important}}
@media(max-width:620px){.project-guide h3{font-size:15px}.project-guide__meta{flex-direction:column;gap:4px}}
`;
document.head.appendChild(style);

const head=lab.querySelector('.hero-demo__head b');
if(head) head.textContent='PROJECT PLAYGROUND // SOURCE-BACKED';
const tabs=[...lab.querySelectorAll('[data-mode]')];
const projectTab=tabs.find(x=>x.dataset.mode==='demo');
const gameTab=tabs.find(x=>x.dataset.mode==='hunt');
if(projectTab) projectTab.textContent='PROJECT TESTS';
if(gameTab) gameTab.textContent='TREASURE HUNTER GAME';

const wrap=lab.querySelector('.demo-wrap');
const picker=lab.querySelector('.demo-picker');
const chips=[...lab.querySelectorAll('.demo-chip')];
const guide=document.createElement('section');
guide.className='project-guide';
guide.innerHTML=`
  <div class="project-guide__nav">
    <button data-prev aria-label="Previous project">←</button>
    <select aria-label="Choose a project"></select>
    <button data-next aria-label="Next project">→</button>
  </div>
  <div class="project-guide__meta"><b data-count></b><span data-context></span></div>
  <h3 data-name></h3>
  <p data-desc></p>
  <p class="project-guide__test"><span>WHAT YOU CAN TRY:</span> <b data-test style="font-weight:400;color:inherit"></b></p>
  <div class="project-guide__proof" data-proof></div>`;
wrap.insertBefore(guide, picker);

const select=guide.querySelector('select');
projects.forEach((p,i)=>{
  const o=document.createElement('option');
  o.value=String(i);
  o.textContent=String(i+1).padStart(2,'0')+' · '+p.name;
  select.appendChild(o);
});

let index=0;
function showGuide(i){
  index=(i+projects.length)%projects.length;
  const p=projects[index];
  select.value=String(index);
  guide.querySelector('[data-count]').textContent='PROJECT '+String(index+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
  guide.querySelector('[data-context]').textContent=p.context;
  guide.querySelector('[data-name]').textContent=p.name;
  guide.querySelector('[data-desc]').textContent=p.desc;
  guide.querySelector('[data-test]').textContent=p.test;
  guide.querySelector('[data-proof]').textContent=p.proof;
}
function openProject(i){
  showGuide(i);
  if(chips[index]) chips[index].click();
}
select.onchange=()=>openProject(Number(select.value));
guide.querySelector('[data-prev]').onclick=()=>openProject(index-1);
guide.querySelector('[data-next]').onclick=()=>openProject(index+1);
chips.forEach((chip,i)=>chip.addEventListener('click',()=>showGuide(i)));
showGuide(0);

document.querySelectorAll('.mission-grid .mission').forEach((card,i)=>{
  if(i>6)return;
  const launch=card.querySelector('.mission__launch');
  if(!launch)return;
  launch.textContent='TRY PROJECT DEMO ↗';
  launch.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    openProject(i);
    if(projectTab) projectTab.click();
    document.getElementById('home')?.scrollIntoView({behavior:'smooth'});
  });
});
