/**
 * Scene states for the shader world. The vocabulary follows ShaderGradient
 * (three colours, uStrength / uDensity / uFrequency / uAmplitude / uSpeed,
 * camera angles) with one addition: `morph` moves a single mesh continuously
 * between a sphere (0) and a plane (1), so states blend instead of swapping.
 */
export type WorldState = {
  c1: string;
  c2: string;
  c3: string;
  /** 0 sphere → 1 plane. */
  morph: number;
  /** Rolling wave layer on the plane (the waterPlane feel). */
  water: number;
  /** Sphere diameter as a fraction of the viewport's shorter side. */
  scale: number;
  /** Centre offset in half-viewports: 1 is the right / top edge. */
  x: number;
  y: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  strength: number;
  density: number;
  frequency: number;
  amplitude: number;
  speed: number;
  /** Camera orbit, radians. */
  azimuth: number;
  polar: number;
  brightness: number;
  opacity: number;
  grain: number;
  /** Directional court-like lines across the surface. */
  lines: number;
  /** Technical scanning band. */
  scan: number;
  /** Fresnel rim light. */
  rim: number;
  /** How far the third colour reaches into the body (0 keeps it to the rim). */
  tint: number;
};

export const NUMERIC = [
  "morph",
  "water",
  "scale",
  "x",
  "y",
  "rotX",
  "rotY",
  "rotZ",
  "strength",
  "density",
  "frequency",
  "amplitude",
  "speed",
  "azimuth",
  "polar",
  "brightness",
  "opacity",
  "grain",
  "lines",
  "scan",
  "rim",
  "tint",
] as const satisfies readonly (keyof WorldState)[];

const base: WorldState = {
  c1: "#ff4a1c",
  c2: "#7a1420",
  c3: "#f2d9b8",
  morph: 0,
  water: 0,
  scale: 0.86,
  x: 0,
  y: 0,
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  strength: 0.26,
  density: 1.25,
  frequency: 2.2,
  amplitude: 0.3,
  speed: 0.11,
  azimuth: 0,
  polar: 0,
  brightness: 1,
  opacity: 1,
  grain: 0.05,
  lines: 0,
  scan: 0,
  rim: 0.5,
  tint: 1,
};

type Preset = Partial<WorldState> & { narrow?: Partial<WorldState> };

const presets: Record<string, Preset> = {
  // — Opening: a slow liquid sphere.
  hero: {
    c1: "#ff4a1c",
    c2: "#7a1420",
    c3: "#f2d9b8",
    scale: 0.92,
    x: 0.2,
    y: -0.02,
    rotZ: -0.25,
    narrow: { x: 0.1, y: 0.02, scale: 1.05 },
  },
  "hero-build": {
    c1: "#ff5a22",
    c2: "#a31a34",
    c3: "#bda9ff",
    scale: 1.3,
    x: 0,
    y: -0.02,
    strength: 0.36,
    density: 1.05,
    rotZ: 0.2,
    azimuth: 0.12,
    narrow: { scale: 1.5 },
  },
  "hero-statement": {
    c1: "#f0dcbd",
    c2: "#ff4a1c",
    c3: "#2337d6",
    morph: 0.34,
    scale: 1.45,
    x: 0.42,
    y: -0.3,
    strength: 0.42,
    density: 0.9,
    rotY: -0.5,
    rotZ: 0.35,
    brightness: 0.82,
    azimuth: -0.1,
    narrow: { x: 0.2, y: -0.5, scale: 1.7 },
  },
  // — The sphere stretches into an abstract plane and steps back for reading.
  manifesto: {
    c1: "#1525a8",
    c2: "#6b4fd8",
    c3: "#c9361f",
    morph: 0.86,
    water: 0.35,
    scale: 1.05,
    x: 0.62,
    y: 0.0,
    rotX: -0.6,
    rotY: -0.8,
    rotZ: 0.35,
    strength: 0.62,
    density: 1.15,
    speed: 0.09,
    brightness: 0.66,
    opacity: 0.9,
    narrow: { x: 0.45, brightness: 0.4 },
  },
  about: {
    c1: "#101a52",
    c2: "#4a35a8",
    c3: "#a32a1c",
    morph: 0.95,
    water: 0.4,
    scale: 1.1,
    x: -0.5,
    y: -0.75,
    rotX: -1.12,
    rotZ: 0.3,
    strength: 0.5,
    density: 1.1,
    speed: 0.08,
    brightness: 0.42,
    opacity: 0.85,
  },
  // — The surface takes over the screen; it is seen through the word WORK.
  "work-intro": {
    c1: "#ff5a1f",
    c2: "#f3e7d3",
    c3: "#6d4bff",
    morph: 1,
    water: 0.7,
    scale: 1.3,
    rotX: -0.2,
    rotZ: 0.15,
    strength: 0.6,
    density: 0.62,
    speed: 0.14,
    brightness: 1.08,
    grain: 0.06,
  },
  // — Project worlds.
  "p-aura": {
    c1: "#7b4dff",
    c2: "#e0338a",
    c3: "#ff8a3d",
    morph: 1,
    water: 1,
    scale: 1.3,
    y: -0.28,
    rotX: -0.95,
    rotZ: -0.1,
    strength: 0.5,
    density: 0.58,
    speed: 0.16,
    brightness: 0.95,
    polar: 0.05,
  },
  "p-padel": {
    c1: "#b6ff3c",
    c2: "#04070a",
    c3: "#0f7a41",
    morph: 1,
    water: 0.15,
    scale: 1.35,
    y: -0.3,
    rotX: -1.08,
    rotZ: 0.3,
    strength: 0.16,
    density: 0.5,
    speed: 0.08,
    lines: 1,
    brightness: 0.8,
    rim: 0.2,
    narrow: { brightness: 0.5 },
  },
  "p-vermeg": {
    c1: "#f4f7fb",
    c2: "#8f9db0",
    c3: "#2f6bff",
    morph: 0.08,
    scale: 1.15,
    x: -0.62,
    y: 0.1,
    strength: 0.13,
    density: 2.3,
    frequency: 5,
    amplitude: 0.08,
    speed: 0.07,
    scan: 1,
    brightness: 0.78,
    rim: 0.9,
    narrow: { x: -0.2, y: 0.5 },
  },
  "p-orange": {
    c1: "#ff7900",
    c2: "#c8200e",
    c3: "#1a0a06",
    scale: 1.7,
    x: 0.62,
    y: -0.5,
    strength: 0.34,
    density: 1.1,
    amplitude: 0.45,
    speed: 0.1,
    brightness: 0.95,
    rim: 0.7,
    rotZ: 0.4,
  },
  "p-monoprix": {
    c1: "#f2e6cf",
    c2: "#d81e2c",
    c3: "#0d1b4a",
    morph: 1,
    water: 0.5,
    scale: 1.25,
    x: -0.1,
    y: -0.1,
    rotX: -0.6,
    rotZ: -0.45,
    strength: 0.42,
    density: 0.55,
    speed: 0.1,
    brightness: 0.82,
  },
  "p-bcn": {
    c1: "#e9c58a",
    c2: "#ff6f4f",
    c3: "#0f3d6e",
    morph: 0.5,
    scale: 1.35,
    x: -0.55,
    y: -0.25,
    rotY: 0.6,
    rotZ: -0.3,
    strength: 0.38,
    density: 0.85,
    speed: 0.1,
    brightness: 0.85,
    azimuth: 0.15,
  },
  "p-sql": {
    c1: "#cfd6d4",
    c2: "#2bd67b",
    c3: "#060a09",
    morph: 1,
    water: 0.1,
    scale: 1.3,
    y: -0.35,
    rotX: -0.92,
    rotZ: -0.2,
    strength: 0.18,
    density: 0.45,
    speed: 0.06,
    lines: 0.4,
    brightness: 0.62,
    rim: 0.2,
  },
  // — An eclipse: a near-black disc with a hot corona.
  "p-eclipse": {
    c1: "#0a0612",
    c2: "#2c1050",
    c3: "#ff8a3c",
    scale: 1.62,
    x: 0,
    y: 0,
    strength: 0.035,
    density: 1.1,
    amplitude: 0.06,
    speed: 0.06,
    brightness: 1,
    rim: 1.5,
    tint: 0.03,
    narrow: { scale: 1.9, y: 0.25 },
  },
  // — Dark water at dusk: deep teal, with one warm lit window.
  "p-mara": {
    c1: "#1c5a66",
    c2: "#071820",
    c3: "#f0b35a",
    morph: 1,
    water: 0.6,
    scale: 1.3,
    y: -0.3,
    rotX: -1.0,
    rotZ: -0.18,
    strength: 0.2,
    density: 0.55,
    speed: 0.07,
    lines: 0.4,
    brightness: 0.7,
    rim: 0.35,
    narrow: { brightness: 0.5 },
  },
  // — A drawing board: a dark ruled sheet, lavender with one amber line.
  "p-mech": {
    c1: "#b9a4e6",
    c2: "#15121f",
    c3: "#e0a64a",
    morph: 1,
    water: 0.2,
    scale: 1.3,
    y: -0.32,
    rotX: -1.0,
    rotZ: 0.22,
    strength: 0.2,
    density: 0.6,
    speed: 0.07,
    lines: 0.7,
    brightness: 0.72,
    rim: 0.3,
    narrow: { brightness: 0.5 },
  },
  // — Index: calm; row hovers lend it their palette.
  index: {
    c1: "#2a2f38",
    c2: "#6f6252",
    c3: "#f1e6d2",
    scale: 0.74,
    x: 1.04,
    y: -0.12,
    strength: 0.2,
    speed: 0.07,
    brightness: 0.5,
    opacity: 0.9,
    narrow: { x: 1.1, y: -0.5, scale: 1.1 },
  },
  // — Live demos: quiet; a hovered row lends its palette.
  demos: {
    c1: "#c8ff3d",
    c2: "#1f3fd8",
    c3: "#f2e4cc",
    scale: 0.9,
    x: -1.08,
    y: 0.05,
    strength: 0.24,
    density: 1.4,
    speed: 0.08,
    brightness: 0.5,
    opacity: 0.9,
    narrow: { x: -1.2, y: -0.6, scale: 1.2 },
  },
  experiments: {
    c1: "#2337d6",
    c2: "#ff4a1c",
    c3: "#f2e4cc",
    morph: 1,
    water: 0.9,
    scale: 1.35,
    y: -0.5,
    rotX: -1.2,
    rotZ: 0.5,
    strength: 0.5,
    density: 0.5,
    speed: 0.13,
    brightness: 0.7,
    opacity: 0.9,
  },
  stack: {
    c1: "#8f7bdc",
    c2: "#8a1622",
    c3: "#f1e6d2",
    morph: 0.62,
    scale: 1.5,
    x: -0.3,
    y: 0.1,
    rotY: 0.9,
    rotZ: -0.4,
    strength: 0.5,
    density: 0.8,
    speed: 0.1,
    brightness: 0.34,
    opacity: 0.9,
  },
  // — Ending: the sphere returns, enormous and calm, only its crown in view.
  contact: {
    c1: "#3a0c0c",
    c2: "#8a1622",
    c3: "#ffb27a",
    scale: 2.5,
    x: 0,
    y: -2.2,
    strength: 0.1,
    density: 1.0,
    amplitude: 0.1,
    speed: 0.06,
    brightness: 0.86,
    rim: 1.15,
    tint: 0.12,
    narrow: { scale: 3.2, y: -1.3 },
  },
  resume: {
    c1: "#2a2f38",
    c2: "#8a1622",
    c3: "#f1e6d2",
    scale: 1.4,
    x: 0.7,
    y: -0.6,
    strength: 0.2,
    speed: 0.06,
    brightness: 0.4,
  },
  // — Index-only projects: palettes for row hovers.
  "a-here": { c1: "#7dffb2", c2: "#0c2a1a", c3: "#effff5" },
  "a-veripath": { c1: "#f2c66d", c2: "#3a4fd8", c3: "#f1e6d2" },
  "a-hmm": { c1: "#8fb8ff", c2: "#3d4a6b", c3: "#f5f0e6" },
  "a-ml": { c1: "#ff9d4d", c2: "#5b2bd6", c3: "#f1e6d2" },
  "a-treasure": { c1: "#ffd166", c2: "#0f6e8a", c3: "#f4ead6" },
};

const cache = new Map<string, WorldState>();

/**
 * Resolve a state key. A suffix adjusts a preset without redefining it:
 * `p-aura:calm` is the same world, stepped back so long-form text can sit over it.
 */
export function resolveState(key: string, narrow: boolean): WorldState {
  const id = `${key}|${narrow ? 1 : 0}`;
  const hit = cache.get(id);
  if (hit) return hit;

  const [name, mod] = key.split(":");
  const preset = presets[name] ?? presets.hero;
  const { narrow: narrowOverrides, ...rest } = preset;
  const state: WorldState = { ...base, ...rest, ...(narrow ? narrowOverrides : null) };

  // Phones have no picture behind the project copy, so project worlds step back.
  if (narrow && name.startsWith("p-") && !mod) {
    state.brightness *= 0.46;
    state.lines *= 0.6;
  }

  if (mod === "calm") {
    // Long-form reading: the project's world, small, dim and out at the edge.
    state.morph = Math.min(state.morph, 0.3);
    state.water = 0;
    state.scale = 1.0;
    state.x = 1.2;
    state.y = -0.85;
    state.rotX = 0;
    state.brightness *= 0.24;
    state.opacity *= 0.8;
    state.speed *= 0.7;
    state.lines *= 0.25;
    state.scan *= 0.4;
    if (narrow) {
      state.x = 0.9;
      state.y = -0.95;
    }
  }
  if (mod === "top") {
    // Case-study hero: the project's world, parked high and to the right.
    state.morph = Math.min(state.morph, 0.35);
    state.water = 0;
    state.scale = 1.2;
    state.x = 0.6;
    state.y = 0.45;
    state.rotX = 0;
    state.brightness *= 0.8;
    if (narrow) {
      state.x = 0.3;
      state.y = 0.6;
    }
  }

  cache.set(id, state);
  return state;
}

export const hasState = (key: string) => key.split(":")[0] in presets;
