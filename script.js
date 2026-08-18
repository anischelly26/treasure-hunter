const boot = document.getElementById('boot');
const app = document.getElementById('app');
const bootLines = document.getElementById('bootLines');
const bootBar = document.getElementById('bootBar');
const bootPercent = document.getElementById('bootPercent');
const scrollProgress = document.getElementById('scrollProgress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ANIS SIGNAL SEQUENCE --------------------------------------------------------
// The intro is intentionally personal rather than a generic "hacker boot".
// It reuses the existing boot markup so the rest of the portfolio stays intact.
const signalStyles = document.createElement('style');
signalStyles.id = 'anis-signal-sequence';
signalStyles.textContent = `
  .boot{background:radial-gradient(circle at 50% 42%,#171006 0,#090704 26%,#030303 58%,#010101 100%);isolation:isolate}
  .boot::before{content:"";position:absolute;inset:-25%;background:radial-gradient(circle at 50% 50%,rgba(215,169,79,.08),transparent 28%),conic-gradient(from 90deg at 50% 50%,transparent 0 18%,rgba(215,169,79,.035) 24%,transparent 31% 67%,rgba(215,169,79,.025) 74%,transparent 82%);filter:blur(16px);animation:signalAura 10s linear infinite;z-index:-3}
  .boot::after{content:"";position:absolute;left:-15%;right:-15%;top:-20%;height:24%;background:linear-gradient(180deg,transparent,rgba(215,169,79,.045),transparent);filter:blur(18px);animation:signalScan 3.1s ease-in-out infinite;pointer-events:none;z-index:-1}
  .boot__grid{inset:auto;left:50%;top:46%;width:min(610px,78vw);height:min(610px,78vw);border-radius:50%;border:1px solid rgba(215,169,79,.18);background:none;opacity:1;mask-image:none;transform:translate(-50%,-50%);box-shadow:0 0 0 42px rgba(215,169,79,.016),0 0 0 98px rgba(215,169,79,.01),inset 0 0 80px rgba(215,169,79,.025);animation:signalOrbit 13s linear infinite}
  .boot__grid::before,.boot__grid::after{content:"";position:absolute;border-radius:50%;inset:9%;border:1px dashed rgba(215,169,79,.16)}
  .boot__grid::after{inset:26%;border-style:solid;border-color:rgba(215,169,79,.1);box-shadow:0 0 42px rgba(215,169,79,.035)}
  .signal-space{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:-2}
  .signal-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:#d7a94f;opacity:.16;box-shadow:0 0 10px rgba(215,169,79,.45);animation:signalParticle var(--dur,5s) ease-in-out infinite;animation-delay:var(--delay,0s)}
  .boot__inner{width:min(760px,90vw);text-align:center;z-index:2}
  .boot__head{justify-content:center;flex-direction:column;gap:13px;margin-bottom:24px;color:#6f6b62}
  .boot__head>span{font-size:8px;letter-spacing:.25em}
  .boot__mark{position:relative;width:86px;height:86px;border-radius:50%;border:1px solid rgba(215,169,79,.7);font-size:19px;letter-spacing:.08em;background:radial-gradient(circle,rgba(215,169,79,.12),rgba(215,169,79,.015) 58%,transparent 60%);box-shadow:0 0 55px rgba(215,169,79,.12),inset 0 0 34px rgba(215,169,79,.05)}
  .boot__mark::before{content:"";position:absolute;inset:-13px;border-radius:50%;border:1px dashed rgba(215,169,79,.3);animation:signalOrbit 7s linear infinite}
  .boot__mark::after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;background:#d7a94f;right:-14px;top:50%;box-shadow:0 0 18px 4px rgba(215,169,79,.32);transform:translateY(-50%)}
  .boot__lines{height:auto;min-height:184px;display:grid;place-items:center;color:#8d887f;font-size:11px;line-height:1.5}
  .signal-lock{display:grid;gap:8px;justify-items:center}
  .signal-label{font-size:8px;letter-spacing:.34em;color:#74684f}
  .signal-title{font-family:var(--sans);font-size:clamp(48px,8vw,88px);font-weight:900;letter-spacing:-.075em;line-height:.82;color:#f5f1e8;text-shadow:0 0 40px rgba(215,169,79,.04)}
  .signal-title span{color:#d7a94f;font-weight:500}
  .signal-role{font-size:9px;letter-spacing:.24em;color:#a19a8e;margin-top:3px}
  .signal-status{height:28px;margin-top:15px;display:flex;align-items:center;justify-content:center;gap:9px;font-size:8px;letter-spacing:.22em;color:#d7a94f}
  .signal-status__dot{width:5px;height:5px;border-radius:50%;background:#d7a94f;box-shadow:0 0 14px rgba(215,169,79,.65);animation:signalPulse 1.05s ease-in-out infinite}
  .signal-status b{font-weight:400;transition:opacity .18s ease,transform .18s ease}
  .signal-status b.swap{opacity:0;transform:translateY(5px)}
  .signal-missions{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-top:14px}
  .signal-missions span{padding:7px 10px;border:1px solid rgba(255,255,255,.075);border-radius:999px;font-size:7px;letter-spacing:.14em;color:#5d5b56;background:rgba(255,255,255,.01);transition:.35s ease}
  .signal-missions span.active{color:#e2c783;border-color:rgba(215,169,79,.45);background:rgba(215,169,79,.055);box-shadow:0 0 24px rgba(215,169,79,.05)}
  .boot__bar{width:min(560px,78vw);margin:24px auto 0;height:1px;background:#1b1812;overflow:visible;position:relative}
  .boot__bar::before{content:"SIGNAL SYNC";position:absolute;left:0;top:-15px;font-size:6px;letter-spacing:.22em;color:#4f4a42}
  .boot__bar span{background:linear-gradient(90deg,#6b4913,#d7a94f,#ffe4a4);box-shadow:0 0 18px rgba(215,169,79,.42);transition:none}
  .boot__meta{width:min(560px,78vw);margin:0 auto;padding-top:10px;color:#55514a}
  .boot__meta span{font-size:7px;letter-spacing:.2em}
  .boot__meta b{font-size:8px;letter-spacing:.16em}
  .signal-enter{color:#f0d692!important;text-shadow:0 0 18px rgba(215,169,79,.16)}
  @keyframes signalOrbit{to{transform:translate(-50%,-50%) rotate(360deg)}}
  @keyframes signalAura{to{transform:rotate(360deg)}}
  @keyframes signalScan{0%{transform:translateY(-70vh);opacity:0}22%{opacity:.5}75%{opacity:.25}100%{transform:translateY(145vh);opacity:0}}
  @keyframes signalParticle{0%,100%{transform:translate3d(0,0,0) scale(.65);opacity:.08}50%{transform:translate3d(0,-18px,0) scale(1.25);opacity:.32}}
  @keyframes signalPulse{0%,100%{opacity:.35;transform:scale(.75)}50%{opacity:1;transform:scale(1.15)}}
  @media(max-width:620px){
    .boot__grid{width:88vw;height:88vw;top:43%}
    .boot__mark{width:72px;height:72px;font-size:16px}
    .signal-role{font-size:7px;letter-spacing:.17em}
    .signal-missions{max-width:310px;margin-left:auto;margin-right:auto}
    .signal-missions span{padding:6px 8px;font-size:6px}
    .boot__lines{min-height:172px}
  }
  @media(prefers-reduced-motion:reduce){
    .boot::before,.boot::after,.boot__grid,.boot__mark::before,.signal-particle,.signal-status__dot{animation:none!important}
  }
`;
document.head.appendChild(signalStyles);

const signalSpace = document.createElement('div');
signalSpace.className = 'signal-space';
for (let i = 0; i < 28; i += 1) {
  const particle = document.createElement('i');
  particle.className = 'signal-particle';
  const x = (i * 37 + 11) % 100;
  const y = (i * 61 + 17) % 100;
  const delay = -((i % 9) * 0.41);
  const duration = 4.2 + (i % 6) * 0.6;
  particle.style.cssText = `left:${x}%;top:${y}%;--delay:${delay}s;--dur:${duration}s`;
  signalSpace.appendChild(particle);
}
boot.prepend(signalSpace);

const bootHeadLabel = boot.querySelector('.boot__head > span');
const bootMetaLabel = boot.querySelector('.boot__meta > span');
if (bootHeadLabel) bootHeadLabel.textContent = 'ANIS SIGNAL // TUNIS · WORLDWIDE';
if (bootMetaLabel) bootMetaLabel.textContent = 'FROM IDEAS TO SYSTEMS';

bootLines.innerHTML = `
  <div>
    <div class="signal-lock">
      <div class="signal-label">IDENTITY CHANNEL</div>
      <div class="signal-title">ANIS<span>.EXE</span></div>
      <div class="signal-role">SOFTWARE ENGINEER × AI BUILDER</div>
    </div>
    <div class="signal-status"><span class="signal-status__dot"></span><b id="signalStatus">SIGNATURE VERIFIED</b></div>
    <div class="signal-missions" id="signalMissions">
      <span>VERMEG</span><span>ORANGE</span><span>MONOPRIX</span><span>PADELVISION</span>
    </div>
  </div>
`;

const signalStatus = document.getElementById('signalStatus');
const signalMissions = [...document.querySelectorAll('#signalMissions span')];
const signalStates = [
  ['SIGNATURE VERIFIED', 180],
  ['PROJECT ARCHIVE LINKED', 720],
  ['AI SYSTEMS ONLINE', 1260],
  ['INTERACTIVE PORTFOLIO READY', 1800],
  ['ENTERING ANIS.EXE', 2310],
];

signalStates.forEach(([text, delay]) => {
  setTimeout(() => {
    signalStatus.classList.add('swap');
    setTimeout(() => {
      signalStatus.textContent = text;
      signalStatus.classList.toggle('signal-enter', text === 'ENTERING ANIS.EXE');
      signalStatus.classList.remove('swap');
    }, 150);
  }, prefersReducedMotion ? Math.min(delay, 420) : delay);
});

signalMissions.forEach((mission, index) => {
  setTimeout(() => mission.classList.add('active'), prefersReducedMotion ? 180 : 480 + index * 300);
});

const bootDuration = prefersReducedMotion ? 720 : 2700;
const bootStartedAt = performance.now();
function updateSignalProgress(now) {
  const ratio = Math.min(1, (now - bootStartedAt) / bootDuration);
  const eased = 1 - Math.pow(1 - ratio, 3);
  const progress = Math.round(eased * 100);
  bootBar.style.width = `${progress}%`;
  bootPercent.textContent = `${progress}%`;

  if (ratio < 1) {
    requestAnimationFrame(updateSignalProgress);
    return;
  }

  setTimeout(() => {
    boot.classList.add('done');
    app.classList.remove('hidden');
    startMotionSystem();
  }, prefersReducedMotion ? 120 : 320);
}
requestAnimationFrame(updateSignalProgress);

// Cursor / ambient light
const glow = document.getElementById('cursorGlow');
window.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
  document.documentElement.style.setProperty('--my', `${event.clientY}px`);
  if (glow) {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});

// Scroll progress + active section rail
const railItems = [...document.querySelectorAll('.section-rail span')];
const sections = [...document.querySelectorAll('main > section[id]')];

function updateScrollUI() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = Math.min(1, window.scrollY / max);
  if (scrollProgress) scrollProgress.style.width = `${ratio * 100}%`;

  const focusY = window.scrollY + window.innerHeight * 0.46;
  let active = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= focusY) active = section.id;
  });
  railItems.forEach((item) => item.classList.toggle('active', item.dataset.target === active));
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

// Magnetic controls
if (!prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach((element) => {
    const strength = Number(element.dataset.strength || 14);
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      element.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = 'translate3d(0,0,0)';
    });
  });
}

// Premium card tilt. It deliberately stays subtle so the portfolio does not become a gamer dashboard.
if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 5.2;
      const rotateX = (0.5 - py) * 4.2;
      card.style.setProperty('--card-x', `${px * 100}%`);
      card.style.setProperty('--card-y', `${py * 100}%`);
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

function fallbackReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function startMotionSystem() {
  if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Hero boot reveal
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .fromTo('.hero__eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 })
    .fromTo('.hero-line--solid', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.95 }, '-=.2')
    .fromTo('.hero-line--outline', { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05 }, '-=.72')
    .fromTo('.hero__role', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=.48')
    .fromTo('.hero__copy', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, '-=.38')
    .fromTo('.hero__actions', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, '-=.42')
    .fromTo('.hero__signal', { opacity: 0, x: 35 }, { opacity: 1, x: 0, duration: 0.8 }, '-=.52');

  // Hero typography gets pulled apart as the user descends.
  gsap.to('.hero-line--solid', {
    xPercent: -13,
    opacity: 0.28,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.1 },
  });
  gsap.to('.hero-line--outline', {
    xPercent: 17,
    opacity: 0.12,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.1 },
  });
  gsap.to('.hero__signal', {
    y: 120,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: '35% top', end: 'bottom top', scrub: 1 },
  });

  // Section reveals
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.closest('#home')) return;
    gsap.fromTo(element,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 87%', toggleActions: 'play none none none' },
      },
    );
  });

  // Mission archive cinematic entrance
  gsap.fromTo('.mission',
    { opacity: 0, y: 70, scale: 0.975 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.09,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.mission-grid', start: 'top 79%' },
    },
  );

  // Slow visual drift gives the cards depth without constant distraction.
  document.querySelectorAll('.mission__visual').forEach((visual, index) => {
    gsap.to(visual, {
      backgroundPosition: `${index % 2 ? 18 : -18}px 24px`,
      ease: 'none',
      scrollTrigger: { trigger: visual.closest('.mission'), start: 'top bottom', end: 'bottom top', scrub: 1.8 },
    });
  });

  gsap.to('.next__ring', {
    rotate: 135,
    scale: 1.08,
    ease: 'none',
    scrollTrigger: { trigger: '#next', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
  });

  ScrollTrigger.refresh();
}

// Terminal
const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const openers = [
  document.getElementById('terminalToggle'),
  document.getElementById('heroTerminal'),
  document.getElementById('nextTerminal'),
];
const closeBtn = document.getElementById('terminalClose');

function openTerminal() {
  terminal.classList.add('open');
  terminal.setAttribute('aria-hidden', 'false');
  setTimeout(() => terminalInput.focus(), 220);
}
function closeTerminal() {
  terminal.classList.remove('open');
  terminal.setAttribute('aria-hidden', 'true');
}
openers.forEach((button) => button?.addEventListener('click', openTerminal));
closeBtn.addEventListener('click', closeTerminal);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeTerminal();
  if (event.key === '`' && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    openTerminal();
  }
});

const commands = {
  help: `<span class="cmd">AVAILABLE COMMANDS</span><br>whoami &nbsp; projects &nbsp; experience &nbsp; skills &nbsp; graphics &nbsp; status &nbsp; vermeg &nbsp; orange &nbsp; monoprix &nbsp; hmm &nbsp; padel &nbsp; veripath &nbsp; mlpipeline &nbsp; contact &nbsp; clear &nbsp; sudo hire anis`,
  whoami: `<span class="green">ANIS CHELLI</span><br>Final-year Software Engineering student @ MedTech<br>Software Engineer // AI Builder<br><span class="dim">AI systems · software engineering · intelligent products.</span>`,
  projects: `<span class="cmd">MISSION_01</span> Vermeg — AI UI-to-Code Converter<br><span class="cmd">MISSION_02</span> Orange × MedTech — Explainable AI PFE Portal<br><span class="cmd">MISSION_03</span> Monoprix — Sales Data Centralization<br><span class="cmd">MISSION_04</span> AI Lab — Hidden Markov Weather Analysis<br><span class="cmd">MISSION_05</span> PadelVision — AI Padel Coach<br><span class="cmd">MISSION_06</span> VeriPath — Study-Abroad Decision AI<br><span class="cmd">MISSION_07</span> ML Pipeline — Distributed ML Workflow <span class="dim">[fork / collaboration]</span>`,
  experience: `VERMEG → AI / computer vision internship<br>MONOPRIX → Data systems / automation internship<br>ORANGE DIGITAL CENTER × MEDTECH → Full-stack XAI project<br>INDEPENDENT R&D → PadelVision + VeriPath AI<br>COLLAB SYSTEMS → ML pipeline / deployment architecture`,
  skills: `AI → Machine Learning, NLP, Computer Vision, OCR, XAI, HMM<br>AI TOOLING → OpenCV, MediaPipe, Tesseract, LLaVA, Ollama, hmmlearn<br>ENGINEERING → Python, Java, JavaScript, C, PHP<br>WEB → React, Node.js, Express, Streamlit, HTML/CSS<br>DATA → MySQL, SQL Server, MongoDB, pandas<br>CREATIVE WEB → Three.js, GSAP, WebGL, motion UI`,
  graphics: `<span class="cmd">ANIS.EXE MOTION STACK</span><br>Three.js → real-time WebGL environment<br>GSAP → cinematic timeline animation<br>ScrollTrigger → scroll-scrubbed transitions<br>CSS → glass UI, responsive system, reduced-motion fallback`,
  status: `<span class="green">● AVAILABLE FOR NEXT MISSION</span><br>Final-year Software Engineering student @ MedTech<br>PFE target: 2026–2027<br>Target: AI/ML · backend · full-stack product engineering`,
  vermeg: `<span class="cmd">MISSION_01 // VERMEG</span><br>AI UI-to-code prototype.<br>OpenCV → Tesseract OCR → LLaVA/Ollama → HTML/CSS generation.`,
  orange: `<span class="cmd">MISSION_02 // ORANGE × MEDTECH</span><br>Explainable AI internship/PFE management platform.<br>CV parsing → matching → ranking → explainable shortlisting.`,
  monoprix: `<span class="cmd">MISSION_03 // MONOPRIX</span><br>Centralized sales-data workflow and Python import automation.`,
  hmm: `<span class="cmd">MISSION_04 // HMM</span><br>Gaussian Hidden Markov Model for latent weather-state inference and forecasting.<br>Baum-Welch · Viterbi · AIC/BIC.`,
  padel: `<span class="cmd">MISSION_05 // PADELVISION AI</span><br>Video → MediaPipe pose → movement analysis → tactical strategy, rebuild steps and drills.<br><a href="https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai" target="_blank">[ OPEN PROJECT ↗ ]</a>`,
  veripath: `<span class="cmd">MISSION_06 // VERIPATH AI</span><br>Profile → academic discovery → transparent recommendation → shortlist → decision support.<br><a href="https://github.com/anischelly26/anischelly26/tree/main/projects/veripath-ai" target="_blank">[ OPEN PROJECT ↗ ]</a>`,
  mlpipeline: `<span class="cmd">MISSION_07 // ML PIPELINE</span><br>Ingest → clean → train → explain.<br>FastAPI orchestration · Supabase persistence · Hugging Face ML services · Vercel frontend.<br><span class="dim">Fork / collaborative learning codebase. Upstream: Adam Bouacida (adam12bT).</span><br><a href="https://github.com/anischelly26/ml_pipeline" target="_blank">[ EXPLORE FORK ↗ ]</a>`,
  studyabroad: `<span class="cmd">VERIPATH AI</span><br>The Study Abroad AI project is now named VeriPath AI.<br>Type <span class="cmd">veripath</span>.`,
  contact: `GitHub → <a href="https://github.com/anischelly26" target="_blank">github.com/anischelly26 ↗</a><br>Email → <a href="mailto:anis.chelli@medtech.tn">anis.chelli@medtech.tn ↗</a>`,
  'sudo hire anis': `<span class="green">PERMISSION GRANTED.</span><br>Recruiter mode unlocked.<br><a href="mailto:anis.chelli@medtech.tn">[ SEND TRANSMISSION ↗ ]</a>`,
};

function addOutput(html, className = '') {
  const row = document.createElement('p');
  row.className = className;
  row.innerHTML = html;
  terminalOutput.appendChild(row);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

document.getElementById('terminalForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const raw = terminalInput.value.trim();
  if (!raw) return;
  addOutput(`<span class="dim">anis@core:~$</span> ${raw}`);
  const command = raw.toLowerCase();
  if (command === 'clear') terminalOutput.innerHTML = '';
  else if (commands[command]) addOutput(commands[command]);
  else addOutput(`<span class="dim">command not found:</span> ${raw}<br>Try <span class="cmd">help</span>.`);
  terminalInput.value = '';
});