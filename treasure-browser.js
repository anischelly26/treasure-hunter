const card=document.querySelector('[data-treasure-project]');
const holder=card?.querySelector('[data-treasure-demo]');
const toggle=card?.querySelector('[data-treasure-toggle]');
if(!card||!holder||!toggle)throw new Error('Treasure Hunter project card not ready');

const style=document.createElement('style');
style.textContent=`
.treasure-shell{position:relative;border:1px solid rgba(215,169,79,.22);background:#020202}.treasure-shell canvas{display:block;width:100%;height:auto;aspect-ratio:2/1;image-rendering:pixelated;background:#111;outline:none}
.treasure-hud{position:absolute;left:8px;right:8px;top:8px;display:flex;justify-content:space-between;gap:10px;pointer-events:none;font:7px var(--mono);letter-spacing:.08em;color:#fff;text-shadow:0 1px 2px #000}.treasure-hud span{background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.13);padding:5px 7px}
.treasure-help{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:8px}.treasure-help p{margin:0!important;font:7px/1.55 var(--mono)!important;color:#777!important}
.treasure-controls{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.treasure-control{min-width:44px;height:34px;padding:0 8px;border:1px solid rgba(255,255,255,.1);background:#0a0a0a;color:#8d8d87;font:8px var(--mono);cursor:pointer}.treasure-control:hover,.treasure-control.primary{border-color:rgba(215,169,79,.4);color:var(--gold)}
.treasure-note{margin-top:8px;font:7px/1.55 var(--mono);color:#5f5c56}.treasure-note b{color:#9a7b42;font-weight:400}.treasure-loading{height:260px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.08);font:9px var(--mono);color:#777;text-align:center}.treasure-loading b{display:block;color:var(--gold);margin-bottom:8px}
@media(max-width:620px){.treasure-help{align-items:flex-start;flex-direction:column}.treasure-controls{width:100%;justify-content:flex-start}.treasure-control{flex:1}}
`;
document.head.appendChild(style);

holder.innerHTML=`
<div class="treasure-loading"><div><b>READY TO LOAD ORIGINAL SDL2 MAPS</b>Open this demo to read the four level arrays from the public team source.</div></div>
<div class="treasure-game" hidden>
  <div class="treasure-shell">
    <canvas width="1024" height="512" tabindex="0" aria-label="Treasure Hunter playable browser demo"></canvas>
    <div class="treasure-hud"><span data-level>LEVEL 1 / 4</span><span data-status>HP 100</span></div>
  </div>
  <div class="treasure-help">
    <p>← → MOVE · SPACE JUMP · ↑ ATTACK<br>R RESTART · Touch controls work on mobile.</p>
    <div class="treasure-controls">
      <button class="treasure-control" data-control="left">←</button>
      <button class="treasure-control" data-control="right">→</button>
      <button class="treasure-control primary" data-control="jump">JUMP</button>
      <button class="treasure-control primary" data-control="attack">ATTACK</button>
      <button class="treasure-control" data-control="restart">R</button>
    </div>
  </div>
  <div class="treasure-note"><b>SOURCE-BACKED:</b> original 16×32 maps, four-level progression, SDL controls, 100 HP, spike/crab damage, crab healing and the 100 HP shark boss. Physics are adapted for the browser.</div>
</div>`;

const MAIN_C='https://raw.githubusercontent.com/adam12bT/Treasure-Hunter/main/src/main.c';
const BASE='https://raw.githubusercontent.com/adam12bT/Treasure-Hunter/main/assets/';
const ASSET_PATHS={bg:'playing_bg_img.png',start:'press%20space%20to%20start.png',player:'player_sprites1.png',crab:'craby1.png',shark:'shark.png',tiles:'outside_sprites.png',spikes:'trap_atlas.png',tree:'tree_one_atlas.png',flag:'flag.png',wheel:'wheel.png',chest:'chest.png',dead:'DIEAD.png',cloud:'big_clouds.png'};
function parseMaps(src){const out=[];for(let n=1;n<=4;n++){const match=src.match(new RegExp('int\\s+level'+n+'\\s*\\[16\\]\\[32\\]\\s*=\\s*\\{([\\s\\S]*?)\\n\\s*\\};'));if(!match)throw new Error('level'+n+' array not found');const rows=[...match[1].matchAll(/\{([^{}]+)\}/g)].map(m=>m[1].split(',').map(x=>Number(x.trim())).filter(Number.isFinite));if(rows.length!==16||rows.some(r=>r.length!==32))throw new Error('level'+n+' array shape mismatch');out.push(rows)}return out}
function intersects(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}

let loaded=false;
let active=false;
function ensureGame(){
  if(loaded)return;
  loaded=true;
  holder.querySelector('.treasure-loading').innerHTML='<div><b>LOADING ORIGINAL SDL2 MAPS…</b>The demo reads the level arrays directly from the public C source.</div>';
  fetch(MAIN_C).then(r=>{if(!r.ok)throw new Error('Could not load original source');return r.text()}).then(src=>boot(parseMaps(src))).catch(err=>{holder.querySelector('.treasure-loading').innerHTML='<div><b>GAME SOURCE COULD NOT LOAD</b>'+String(err.message||err)+'<br><br><a href="https://github.com/adam12bT/Treasure-Hunter" target="_blank" rel="noreferrer" style="color:var(--gold)">Open original repository ↗</a></div>'});
}

function setOpen(force){
  document.querySelectorAll('.mission.demo-open').forEach(other=>{if(other!==card){other.classList.remove('demo-open');const b=other.querySelector('.project-demo-toggle b');if(b)b.textContent='＋'}});
  const open=typeof force==='boolean'?force:!card.classList.contains('demo-open');
  card.classList.toggle('demo-open',open);toggle.querySelector('b').textContent=open?'−':'＋';active=open;
  if(open){ensureGame();setTimeout(()=>{card.scrollIntoView({behavior:'smooth',block:'center'});holder.querySelector('canvas')?.focus()},80)}
}
toggle.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setOpen()});
toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setOpen()}});
holder.addEventListener('click',e=>e.stopPropagation());

function boot(maps){
  holder.querySelector('.treasure-loading').hidden=true;
  const gameWrap=holder.querySelector('.treasure-game');gameWrap.hidden=false;
  const canvas=holder.querySelector('canvas'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
  const levelEl=holder.querySelector('[data-level]'),statusEl=holder.querySelector('[data-status]');
  const imgs={};Object.keys(ASSET_PATHS).forEach(k=>{const i=new Image();i.src=BASE+ASSET_PATHS[k];imgs[k]=i});
  const keys={left:false,right:false};
  let last=performance.now();
  let state;

  function enemyFromMap(map){let spawn=null,left=0,right=1024;for(let r=0;r<16;r++)for(let c=0;c<32;c++){const v=map[r][c];if(v===90||v===91)spawn={x:c*32,y:r*32+3};if(v===5)left=c*32;if(v===4)right=c*32}return spawn?{x:spawn.x,y:spawn.y,dir:-1,left,right,dead:false,cooldown:0}:null}
  function reset(started=false){state={started,level:0,dead:false,won:false,invuln:0,attack:0,attackHit:false,p:{x:0,y:360,vx:0,vy:0,onGround:false,facing:1,hp:100},enemy:enemyFromMap(maps[0]),boss:{x:950,y:312,hp:100,mode:'idle',dir:-1,timer:2.5,contact:0,hit:0}};keys.left=keys.right=false;hud()}
  function hud(){levelEl.textContent='LEVEL '+(state.level+1)+' / 4';statusEl.textContent='HP '+Math.max(0,Math.round(state.p.hp))+(state.level===3?' · BOSS '+Math.max(0,Math.round(state.boss.hp)):'')}
  function loadLevel(n){state.level=n;state.p.x=n===2?10:0;state.p.y=50;state.p.vx=0;state.p.vy=0;state.enemy=n<3?enemyFromMap(maps[n]):null;hud()}
  function damage(amount,respawn=false){if(state.invuln>0||state.dead)return;state.p.hp-=amount;state.invuln=.8;if(respawn){state.p.x=0;state.p.y=50;state.p.vy=0}if(state.p.hp<=0){state.p.hp=0;state.dead=true}hud()}
  function attackBox(){const p=state.p;return{x:p.facing>0?p.x+44:p.x-10,y:p.y+10,w:30,h:20}}
  function eachTile(values,fn){const map=maps[state.level];for(let r=0;r<16;r++)for(let c=0;c<32;c++)if(values.includes(map[r][c]))fn({x:c*32,y:r*32,w:32,h:32,v:map[r][c],r,c})}
  function jump(){if(!state.started){state.started=true;return}if(state.dead||state.won){reset(true);return}if(state.p.onGround){state.p.vy=-420;state.p.onGround=false}}
  function attack(){if(!state.started){state.started=true;return}if(state.dead||state.won)return;if(state.attack<=0){state.attack=.28;state.attackHit=false}}
  function update(dt){
    if(!active||!state.started||state.dead||state.won)return;
    const p=state.p;state.invuln=Math.max(0,state.invuln-dt);state.attack=Math.max(0,state.attack-dt);p.vx=keys.left?-170:keys.right?170:0;if(p.vx)p.facing=p.vx>0?1:-1;
    const oldX=p.x,oldY=p.y;p.x+=p.vx*dt;p.vy+=900*dt;p.y+=p.vy*dt;p.onGround=false;let hb={x:p.x+22,y:p.y+5,w:20,h:34};
    eachTile([0,3,6,17],t=>{if(!intersects(hb,t))return;if(p.vy>=0&&oldY+39<=t.y+7){p.y=t.y-39;p.vy=0;p.onGround=true;hb.y=p.y+5}else if(p.vx>0&&oldX+64<=t.x+6)p.x=t.x-64;else if(p.vx<0&&oldX>=t.x+t.w-6)p.x=t.x+t.w});
    eachTile([2],t=>{const s={x:t.x,y:t.y+12,w:32,h:20};if(intersects({x:p.x+22,y:p.y+5,w:20,h:34},s))damage(20,true)});
    if(p.y>530)damage(20,true);if(p.x<0)p.x=0;if(p.x>1000&&state.level<3)loadLevel(state.level+1);
    const e=state.enemy;if(e&&!e.dead){e.x+=e.dir*55*dt;if(e.x<=e.left){e.x=e.left;e.dir=1}if(e.x>=e.right){e.x=e.right;e.dir=-1}e.cooldown=Math.max(0,e.cooldown-dt);const er={x:e.x+24,y:e.y+8,w:28,h:24};if(intersects({x:p.x+22,y:p.y+5,w:20,h:34},er)&&e.cooldown<=0){damage(20);e.cooldown=1}if(state.attack>0&&!state.attackHit&&intersects(attackBox(),er)){e.dead=true;state.attackHit=true;p.hp=Math.min(100,p.hp+20);hud()}}
    if(state.level===3&&state.boss.hp>0){const b=state.boss;b.contact=Math.max(0,b.contact-dt);b.hit=Math.max(0,b.hit-dt);b.timer-=dt;if(b.timer<=0){const choice=1+Math.floor(Math.random()*3);if(choice===1){b.mode='charge';b.dir=p.x<b.x?-1:1;b.timer=2.3}if(choice===2){b.mode='spawn';b.timer=1.2;state.enemy={x:Math.max(0,b.x-80),y:352,dir:-1,left:0,right:900,dead:false,cooldown:0}}if(choice===3){b.mode='idle';b.timer=2}}if(b.mode==='charge'){b.x+=b.dir*260*dt;if(b.x<0){b.x=0;b.dir=1}if(b.x>900){b.x=900;b.dir=-1}}const br={x:b.x+18,y:b.y+18,w:34,h:52};if(intersects({x:p.x+22,y:p.y+5,w:20,h:34},br)&&b.contact<=0){damage(b.mode==='charge'?30:10);b.contact=.8}if(state.attack>0&&!state.attackHit&&b.hit<=0&&intersects(attackBox(),br)){b.hp=Math.max(0,b.hp-10);b.hit=.38;state.attackHit=true;hud()}if(b.hp<=0){state.won=true;hud()}}
  }
  function sprite(img,sx,sy,sw,sh,dx,dy,dw,dh,flip=false){if(!img.complete||!img.naturalWidth)return;ctx.save();if(flip){ctx.translate(dx+dw,dy);ctx.scale(-1,1);ctx.drawImage(img,sx,sy,sw,sh,0,0,dw,dh)}else ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);ctx.restore()}
  function draw(now){
    ctx.clearRect(0,0,1024,512);
    if(!state.started){if(imgs.start.complete&&imgs.start.naturalWidth)ctx.drawImage(imgs.start,0,0,1024,512);else{ctx.fillStyle='#151515';ctx.fillRect(0,0,1024,512);ctx.fillStyle='#fff';ctx.font='36px monospace';ctx.fillText('TREASURE HUNTER — PRESS SPACE',180,260)}return}
    if(imgs.bg.complete&&imgs.bg.naturalWidth)ctx.drawImage(imgs.bg,0,0,1024,512);else{ctx.fillStyle='#79c9e9';ctx.fillRect(0,0,1024,512)}
    if(imgs.cloud.complete&&imgs.cloud.naturalWidth){ctx.globalAlpha=.65;ctx.drawImage(imgs.cloud,(now*.015)%1300-250,18,448,101);ctx.globalAlpha=1}
    const map=maps[state.level],flagFrame=Math.floor(now/120)%8,wheelFrame=Math.floor(now/100)%10;
    for(let r=0;r<16;r++)for(let c=0;c<32;c++){const v=map[r][c],x=c*32,y=r*32;if([0,17].includes(v)&&imgs.tiles.complete)ctx.drawImage(imgs.tiles,32,0,32,32,x,y,32,32);if(v===6&&imgs.tiles.complete)ctx.drawImage(imgs.tiles,32,32,32,32,x,y,32,32);if(v===3&&imgs.tiles.complete)ctx.drawImage(imgs.tiles,96,96,32,32,x,y,32,32);if(v===2&&imgs.spikes.complete)ctx.drawImage(imgs.spikes,0,0,imgs.spikes.naturalWidth,imgs.spikes.naturalHeight,x,y,32,32);if(v===7&&imgs.tree.complete)ctx.drawImage(imgs.tree,0,0,imgs.tree.naturalWidth,imgs.tree.naturalHeight,x,y-70,40,150);if(v===10&&imgs.flag.complete)ctx.drawImage(imgs.flag,flagFrame*34,0,34,93,x,y,40,100);if(v===11&&imgs.wheel.complete)ctx.drawImage(imgs.wheel,wheelFrame*31,0,31,32,x,y,31,32)}
    if(state.enemy&&!state.enemy.dead&&imgs.crab.complete){const f=Math.floor(now/110)%6;sprite(imgs.crab,f*72,32,72,32,state.enemy.x,state.enemy.y,72,32,state.enemy.dir>0)}
    if(state.level===3&&state.boss.hp>0&&imgs.shark.complete){const b=state.boss,f=Math.floor(now/120)%4,row=b.mode==='charge'?1:0;sprite(imgs.shark,f*34,row*30,34,30,b.x,b.y,68,80,b.dir>0)}
    if(state.level===3&&state.boss.hp<=0&&imgs.chest.complete){const f=Math.floor(now/180)%5;ctx.drawImage(imgs.chest,f*64,0,64,35,515,332,128,70)}
    const p=state.p;let row=0,frames=4;if(state.attack>0){row=4;frames=4}else if(!p.onGround){row=p.vy<0?2:3;frames=4}else if(Math.abs(p.vx)>0){row=1;frames=5}sprite(imgs.player,(Math.floor(now/100)%frames)*64,row*40,64,40,p.x,p.y,64,40,p.facing<0);
    if(state.attack>0){const a=attackBox();ctx.fillStyle='rgba(255,220,110,.18)';ctx.fillRect(a.x,a.y,a.w,a.h)}
    ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(5,5,202,22);ctx.fillStyle='#e33';ctx.fillRect(7,7,196*(p.hp/100),18);if(state.level===3){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(817,5,202,22);ctx.fillStyle='#ffd42a';ctx.fillRect(819,7,196*(state.boss.hp/100),18)}
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(392,4,240,28);ctx.fillStyle='#fff';ctx.font='18px monospace';ctx.textAlign='center';ctx.fillText(state.level===3?'— The final Level —':'— The '+['First','Second','Third'][state.level]+' Level —',512,24);ctx.textAlign='left';
    if(state.dead){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,1024,512);if(imgs.dead.complete&&imgs.dead.naturalWidth)ctx.drawImage(imgs.dead,380,50,300,400);ctx.fillStyle='#fff';ctx.font='24px monospace';ctx.textAlign='center';ctx.fillText('R — RESTART',512,470);ctx.textAlign='left'}
    if(state.won){ctx.fillStyle='rgba(0,0,0,.38)';ctx.fillRect(0,0,1024,512);ctx.fillStyle='#ffe08a';ctx.font='28px monospace';ctx.textAlign='center';ctx.fillText('BOSS DEFEATED — TREASURE RECOVERED',512,105);ctx.font='18px monospace';ctx.fillText('R — PLAY AGAIN',512,136);ctx.textAlign='left'}
  }
  function loop(now){const dt=Math.min(.035,(now-last)/1000);last=now;update(dt);draw(now);requestAnimationFrame(loop)}
  reset(false);requestAnimationFrame(loop);
  function down(c){if(c==='left')keys.left=true;if(c==='right')keys.right=true;if(c==='jump')jump();if(c==='attack')attack();if(c==='restart')reset(true)}
  function up(c){if(c==='left')keys.left=false;if(c==='right')keys.right=false}
  holder.querySelectorAll('[data-control]').forEach(b=>{const c=b.dataset.control;b.addEventListener('pointerdown',e=>{e.preventDefault();active=true;down(c)});b.addEventListener('pointerup',e=>{e.preventDefault();up(c)});b.addEventListener('pointerleave',()=>up(c))});
  canvas.addEventListener('focus',()=>{active=true});
  window.addEventListener('keydown',e=>{if(!active||!card.classList.contains('demo-open'))return;if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')keys.left=true;if(e.key==='ArrowRight')keys.right=true;if(e.key===' ')jump();if(e.key==='ArrowUp')attack();if(e.key.toLowerCase()==='r')reset(true)},{passive:false});
  window.addEventListener('keyup',e=>{if(!active)return;if(e.key==='ArrowLeft')keys.left=false;if(e.key==='ArrowRight')keys.right=false});
}
