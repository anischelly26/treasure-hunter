const API='https://anis-project-ratings.rhythmx.chatgpt.site/api/ratings';
const PROJECTS=new Set(['aura','vermeg','orange','zero-eclipse','monoprix','padelvision','here','hmm','barcelona','ml-pipeline','veripath','treasure']);
const cards=new Map(),versions=new Map(),busy=new Set();
let voter=null,loadRequest=null,lastLoad=0;
try{
  const key='anis-project-ratings-voter-v1';
  const saved=localStorage.getItem(key);
  if(saved&&(/^[a-f0-9]{32}$/i.test(saved)||/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(saved)))voter=saved;
  else{voter=crypto.randomUUID();localStorage.setItem(key,voter);}
}catch{voter=null;}

function draw(item,preview){
  const score=preview??item.data.mine??0;
  for(const button of item.buttons){const n=Number(button.dataset.score);button.classList.toggle('is-filled',n<=score);button.setAttribute('aria-checked',String(n===item.data.mine));button.tabIndex=n===(item.data.mine||1)?0:-1;button.setAttribute('aria-disabled',String(!voter||busy.has(item.key)));}
  if(item.loaded)item.total.textContent=item.data.count?`${item.data.average.toFixed(1)} / 5 · ${item.data.count} ${item.data.count===1?'rating':'ratings'}`:'No ratings yet';
}

function note(item,message,error=false){item.note.textContent=message;item.note.classList.toggle('is-error',error);}
function ownNote(item){note(item,!voter?'Enable site storage and reload to leave a rating.':item.data.mine?`Your rating: ${item.data.mine}/5. Change it anytime.`:'One rating per browser. Change it anytime.');}
function parseProjects(payload){
  if(!payload||!payload.projects||typeof payload.projects!=='object')throw new Error('Ratings response unavailable');
  const out=new Map();
  for(const key of cards.keys()){
    const row=payload.projects[key];
    if(!row||!Number.isSafeInteger(row.count)||row.count<0||!(row.count===0?row.average===null:Number.isFinite(row.average)&&row.average>=1&&row.average<=5)||!(row.mine===null||Number.isInteger(row.mine)&&row.mine>=1&&row.mine<=5))throw new Error('Invalid ratings response');
    out.set(key,{count:row.count,average:row.average,mine:row.mine});
  }
  return out;
}

async function request(options={},controller=new AbortController()){
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(API+(options.method==='POST'?'':voter?'?voter='+encodeURIComponent(voter):''),{...options,signal:controller.signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});
    const payload=await response.json();
    if(!response.ok){const error=new Error(response.status===429?'Please wait a minute before rating again.':'Could not confirm the save. Please try again.');error.status=response.status;throw error;}
    return parseProjects(payload);
  }finally{clearTimeout(timeout);}
}

async function load(){
  if(loadRequest)return;
  const snapshot=new Map(versions),controller=new AbortController();loadRequest=controller;
  for(const item of cards.values())item.retry.hidden=true;
  try{
    const rows=await request({},controller);
    for(const [key,data] of rows){if(busy.has(key)||(versions.get(key)||0)!==(snapshot.get(key)||0))continue;const item=cards.get(key);item.data=data;item.loaded=true;draw(item);ownNote(item);}
    lastLoad=Date.now();
  }catch{
    for(const item of cards.values()){if(busy.has(item.key))continue;if(!item.loaded)item.total.textContent='Ratings unavailable';note(item,'Could not load shared ratings. Try again.',true);item.retry.hidden=false;}
  }finally{if(loadRequest===controller)loadRequest=null;}
}

async function save(item,score){
  if(!voter||busy.has(item.key))return;
  busy.add(item.key);versions.set(item.key,(versions.get(item.key)||0)+1);item.note.setAttribute('aria-live','polite');note(item,'Saving your rating…');item.retry.hidden=true;draw(item,score);
  try{
    const rows=await request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({project:item.key,score,voter})});
    // Other projects may have saves in flight; only this confirmed vote is applied.
    item.data=rows.get(item.key);item.loaded=true;item.note.textContent=`Saved. Your rating: ${item.data.mine}/5. Change it anytime.`;item.note.classList.remove('is-error');
  }catch(error){note(item,error.status===429?error.message:'Could not confirm the save. Select a star to try again.',true);}
  finally{busy.delete(item.key);versions.set(item.key,(versions.get(item.key)||0)+1);draw(item);}
}

function attach(card){
  const key=card.dataset.project;
  if(!PROJECTS.has(key)||cards.has(key))return;
  const title=card.querySelector('h3')?.textContent.trim()||key;
  const section=document.createElement('section');section.className='project-rating';section.setAttribute('aria-label',`Rating for ${title}`);
  const header=document.createElement('div');header.className='project-rating__header';
  const label=document.createElement('span');label.id=`project-rating-${key}`;label.textContent='Rate this project';
  const total=document.createElement('span');total.className='project-rating__total';total.textContent='Loading ratings…';header.append(label,total);
  const group=document.createElement('div');group.className='project-rating__stars';group.setAttribute('role','radiogroup');group.setAttribute('aria-labelledby',label.id);
  const noteElement=document.createElement('p');noteElement.className='project-rating__note';noteElement.setAttribute('role','status');noteElement.setAttribute('aria-live','off');
  const retry=document.createElement('button');retry.className='project-rating__retry';retry.type='button';retry.textContent='Retry loading ratings';retry.hidden=true;retry.addEventListener('click',()=>load());
  const item={key,section,total,note:noteElement,retry,buttons:[],loaded:false,data:{count:0,average:null,mine:null}};cards.set(key,item);
  for(let score=1;score<=5;score++){
    const button=document.createElement('button');button.type='button';button.className='project-rating__star';button.dataset.score=String(score);button.textContent='★';button.setAttribute('role','radio');button.setAttribute('aria-label',`Rate ${title} ${score} out of 5`);
    button.addEventListener('click',event=>{event.stopPropagation();save(item,score)});
    button.addEventListener('pointerenter',()=>{if(!busy.has(key))draw(item,score)});
    button.addEventListener('focus',()=>{if(!busy.has(key))draw(item,score)});
    button.addEventListener('keydown',event=>{
      const delta={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];
      if(delta===undefined&&event.key!=='Home'&&event.key!=='End')return;
      event.preventDefault();event.stopPropagation();if(busy.has(key)||!voter)return;
      const next=event.key==='Home'?1:event.key==='End'?5:((score-1+delta+5)%5)+1;
      item.buttons[next-1].focus();save(item,next);
    });
    group.append(button);item.buttons.push(button);
  }
  group.addEventListener('pointerleave',()=>{if(!busy.has(key))draw(item)});
  group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget)&&!busy.has(key))draw(item)});
  section.addEventListener('click',event=>event.stopPropagation());section.append(header,group,noteElement,retry);card.append(section);draw(item);ownNote(item);
}

const grid=document.querySelector('.mission-grid');
if(grid){
  grid.querySelectorAll('.mission[data-project]').forEach(attach);
  // Treasure Hunter is inserted by the portfolio's existing module.
  new MutationObserver(records=>{let changed=false;for(const record of records)for(const node of record.addedNodes){if(node.nodeType===1&&node.matches?.('.mission[data-project]')){const before=cards.size;attach(node);changed ||= cards.size>before;}}if(changed)load();}).observe(grid,{childList:true});
  load();
  const refresh=()=>{if(document.visibilityState==='visible'&&Date.now()-lastLoad>30000)load();};
  addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
}
