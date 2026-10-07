// Simplex noise — Ian McEwan / Ashima Arts (MIT).
const noise = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/**
 * One surface, parameterised by uv. `uMorph` slides every vertex from its place
 * on a sphere to its place on a sheet, so the sphere unrolls instead of being
 * swapped for a plane. The seam sits at the back and opens away from the viewer.
 */
export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uWater;
uniform float uStrength;
uniform float uDensity;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uVelocity;
uniform float uAudio;
uniform vec2 uPlane;
uniform float uTexel;

varying vec3 vWorld;
varying vec3 vNormalW;
varying vec3 vLocal;
varying vec2 vUv;
varying float vField;

const float PI = 3.141592653589793;
${noise}

vec3 onSphere(vec2 st) {
  float theta = (st.x - 0.5) * 2.0 * PI;
  float phi = st.y * PI;
  float s = sin(phi);
  return vec3(sin(theta) * s, -cos(phi), cos(theta) * s);
}

vec3 baseNormal(vec2 st) {
  return normalize(mix(onSphere(st), vec3(0.0, 0.0, 1.0), uMorph));
}

vec3 surface(vec2 st, out float field) {
  vec3 sp = onSphere(st);
  vec3 pl = vec3((st.x - 0.5) * uPlane.x, (st.y - 0.5) * uPlane.y, 0.0);
  vec3 p = mix(sp, pl, uMorph);
  vec3 n = normalize(mix(sp, vec3(0.0, 0.0, 1.0), uMorph));

  vec3 q = mix(sp, pl * 0.62, uMorph) * uDensity;
  float t = uTime;
  field = snoise(q + vec3(0.0, t * 0.6, t));
  field += 0.5 * snoise(q * 1.9 + vec3(t * 0.7, 3.1, -t * 0.4));
  field += 0.22 * uMorph * snoise(q * 3.7 + vec3(-t * 0.5, t * 0.3, 7.7));

  float wave = sin(pl.x * 0.9 + t * 1.6 + field) * 0.5 + sin(pl.y * 1.3 - t * 1.1) * 0.35;
  float d = field * uStrength * (1.0 + uVelocity * 0.7 + uAudio * 0.55);
  d += wave * uWater * 0.22 * uMorph;
  p += n * d;

  // Twist: ShaderGradient's uFrequency / uAmplitude, faded out as the sphere opens.
  float a = sin(st.y * uFrequency + t) * uAmplitude * (1.0 - uMorph);
  float c = cos(a);
  float s = sin(a);
  p.xz = mat2(c, -s, s, c) * p.xz;
  return p;
}

void main() {
  float f;
  vec3 p = surface(uv, f);

  // Normal from two neighbours on the same parametric surface. At the poles the
  // parameterisation collapses, so the shading eases back to the undisplaced normal.
  float g;
  vec3 px = surface(uv + vec2(uTexel, 0.0), g);
  vec3 py = surface(uv + vec2(0.0, uTexel), g);
  vec3 c = cross(px - p, py - p);
  float pole = smoothstep(0.0, 0.045, min(uv.y, 1.0 - uv.y)) + uMorph;
  vec3 n = normalize(mix(baseNormal(uv), normalize(c + vec3(0.0, 0.0, 1e-9)), clamp(pole, 0.0, 1.0)));

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * n);
  vLocal = p;
  vUv = uv;
  vField = f;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uLight;
uniform float uTime;
uniform float uMorph;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uLines;
uniform float uScan;
uniform float uRim;
uniform float uTint;
uniform float uAudio;

varying vec3 vWorld;
varying vec3 vNormalW;
varying vec3 vLocal;
varying vec2 vUv;
varying float vField;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 N = normalize(vNormalW);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(uLight);

  // Three colours, mixed by the same field that shapes the surface.
  float k = mix(1.0, 0.3, uMorph);
  float a = smoothstep(-0.9, 0.9, vField + vLocal.x * 0.55 * k);
  float b = smoothstep(-0.25, 1.1, vLocal.y * 0.7 * k + vField * 0.5 + 0.15);
  vec3 col = mix(mix(uC1, uC2, a), uC3, b * 0.9 * uTint);

  float diff = pow(clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0), 1.7);
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  float spec = pow(nh, 40.0) * 0.32 + pow(nh, 6.0) * 0.1;
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

  vec3 lit = col * (0.05 + 1.05 * diff);
  lit += spec * mix(vec3(1.0), uC3, 0.6) * (1.0 + uAudio * 0.8);
  lit += fres * uRim * mix(uC3, uC1, 0.35);

  // Court-like lines running across the sheet.
  float along = abs(fract(vUv.y * 26.0) - 0.5);
  float across = abs(fract(vUv.x * 7.0) - 0.5);
  float line = smoothstep(0.03, 0.0, along) + smoothstep(0.006, 0.0, across) * 0.7;
  lit += uLines * line * mix(uC1, vec3(1.0), 0.25) * (0.12 + 0.5 * diff);

  // A slow scanning band with fine raster lines.
  float sweep = fract(uTime * 0.9);
  float band = smoothstep(0.07, 0.0, abs(vUv.y - sweep));
  lit += uScan * band * mix(uC3, vec3(1.0), 0.5) * 0.55;
  lit *= 1.0 - uScan * 0.1 * step(0.5, fract(gl_FragCoord.y * 0.25));

  lit *= uBrightness;
  lit = 1.0 - exp(-lit * 1.25);
  lit += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * uGrain;

  // The sheet dissolves at its edges; the sphere keeps a hard silhouette.
  float ed = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float alpha = uOpacity * mix(1.0, smoothstep(0.0, 0.16, ed), smoothstep(0.3, 1.0, uMorph));

  gl_FragColor = vec4(lit, alpha);
  #include <colorspace_fragment>
}
`;

export const haloVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const haloFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float glow = exp(-r * r * 6.5) * uIntensity;
  gl_FragColor = vec4(uColor, glow);
  #include <colorspace_fragment>
}
`;
