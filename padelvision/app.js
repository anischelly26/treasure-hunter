// The hosted demo runs pose inference in the browser. No upload or scoring service is involved.
const $ = (selector) => document.querySelector(selector);
const fileInput = $('#videoFile');
const dropZone = $('#dropZone');
const viewer = $('#viewer');
const video = $('#video');
const overlay = $('#overlay');
const analyzeButton = $('#analyze');
const progress = $('#progress');
const progressBar = $('#progressBar');
const progressText = $('#progressText');
const phases = ['Ready position', 'Preparation', 'Backswing', 'Acceleration', 'Contact window', 'Follow-through', 'Recovery'];
const links = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28],[27,31],[28,32]];
const SOURCE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304';
const MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
let objectUrl = null;
let selectedFile = null;
let landmarker = null;
let report = null;
let processing = false;

$('#clock').textContent = new Intl.DateTimeFormat('en', {month:'short', day:'numeric'}).format(new Date()).toUpperCase();

function status(message, percent) {
  progress.hidden = false;
  progressText.textContent = message;
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}
function error(message) {
  status(message, 0);
  progressText.style.color = '#ffb9a9';
  analyzeButton.disabled = !selectedFile;
  analyzeButton.innerHTML = 'RETRY ANALYSIS <span>→</span>';
}
function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a,b)=>a-b);
  const middle = Math.floor(sorted.length/2);
  return sorted.length%2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2;
}
function distance(a,b,w,h) { return Math.hypot((a.x-b.x)*w,(a.y-b.y)*h); }
function angle(a,b,c,w,h) {
  if (![a,b,c].every(p=>p && (p.visibility??1)>.45)) return null;
  const ux=(a.x-b.x)*w, uy=(a.y-b.y)*h, vx=(c.x-b.x)*w, vy=(c.y-b.y)*h;
  const m=Math.hypot(ux,uy)*Math.hypot(vx,vy);
  return m>0? Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/m)))*180/Math.PI : null;
}
function fileReady(file) {
  if (processing) return;
  if (!file) return;
  if (!(/\.(mp4|webm|mov)$/i.test(file.name) || /^video\/(mp4|webm|quicktime)$/.test(file.type))) { error('Choose an MP4, WebM or MOV video.'); return; }
  if (file.size>100*1024*1024) { error('Choose a video under 100 MB.'); return; }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  selectedFile=file;
  report=null;
  $('#report').hidden=true;
  overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height);
  video.src=objectUrl;
  video.load();
  dropZone.hidden=true;
  viewer.hidden=false;
  progress.hidden=true;
  progressText.style.color='';
  $('#fileName').textContent=file.name;
  $('#fileMeta').textContent=`${(file.size/1048576).toFixed(1)} MB`;
  analyzeButton.disabled=true;
  analyzeButton.innerHTML='READING VIDEO… <span>→</span>';
  $('#sessionStat').textContent='READY';
  $('#coverageStat').textContent='—';
  video.onloadedmetadata=()=>{
    if (!Number.isFinite(video.duration) || video.duration<=0) { error('This video cannot be decoded in your browser. Try an H.264 MP4 or WebM.'); return; }
    if (video.duration<2 || video.duration>60) { error('Use a clip between 2 and 60 seconds long.'); return; }
    $('#fileMeta').textContent=`${video.duration.toFixed(1)} SEC · ${(file.size/1048576).toFixed(1)} MB`;
    analyzeButton.disabled=false;
    analyzeButton.innerHTML='RUN POSE ANALYSIS <span>→</span>';
  };
  video.onerror=()=>error('Your browser could not decode this video. Try an H.264 MP4 or WebM.');
}
fileInput.addEventListener('change',()=>fileReady(fileInput.files?.[0]));
for (const evt of ['dragenter','dragover']) dropZone.addEventListener(evt,e=>{e.preventDefault();dropZone.classList.add('dragging')});
for (const evt of ['dragleave','drop']) dropZone.addEventListener(evt,e=>{e.preventDefault();dropZone.classList.remove('dragging')});
dropZone.addEventListener('drop',e=>fileReady(e.dataTransfer?.files?.[0]));

async function getLandmarker() {
  if (landmarker) return landmarker;
  status('Downloading the pose model and vision runtime…',8);
  const {FilesetResolver, PoseLandmarker} = await import(`${SOURCE}/+esm`);
  const files = await FilesetResolver.forVisionTasks(`${SOURCE}/wasm`);
  landmarker = await PoseLandmarker.createFromOptions(files,{
    baseOptions:{modelAssetPath:MODEL,delegate:'CPU'},
    runningMode:'VIDEO',numPoses:1,
    minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5
  });
  return landmarker;
}
function seekTo(seconds) {
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{cleanup();reject(new Error('The video could not seek to a sampled frame.'))},8000);
    const cleanup=()=>{clearTimeout(timer);video.removeEventListener('seeked',done)};
    const done=()=>{cleanup();resolve()};
    video.addEventListener('seeked',done,{once:true});
    video.currentTime=Math.max(0,Math.min(seconds,Math.max(0,video.duration-.03)));
  });
}
async function analyze() {
  if (!selectedFile || processing || !Number.isFinite(video.duration)) return;
  processing=true;analyzeButton.disabled=true;video.pause();progressText.style.color='';
  report=null;$('#report').hidden=true;
  try {
    const model=await getLandmarker();
    const duration=video.duration;
    const total=Math.min(120,Math.max(3,Math.ceil(duration*2)));
    const samples=[];
    // strictly increasing timestamps required by MediaPipe's VIDEO mode.
    for (let i=0;i<total;i++) {
      const t=Math.min(duration-.04,(i+.5)*duration/total);
      status(`Analyzing frame ${i+1} of ${total} · video stays local`,12+Math.round(84*(i+1)/total));
      await seekTo(t);
      const output=model.detectForVideo(video,Math.round(t*1000));
      const points=output.landmarks?.[0]||null;
      const side=$('#hand').value==='right' ? [12,14,16] : [11,13,15];
      const elbow=points?angle(points[side[0]],points[side[1]],points[side[2]],video.videoWidth,video.videoHeight):null;
      const shoulder=points?distance(points[11],points[12],video.videoWidth,video.videoHeight):0;
      const stance=points && shoulder>1 && [27,28].every(k=>(points[k].visibility??1)>.45)?distance(points[27],points[28],video.videoWidth,video.videoHeight)/shoulder:null;
      samples.push({time:t,points,elbow,stance});
      await new Promise(requestAnimationFrame);
    }
    const detected=samples.filter(s=>s.points).length;
    report={version:'browser-v0.6',stroke:$('#stroke').value,handedness:$('#hand').value,duration:+duration.toFixed(2),framesSampled:total,framesWithPose:detected,coverage:detected/total,elbowMedian:median(samples.map(s=>s.elbow).filter(Number.isFinite)),stanceMedian:median(samples.map(s=>s.stance).filter(Number.isFinite)),phaseMethod:'Seven equal-duration windows; no stroke/contact detection',samples};
    video.currentTime=0;
    renderReport(report);
    status('Analysis complete. Select a phase below to inspect a sampled frame.',100);
    $('#report').scrollIntoView({behavior:'smooth',block:'start'});
  } catch(e) {
    console.error('PadelVision analysis failed',e);
    const detail=String(e?.message||e);
    if (/activeTexture|kGpuService|WebGL|create_context/i.test(detail)) {
      error('This browser could not create the graphics context MediaPipe needs. Try enabling hardware acceleration or run the linked Python application.');
    } else {
      error('Pose analysis could not run. Check internet access for the model, use a short H.264 MP4, then retry.');
    }
  } finally {
    landmarker?.close();landmarker=null; // VIDEO mode needs a new timestamp sequence for the next run.
    processing=false;analyzeButton.disabled=!selectedFile;
    if (report) analyzeButton.innerHTML='ANALYZE AGAIN <span>↻</span>';
  }
}
analyzeButton.addEventListener('click',analyze);

function addItems(selector,items) {
  const ul=$(selector);ul.replaceChildren();
  for(const value of items){const li=document.createElement('li');li.textContent=value;ul.append(li)}
}
function renderReport(data) {
  $('#report').hidden=false;
  $('#sessionStat').textContent='01';
  $('#strokeStat').textContent=data.stroke.toUpperCase();
  $('#coverageStat').textContent=`${Math.round(data.coverage*100)}%`;
  $('#sessionId').textContent=`SESSION / ${new Date().toISOString().slice(0,10)}`;
  $('#metricCoverage').textContent=`${Math.round(data.coverage*100)}%`;
  $('#metricElbow').textContent=data.elbowMedian==null?'—':`${Math.round(data.elbowMedian)}°`;
  $('#metricStance').textContent=data.stanceMedian==null?'—':`${data.stanceMedian.toFixed(2)}×`;
  $('#metricFrames').textContent=String(data.framesSampled);
  $('#reportStatus').textContent=data.framesWithPose===0?'No pose detected':data.coverage<.6?'Limited pose coverage':'Pose tracking available';
  $('#reportSummary').textContent=`Body landmarks found in ${data.framesWithPose} of ${data.framesSampled} sampled frames. Measurements describe this camera view; they are not a technique grade.`;
  const timeline=$('#timeline');timeline.replaceChildren();
  for(let i=0;i<7;i++){
    const section=document.createElement('div');
    const time=(data.duration*(i+.5)/7);
    const b=document.createElement('b');b.textContent=String(i+1).padStart(2,'0');
    const title=document.createElement('small');title.textContent=phases[i];
    const stamp=document.createElement('span');stamp.textContent=`~${time.toFixed(1)}s`;
    section.append(b,title,stamp);section.setAttribute('role','button');section.tabIndex=0;
    section.title='Inspect sampled frame near this window';
    const inspect=()=>{const sample=data.samples.reduce((best,current)=>Math.abs(current.time-time)<Math.abs(best.time-time)?current:best);video.pause();seekTo(sample.time).then(()=>drawSample(sample)).catch(()=>{});};
    section.addEventListener('click',inspect);section.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect()}});
    timeline.append(section);
  }
  const observations=[`Pose tracked in ${data.framesWithPose}/${data.framesSampled} frames (${Math.round(data.coverage*100)}% coverage).`];
  if(data.elbowMedian!=null) observations.push(`Median visible ${data.handedness}-arm elbow angle: ${Math.round(data.elbowMedian)}° in the camera image.`);
  if(data.stanceMedian!=null) observations.push(`Median ankle-to-shoulder width ratio: ${data.stanceMedian.toFixed(2)} in the camera image.`);
  if(data.framesWithPose===0) observations.push('No movement measurements can be calculated from this video.');
  addItems('#observations',observations);
  addItems('#nextSteps',data.coverage<.6?['Re-record with one player fully visible and a stable rear or front view.','Avoid cuts and occlusion; choose one complete stroke.']:['Select a timeline window to inspect the detected skeleton on a sampled frame.','Review positioning with a qualified coach before turning measurements into training advice.']);
}
function drawSample(sample) {
  const parent=video.parentElement;
  const dpr=window.devicePixelRatio||1;
  overlay.width=Math.round(parent.clientWidth*dpr);overlay.height=Math.round(parent.clientHeight*dpr);
  const ctx=overlay.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,parent.clientWidth,parent.clientHeight);
  if (!sample?.points || !video.videoWidth) return;
  const videoRect=video.getBoundingClientRect(), parentRect=parent.getBoundingClientRect();
  const ratio=Math.min(videoRect.width/video.videoWidth,videoRect.height/video.videoHeight);
  const width=video.videoWidth*ratio,height=video.videoHeight*ratio;
  const x=(videoRect.left-parentRect.left)+(videoRect.width-width)/2;
  const y=(videoRect.top-parentRect.top)+(videoRect.height-height)/2;
  ctx.lineWidth=2;ctx.strokeStyle='#b2f276';ctx.fillStyle='#67dde0';ctx.shadowBlur=9;ctx.shadowColor='#b2f276';
  for(const [a,b] of links){const p=sample.points[a],q=sample.points[b];if((p.visibility??1)<.45||(q.visibility??1)<.45)continue;ctx.beginPath();ctx.moveTo(x+p.x*width,y+p.y*height);ctx.lineTo(x+q.x*width,y+q.y*height);ctx.stroke()}
  for(const index of [11,12,13,14,15,16,23,24,25,26,27,28]){const p=sample.points[index];if((p.visibility??1)<.45)continue;ctx.beginPath();ctx.arc(x+p.x*width,y+p.y*height,3.5,0,Math.PI*2);ctx.fill()}
}
video.addEventListener('seeked',()=>{
  if(!report || processing) return;
  const sample=report.samples.reduce((best,current)=>Math.abs(current.time-video.currentTime)<Math.abs(best.time-video.currentTime)?current:best);
  if(Math.abs(sample.time-video.currentTime)<.08)drawSample(sample);
  else overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height);
});
video.addEventListener('play',()=>overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height));
window.addEventListener('resize',()=>{if(report && video.paused){const s=report.samples.reduce((best,c)=>Math.abs(c.time-video.currentTime)<Math.abs(best.time-video.currentTime)?c:best);if(Math.abs(s.time-video.currentTime)<.08)drawSample(s)}});
$('#downloadReport').addEventListener('click',()=>{
  if(!report)return;
  const {samples,...summary}=report;
  const result={...summary,notes:['Pose landmarks generated by MediaPipe, not coach validated','No racket, ball, contact frame or technique score'],samples:samples.map(({time,points,elbow,stance})=>({time:+time.toFixed(2),detected:!!points,elbow,stance}))};
  const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='padelvision-session.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
