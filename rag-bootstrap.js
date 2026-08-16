const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = 'rag.css';
document.head.appendChild(css);

const nextSection = document.getElementById('next');

const ragSection = document.createElement('section');
ragSection.id = 'ask-cv';
ragSection.className = 'rag section';
ragSection.innerHTML = `
  <div class="section-index">04 / CV INTELLIGENCE</div>
  <div class="rag__head">
    <div>
      <div class="kicker reveal">RECRUITER INTERFACE // GROUNDED AI</div>
      <h2 class="display reveal">ASK<br><span>MY CV.</span></h2>
    </div>
    <p class="reveal">A real retrieval-augmented assistant over my CV. Your question becomes a semantic vector, the most relevant CV passages are retrieved, and Grok answers from that evidence — not from a generic chatbot memory.</p>
  </div>

  <div class="rag__shell reveal">
    <aside class="rag__system">
      <div class="rag__label">RAG PIPELINE // LIVE</div>
      <h3>Evidence before generation.</h3>

      <div class="rag__architecture" aria-label="RAG architecture">
        <div class="rag-node"><b>01</b> // RECRUITER QUERY</div>
        <div class="rag-node"><b>02</b> // MINILM EMBEDDING</div>
        <div class="rag-node"><b>03</b> // TOP-K CV RETRIEVAL</div>
        <div class="rag-node"><b>04</b> // GROK 4.5 ANSWER</div>
      </div>

      <div class="rag__telemetry">
        <div><span>VECTOR MODEL</span><b>MiniLM-L6-v2</b></div>
        <div><span>DIMENSIONS</span><b>384D</b></div>
        <div><span>RETRIEVAL</span><b>TOP-K // 4</b></div>
        <div><span>GENERATOR</span><b>GROK 4.5</b></div>
      </div>

      <div class="rag__status" id="ragStatus" data-state="idle">
        <span class="rag__status-dot"></span>
        <span id="ragStatusText">WAKE ON FIRST QUERY</span>
      </div>
    </aside>

    <div class="rag__chat">
      <div class="rag__chatbar">
        <div class="rag__identity">
          <div class="rag__avatar">AI</div>
          <div><b>ASK_ANIS</b><span>CV-GROUNDED RECRUITER AGENT</span></div>
        </div>
        <div class="rag__privacy">NO PHONE / HOME ADDRESS<br>CV EVIDENCE ONLY</div>
      </div>

      <div class="rag__messages" id="ragMessages" aria-live="polite"></div>

      <div class="rag__suggestions" aria-label="Suggested CV questions">
        <button class="rag-question" data-question="What did Anis build at Vermeg?">VERMEG EXPERIENCE</button>
        <button class="rag-question" data-question="What AI and software engineering skills does Anis have?">TECHNICAL SKILLS</button>
        <button class="rag-question" data-question="Explain Anis's Orange Digital Center project.">ORANGE × MEDTECH</button>
        <button class="rag-question" data-question="What kind of PFE internship is Anis looking for?">PFE OBJECTIVE</button>
        <button class="rag-question" data-question="What languages does Anis speak?">LANGUAGES</button>
      </div>

      <div>
        <form class="rag__form" id="ragForm">
          <input class="rag__input" id="ragInput" maxlength="500" autocomplete="off" placeholder="Ask about experience, skills, projects, education..." aria-label="Ask a question about Anis's CV" />
          <button class="rag__send" id="ragSend" type="submit" aria-label="Send CV question">↗</button>
        </form>
        <div class="rag__footnote">RAG DEMO // SEMANTIC RETRIEVAL + GROK // ANSWERS ARE RESTRICTED TO THE INDEXED CV</div>
      </div>
    </div>
  </div>
`;

if (nextSection?.parentNode) {
  nextSection.parentNode.insertBefore(ragSection, nextSection);
}

// Promote the recruiter agent into the main navigation.
const nav = document.querySelector('.nav__links');
const terminalButton = document.getElementById('terminalToggle');
if (nav && terminalButton && !nav.querySelector('a[href="#ask-cv"]')) {
  const askLink = document.createElement('a');
  askLink.href = '#ask-cv';
  askLink.textContent = 'ASK CV';
  nav.insertBefore(askLink, terminalButton);
}

// Extend the visual section rail without coupling it to the original script's static list.
const rail = document.querySelector('.section-rail');
if (rail) {
  const nextRail = rail.querySelector('[data-target="next"]');
  if (nextRail) nextRail.textContent = '05';

  const item = document.createElement('span');
  item.dataset.target = 'ask-cv';
  item.textContent = '04';
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => ragSection.scrollIntoView({ behavior: 'smooth' }));
  if (nextRail) rail.insertBefore(item, nextRail);
  else rail.appendChild(item);

  window.addEventListener('scroll', () => {
    const rect = ragSection.getBoundingClientRect();
    const active = rect.top < window.innerHeight * 0.58 && rect.bottom > window.innerHeight * 0.38;
    item.classList.toggle('active', active);
  }, { passive: true });
}

const nextHud = document.querySelector('#next .next__hud span');
if (nextHud) nextHud.textContent = '05 / NEXT MISSION';

// The skill becomes a real portfolio capability only after this implementation exists.
const aiSystems = [...document.querySelectorAll('.arsenal-row')].find((row) => row.querySelector('span')?.textContent.trim() === 'AI SYSTEMS');
if (aiSystems) {
  const value = aiSystems.querySelector('b');
  if (value && !value.textContent.includes('RAG')) value.textContent += ' · RAG';
}

const aiTooling = [...document.querySelectorAll('.arsenal-row')].find((row) => row.querySelector('span')?.textContent.trim() === 'AI TOOLING');
if (aiTooling) {
  const value = aiTooling.querySelector('b');
  if (value && !value.textContent.includes('Grok')) value.textContent += ' · FastEmbed · Grok API';
}

const client = document.createElement('script');
client.src = 'rag.js';
client.defer = true;
document.body.appendChild(client);
