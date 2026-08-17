const boot = document.getElementById('boot');
const app = document.getElementById('app');
const bootLines = document.getElementById('bootLines');
const bootBar = document.getElementById('bootBar');
const bootPercent = document.getElementById('bootPercent');
const scrollProgress = document.getElementById('scrollProgress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sequence = [
  'boot sequence initiated...',
  'initializing WebGL renderer...',
  'mounting neural project archive...',
  'loading motion system...',
  'mapping mission topology...',
  'checking identity signature...',
  '<span class="ok">identity: ANIS CHELLI // VERIFIED</span>',
  '<span class="ok">ACCESS GRANTED</span>',
];

let progress = 0;
let line = 0;

function renderLine() {
  if (line >= sequence.length) return;
  const row = document.createElement('div');
  row.innerHTML = `> ${sequence[line++]}`;
  bootLines.appendChild(row);
  setTimeout(renderLine, 185);
}
renderLine();

const bootTimer = setInterval(() => {
  progress += Math.floor(Math.random() * 9) + 4;
  if (progress >= 100) {
    progress = 100;
    clearInterval(bootTimer);
    setTimeout(() => {
      boot.classList.add('done');
      app.classList.remove('hidden');
      startMotionSystem();
    }, 520);
  }
  bootBar.style.width = `${progress}%`;
  bootPercent.textContent = `${progress}%`;
}, 80);

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