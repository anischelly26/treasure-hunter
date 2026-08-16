import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

const canvas = document.getElementById('webgl');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x040404, 0.045);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0, 9.5);

const root = new THREE.Group();
scene.add(root);

const gold = new THREE.Color(0xd7a94f);
const dimGold = new THREE.Color(0x6b4b14);

// Event-horizon core
const ringGroup = new THREE.Group();
ringGroup.position.set(3.6, 0.55, -1.4);
root.add(ringGroup);

for (let i = 0; i < 7; i += 1) {
  const radius = 1.2 + i * 0.34;
  const geometry = new THREE.TorusGeometry(radius, i === 0 ? 0.018 : 0.008, 8, 180);
  const material = new THREE.MeshBasicMaterial({
    color: i < 2 ? gold : dimGold,
    transparent: true,
    opacity: Math.max(0.05, 0.22 - i * 0.022),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI * 0.5 + (i - 3) * 0.015;
  ring.rotation.y = (i - 3) * 0.025;
  ring.userData.speed = 0.04 + i * 0.009;
  ringGroup.add(ring);
}

const coreGeometry = new THREE.SphereGeometry(0.92, 64, 64);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x010101 });
const core = new THREE.Mesh(coreGeometry, coreMaterial);
ringGroup.add(core);

const haloGeometry = new THREE.SphereGeometry(1.04, 64, 64);
const haloMaterial = new THREE.MeshBasicMaterial({
  color: gold,
  transparent: true,
  opacity: 0.045,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  depthWrite: false,
});
const halo = new THREE.Mesh(haloGeometry, haloMaterial);
ringGroup.add(halo);

// Particle field
const particleCount = reducedMotion ? 420 : Math.min(1500, Math.floor((window.innerWidth * window.innerHeight) / 900));
const positions = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i += 1) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 28;
  positions[i3 + 1] = (Math.random() - 0.5) * 18;
  positions[i3 + 2] = -Math.random() * 34 + 6;
  sizes[i] = Math.random();
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

const particleMaterial = new THREE.PointsMaterial({
  color: 0xcab987,
  size: 0.025,
  transparent: true,
  opacity: 0.55,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const particles = new THREE.Points(particlesGeometry, particleMaterial);
root.add(particles);

// Fine orbital dust around the event horizon
const dustCount = reducedMotion ? 120 : 420;
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.15 + Math.pow(Math.random(), 0.55) * 3.0;
  const i3 = i * 3;
  dustPositions[i3] = Math.cos(angle) * radius;
  dustPositions[i3 + 1] = (Math.random() - 0.5) * 0.24;
  dustPositions[i3 + 2] = Math.sin(angle) * radius * 0.23;
}
const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustMaterial = new THREE.PointsMaterial({ color: gold, size: 0.022, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
const dust = new THREE.Points(dustGeometry, dustMaterial);
dust.rotation.x = 0.14;
ringGroup.add(dust);

const pointer = { x: 0, y: 0 };
const targetPointer = { x: 0, y: 0 };
let scrollProgress = 0;

window.addEventListener('pointermove', (event) => {
  targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  targetPointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
});

window.addEventListener('scroll', () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollProgress = window.scrollY / max;
}, { passive: true });

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(width, height, false);

  if (width < 820) {
    ringGroup.position.set(2.1, 0.4, -2.2);
    ringGroup.scale.setScalar(0.68);
  } else {
    ringGroup.position.set(3.6, 0.55, -1.4);
    ringGroup.scale.setScalar(1);
  }
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();

function render() {
  const time = clock.getElapsedTime();
  pointer.x += (targetPointer.x - pointer.x) * 0.035;
  pointer.y += (targetPointer.y - pointer.y) * 0.035;

  if (!reducedMotion) {
    particles.rotation.y = time * 0.007;
    particles.rotation.x = pointer.y * 0.018;
    root.position.x = pointer.x * 0.13;
    root.position.y = pointer.y * 0.09;

    ringGroup.rotation.z = time * 0.025 + scrollProgress * 0.75;
    ringGroup.rotation.x = pointer.y * 0.06;
    ringGroup.rotation.y = pointer.x * 0.09;
    dust.rotation.y = time * 0.085;

    ringGroup.children.forEach((child) => {
      if (child.userData?.speed) child.rotation.z += child.userData.speed * 0.002;
    });

    camera.position.z = 9.5 - scrollProgress * 0.7;
    camera.position.x = pointer.x * 0.08;
    camera.position.y = pointer.y * 0.05;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
