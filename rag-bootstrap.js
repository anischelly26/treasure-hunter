const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = 'rag.css';
document.head.appendChild(css);

const backdrop = document.createElement('div');
backdrop.className = 'rag-backdrop';
backdrop.setAttribute('aria-hidden','true');

document.body.appendChild(backdrop);

const drawer = document.createElement('aside');
drawer.id = 'ask-cv';
drawer.className = 'rag-drawer';
drawer.setAttribute('aria-hidden','true');
drawer.innerHTML = `
  <div class="rag-drawer__top">
    <div class="rag__identity">
      <div class="rag__avatar">AC</div>
      <div><b>ASK ABOUT ANIS</b><span>CV-GROUNDED AI ASSISTANT</span></div>
    </div>
    <button class="rag-close" type="button" aria-label="Close assistant">×</button>
  </div>

  <div class="rag-drawer__intro">
    <span>MORE THAN THE PORTFOLIO</span>
    <h2>Curious about Anis?</h2>
    <p>Ask about projects, internships, skills, education or the kind of PFE opportunity he is looking for.</p>
  </div>

  <div class="rag__status" id="ragStatus" data-state="idle">
    <span class="rag__status-dot"></span>
    <span id="ragStatusText">WAKE ON FIRST QUESTION</span>
  </div>

  <div class="rag__suggestions" aria-label="Suggested questions">
    <button class="rag-question" data-question="What did Anis build at Vermeg?">VERMEG</button>
    <button class="rag-question" data-question="What AI and software engineering skills does Anis have?">SKILLS</button>
    <button class="rag-question" data-question="Explain Anis's Orange Digital Center project.">ORANGE PROJECT</button>
    <button class="rag-question" data-question="What kind of PFE internship is Anis looking for?">PFE GOAL</button>
  </div>

  <div class="rag__messages" id="ragMessages" aria-live="polite"></div>

  <form class="rag__form" id="ragForm">
    <input class="rag__input" id="ragInput" maxlength="500" autocomplete="off" placeholder="Ask something about Anis..." aria-label="Ask a question about Anis" />
    <button class="rag__send" id="ragSend" type="submit" aria-label="Send question">↗</button>
  </form>
  <div class="rag__footnote">Answers are grounded in the indexed CV and portfolio evidence.</div>
`;
document.body.appendChild(drawer);

const companion = document.createElement('button');
companion.className = 'anis-companion';
companion.type = 'button';
companion.setAttribute('aria-label','Ask the AI assistant for more details about Anis');
companion.innerHTML = `
  <span class="anis-companion__bubble">Want more details about Anis?<b>Click me ✦</b></span>
  <span class="anis-bot" aria-hidden="true">
    <i class="anis-bot__antenna"></i>
    <i class="anis-bot__head"><b></b><b></b></i>
    <i class="anis-bot__body">AC</i>
    <i class="anis-bot__arm anis-bot__arm--l"></i>
    <i class="anis-bot__arm anis-bot__arm--r"></i>
    <i class="anis-bot__leg anis-bot__leg--l"></i>
    <i class="anis-bot__leg anis-bot__leg--r"></i>
  </span>`;
document.body.appendChild(companion);

let announced = false;
function openDrawer(){
  drawer.classList.add('open');
  backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  companion.classList.add('compact');
  setTimeout(()=>document.getElementById('ragInput')?.focus(),260);
}
function closeDrawer(){
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
}
companion.addEventListener('click',openDrawer);
drawer.querySelector('.rag-close').addEventListener('click',closeDrawer);
backdrop.addEventListener('click',closeDrawer);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

const missions = document.getElementById('missions');
const lastProject = document.querySelector('.mission-grid .mission:last-child');
if (lastProject && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries=>{
    if(announced)return;
    if(entries.some(entry=>entry.isIntersecting && entry.intersectionRatio>.22)){
      announced=true;
      companion.classList.add('show');
      observer.disconnect();
    }
  },{threshold:[.22,.45]});
  observer.observe(lastProject);
} else if (missions) {
  window.addEventListener('scroll',()=>{
    if(announced)return;
    const r=missions.getBoundingClientRect();
    if(r.bottom < window.innerHeight*1.45 && r.bottom>0){announced=true;companion.classList.add('show')}
  },{passive:true});
}

const nav = document.querySelector('.nav__links');
const terminalButton = document.getElementById('terminalToggle');
if(nav && terminalButton && !nav.querySelector('[data-ask-anis]')){
  const ask=document.createElement('button');
  ask.dataset.askAnis='true';
  ask.textContent='ASK ANIS';
  ask.addEventListener('click',openDrawer);
  nav.insertBefore(ask,terminalButton);
}

const client = document.createElement('script');
client.src = 'rag.js';
client.defer = true;
document.body.appendChild(client);
