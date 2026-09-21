// A calibrated instrument: brass gimbals resolve around a dark ceramic core.
// The camera responds to natural scroll and pointer input; there is no idle spin.
const stage=document.querySelector('.signal-stage');
const canvas=document.querySelector('#webgl');
const body=document.body;
let dispose=()=>{};
function fallback(){dispose();body.dataset.scene='fallback';stage.dataset.renderState='static';}
async function start(){
  // Test before downloading Three.js. The SVG is always present underneath.
  const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});
  if(!context){fallback();return;}
  const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js');
  const small=matchMedia('(max-width:620px)');
  const fine=matchMedia('(pointer:fine)');
  const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(devicePixelRatio,small.matches?1:1.5));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.3;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,40);
  const assembly=new THREE.Group();scene.add(assembly);
  const brass=new THREE.MeshStandardMaterial({color:0xc99f55,metalness:.78,roughness:.3});
  const edge=new THREE.MeshStandardMaterial({color:0xf3d59c,metalness:.65,roughness:.22});
  const ceramic=new THREE.MeshPhysicalMaterial({color:0x26322d,metalness:.42,roughness:.24,clearcoat:.8,clearcoatRoughness:.2});
  const emissive=new THREE.MeshStandardMaterial({color:0xffd894,emissive:0xd6a03e,emissiveIntensity:.55,metalness:.3,roughness:.3});
  const segments=small.matches?64:96;
  function mesh(geometry,material,parent=assembly){const m=new THREE.Mesh(geometry,material);parent.add(m);return m;}
  const core=mesh(new THREE.SphereGeometry(.69,small.matches?32:48,24),ceramic);
  const seam=mesh(new THREE.TorusGeometry(.692,.008,6,segments),emissive);seam.rotation.x=1.18;
  const outer=new THREE.Group();assembly.add(outer);outer.rotation.set(.45,-.3,-.4);
  mesh(new THREE.TorusGeometry(1.75,.017,8,segments),edge,outer);
  const middle=new THREE.Group();assembly.add(middle);
  const inner=new THREE.Group();assembly.add(inner);
  mesh(new THREE.TorusGeometry(1.42,.04,10,segments,Math.PI*1.84),brass,middle);
  mesh(new THREE.TorusGeometry(1.16,.027,8,segments,Math.PI*1.88),edge,inner);
  // Deliberate index marks; one draw call, no particle field.
  const ticks=new THREE.InstancedMesh(new THREE.BoxGeometry(.014,.07,.016),brass,48);
  const dummy=new THREE.Object3D();
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;dummy.position.set(Math.cos(a)*1.88,Math.sin(a)*1.88,0);dummy.rotation.z=a-Math.PI/2;dummy.updateMatrix();ticks.setMatrixAt(i,dummy.matrix);}
  outer.add(ticks);
  const pin=mesh(new THREE.SphereGeometry(.045,12,8),emissive,middle);pin.position.set(1.42,0,0);
  scene.add(new THREE.HemisphereLight(0xffecd1,0x142322,2.6));
  function light(color,intensity,x,y,z){const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);}
  light(0xffe4b0,5,-3,4,4);light(0xb8d6d2,2.5,3,0,-2);light(0xc38d3a,2,-2,-2,1);
  // Procedural studio reflection: three soft panels, no downloaded textures.
  const studio=new THREE.Scene();studio.background=new THREE.Color(0x363b35);
  for(const [x,y,z,sx,sy,color] of [[-3,3,2,3,5,0xffebce],[3,0,1,1,6,0x95b3ae],[0,-2,-3,4,1,0x98733e]]){
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
    panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);
  }
  const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(studio,.1);
  scene.environment=environment.texture;pmrem.dispose();
  studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
  let paused=body.classList.contains('motion-paused'),visible=true,lost=false,raf=0,last=0;
  let targetP=0,p=0,targetX=0,targetY=0,x=0,y=0;
  function stop(){cancelAnimationFrame(raf);raf=0;stage.dataset.renderState=paused?'paused':'sleeping';}
  function render(now){
    raf=0;if(!visible||document.hidden||lost)return;
    const interval=small.matches?1000/30:1000/45;
    if(now-last<interval){raf=requestAnimationFrame(render);return;}
    const dt=Math.min(.1,(now-last)/1000||.02);last=now;const damping=1-Math.exp(-8*dt);
    p+=(targetP-p)*damping;x+=(targetX-x)*damping;y+=(targetY-y)*damping;
    const progress=paused?0:p;const px=paused?0:x,py=paused?0:y;
    camera.position.set(.3+progress*.55+px*.2,.2+progress*.25-py*.14,7.3+progress*.8);
    camera.lookAt(0,0,0);
    assembly.rotation.set(.05+progress*.16,-.12+progress*.4,-.12);
    middle.rotation.set(1.03-progress*.32,.23+progress*.2,-.6);
    inner.rotation.set(-.55+progress*.2,1.04-progress*.35,.32);
    core.rotation.y=progress*.3;
    renderer.render(scene,camera);
    body.dataset.scene='ready';
    stage.dataset.renderState=paused?'paused':'settled';
    if(!paused&&(Math.abs(targetP-p)+Math.abs(targetX-x)+Math.abs(targetY-y)>.0008)){
      stage.dataset.renderState='moving';raf=requestAnimationFrame(render);
    }
  }
  function wake(){if(!raf&&visible&&!document.hidden&&!lost)raf=requestAnimationFrame(render);}
  function scroll(){if(paused)return;const hero=document.querySelector('#home').getBoundingClientRect();targetP=Math.max(0,Math.min(1,-hero.top/Math.max(1,hero.height*.8)));wake();}
  function resize(){const r=stage.getBoundingClientRect();renderer.setPixelRatio(Math.min(devicePixelRatio,small.matches?1:1.5));renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();wake();}
  function pointer(e){if(paused||!fine.matches||small.matches||!visible)return;targetX=(e.clientX/innerWidth-.5)*2;targetY=(e.clientY/innerHeight-.5)*2;wake();}
  function leave(){targetX=targetY=0;wake();}
  function motion(e){paused=e.detail.paused;if(paused){p=targetP=0;x=targetX=0;y=targetY=0;}else scroll();wake();}
  function visibility(){if(document.hidden)stop();else{last=performance.now();wake();}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){scroll();wake()}else stop();});observer.observe(stage);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
  addEventListener('scroll',scroll,{passive:true});addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);
  addEventListener('portfolio-motion',motion);document.addEventListener('visibilitychange',visibility);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stop();body.dataset.scene='fallback';stage.dataset.renderState='static';});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;resize();wake();});
  dispose=()=>{stop();observer.disconnect();resizeObserver.disconnect();removeEventListener('scroll',scroll);removeEventListener('pointermove',pointer);removeEventListener('portfolio-motion',motion);document.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});environment.dispose();renderer.dispose();};
  addEventListener('pagehide',e=>{if(!e.persisted)dispose();else stop();});
  addEventListener('pageshow',wake);
  resize();scroll();wake();
}
start().catch(fallback);
