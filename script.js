const boot = document.getElementById('boot');
const app = document.getElementById('app');
const bootLines = document.getElementById('bootLines');
const bootBar = document.getElementById('bootBar');
const bootPercent = document.getElementById('bootPercent');

const sequence = [
  'boot sequence initiated...',
  'loading neural modules...',
  'mounting project archive...',
  'indexing internship missions...',
  'checking identity signature...',
  '<span class="ok">identity: ANIS CHELLI // VERIFIED</span>',
  '<span class="ok">ACCESS GRANTED</span>'
];

let progress = 0;
let line = 0;
function renderLine(){
  if(line >= sequence.length) return;
  const p = document.createElement('div');
  p.innerHTML = '> ' + sequence[line++];
  bootLines.appendChild(p);
  setTimeout(renderLine, 245);
}
renderLine();

const timer = setInterval(()=>{
  progress += Math.floor(Math.random()*8)+3;
  if(progress >= 100){
    progress = 100;
    clearInterval(timer);
    setTimeout(()=>{
      boot.classList.add('done');
      app.classList.remove('hidden');
      document.querySelectorAll('.reveal').forEach((el,i)=>{
        if(el.closest('.hero')) setTimeout(()=>el.classList.add('visible'), 110 + i*80);
      });
    }, 650);
  }
  bootBar.style.width = progress + '%';
  bootPercent.textContent = progress + '%';
}, 90);

const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let w = innerWidth, h = innerHeight;
let mouse = {x:w*.5,y:h*.5};
let stars = [];

function resize(){
  w = innerWidth; h = innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = w*dpr; canvas.height = h*dpr;
  canvas.style.width = w+'px'; canvas.style.height = h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.min(220, Math.floor(w*h/7000))},()=>({
    x:Math.random()*w,y:Math.random()*h,z:Math.random(),r:Math.random()*1.1+.15,v:Math.random()*.16+.03
  }));
}
resize(); addEventListener('resize',resize);
addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

function draw(){
  ctx.clearRect(0,0,w,h);
  const parX = (mouse.x-w/2)*.012;
  const parY = (mouse.y-h/2)*.012;
  for(const s of stars){
    s.y += s.v*(.5+s.z);
    if(s.y>h+5){s.y=-5;s.x=Math.random()*w;}
    const alpha = .16 + s.z*.58;
    ctx.beginPath();
    ctx.fillStyle=`rgba(${s.z>.82?215:190},${s.z>.82?169:190},${s.z>.82?79:185},${alpha})`;
    ctx.arc(s.x + parX*s.z, s.y + parY*s.z, s.r*(.7+s.z), 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

const glow = document.getElementById('cursorGlow');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const openers = [document.getElementById('terminalToggle'),document.getElementById('heroTerminal'),document.getElementById('nextTerminal')];
const closeBtn = document.getElementById('terminalClose');
function openTerminal(){terminal.classList.add('open');terminal.setAttribute('aria-hidden','false');setTimeout(()=>terminalInput.focus(),220)}
function closeTerminal(){terminal.classList.remove('open');terminal.setAttribute('aria-hidden','true')}
openers.forEach(b=>b&&b.addEventListener('click',openTerminal));
closeBtn.addEventListener('click',closeTerminal);
addEventListener('keydown',e=>{if(e.key==='Escape')closeTerminal();if(e.key==='`'&&!e.metaKey&&!e.ctrlKey){e.preventDefault();openTerminal();}});

const commands = {
  help:`<span class="cmd">AVAILABLE COMMANDS</span><br>whoami &nbsp; projects &nbsp; experience &nbsp; skills &nbsp; status &nbsp; vermeg &nbsp; orange &nbsp; monoprix &nbsp; hmm &nbsp; contact &nbsp; clear &nbsp; sudo hire anis`,
  whoami:`<span class="green">ANIS CHELLI</span><br>Final-year Software Engineering student @ MedTech<br>Software Engineer // AI Builder<br><span class="dim">Focus: AI/ML · backend · full-stack · intelligent systems.</span>`,
  projects:`<span class="cmd">MISSION_01</span> Vermeg — AI UI-to-Code Converter<br><span class="cmd">MISSION_02</span> Orange × MedTech — Explainable AI Internship & PFE Portal<br><span class="cmd">MISSION_03</span> Monoprix — Sales Data Centralization<br><span class="cmd">MISSION_04</span> AI Lab — Hidden Markov Weather Analysis`,
  experience:`VERMEG → AI internship // Python UI-to-code prototype<br>MONOPRIX → Data management internship // centralized sales-data workflows<br>ORANGE DIGITAL CENTER × MEDTECH → Full-stack XAI senior project`,
  skills:`AI → Machine Learning, NLP, Computer Vision, OCR, Explainable AI, HMM<br>AI TOOLING → OpenCV, Tesseract, LLaVA, Ollama, hmmlearn<br>ENGINEERING → Python, Java, JavaScript, C, PHP<br>WEB → React, Node.js, Express, HTML/CSS<br>DATA → MySQL, SQL Server, MongoDB<br>SYSTEMS → Git, GitHub, Linux, Windows, Azure, Agile/Scrum`,
  status:`<span class="green">● AVAILABLE FOR NEXT MISSION</span><br>Final-year Software Engineering student @ MedTech<br>PFE target: 2026–2027<br>Target domains: AI/ML, backend, full-stack product engineering`,
  vermeg:`<span class="cmd">MISSION_01 // VERMEG</span><br>Built an end-to-end Python prototype that converts UI screenshots into HTML/CSS.<br>Pipeline: OpenCV preprocessing → Tesseract OCR → LLaVA via Ollama → code generation.<br><span class="dim">Developed independently with weekly supervisor reviews.</span>`,
  orange:`<span class="cmd">MISSION_02 // ORANGE × MEDTECH</span><br>Internship & PFE Management Portal with Explainable AI Shortlisting.<br>CV parsing → skill extraction/matching → ranking → human-readable explanation.<br><span class="dim">Full-stack team project with React / Node.js / Express / MongoDB architecture.</span>`,
  monoprix:`<span class="cmd">MISSION_03 // MONOPRIX</span><br>Centralized daily store-sales data and automated file imports with Python.<br>Focus: MySQL, SQL Server, data integrity, query efficiency and reduced manual handling.`,
  hmm:`<span class="cmd">MISSION_04 // HIDDEN MARKOV WEATHER ANALYSIS</span><br>Gaussian HMM for latent weather-state inference and forecasting.<br>Baum-Welch training · Viterbi decoding · AIC/BIC model selection · next-step forecasting.<br><span class="dim">Team project with Youssef Mani.</span>`,
  contact:`GitHub → <a href="https://github.com/anischelly26" target="_blank">github.com/anischelly26 ↗</a><br>School email → <a href="mailto:anis.chelli@medtech.tn">anis.chelli@medtech.tn ↗</a>`,
  'sudo hire anis':`<span class="green">PERMISSION GRANTED.</span><br>Recruiter mode unlocked.<br>Opening communication channel...<br><a href="mailto:anis.chelli@medtech.tn">[ SEND TRANSMISSION ↗ ]</a>`
};

function addOutput(html, cls=''){
  const p=document.createElement('p');
  p.className=cls; p.innerHTML=html; terminalOutput.appendChild(p);
  terminalOutput.scrollTop=terminalOutput.scrollHeight;
}

document.getElementById('terminalForm').addEventListener('submit',e=>{
  e.preventDefault();
  const raw=terminalInput.value.trim();
  if(!raw)return;
  addOutput(`<span class="dim">anis@core:~$</span> ${raw}`);
  const cmd=raw.toLowerCase();
  if(cmd==='clear'){terminalOutput.innerHTML='';}
  else if(commands[cmd]) addOutput(commands[cmd]);
  else addOutput(`<span class="dim">command not found:</span> ${raw}<br>Try <span class="cmd">help</span>.`);
  terminalInput.value='';
});

const hero = document.querySelector('.hero');
addEventListener('scroll',()=>{
  if(scrollY < innerHeight*1.2){
    const y=scrollY;
    hero.style.transform=`translateY(${y*.08}px)`;
    hero.style.opacity=String(Math.max(.2,1-y/(innerHeight*1.15)));
  }
},{passive:true});