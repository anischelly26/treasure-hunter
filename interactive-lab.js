const hero = document.getElementById('home');
if (!hero) throw new Error('ANIS.EXE hero not found');

const labStyles = `
.hero__signal{display:none!important}
.hero-demo{position:absolute;right:6vw;bottom:7vh;width:min(520px,40vw);z-index:8;border:1px solid rgba(215,169,79,.24);background:linear-gradient(145deg,rgba(14,14,14,.88),rgba(5,5,5,.94));backdrop-filter:blur(22px);box-shadow:0 30px 100px rgba(0,0,0,.42);overflow:hidden}
.hero-demo__head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08);font:8px var(--mono);letter-spacing:.14em;color:#777}
.hero-demo__head b{color:var(--gold);font-weight:400}.hero-demo__tabs{display:flex;gap:6px}.hero-demo__tabs button,.demo-chip,.demo-action,.hunt-control{border:1px solid rgba(255,255,255,.1);background:#0a0a0a;color:#8d8d87;font:8px var(--mono);letter-spacing:.1em;cursor:pointer}.hero-demo__tabs button{padding:7px 9px}.hero-demo__tabs button.active,.demo-chip.active,.demo-action:hover,.hunt-control:hover{border-color:rgba(215,169,79,.55);color:var(--gold);background:rgba(215,169,79,.07)}
.hero-demo__body{padding:14px}.demo-picker{display:flex;gap:6px;overflow:auto;padding-bottom:10px;scrollbar-width:none}.demo-picker::-webkit-scrollbar{display:none}.demo-chip{white-space:nowrap;padding:7px 9px}.demo-stage{height:210px;border:1px solid rgba(255,255,255,.08);background:radial-gradient(circle at 70% 20%,rgba(215,169,79,.08),transparent 36%),#070707;position:relative;overflow:hidden}.demo-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px}.demo-title{font:9px var(--mono);letter-spacing:.11em;color:#d4d2cb}.demo-sub{font:8px var(--mono);color:#666;margin-top:3px}.demo-action{padding:9px 11px;color:#c8b27c}
.demo-terminal{position:absolute;left:12px;right:12px;bottom:12px;padding:9px 10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.72);font:8px var(--mono);line-height:1.55;color:#777}.demo-terminal .ok{color:#7dffb2}.demo-terminal .gold{color:var(--gold)}
.ui-window{position:absolute;inset:16px 16px 44px;border:1px solid #2b2b2b;background:#0d0d0d}.ui-window i{position:absolute;border:1px solid #323232;background:#151515}.ui-window .u1{left:10px;right:10px;top:10px;height:28px}.ui-window .u2{left:10px;top:48px;bottom:10px;width:42%}.ui-window .u3{right:10px;top:48px;bottom:10px;width:48%}.ui-window.scanned i{border-color:var(--gold);box-shadow:0 0 14px rgba(215,169,79,.12)}
.xai-list{position:absolute;inset:18px 18px 46px;display:grid;align-content:center;gap:13px}.xai-row{display:grid;grid-template-columns:70px 1fr 32px;gap:8px;align-items:center;font:8px var(--mono);color:#7b7b75}.xai-bar{height:4px;background:#171717}.xai-bar i{display:block;height:100%;width:0;background:var(--gold);transition:width .6s}.xai-row b{font-weight:400;color:#aaa}
.data-table{position:absolute;left:16px;right:16px;top:16px;border:1px solid #222;font:8px var(--mono)}.data-row{display:grid;grid-template-columns:1fr 1fr 1fr;padding:8px;border-bottom:1px solid #1c1c1c;color:#777}.data-row:first-child{color:var(--gold)}.data-progress{position:absolute;left:16px;right:16px;bottom:50px;height:3px;background:#171717}.data-progress i{display:block;width:0;height:100%;background:#7dffb2;transition:width .7s}
.hmm-states{position:absolute;inset:26px 18px 52px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;align-items:center}.hmm-state{height:74px;border:1px solid #222;background:#0d0d0d;color:#6f6f69;display:grid;place-items:center;font:8px var(--mono);cursor:pointer}.hmm-state.active{border-color:var(--gold);color:var(--gold);background:rgba(215,169,79,.06)}
.padel-court{position:absolute;inset:16px 42px 48px;border:1px solid rgba(215,169,79,.25);background:linear-gradient(90deg,transparent 49.6%,rgba(255,255,255,.12) 50%,transparent 50.4%),linear-gradient(0deg,transparent 49.6%,rgba(255,255,255,.1) 50%,transparent 50.4%),#0b0b0b}.padel-player,.padel-ball{position:absolute;border-radius:50%;transform:translate(-50%,-50%)}.padel-player{width:14px;height:14px;left:50%;top:78%;background:var(--gold)}.padel-ball{width:8px;height:8px;left:50%;top:50%;background:#f4f1da;transition:.45s}.padel-shot{position:absolute;top:16px;bottom:48px;width:28%;border:1px dashed rgba(255,255,255,.08);opacity:.55}.padel-shot.left{left:9%}.padel-shot.right{right:9%}
.rank-mini{position:absolute;inset:18px 16px 46px;display:grid;gap:7px;align-content:center}.rank-mini div{display:grid;grid-template-columns:24px 1fr 50px;gap:8px;padding:9px;border:1px solid #202020;font:8px var(--mono);color:#777}.rank-mini strong{color:var(--gold);font-weight:400}
.pipe-mini{position:absolute;left:16px;right:16px;top:40px;display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.pipe-mini div{padding:18px 6px;border:1px solid #222;text-align:center;font:7px var(--mono);color:#5f5f5a;transition:.3s}.pipe-mini div.run{border-color:var(--gold);color:var(--gold);background:rgba(215,169,79,.05)}.pipe-mini div.done{border-color:rgba(125,255,178,.35);color:#7dffb2}
.hunt-wrap{display:none}.hero-demo.hunt-mode .demo-wrap{display:none}.hero-demo.hunt-mode .hunt-wrap{display:block}.hunt-top{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px;font:8px var(--mono);color:#777}.hunt-top b{color:var(--gold);font-weight:400}.hunt-board{display:grid;grid-template-columns:repeat(9,1fr);gap:4px;aspect-ratio:1.8/1}.hunt-cell{border:1px solid #191919;background:#090909;position:relative}.hunt-cell.wall{background:#111;border-color:#202020}.hunt-cell.player::after,.hunt-cell.treasure::after,.hunt-cell.enemy::after{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--mono)}.hunt-cell.player::after{content:'▲';color:var(--gold);font-size:13px;text-shadow:0 0 12px rgba(215,169,79,.5)}.hunt-cell.treasure::after{content:'◆';color:#7dffb2;font-size:12px}.hunt-cell.enemy::after{content:'×';color:#a95858;font-size:14px}.hunt-controls{display:grid;grid-template-columns:repeat(3,34px);gap:5px;justify-content:center;margin-top:10px}.hunt-control{height:30px}.hunt-control.up{grid-column:2}.hunt-control.left{grid-column:1}.hunt-control.down{grid-column:2}.hunt-control.right{grid-column:3}.hunt-msg{text-align:center;margin-top:8px;min-height:14px;font:8px var(--mono);color:#6f6f69}
@media(max-width:900px){.hero-demo{position:relative;right:auto;bottom:auto;width:100%;margin-top:28px}.hero{align-items:flex-start;flex-direction:column;overflow:visible}.hero__content{width:100%}.hero__coordinates{display:none}.demo-stage{height:190px}}
`;

const style = document.createElement('style');
style.textContent = labStyles;
document.head.appendChild(style);

const panel = document.createElement('section');
panel.className = 'hero-demo';
panel.setAttribute('aria-label', 'Interactive project demos and Treasure Hunter mini game');
panel.innerHTML = `
  <div class="hero-demo__head">
    <b>LIVE EXECUTION</b>
    <div class="hero-demo__tabs">
      <button class="active" data-mode="demo">PROJECT DEMOS</button>
      <button data-mode="hunt">TREASURE HUNTER</button>
    </div>
  </div>
  <div class="hero-demo__body">
    <div class="demo-wrap">
      <div class="demo-picker"></div>
      <div class="demo-stage"></div>
      <div class="demo-meta">
        <div><div class="demo-title"></div><div class="demo-sub"></div></div>
        <button class="demo-action">RUN DEMO</button>
      </div>
    </div>
    <div class="hunt-wrap">
      <div class="hunt-top"><span>MISSION // RECOVER 3 SIGNAL CORES</span><b><span data-score>0</span>/3</b></div>
      <div class="hunt-board"></div>
      <div class="hunt-controls">
        <button class="hunt-control up" data-move="up">↑</button>
        <button class="hunt-control left" data-move="left">←</button>
        <button class="hunt-control down" data-move="down">↓</button>
        <button class="hunt-control right" data-move="right">→</button>
      </div>
      <div class="hunt-msg">Use arrows / WASD. Avoid the red sentry.</div>
    </div>
  </div>`;
hero.appendChild(panel);

const projects = [
  { id:'ui', short:'UI→CODE', title:'AI UI-to-Code', sub:'Computer vision + OCR' },
  { id:'xai', short:'XAI', title:'Explainable AI Portal', sub:'Ranking + explanation' },
  { id:'data', short:'DATA', title:'Data Automation', sub:'Import + validation' },
  { id:'hmm', short:'HMM', title:'Hidden Markov Model', sub:'State + forecast' },
  { id:'padel', short:'PADEL', title:'PadelVision AI', sub:'Pose → tactic' },
  { id:'veripath', short:'PATH', title:'VeriPath AI', sub:'Profile → ranking' },
  { id:'pipeline', short:'PIPE', title:'Distributed ML Pipeline', sub:'Ingest → train → explain' },
];

const picker = panel.querySelector('.demo-picker');
const stage = panel.querySelector('.demo-stage');
const title = panel.querySelector('.demo-title');
const sub = panel.querySelector('.demo-sub');
const runButton = panel.querySelector('.demo-action');
let current = 0;
let hmmState = 'CLOUDY';
let pipeTimer = null;

projects.forEach((p, index) => {
  const btn = document.createElement('button');
  btn.className = 'demo-chip';
  btn.textContent = p.short;
  btn.onclick = () => { current = index; renderDemo(); };
  picker.appendChild(btn);
});

function terminal(text='READY', klass='') { return `<div class="demo-terminal"><span class="${klass}">${text}</span></div>`; }

function renderDemo() {
  clearInterval(pipeTimer);
  const p = projects[current];
  picker.querySelectorAll('.demo-chip').forEach((b, i) => b.classList.toggle('active', i === current));
  title.textContent = p.title;
  sub.textContent = p.sub;
  runButton.textContent = p.id === 'hmm' ? 'FORECAST' : p.id === 'padel' ? 'PLAY SHOT' : p.id === 'veripath' ? 'RANK' : 'RUN DEMO';

  if (p.id === 'ui') stage.innerHTML = `<div class="ui-window"><i class="u1"></i><i class="u2"></i><i class="u3"></i></div>${terminal('awaiting screenshot...')}`;
  if (p.id === 'xai') stage.innerHTML = `<div class="xai-list">${[['A',91],['B',78],['C',63]].map(([n,s])=>`<div class="xai-row"><span>Candidate ${n}</span><div class="xai-bar"><i data-w="${s}%"></i></div><b>${s}%</b></div>`).join('')}</div>${terminal('model ready')}`;
  if (p.id === 'data') stage.innerHTML = `<div class="data-table"><div class="data-row"><span>DATE</span><span>STORE</span><span>SALES</span></div><div class="data-row"><span>08-12</span><span>TUN-01</span><span>12,480</span></div><div class="data-row"><span>08-13</span><span>TUN-02</span><span>9,220</span></div><div class="data-row"><span>08-14</span><span>TUN-03</span><span>14,110</span></div></div><div class="data-progress"><i></i></div>${terminal('0 rows inserted')}`;
  if (p.id === 'hmm') stage.innerHTML = `<div class="hmm-states">${['SUNNY','CLOUDY','RAIN'].map(s=>`<button class="hmm-state ${s===hmmState?'active':''}" data-state="${s}">${s}</button>`).join('')}</div>${terminal(`current state: ${hmmState}`,'gold')}`;
  if (p.id === 'padel') stage.innerHTML = `<div class="padel-shot left"></div><div class="padel-shot right"></div><div class="padel-court"><i class="padel-player"></i><i class="padel-ball"></i></div>${terminal('tap PLAY SHOT to choose a tactical target')}`;
  if (p.id === 'veripath') stage.innerHTML = `<div class="rank-mini"><div><span>01</span><span>AI & Data Science</span><strong>--</strong></div><div><span>02</span><span>Software Engineering</span><strong>--</strong></div><div><span>03</span><span>Product / Innovation</span><strong>--</strong></div></div>${terminal('profile loaded · ranking not started')}`;
  if (p.id === 'pipeline') stage.innerHTML = `<div class="pipe-mini"><div>INGEST</div><div>CLEAN</div><div>TRAIN</div><div>EXPLAIN</div></div>${terminal('pipeline idle')}`;

  if (p.id === 'hmm') {
    stage.querySelectorAll('[data-state]').forEach(btn => btn.onclick = () => { hmmState = btn.dataset.state; renderDemo(); });
  }
}

runButton.onclick = () => {
  const p = projects[current];
  const out = stage.querySelector('.demo-terminal');
  if (p.id === 'ui') {
    stage.querySelector('.ui-window').classList.add('scanned');
    out.innerHTML = `<span class="ok">3 components detected</span> · header · panel · content`;
  }
  if (p.id === 'xai') {
    stage.querySelectorAll('.xai-bar i').forEach(i => i.style.width = i.dataset.w);
    out.innerHTML = `<span class="ok">ranking complete</span> · top signal: Python + ML overlap`;
  }
  if (p.id === 'data') {
    stage.querySelector('.data-progress i').style.width = '100%';
    out.innerHTML = `<span class="ok">3/3 rows validated and inserted</span>`;
  }
  if (p.id === 'hmm') {
    const next = { SUNNY:'CLOUDY', CLOUDY:'RAIN', RAIN:'CLOUDY' }[hmmState];
    out.innerHTML = `next likely state → <span class="gold">${next}</span> <span style="color:#555">(demo model)</span>`;
  }
  if (p.id === 'padel') {
    const ball = stage.querySelector('.padel-ball');
    const goRight = Math.random() > .5;
    ball.style.left = goRight ? '78%' : '22%';
    ball.style.top = '22%';
    out.innerHTML = `<span class="gold">${goRight?'CROSS-COURT':'DOWN THE LINE'}</span> · create space, recover center`;
    setTimeout(()=>{ball.style.left='50%';ball.style.top='50%'},850);
  }
  if (p.id === 'veripath') {
    const scores = [92,86,74];
    stage.querySelectorAll('.rank-mini strong').forEach((el,i)=>el.textContent=`${scores[i]}%`);
    out.innerHTML = `<span class="ok">ranking generated</span> · compatibility ≠ admission probability`;
  }
  if (p.id === 'pipeline') {
    const steps = [...stage.querySelectorAll('.pipe-mini div')];
    let i = 0;
    steps.forEach(s=>s.className='');
    out.textContent = 'pipeline running...';
    pipeTimer = setInterval(()=>{
      if (i>0) { steps[i-1].className='done'; }
      if (i<steps.length) { steps[i].className='run'; i+=1; }
      else { clearInterval(pipeTimer); out.innerHTML='<span class="ok">pipeline complete · report generated</span>'; }
    },380);
  }
};
renderDemo();

panel.querySelectorAll('[data-mode]').forEach(btn => btn.onclick = () => {
  const hunt = btn.dataset.mode === 'hunt';
  panel.classList.toggle('hunt-mode', hunt);
  panel.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('active', x === btn));
});

// TREASURE HUNTER — keyboard/mobile mini game
const cols = 9, rows = 5;
const walls = new Set([3,5,11,12,20,23,31,32,37]);
let player = {x:0,y:4};
let enemy = {x:8,y:0};
let treasures = [{x:2,y:1},{x:6,y:1},{x:7,y:4}];
let score = 0;
let gameOver = false;
const board = panel.querySelector('.hunt-board');
const msg = panel.querySelector('.hunt-msg');
const scoreEl = panel.querySelector('[data-score]');

function key(x,y){return y*cols+x}
function occupiedTreasure(x,y){return treasures.findIndex(t=>t.x===x&&t.y===y)}
function renderHunt(){
  board.innerHTML='';
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    const c=document.createElement('div'); c.className='hunt-cell';
    if(walls.has(key(x,y))) c.classList.add('wall');
    if(occupiedTreasure(x,y)>=0) c.classList.add('treasure');
    if(enemy.x===x&&enemy.y===y) c.classList.add('enemy');
    if(player.x===x&&player.y===y) c.classList.add('player');
    board.appendChild(c);
  }
  scoreEl.textContent=score;
}
function resetHunt(text='New mission loaded.'){
  player={x:0,y:4}; enemy={x:8,y:0}; treasures=[{x:2,y:1},{x:6,y:1},{x:7,y:4}]; score=0; gameOver=false; msg.textContent=text; renderHunt();
}
function moveEnemy(){
  const options=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:enemy.x+dx,y:enemy.y+dy})).filter(p=>p.x>=0&&p.x<cols&&p.y>=0&&p.y<rows&&!walls.has(key(p.x,p.y)));
  options.sort((a,b)=>(Math.abs(a.x-player.x)+Math.abs(a.y-player.y))-(Math.abs(b.x-player.x)+Math.abs(b.y-player.y)));
  if(options[0]) enemy=options[Math.random()>.28?0:Math.floor(Math.random()*options.length)];
}
function move(dir){
  if(gameOver){resetHunt();return}
  const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir]; if(!d)return;
  const nx=player.x+d[0], ny=player.y+d[1];
  if(nx<0||nx>=cols||ny<0||ny>=rows||walls.has(key(nx,ny))){msg.textContent='Blocked. Find another route.';return}
  player={x:nx,y:ny};
  const ti=occupiedTreasure(nx,ny); if(ti>=0){treasures.splice(ti,1);score+=1;msg.textContent=`Signal core ${score}/3 recovered.`}
  moveEnemy();
  if(enemy.x===player.x&&enemy.y===player.y){gameOver=true;msg.textContent='Sentry intercepted you. Move again to restart.'}
  if(score===3){gameOver=true;msg.textContent='ACCESS GRANTED — all signal cores recovered.'}
  renderHunt();
}
panel.querySelectorAll('[data-move]').forEach(btn=>btn.onclick=()=>move(btn.dataset.move));
window.addEventListener('keydown',e=>{
  if(!panel.classList.contains('hunt-mode')) return;
  const map={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
  if(map[e.key]){e.preventDefault();move(map[e.key]);}
});
renderHunt();

// Direct Treasure Hunter access from the nav.
const nav = document.querySelector('.nav__links');
if(nav){
  const huntBtn=document.createElement('button'); huntBtn.textContent='HUNT_';
  huntBtn.onclick=()=>{panel.classList.add('hunt-mode');panel.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x.dataset.mode==='hunt'));hero.scrollIntoView({behavior:'smooth'});};
  nav.insertBefore(huntBtn, nav.lastElementChild);
}
