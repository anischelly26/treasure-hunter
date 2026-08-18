const labStyles = `
.lab-trigger{display:inline-flex;align-items:center;gap:7px;margin-left:auto;padding-left:16px;color:var(--gold);font:8px var(--mono);letter-spacing:.14em;cursor:pointer;position:relative;z-index:4}.lab-trigger::before{content:'●';font-size:6px;opacity:.7}.lab-trigger:hover{color:#f2d695}.lab-overlay{position:fixed;inset:0;z-index:180;background:rgba(0,0,0,.78);backdrop-filter:blur(16px);display:grid;place-items:center;padding:20px;opacity:0;visibility:hidden;transition:.25s}.lab-overlay.open{opacity:1;visibility:visible}.lab-panel{width:min(760px,94vw);max-height:min(760px,88vh);overflow:auto;border:1px solid rgba(215,169,79,.28);background:linear-gradient(145deg,rgba(18,18,18,.97),rgba(6,6,6,.98));box-shadow:0 40px 140px rgba(0,0,0,.65);padding:26px;position:relative}.lab-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;border-bottom:1px solid var(--line);padding-bottom:18px;margin-bottom:22px}.lab-kicker{font:8px var(--mono);letter-spacing:.2em;color:var(--gold);margin-bottom:8px}.lab-head h3{margin:0;font-size:clamp(26px,4vw,46px);letter-spacing:-.045em}.lab-close{border:1px solid var(--line);background:transparent;width:36px;height:36px;cursor:pointer;color:#aaa}.lab-close:hover{border-color:var(--gold);color:var(--gold)}.lab-copy{color:#8f8f89;line-height:1.6;margin:0 0 20px}.lab-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.lab-btn{border:1px solid rgba(215,169,79,.32);background:rgba(215,169,79,.07);color:#d9c395;padding:11px 14px;font:8px var(--mono);letter-spacing:.12em;cursor:pointer}.lab-btn:hover,.lab-btn.active{background:var(--gold);color:#080706}.lab-output{margin-top:18px;border:1px solid var(--line);background:#070707;padding:16px;min-height:72px;font:11px var(--mono);line-height:1.7;color:#9f9f98}.lab-good{color:var(--green)}.lab-gold{color:var(--gold)}.lab-muted{color:#686862}.lab-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.lab-card{border:1px solid var(--line);padding:14px;background:rgba(255,255,255,.018);font:10px var(--mono)}.lab-card b{display:block;color:#d7d5ce;margin-bottom:6px}.scan-stage{height:240px;border:1px solid var(--line);position:relative;background:linear-gradient(135deg,#151515,#080808);overflow:hidden}.scan-ui{position:absolute;inset:22px;display:grid;grid-template-columns:1fr 1fr;gap:12px}.scan-ui span{border:1px solid #383838;background:#111}.scan-ui span:nth-child(1){grid-column:1/3;height:42px}.scan-box{position:absolute;border:1px solid var(--gold);box-shadow:0 0 18px rgba(215,169,79,.14);opacity:0;transition:.35s}.scan-stage.scanned .scan-box{opacity:1}.xai-bars{display:grid;gap:9px;margin-top:12px}.xai-row{display:grid;grid-template-columns:90px 1fr 42px;gap:10px;align-items:center;font:9px var(--mono)}.xai-track{height:5px;background:#181818}.xai-track i{display:block;height:100%;background:var(--gold)}.import-table{border:1px solid var(--line);font:9px var(--mono);overflow:hidden}.import-row{display:grid;grid-template-columns:1fr 1fr 1fr;padding:9px 12px;border-bottom:1px solid var(--line);color:#8f8f89}.import-row:first-child{color:var(--gold)}.progress-line{height:4px;background:#171717;margin-top:16px}.progress-line i{display:block;width:0;height:100%;background:var(--gold);transition:width .75s}.state-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.state{padding:22px 10px;text-align:center;border:1px solid var(--line);font:9px var(--mono);cursor:pointer}.state.active{border-color:var(--gold);background:rgba(215,169,79,.07);color:var(--gold)}.court-mini{height:260px;border:1px solid rgba(215,169,79,.25);position:relative;background:linear-gradient(90deg,transparent 49.7%,rgba(255,255,255,.16) 50%,transparent 50.3%),linear-gradient(0deg,transparent 49.7%,rgba(255,255,255,.12) 50%,transparent 50.3%),#0b0b0b}.court-mini::after{content:'';position:absolute;inset:18px;border:1px solid rgba(255,255,255,.15)}.court-player,.court-opponent{position:absolute;width:16px;height:16px;border-radius:50%;transform:translate(-50%,-50%)}.court-player{left:50%;top:78%;background:var(--gold);box-shadow:0 0 18px rgba(215,169,79,.5)}.court-opponent{left:28%;top:24%;background:#eee}.rank-list{display:grid;gap:8px}.rank-row{display:grid;grid-template-columns:28px 1fr 70px;align-items:center;padding:12px;border:1px solid var(--line);font:9px var(--mono)}.rank-row strong{color:var(--gold)}.pipeline{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.pipe-step{padding:18px 8px;border:1px solid var(--line);text-align:center;font:8px var(--mono);color:#65655f}.pipe-step.running{border-color:#8f713c;color:var(--gold)}.pipe-step.done{border-color:rgba(125,255,178,.32);color:var(--green)}.hunt-stats{display:flex;justify-content:space-between;gap:12px;font:9px var(--mono);color:#777;margin:8px 0 16px}.hunt-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.hunt-cell{aspect-ratio:1;border:1px solid var(--line);background:#0a0a0a;cursor:pointer;position:relative}.hunt-cell:hover{border-color:rgba(215,169,79,.45)}.hunt-cell.hit{border-color:var(--gold);background:radial-gradient(circle,rgba(215,169,79,.22),rgba(215,169,79,.03))}.hunt-cell.hit::after{content:'✦';position:absolute;inset:0;display:grid;place-items:center;color:var(--gold);font-size:22px}.hunt-cell.miss::after{content:'×';position:absolute;inset:0;display:grid;place-items:center;color:#3f3f3c}.hunt-launch{position:relative}.hunt-badge{font:8px var(--mono);letter-spacing:.15em;color:var(--gold)}@media(max-width:720px){.lab-panel{padding:18px}.lab-grid,.pipeline{grid-template-columns:1fr 1fr}.hunt-grid{grid-template-columns:repeat(5,1fr)}.scan-stage{height:190px}.lab-head h3{font-size:28px}}
`;

const style = document.createElement('style');
style.textContent = labStyles;
document.head.appendChild(style);

const demos = [
  { id: 'ui', title: 'UI → CODE', label: 'Computer Vision Demo' },
  { id: 'xai', title: 'CV → MATCH → EXPLAIN', label: 'Explainable Ranking Demo' },
  { id: 'data', title: 'FILES → DATABASE', label: 'Data Automation Demo' },
  { id: 'hmm', title: 'SIGNAL → STATE', label: 'HMM Forecast Demo' },
  { id: 'padel', title: 'VIDEO → STRATEGY', label: 'Padel Tactics Demo' },
  { id: 'veripath', title: 'PROFILE → DECIDE', label: 'Recommendation Demo' },
  { id: 'pipeline', title: 'INGEST → TRAIN → EXPLAIN', label: 'Pipeline Demo' },
];

const overlay = document.createElement('div');
overlay.className = 'lab-overlay';
overlay.innerHTML = `<div class="lab-panel" role="dialog" aria-modal="true" aria-labelledby="labTitle"><div class="lab-head"><div><div class="lab-kicker">ANIS.EXE // INTERACTIVE LAB</div><h3 id="labTitle">SYSTEM TEST</h3></div><button class="lab-close" aria-label="Close demo">×</button></div><div id="labBody"></div></div>`;
document.body.appendChild(overlay);

const labBody = overlay.querySelector('#labBody');
const labTitle = overlay.querySelector('#labTitle');
const closeLab = () => overlay.classList.remove('open');
overlay.querySelector('.lab-close').addEventListener('click', closeLab);
overlay.addEventListener('click', (event) => { if (event.target === overlay) closeLab(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLab(); });

function openLab(title, html, setup) {
  labTitle.textContent = title;
  labBody.innerHTML = html;
  overlay.classList.add('open');
  setup?.(labBody);
}

function demoUI() {
  openLab('UI → CODE', `<p class="lab-copy">Mini simulation of the screenshot-analysis pipeline.</p><div class="scan-stage"><div class="scan-ui"><span></span><span></span><span></span></div><i class="scan-box" style="left:22px;top:22px;right:22px;height:42px"></i><i class="scan-box" style="left:22px;top:76px;width:45%;bottom:22px"></i><i class="scan-box" style="right:22px;top:76px;width:45%;bottom:22px"></i></div><div class="lab-actions"><button class="lab-btn" data-scan>SCAN SCREEN</button></div><div class="lab-output">Awaiting image...</div>`, (root) => {
    root.querySelector('[data-scan]').onclick = () => {
      root.querySelector('.scan-stage').classList.add('scanned');
      root.querySelector('.lab-output').innerHTML = `<span class="lab-good">3 components detected.</span><br>&lt;header class="hero"&gt;...&lt;/header&gt;<br>&lt;section class="panel-grid"&gt;...&lt;/section&gt;`;
    };
  });
}

function demoXAI() {
  const candidates = [
    ['Candidate A', 91, 'Strong Python + ML match'],
    ['Candidate B', 78, 'Good backend experience'],
    ['Candidate C', 63, 'Partial skills overlap'],
  ];
  openLab('CV → MATCH → EXPLAIN', `<p class="lab-copy">Rank three mock candidates and expose the reason behind the score.</p><div class="lab-actions"><button class="lab-btn" data-rank>RUN MATCHING</button></div><div class="lab-output">Model ready.</div>`, (root) => {
    root.querySelector('[data-rank]').onclick = () => {
      root.querySelector('.lab-output').innerHTML = `<div class="xai-bars">${candidates.map(([name, score, why]) => `<div class="xai-row"><span>${name}</span><div class="xai-track"><i style="width:${score}%"></i></div><b>${score}%</b></div><div class="lab-muted">↳ ${why}</div>`).join('')}</div>`;
    };
  });
}

function demoData() {
  openLab('FILES → DATABASE', `<p class="lab-copy">A tiny version of the sales-file import workflow.</p><div class="import-table"><div class="import-row"><span>DATE</span><span>STORE</span><span>SALES</span></div><div class="import-row"><span>2026-08-12</span><span>Tunis 01</span><span>12,480</span></div><div class="import-row"><span>2026-08-13</span><span>Tunis 02</span><span>9,220</span></div><div class="import-row"><span>2026-08-14</span><span>Tunis 03</span><span>14,110</span></div></div><div class="progress-line"><i></i></div><div class="lab-actions"><button class="lab-btn" data-import>IMPORT DATA</button></div><div class="lab-output">0 rows inserted.</div>`, (root) => {
    root.querySelector('[data-import]').onclick = () => {
      root.querySelector('.progress-line i').style.width = '100%';
      root.querySelector('.lab-output').innerHTML = `<span class="lab-good">✓ Import complete</span><br>3 rows validated · 3 rows inserted · 0 rejected`;
    };
  });
}

function demoHMM() {
  const transitions = { Sunny: 'Cloudy', Cloudy: 'Rain', Rain: 'Cloudy' };
  openLab('SIGNAL → STATE', `<p class="lab-copy">Choose the current hidden weather state, then run a simple transition forecast.</p><div class="state-strip">${Object.keys(transitions).map((s) => `<button class="state" data-state="${s}">${s.toUpperCase()}</button>`).join('')}</div><div class="lab-actions"><button class="lab-btn" data-forecast>FORECAST NEXT</button></div><div class="lab-output">Select a state.</div>`, (root) => {
    let current = null;
    root.querySelectorAll('[data-state]').forEach((btn) => btn.onclick = () => {
      current = btn.dataset.state;
      root.querySelectorAll('.state').forEach((x) => x.classList.toggle('active', x === btn));
      root.querySelector('.lab-output').textContent = `Observed state: ${current}`;
    });
    root.querySelector('[data-forecast]').onclick = () => {
      root.querySelector('.lab-output').innerHTML = current ? `Most likely next state → <span class="lab-gold">${transitions[current]}</span><br><span class="lab-muted">Demo transition model, not a live weather forecast.</span>` : 'Select a state first.';
    };
  });
}

function demoPadel() {
  openLab('VIDEO → STRATEGY', `<p class="lab-copy">Opponent is pulled left. Pick the highest-value response.</p><div class="court-mini"><i class="court-player"></i><i class="court-opponent"></i></div><div class="lab-actions"><button class="lab-btn" data-shot="line">DOWN THE LINE</button><button class="lab-btn" data-shot="middle">PLAY MIDDLE</button><button class="lab-btn" data-shot="cross">CROSS COURT</button></div><div class="lab-output">Read the court.</div>`, (root) => {
    root.querySelectorAll('[data-shot]').forEach((btn) => btn.onclick = () => {
      const good = btn.dataset.shot === 'line';
      root.querySelector('.lab-output').innerHTML = good ? `<span class="lab-good">✓ Strong choice.</span><br>Attack the open right-side space while the opponent is displaced.` : `<span class="lab-gold">Possible, but lower value.</span><br>The largest open space is down the line.`;
    });
  });
}

function demoVeriPath() {
  const options = {
    AI: [['Germany', 92], ['France', 88], ['Netherlands', 82]],
    Business: [['France', 90], ['Spain', 84], ['Netherlands', 81]],
    Design: [['Netherlands', 91], ['France', 86], ['Spain', 79]],
  };
  openLab('PROFILE → DECIDE', `<p class="lab-copy">Choose a field and generate a transparent sample ranking.</p><div class="lab-actions">${Object.keys(options).map((x) => `<button class="lab-btn" data-field="${x}">${x}</button>`).join('')}</div><div class="lab-output">Choose a study field.</div>`, (root) => {
    root.querySelectorAll('[data-field]').forEach((btn) => btn.onclick = () => {
      const rows = options[btn.dataset.field];
      root.querySelector('.lab-output').innerHTML = `<div class="rank-list">${rows.map(([place, score], i) => `<div class="rank-row"><span>0${i + 1}</span><b>${place}</b><strong>${score}</strong></div>`).join('')}</div><div class="lab-muted" style="margin-top:10px">Demo compatibility score — not admission probability.</div>`;
    });
  });
}

function demoPipeline() {
  openLab('INGEST → TRAIN → EXPLAIN', `<p class="lab-copy">Run a lightweight visual simulation of the distributed ML workflow.</p><div class="pipeline"><div class="pipe-step">INGEST</div><div class="pipe-step">CLEAN</div><div class="pipe-step">TRAIN</div><div class="pipe-step">EXPLAIN</div></div><div class="lab-actions"><button class="lab-btn" data-run>RUN PIPELINE</button></div><div class="lab-output">Pipeline idle.</div>`, (root) => {
    root.querySelector('[data-run]').onclick = () => {
      const steps = [...root.querySelectorAll('.pipe-step')];
      root.querySelector('.lab-output').textContent = 'Running...';
      steps.forEach((step, index) => setTimeout(() => {
        steps.forEach((x) => x.classList.remove('running'));
        step.classList.add('running');
        if (index > 0) steps[index - 1].classList.add('done');
        if (index === steps.length - 1) setTimeout(() => {
          step.classList.remove('running');
          step.classList.add('done');
          root.querySelector('.lab-output').innerHTML = `<span class="lab-good">✓ Pipeline complete</span><br>Model selected · metrics saved · explanation generated`;
        }, 650);
      }, index * 650));
    };
  });
}

const demoHandlers = { ui: demoUI, xai: demoXAI, data: demoData, hmm: demoHMM, padel: demoPadel, veripath: demoVeriPath, pipeline: demoPipeline };

document.querySelectorAll('.mission').forEach((card, index) => {
  const demo = demos[index];
  if (!demo) return;
  const launch = card.querySelector('.mission__launch');
  if (!launch) return;
  const trigger = document.createElement('span');
  trigger.className = 'lab-trigger';
  trigger.dataset.demo = demo.id;
  trigger.textContent = 'TRY DEMO';
  launch.appendChild(trigger);
});

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-demo]');
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  demoHandlers[trigger.dataset.demo]?.();
});

function openTreasureHunt() {
  openLab('TREASURE HUNT // SIGNAL RECOVERY', `<p class="lab-copy">Find all <b>5 hidden signal fragments</b> before the timer reaches zero.</p><div class="hunt-stats"><span>TIME <b data-time>20</b>s</span><span>SIGNALS <b data-score>0</b>/5</span></div><div class="hunt-grid"></div><div class="lab-actions"><button class="lab-btn" data-start>START HUNT</button></div><div class="lab-output">System waiting.</div>`, (root) => {
    const grid = root.querySelector('.hunt-grid');
    const cells = Array.from({ length: 25 }, (_, i) => {
      const cell = document.createElement('button');
      cell.className = 'hunt-cell';
      cell.dataset.cell = i;
      grid.appendChild(cell);
      return cell;
    });
    let treasures = new Set();
    let score = 0;
    let time = 20;
    let active = false;
    let timer = null;
    const reset = () => {
      clearInterval(timer);
      score = 0; time = 20; active = true;
      treasures = new Set();
      while (treasures.size < 5) treasures.add(Math.floor(Math.random() * cells.length));
      cells.forEach((cell) => { cell.className = 'hunt-cell'; cell.disabled = false; });
      root.querySelector('[data-score]').textContent = score;
      root.querySelector('[data-time]').textContent = time;
      root.querySelector('.lab-output').innerHTML = `Signal scan active. <span class="lab-gold">Hunt.</span>`;
      timer = setInterval(() => {
        time -= 1;
        root.querySelector('[data-time]').textContent = time;
        if (time <= 0) finish(false);
      }, 1000);
    };
    const finish = (won) => {
      if (!active) return;
      active = false; clearInterval(timer);
      cells.forEach((cell) => { cell.disabled = true; });
      root.querySelector('.lab-output').innerHTML = won ? `<span class="lab-good">ACCESS GRANTED.</span><br>You recovered all 5 signals with ${time}s remaining.` : `<span class="lab-gold">SIGNAL LOST.</span><br>${score}/5 fragments recovered. Run it again.`;
    };
    cells.forEach((cell, i) => cell.onclick = () => {
      if (!active || cell.classList.contains('hit') || cell.classList.contains('miss')) return;
      if (treasures.has(i)) {
        cell.classList.add('hit'); score += 1; root.querySelector('[data-score]').textContent = score;
        if (score === 5) finish(true);
      } else cell.classList.add('miss');
    });
    root.querySelector('[data-start]').onclick = reset;
  });
}

const nav = document.querySelector('.nav__links');
if (nav) {
  const hunt = document.createElement('button');
  hunt.className = 'hunt-launch';
  hunt.innerHTML = '<span class="hunt-badge">HUNT_</span>';
  hunt.title = 'Open mini treasure hunt';
  hunt.addEventListener('click', openTreasureHunt);
  nav.insertBefore(hunt, nav.lastElementChild);
}
