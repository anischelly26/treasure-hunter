(() => {
  'use strict';
  const root = document.documentElement;
  const menu = document.querySelector('#menu');
  const menuButton = document.querySelector('.menu-button');
  const caseDialog = document.querySelector('#case-study');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches;
  let ticking = false;
  const chapters = [...document.querySelectorAll('.chapter')];
  const motionButton = document.querySelector('#motion');
  const data = {
    vermeg: {
      title: 'From screenshot to editable interface.',
      meta: 'VERMEG / AI INTERNSHIP / JULY–AUGUST 2024',
      problem: 'A screenshot contains pixels, not reusable interface structure. Low-contrast text and mixed visual elements make direct extraction unreliable.',
      contribution: 'Built a Python prototype combining screenshot preprocessing, text extraction and HTML/CSS generation during the Vermeg internship.',
      decisions: 'Used OpenCV preprocessing—including contrast enhancement, CLAHE and binarization—to improve the input to Tesseract. LLaVA ran locally through Ollama to interpret the interface and support code generation.',
      result: 'Produced an end-to-end prototype and checked generated-code syntax and layout relevance. It is presented as a prototype, not a production-grade pixel-perfect converter.',
      caveat: 'No independently verified accuracy percentage or performance benchmark is claimed.',
      links: [['PROJECT SOURCE', 'https://github.com/anischelly26/ui-to-html-css-translator'], ['PROJECT PLAYGROUND', 'playground.html#missions']]
    },
    orange: {
      title: 'Shortlisting with a reason.',
      meta: 'ORANGE DIGITAL CENTER × MEDTECH / TEAM PROJECT / 2025–2026',
      problem: 'Internship recruitment becomes fragmented when CVs, applications, supervisor assignments and evaluations live in separate workflows. A ranking also needs an explanation a coordinator can inspect.',
      contribution: 'Contributed to data preparation, backend and system logic, and Agile delivery within the team. This is shared project work—not a claim of sole authorship.',
      decisions: 'The documented architecture uses React, Node.js, Express and MongoDB. The matching module is positioned as decision support: skill extraction and ranking assist a human coordinator rather than making the final hiring decision.',
      result: 'The team developed an internship/PFE portal project covering application management and explainable matching. The case study documents the wider scope; no production adoption or hiring-impact metrics are claimed.',
      caveat: 'Team: Asma Gannar, Eya Bedoui, Fares Anas, Adem Bouaccida, Skander Bouricha and Anis Chelli.',
      links: [['DOCUMENTED CASE STUDY', 'https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/orange-xai-portal.md'], ['PROJECT PLAYGROUND', 'playground.html#missions']]
    },
    monoprix: {
      title: 'A consistent foundation for sales data.',
      meta: 'MONOPRIX HEADQUARTERS, TUNIS / DATA INTERNSHIP / JULY 2024',
      problem: 'Sales information from multiple stores needed a structured, centralized database and a repeatable path from external files into that database.',
      contribution: 'Designed a centralized MySQL database and implemented Python scripts for sales-data imports during the internship.',
      decisions: 'Organized store, product, time and transaction information in a relational structure. Focused on connecting Python imports to the database while considering redundancy, integrity and consistency.',
      result: 'Implemented a practical import and centralization workflow to reduce repetitive manual handling and make sales information more accessible.',
      caveat: 'Commercial data is not exposed. No invented time savings or throughput figures are included.',
      links: [['DOCUMENTED CASE STUDY', 'https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/monoprix-data-centralization.md'], ['PROJECT PLAYGROUND', 'playground.html#missions']]
    },
    barcelona: {
      title: 'Two markets. A comparable view.',
      meta: 'BARCELONA × DUBAI / PROPERTY ANALYTICS / MVP IN PROGRESS',
      problem: 'Comparing property markets requires consistent currencies, area units and contextual signals instead of comparing raw listing prices.',
      contribution: 'Developing an interactive Next.js portfolio MVP focused on cross-market comparisons, normalized pricing and geospatial signals.',
      decisions: 'Separating the comparison interface and typed data model from the longer-term ingestion and backend roadmap. Real-data coverage and production readiness must be checked independently of a polished interface.',
      result: 'An in-progress MVP and source repository are available. This case study does not claim a completed scraping pipeline, production PostGIS backend or verified investment returns.',
      caveat: 'The hosted MVP may require sign-in. The public repository is available without a ChatGPT account. Demonstration values are not investment guidance.',
      links: [['PUBLIC SOURCE', 'https://github.com/anischelly26/barcelona-dubai-market-explorer'], ['HOSTED MVP · MAY REQUIRE SIGN-IN', 'https://barcelona-dubai-market-explorer.rhythmx.chatgpt.site']]
    }
  };
  function motionState() {
    motionButton.textContent = paused ? 'ENABLE MOTION' : 'PAUSE MOTION';
    motionButton.setAttribute('aria-pressed', String(paused));
    document.body.classList.toggle('motion-enabled', !paused);
    window.dispatchEvent(new CustomEvent('portfolio-motion', { detail: { paused } }));
    update();
  }
  motionButton.addEventListener('click', () => { paused = !paused; motionState(); });
  media.addEventListener('change', () => { paused = media.matches; motionState(); });
  function openDialog(dialog) { dialog.showModal(); document.body.style.overflow = 'hidden'; }
  function closeDialog(dialog) { dialog.close(); }
  for (const dialog of [menu, caseDialog]) {
    dialog.querySelector('.close').addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
      menuButton.setAttribute('aria-expanded', 'false');
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog);
    }});
  }
  menuButton.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'true'); openDialog(menu); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeDialog(menu)));
  document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
    const item = data[button.dataset.case];
    const container = document.querySelector('#case-content');
    container.replaceChildren();
    const add = (tag, text, parent = container, className) => {
      const el = document.createElement(tag); el.textContent = text;
      if (className) el.className = className;
      parent.append(el); return el;
    };
    add('h2', item.title).id = 'case-title';
    add('p', item.meta, container, 'case-meta');
    const body = add('div', '', container, 'case-body');
    [['The problem', item.problem], ['My contribution', item.contribution], ['Technical decisions', item.decisions], ['Result & status', item.result]].forEach(([title, text]) => {
      const section = add('section', '', body); add('h3', title, section); add('p', text, section);
    });
    add('p', item.caveat, container, 'case-caveat');
    const links = add('div', '', container, 'case-links');
    item.links.forEach(([label, href]) => {
      const a = add('a', label + ' ↗', links); a.href = href;
      if (href.startsWith('https:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
    openDialog(caseDialog); caseDialog.scrollTop = 0;
  }));
  document.querySelectorAll('.diamond-number').forEach(el => el.dataset.number = el.textContent);
  function update() {
    ticking = false;
    const h = innerHeight;
    const p = Math.min(8, Math.max(0, scrollY / Math.max(1, document.querySelector('#profile').offsetTop)));
    let scene = 0;
    chapters.forEach(ch => { if (ch.getBoundingClientRect().top < h * .55) scene = Number(ch.dataset.scene); });
    const dark = scene >= 3 && scene <= 6;
    document.body.classList.toggle('dark', dark);
    root.style.setProperty('--dark', dark ? '.76' : '0');
    root.style.setProperty('--mist', dark ? '.02' : scene === 0 ? '0' : '.45');
    document.querySelector('.navigation').classList.toggle('is-scrolled', scrollY > h * .3);
    if (!paused) {
      root.style.setProperty('--zoom', String(1.03 + Math.sin(p * .75) * .035 + Math.min(.2, p * .025)));
      root.style.setProperty('--shift', Math.sin(p * .8) * 2 + '%');
    } else { root.style.setProperty('--zoom', '1.03'); root.style.setProperty('--shift', '0%'); }
    const current = scene === 0 ? 'home' : scene === 1 ? 'profile' : scene === 8 ? 'contact' : 'work';
    document.querySelectorAll('.chapter-nav a').forEach(a => {
      if (a.hash === '#' + current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    window.dispatchEvent(new CustomEvent('portfolio-scroll', {detail:{progress:p,scene,paused}}));
  }
  const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => target.classList.toggle('not-in-view', !isIntersecting)), {threshold:.06});
  document.querySelectorAll('.chapter-copy,.exploration-content,.contact-content').forEach(el => observer.observe(el));
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update, {passive:true});
  motionState();
})();
