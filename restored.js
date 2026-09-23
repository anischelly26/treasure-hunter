(() => {
'use strict';
const body=document.body, media=matchMedia('(prefers-reduced-motion: reduce)');
const motion=document.querySelector('#motion');
let paused=media.matches;
const setMotion=()=>{
 body.classList.toggle('motion-paused',paused);
 motion.textContent=paused?'ENABLE MOTION  ▷':'PAUSE MOTION  Ⅱ';
 motion.setAttribute('aria-pressed',String(paused));
 window.dispatchEvent(new CustomEvent('portfolio-motion',{detail:{paused}}));
};
motion.addEventListener('click',()=>{paused=!paused;setMotion()});
media.addEventListener('change',()=>{paused=media.matches;setMotion()});setMotion();
const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav__links');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
matchMedia('(min-width:981px)').addEventListener('change',closeMenu);
const sections=[...document.querySelectorAll('main>section[id]')];
let ticking=false;
function update(){
 ticking=false;
 const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
 document.querySelector('#scrollProgress').style.width=(scrollY/max*100)+'%';
 let active='home';for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.45)active=s.id;
 document.querySelectorAll('.section-rail [data-target]').forEach(el=>el.classList.toggle('active',el.dataset.target===active));
 nav.querySelectorAll('a[href^="#"]').forEach(el=>{if(el.hash==='#'+active)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current')});
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('offscreen',!e.isIntersecting)),{rootMargin:'50px'});
document.querySelectorAll('.mission,.hero__signal,.next__panel').forEach(el=>observer.observe(el));
const terminal=document.querySelector('#terminal'),terminalInput=document.querySelector('#terminalInput'),terminalOutput=document.querySelector('#terminalOutput');
document.querySelectorAll('#terminalToggle,#heroTerminal').forEach(el=>el.addEventListener('click',()=>{terminal.showModal();terminalInput.focus()}));
document.querySelector('#terminalClose').addEventListener('click',()=>terminal.close());
addEventListener('keydown',e=>{if(e.key==='`'&&!e.metaKey&&!e.ctrlKey&&!/INPUT|TEXTAREA/.test(e.target.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();terminal.showModal();terminalInput.focus()}});
const commands = {
  help: `<span class="cmd">AVAILABLE COMMANDS</span><br>whoami &nbsp; projects &nbsp; experience &nbsp; skills &nbsp; graphics &nbsp; status &nbsp; vermeg &nbsp; orange &nbsp; monoprix &nbsp; hmm &nbsp; padel &nbsp; veripath &nbsp; mlpipeline &nbsp; contact &nbsp; clear &nbsp; sudo hire anis`,
  whoami: `<span class="green">ANIS CHELLI</span><br>Final-year Software Engineering student @ MedTech<br>Software Engineer // AI Builder<br><span class="dim">AI systems · software engineering · intelligent products.</span>`,
  projects: `<span class="cmd">MISSION_01</span> Vermeg — AI UI-to-Code Converter<br><span class="cmd">MISSION_02</span> Orange × MedTech — Explainable AI PFE Portal<br><span class="cmd">MISSION_03</span> Zero Eclipse — Java Action Platformer<br><span class="cmd">MISSION_04</span> Monoprix — Sales Data Centralization<br><span class="cmd">MISSION_05</span> HERE — Human Matching Product Demo<br><span class="cmd">MISSION_06</span> AI Lab — Hidden Markov Weather Analysis<br><span class="cmd">MISSION_07</span> Barcelona × Dubai — Market Explorer MVP<br><span class="cmd">MISSION_08</span> PadelVision — AI Padel Coach<br><span class="cmd">MISSION_09</span> ML Pipeline — Distributed ML Workflow <span class="dim">[fork / collaboration]</span><br><span class="cmd">MISSION_10</span> Treasure Hunter — C/SDL2 Game<br><span class="cmd">MISSION_11</span> VeriPath — Study-Abroad Decision AI`,
  experience: `VERMEG → AI / computer vision internship<br>MONOPRIX → Data systems / automation internship<br>ORANGE DIGITAL CENTER × MEDTECH → Full-stack XAI project<br>INDEPENDENT R&D → PadelVision + VeriPath AI<br>COLLAB SYSTEMS → ML pipeline / deployment architecture`,
  skills: `AI → Machine Learning, NLP, Computer Vision, OCR, XAI, HMM<br>AI TOOLING → OpenCV, MediaPipe, Tesseract, LLaVA, Ollama, hmmlearn<br>ENGINEERING → Python, Java, JavaScript, C, PHP<br>WEB → React, Node.js, Express, Streamlit, HTML/CSS<br>DATA → MySQL, SQL Server, MongoDB, pandas<br>CREATIVE WEB → Three.js, GSAP, WebGL, motion UI`,
  graphics: `<span class="cmd">ANIS.EXE MOTION STACK</span><br>Three.js → illuminated signal core<br>Native scroll → coordinated camera movement<br>CSS → glass UI, responsive system, reduced-motion fallback`,
  status: `<span class="green">● AVAILABLE FOR NEXT MISSION</span><br>Final-year Software Engineering student @ MedTech<br>PFE target: 2026–2027<br>Target: AI/ML · backend · full-stack product engineering`,
  vermeg: `<span class="cmd">MISSION_01 // VERMEG</span><br>AI UI-to-code prototype.<br>OpenCV → Tesseract OCR → LLaVA/Ollama → HTML/CSS generation.`,
  orange: `<span class="cmd">MISSION_02 // ORANGE × MEDTECH</span><br>Explainable AI internship/PFE management platform.<br>CV parsing → matching → ranking → explainable shortlisting.`,
  monoprix: `<span class="cmd">MISSION_04 // MONOPRIX</span><br>Centralized sales-data workflow and Python import automation.`,
  hmm: `<span class="cmd">MISSION_06 // HMM</span><br>Gaussian Hidden Markov Model for latent weather-state inference and forecasting.<br>Baum-Welch · Viterbi · AIC/BIC.`,
  padel: `<span class="cmd">MISSION_08 // PADELVISION AI</span><br>Video → MediaPipe pose → movement analysis → tactical strategy, rebuild steps and drills.<br><a href="https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai" target="_blank">[ OPEN PROJECT ↗ ]</a>`,
  veripath: `<span class="cmd">MISSION_11 // VERIPATH AI</span><br>Profile → academic discovery → transparent recommendation → shortlist → decision support.<br><a href="https://github.com/anischelly26/anischelly26/tree/main/projects/veripath-ai" target="_blank">[ OPEN PROJECT ↗ ]</a>`,
  mlpipeline: `<span class="cmd">MISSION_09 // ML PIPELINE</span><br>Ingest → clean → train → explain.<br>FastAPI orchestration · Supabase persistence · Hugging Face ML services · Vercel frontend.<br><span class="dim">Fork / collaborative learning codebase. Upstream: Adam Bouacida (adam12bT).</span><br><a href="https://github.com/anischelly26/ml_pipeline" target="_blank">[ EXPLORE FORK ↗ ]</a>`,
  studyabroad: `<span class="cmd">VERIPATH AI</span><br>The Study Abroad AI project is now named VeriPath AI.<br>Type <span class="cmd">veripath</span>.`,
  contact: `GitHub → <a href="https://github.com/anischelly26" target="_blank">github.com/anischelly26 ↗</a><br>Email → <a href="mailto:anis.chelli@medtech.tn">anis.chelli@medtech.tn ↗</a>`,
  'sudo hire anis': `<span class="green">PERMISSION GRANTED.</span><br>Recruiter mode unlocked.<br><a href="mailto:anis.chelli@medtech.tn">[ SEND TRANSMISSION ↗ ]</a>`,
};
commands.resume='<a href="resume.html">[ VIEW / PRINT RÉSUMÉ ↗ ]</a>';commands.help+=' &nbsp; resume';
function output(html){const p=document.createElement('p');p.innerHTML=html;terminalOutput.append(p);terminalOutput.scrollTop=terminalOutput.scrollHeight}
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelector('#terminalForm').addEventListener('submit',e=>{
 e.preventDefault();const raw=terminalInput.value.trim();if(!raw)return;
 output('<span class="dim">anis@core:~$</span> '+escape(raw));
 const command=raw.toLowerCase();
 if(command==='clear')terminalOutput.replaceChildren();
 else if(Object.hasOwn(commands,command))output(commands[command]);
 else output('<span class="dim">command not found:</span> '+escape(raw)+'<br>Try <span class="cmd">help</span>.');
 terminalInput.value='';
});
})();
