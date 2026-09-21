// Original depth-relief scene. The generated alpine image is never fetched from
// the reference site. Its relief mesh and cloud layers use a real 3D camera;
// this is not an unrestricted, fully modeled alpine environment.
const canvas = document.querySelector('#landscape');
const world = document.querySelector('.world');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let stopped = reduce.matches;
let progress = 0;
let renderer;
let frame;
let lost = false;
let dispose = () => {};
const pointer = {x: 0, y: 0};
addEventListener('portfolio-scroll', event => { progress = event.detail.progress; });
addEventListener('portfolio-motion', event => { stopped = event.detail.paused; });
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault(); lost = true; cancelAnimationFrame(frame);
  world.classList.remove('ready');
});
canvas.addEventListener('webglcontextrestored', () => {
  // Leave a working still image visible rather than risk a reload loop.
  dispose();
});
async function start() {
  // Probe before importing Three: unsupported browsers get a fully usable page.
  const probe = document.createElement('canvas');
  const context = probe.getContext('webgl2');
  if (!context) { world.dataset.renderer = 'image-fallback'; return; }
  context.getExtension('WEBGL_lose_context')?.loseContext();
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js');
  const image = new Image();
  image.src = new URL('./assets/alpine-original.webp', import.meta.url).href;
  await image.decode();
  renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:false, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, 0, 12);
  const texture = new THREE.Texture(image); texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(16, 16 * image.height / image.width, 150, 86);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    const x = uv.getX(i), y = uv.getY(i);
    // Broad authored depth for the central ridge plus nearer edge crags.
    // The original image stays intact; shallow displacement limits disocclusion.
    const ridge = Math.exp(-Math.pow((x-.63)/.2,2)-Math.pow((y-.43)/.32,2));
    const edges = (Math.pow(Math.abs(x-.5)*2,5)) * Math.pow(1-y,2);
    position.setZ(i, ridge * .55 + edges * .7);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshBasicMaterial({map:texture});
  const relief = new THREE.Mesh(geometry, material);
  scene.add(relief);
  // Sparse transparent planes sit at separate depths; perspective, not a CSS
  // translate, controls their relative motion as the camera travels.
  const cloudMaterial = new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{time:{value:0},opacity:{value:.12}},
    vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`precision mediump float;
      varying vec2 vUv; uniform float time; uniform float opacity;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.03+vec2(8.3,1.7);a*=.5;}return s;}
      void main(){vec2 p=vUv*vec2(6.,3.);p.x+=time*.015;
        float n=fbm(p); float edge=smoothstep(0.,.22,vUv.y)*smoothstep(0.,.22,1.-vUv.y)*smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x);
        float alpha=smoothstep(.28,.72,n)*edge*opacity;gl_FragColor=vec4(vec3(.88,.93,.96),alpha);}
    `
  });
  const clouds=[];
  for(let i=0;i<3;i++){
    const layer=new THREE.Mesh(new THREE.PlaneGeometry(26,12),cloudMaterial.clone());
    layer.position.set(i*1.8-1.8,-2+i*.9,2+i*.75);
    scene.add(layer); clouds.push(layer);
  }
  function resize(){
    renderer.setSize(innerWidth,innerHeight,false);
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
    // Keep the mesh covering ultrawide viewports without exposing its edges.
    const cover=Math.max(1,camera.aspect/1.77);
    relief.scale.set(cover,cover,1);
  }
  addEventListener('resize',resize,{passive:true});
  const move = event => {pointer.x=(event.clientX/innerWidth-.5)*2;pointer.y=(event.clientY/innerHeight-.5)*2;};
  if(matchMedia('(pointer:fine)').matches) addEventListener('pointermove',move,{passive:true});
  let targetP=progress,elapsed=0,lastTime=0;
  function draw(time=0){
    if(lost || document.hidden) return;
    const delta=lastTime ? Math.min(.05,(time-lastTime)/1000) : 0;lastTime=time;
    if(!stopped) elapsed+=delta;
    const blend=1-Math.exp(-delta*4);
    targetP+= (progress-targetP)*blend;
    const mobile=innerWidth<700;
    const x=stopped ? 0 : Math.sin(targetP*.75)*.5+pointer.x*.08;
    const y=stopped ? 0 : Math.sin(targetP*.5)*.15-pointer.y*.035;
    camera.position.set((mobile ? 2.4 : 0)+x,y,12-(stopped ? 0 : Math.min(1.5,targetP*.18)));
    camera.lookAt(mobile ? 2.4 : 0,0,0);
    clouds.forEach((layer,i)=>{layer.material.uniforms.time.value=elapsed+i*23;layer.material.uniforms.opacity.value=.12+Math.sin(targetP*.8)*.08;});
    renderer.render(scene,camera);
    world.classList.add('ready');world.dataset.renderer='webgl-relief';
    frame=requestAnimationFrame(draw);
  }
  dispose=()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('pointermove',move);geometry.dispose();material.dispose();texture.dispose();cloudMaterial.dispose();clouds.forEach(c=>{c.geometry.dispose();c.material.dispose();});renderer.dispose();};
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden&&!lost){lastTime=0;frame=requestAnimationFrame(draw);}});
  addEventListener('pagehide',dispose,{once:true});
  resize(); frame=requestAnimationFrame(draw);
}
start().catch(() => {world.classList.remove('ready');world.dataset.renderer='image-fallback';dispose();});
