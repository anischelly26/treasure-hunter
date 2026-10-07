"use client";

import { clamp, damp, lerp, smooth } from "../math";
import { motion } from "../motion";
import { NUMERIC, resolveState, type WorldState } from "./states";

type RGB = [number, number, number];
type Live = Record<(typeof NUMERIC)[number], number> & { c1: RGB; c2: RGB; c3: RGB };

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

const rgbCache = new Map<string, RGB>();
function hexToLinear(hex: string): RGB {
  let rgb = rgbCache.get(hex);
  if (!rgb) {
    const n = parseInt(hex.slice(1), 16);
    rgb = [toLinear(((n >> 16) & 255) / 255), toLinear(((n >> 8) & 255) / 255), toLinear((n & 255) / 255)];
    rgbCache.set(hex, rgb);
  }
  return rgb;
}

export const linearToCss = (c: RGB) =>
  `rgb(${c.map((v) => Math.round(clamp(toSrgb(v)) * 255)).join(" ")})`;

function fromState(s: WorldState): Live {
  const live = { c1: [...hexToLinear(s.c1)], c2: [...hexToLinear(s.c2)], c3: [...hexToLinear(s.c3)] } as Live;
  for (const k of NUMERIC) live[k] = s[k];
  return live;
}

function mix(out: Live, a: WorldState, b: WorldState, t: number) {
  for (const k of NUMERIC) out[k] = lerp(a[k], b[k], t);
  for (const k of ["c1", "c2", "c3"] as const) {
    const ca = hexToLinear(a[k]);
    const cb = hexToLinear(b[k]);
    for (let i = 0; i < 3; i++) out[k][i] = lerp(ca[i], cb[i], t);
  }
}

type Anchor = { key: string; top: number; lead: number };

const narrow = () => motion.vw / motion.vh < 0.85;
const initial = resolveState("hero", false);

export const world = {
  /** What is on screen this frame. */
  cur: fromState(initial),
  /** Where the scroll position says it should be. */
  target: fromState(initial),
  /** Shader time; advances with the state's speed so speed changes never jump. */
  time: 0,
  /** Audio energy 0..1 from the AURA stage. */
  audio: { bass: 0, high: 0, sBass: 0, sHigh: 0 },
  /** A palette borrowed for a while (project index hover). */
  override: { key: null as string | null, last: null as string | null, mix: 0 },
  enabled: true,
  rendered: false,
};

let anchors: Anchor[] = [];
let needsSnap = true;

/**
 * Read every `[data-world]` marker's document position. Call when layout changes.
 * Next keeps previous routes in the document, hidden, so their state survives a
 * round trip; only markers that are actually laid out belong to the current page.
 */
export function refreshAnchors() {
  const y = window.scrollY;
  anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-world]"))
    .filter((el) => el.getClientRects().length > 0)
    .map((el) => ({
      key: el.dataset.world as string,
      top: el.getBoundingClientRect().top + y,
      lead: parseFloat(el.dataset.worldLead ?? "0.8"),
    }))
    .sort((a, b) => a.top - b.top);
}

/** Read-only view for debugging from the console: `__world.anchors()`. */
export const inspectAnchors = () => anchors.map((a) => ({ ...a }));

/** Jump straight to the scroll position's state on the next frame (first paint). */
export const snapWorld = () => {
  needsSnap = true;
};

export function setOverride(key: string | null) {
  world.override.key = key;
  if (key) world.override.last = key;
}

const scratch = fromState(initial);

function computeTarget() {
  const isNarrow = narrow();
  const { scroll, vh } = motion;

  if (!anchors.length) {
    mix(world.target, initial, initial, 0);
    return;
  }

  // The last marker whose transition has started wins; it blends in from the one before.
  let idx = 0;
  for (let i = 1; i < anchors.length; i++) {
    if (scroll > anchors[i].top - vh) idx = i;
  }
  const to = resolveState(anchors[idx].key, isNarrow);
  if (idx === 0) {
    mix(world.target, to, to, 0);
  } else {
    const a = anchors[idx];
    const t = smooth(clamp((scroll - (a.top - vh)) / (vh * a.lead)));
    mix(world.target, resolveState(anchors[idx - 1].key, isNarrow), to, t);
  }

  // A hovered project lends its colours without disturbing the shape.
  const ov = world.override;
  if (ov.mix > 0.001 && ov.last) {
    const o = resolveState(ov.last, isNarrow);
    mix(scratch, o, o, 0);
    for (const k of ["c1", "c2", "c3"] as const) {
      for (let i = 0; i < 3; i++) world.target[k][i] = lerp(world.target[k][i], scratch[k][i], ov.mix);
    }
    world.target.brightness = lerp(world.target.brightness, Math.max(world.target.brightness, 0.72), ov.mix);
  }
}

export function updateWorld(dt: number) {
  const ov = world.override;
  ov.mix = damp(ov.mix, ov.key ? 1 : 0, 3.5, dt);
  computeTarget();

  const { cur, target } = world;
  if (needsSnap) {
    for (const k of NUMERIC) cur[k] = target[k];
    for (const k of ["c1", "c2", "c3"] as const) for (let i = 0; i < 3; i++) cur[k][i] = target[k][i];
    needsSnap = false;
  } else {
    for (const k of NUMERIC) cur[k] = damp(cur[k], target[k], 6, dt);
    for (const k of ["c1", "c2", "c3"] as const) {
      for (let i = 0; i < 3; i++) cur[k][i] = damp(cur[k][i], target[k][i], 5, dt);
    }
  }

  const a = world.audio;
  a.sBass = damp(a.sBass, a.bass, a.bass > a.sBass ? 18 : 5, dt);
  a.sHigh = damp(a.sHigh, a.high, 8, dt);

  // Reduced motion: the surface holds still; colour and shape still follow the page.
  if (!motion.reduced) world.time += dt * cur.speed * (1 + Math.abs(motion.v) * 1.4);
}
