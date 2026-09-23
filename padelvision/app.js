// Team movement review: actual multi-person pose inference and explicit screen-space rules.
import {selectTeam,summarizeTeam} from './team-analysis.mjs';

const $=selector=>document.querySelector(selector);
const video=$('#video'), overlay=$('#overlay'), input=$('#videoFile'), button=$('#analyze');
const SOURCE='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304';
const MODEL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
const links=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28],[27,31],[28,32]];
let selectedFile=null, objectUrl=null, landmarker=null, report=null, processing=false;
$('#clock').textContent=new Intl.DateTimeFormat('en',{month:'short',day:'numeric'}).format(new Date()).toUpperCase();

function progress(message,percent){
  $('#progress').hidden=false;
  $('#progressText').textContent=message;
  $('#progressBar').style.width=`${Math.max(0,Math.min(100,percent))}%`;
}
function error(message){
  progress(message,0);
  $('#progressText').style.color='#ffb9a9';
  button.disabled=!selectedFile;
  button.innerHTML='RETRY TEAM ANALYSIS <span>→</span>';
}
function clearCanvas(){overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height)}
function invalidateReport(){
  if(!report || processing)return;
  report=null;$('#report').hidden=true;
  $('#coverageStat').textContent='—';$('#styleStat').textContent='—';
  $('#sessionStat').textContent='READY';
  progress('Court setting changed. Run the team analysis again.',0);
  button.innerHTML='RUN TEAM ANALYSIS <span>→</span>';
}
function fileReady(file){
  if(processing || !file)return;
  if(!(/\.(mp4|webm|mov)$/i.test(file.name)||/^video\/(mp4|webm|quicktime)$/.test(file.type))){error('Choose an MP4, WebM or MOV video.');return}
  if(file.size>100*1024*1024){error('Choose a video under 100 MB.');return}
  if(objectUrl)URL.revokeObjectURL(objectUrl);
  objectUrl=URL.createObjectURL(file);selectedFile=file;report=null;
  $('#report').hidden=true;clearCanvas();video.src=objectUrl;video.load();
  $('#dropZone').hidden=true;$('#viewer').hidden=false;$('#progress').hidden=true;
  $('#progressText').style.color='';$('#fileName').textContent=file.name;
  $('#fileMeta').textContent=`${(file.size/1048576).toFixed(1)} MB`;
  $('#sessionStat').textContent='READY';$('#coverageStat').textContent='—';
  $('#styleStat').textContent='—';button.disabled=true;
  button.innerHTML='READING VIDEO… <span>→</span>';
  video.onloadedmetadata=()=>{
    if(!Number.isFinite(video.duration)||video.duration<=0){error('This video cannot be decoded. Try an H.264 MP4 or WebM.');return}
    if(video.duration<3||video.duration>90){error('Use a clip between 3 and 90 seconds long.');return}
    $('#fileMeta').textContent=`${video.duration.toFixed(1)} SEC · ${(file.size/1048576).toFixed(1)} MB`;
    button.disabled=false;button.innerHTML='RUN TEAM ANALYSIS <span>→</span>';
    drawSample(null);
  };
  video.onerror=()=>error('Your browser could not decode this clip. Try an H.264 MP4 or WebM.');
}
input.addEventListener('change',()=>fileReady(input.files?.[0]));
for(const evt of ['dragenter','dragover'])$('#dropZone').addEventListener(evt,e=>{e.preventDefault();$('#dropZone').classList.add('dragging')});
for(const evt of ['dragleave','drop'])$('#dropZone').addEventListener(evt,e=>{e.preventDefault();$('#dropZone').classList.remove('dragging')});
$('#dropZone').addEventListener('drop',e=>fileReady(e.dataTransfer?.files?.[0]));
$('#netLine').addEventListener('input',()=>{
  $('#netValue').textContent=`${$('#netLine').value}% from top`;
  invalidateReport();
  if(video.readyState>=1 && video.paused)drawSample(null);
});
$('#courtSide').addEventListener('change',invalidateReport);
async function getLandmarker(){
  progress('Downloading the pose model and vision runtime…',8);
  const {FilesetResolver,PoseLandmarker}=await import(`${SOURCE}/+esm`);
  const files=await FilesetResolver.forVisionTasks(`${SOURCE}/wasm`);
  landmarker=await PoseLandmarker.createFromOptions(files,{
    baseOptions:{modelAssetPath:MODEL,delegate:'CPU'},runningMode:'VIDEO',numPoses:4,
    minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5
  });
  return landmarker;
}
function seekTo(seconds){
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{cleanup();reject(new Error('Video frame seek timed out.'))},8000);
    const cleanup=()=>{clearTimeout(timer);video.removeEventListener('seeked',done)};
    const done=()=>{cleanup();resolve()};
    video.addEventListener('seeked',done,{once:true});
    video.currentTime=Math.max(0,Math.min(seconds,Math.max(0,video.duration-.04)));
  });
}
async function analyze(){
  if(!selectedFile||processing||!Number.isFinite(video.duration))return;
  processing=true;button.disabled=true;video.pause();$('#progressText').style.color='';
  report=null;$('#report').hidden=true;
  try{
    const model=await getLandmarker(), duration=video.duration;
    const total=Math.min(120,Math.max(6,Math.ceil(duration*2)));
    const side=$('#courtSide').value,netY=Number($('#netLine').value)/100;
    const samples=[];let previous=null;
    for(let i=0;i<total;i++){
      const t=Math.min(duration-.05,(i+.5)*duration/total);
      progress(`Tracking the pair · frame ${i+1} of ${total}`,12+Math.round(84*(i+1)/total));
      await seekTo(t);
      const output=model.detectForVideo(video,Math.round(t*1000));
      const players=selectTeam(output.landmarks||[],previous,side,netY);
      if(players[0]&&players[1])previous=players;
      else if(previous && players.some(Boolean))previous=players.map((p,j)=>p||previous[j]);
      samples.push({time:t,players});
      await new Promise(requestAnimationFrame);
    }
    const summary=summarizeTeam(samples);
    report={version:'browser-team-v0.7',mode:'rule-based movement review',courtSide:side,netLineFraction:netY,
      duration:+duration.toFixed(2),...summary,samples};
    video.currentTime=0;renderReport(report);
    progress('Team review complete. Select a moment to inspect both skeletons.',100);
    $('#report').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){
    console.error('PadelVision team analysis failed',e);
    error(/activeTexture|kGpuService|WebGL|create_context/i.test(String(e?.message||e))
      ? 'MediaPipe could not create a graphics context in this browser. Enable hardware acceleration or run the linked Python app.'
      : 'Team analysis could not run. Check model access and your H.264 MP4, then retry.');
  }finally{
    landmarker?.close();landmarker=null;processing=false;button.disabled=!selectedFile;
    if(report)button.innerHTML='ANALYZE AGAIN <span>↻</span>';
  }
}
button.addEventListener('click',analyze);
function list(selector,items){
  const el=$(selector);el.replaceChildren();
  for(const item of items){const li=document.createElement('li');li.textContent=item;el.append(li)}
}
function renderReport(data){
  $('#report').hidden=false;$('#sessionStat').textContent='PAIR';
  $('#coverageStat').textContent=`${Math.round(data.coverage*100)}%`;
  $('#styleStat').textContent=data.style==='Insufficient team tracking'?'—':data.style.split(' ')[0].toUpperCase();
  $('#sessionId').textContent=`SESSION / ${new Date().toISOString().slice(0,10)}`;
  $('#metricCoverage').textContent=`${Math.round(data.coverage*100)}%`;
  $('#metricNet').textContent=data.style==='Insufficient team tracking'?'—':`${Math.round(data.netShare*100)}%`;
  $('#metricStagger').textContent=data.style==='Insufficient team tracking'?'—':`${Math.round(data.staggerShare*100)}%`;
  $('#metricFrames').textContent=String(data.framesSampled);
  $('#reportStatus').textContent=data.style;
  $('#reportSummary').textContent=data.headline;
  const timeline=$('#timeline');timeline.replaceChildren();
  for(let i=0;i<7;i++){
    const section=document.createElement('div'),time=data.duration*(i+.5)/7;
    const b=document.createElement('b');b.textContent=String(i+1).padStart(2,'0');
    const title=document.createElement('small');title.textContent='Team moment';
    const stamp=document.createElement('span');stamp.textContent=`~${time.toFixed(1)}s`;
    section.append(b,title,stamp);section.setAttribute('role','button');section.tabIndex=0;
    section.title='Inspect a nearby sampled frame';
    const inspect=()=>{const sample=data.samples.reduce((best,s)=>Math.abs(s.time-time)<Math.abs(best.time-time)?s:best);video.pause();seekTo(sample.time).then(()=>drawSample(sample)).catch(()=>{})};
    section.addEventListener('click',inspect);
    section.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect()}});
    timeline.append(section);
  }
  list('#observations',data.observations);list('#nextSteps',data.drills);
}
function drawSample(sample){
  const parent=video.parentElement,dpr=window.devicePixelRatio||1;
  overlay.width=Math.round(parent.clientWidth*dpr);overlay.height=Math.round(parent.clientHeight*dpr);
  const ctx=overlay.getContext('2d');ctx.scale(dpr,dpr);
  if(!video.videoWidth)return;
  const vr=video.getBoundingClientRect(),pr=parent.getBoundingClientRect();
  const ratio=Math.min(vr.width/video.videoWidth,vr.height/video.videoHeight);
  const width=video.videoWidth*ratio,height=video.videoHeight*ratio;
  const x=vr.left-pr.left+(vr.width-width)/2,y=vr.top-pr.top+(vr.height-height)/2;
  const netY=Number($('#netLine').value)/100;
  ctx.setLineDash([8,6]);ctx.lineWidth=1;ctx.strokeStyle='#f9c574';ctx.globalAlpha=.9;
  ctx.beginPath();ctx.moveTo(x,y+height*netY);ctx.lineTo(x+width,y+height*netY);ctx.stroke();
  ctx.setLineDash([]);ctx.font='11px monospace';ctx.fillStyle='#f9c574';ctx.fillText('NET GUIDE',x+8,y+height*netY-8);
  if(!sample)return;
  sample.players.forEach((player,j)=>{
    if(!player?.points)return;
    const points=player.points,color=j?'#69ced1':'#b2f276';
    ctx.lineWidth=2;ctx.strokeStyle=color;ctx.fillStyle=color;
    for(const [a,b] of links){const p=points[a],q=points[b];if((p.visibility??1)<.45||(q.visibility??1)<.45)continue;
      ctx.beginPath();ctx.moveTo(x+p.x*width,y+p.y*height);ctx.lineTo(x+q.x*width,y+q.y*height);ctx.stroke()}
    for(const k of [11,12,13,14,15,16,23,24,25,26,27,28]){const p=points[k];if((p.visibility??1)<.45)continue;
      ctx.beginPath();ctx.arc(x+p.x*width,y+p.y*height,3.5,0,Math.PI*2);ctx.fill()}
    ctx.font='bold 15px monospace';ctx.fillText(`PLAYER ${j?'B':'A'}`,x+player.foot.x*width+10,y+player.foot.y*height-10);
  });
}
video.addEventListener('seeked',()=>{
  if(processing)return;
  const sample=report?.samples.reduce((best,s)=>Math.abs(s.time-video.currentTime)<Math.abs(best.time-video.currentTime)?s:best);
  drawSample(sample && Math.abs(sample.time-video.currentTime)<.08 ? sample : null);
});
video.addEventListener('play',clearCanvas);
window.addEventListener('resize',()=>{if(video.readyState>=1 && video.paused)drawSample(null)});
$('#downloadReport').addEventListener('click',()=>{
  if(!report)return;
  const {samples,...summary}=report;
  const label=$('#coachLabel').value;
  const result={...summary,
    coachReview:label?{label,note:$('#coachNote').value.trim().slice(0,1000),matchId:$('#matchId').value.trim().slice(0,80)}:null,
    notes:['Style and drill cues are unvalidated rules, not a trained strategy model.','No ball, racket, stroke outcome or verified fault is detected.'],
    samples:samples.map(s=>({time:+s.time.toFixed(2),players:s.players.map(p=>p?{foot:p.foot,estimatedDepth:+p.depth.toFixed(3)}:null)}))};
  const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='padelvision-team-session.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});
