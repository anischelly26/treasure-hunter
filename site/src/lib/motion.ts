"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp, damp } from "./math";

gsap.registerPlugin(ScrollTrigger);
// Scenes share selectors; a stage without a given layer is not an error.
gsap.config({ nullTargetWarn: false });

/**
 * One clock for everything. Lenis, ScrollTrigger, velocity-driven DOM and the
 * WebGL world all advance inside the same GSAP tick, in that order, so a frame
 * never shows the canvas and the DOM at different scroll positions.
 */
export const motion = {
  scroll: 0,
  /** Scroll speed in viewport-heights per second, signed. */
  velocity: 0,
  /** Smoothed velocity, clamped to -1..1. Drives skew, distortion, drift. */
  v: 0,
  vw: 1,
  vh: 1,
  reduced: false,
  /** A mouse or trackpad: hover exists and the pointer is precise. */
  fine: false,
  ready: false,
  pointer: {
    /** Client pixels. */
    px: 0,
    py: 0,
    /** Normalized -1..1, raw then smoothed. */
    x: 0,
    y: 0,
    sx: 0,
    sy: 0,
    active: false,
  },
};

type FrameFn = (time: number, dt: number) => void;
const frames: { fn: FrameFn; order: number }[] = [];

/** Subscribe to the shared tick. Lower `order` runs first; the world renders last. */
export function onFrame(fn: FrameFn, order = 0) {
  const entry = { fn, order };
  frames.push(entry);
  frames.sort((a, b) => a.order - b.order);
  return () => {
    const i = frames.indexOf(entry);
    if (i >= 0) frames.splice(i, 1);
  };
}

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

let last = 0;
let prevScroll = 0;

function tick(time: number) {
  const dt = last ? Math.min(time - last, 0.05) : 1 / 60;
  last = time;

  if (lenis) {
    lenis.raf(time * 1000);
    motion.scroll = lenis.animatedScroll;
  } else {
    motion.scroll = window.scrollY;
  }

  motion.velocity = (motion.scroll - prevScroll) / dt / motion.vh;
  prevScroll = motion.scroll;
  motion.v = damp(motion.v, clamp(motion.velocity / 3.2, -1, 1), 7, dt);
  if (Math.abs(motion.v) < 0.0004) motion.v = 0;

  const p = motion.pointer;
  p.sx = damp(p.sx, p.x, 3.2, dt);
  p.sy = damp(p.sy, p.y, 3.2, dt);

  for (let i = 0; i < frames.length; i++) frames[i].fn(time, dt);
}

function measure() {
  motion.vw = window.innerWidth;
  motion.vh = window.innerHeight;
}

function onPointer(e: PointerEvent) {
  if (e.pointerType === "touch") return;
  const p = motion.pointer;
  p.px = e.clientX;
  p.py = e.clientY;
  p.x = (e.clientX / motion.vw) * 2 - 1;
  p.y = (e.clientY / motion.vh) * 2 - 1;
  p.active = true;
}

export function startMotion() {
  measure();
  motion.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  motion.fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  prevScroll = motion.scroll = window.scrollY;

  if (!motion.reduced) {
    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      smoothWheel: true,
      // Touch keeps the platform's own momentum scrolling.
      syncTouch: false,
      autoRaf: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    document.documentElement.classList.add("has-lenis");
  }

  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(tick, false, true);
  window.addEventListener("resize", measure);
  window.addEventListener("pointermove", onPointer, { passive: true });
  motion.ready = true;

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("resize", measure);
    window.removeEventListener("pointermove", onPointer);
    lenis?.destroy();
    lenis = null;
    delete (window as unknown as { __lenis?: Lenis }).__lenis;
    document.documentElement.classList.remove("has-lenis");
    motion.ready = false;
    last = 0;
  };
}

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, {
      immediate,
      duration: 1.7,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const behavior: ScrollBehavior = "auto";
  if (typeof target === "number") window.scrollTo({ top: target, behavior });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView({ behavior });
}

/** Call after the document's layout changed underneath the scroll engine (route change, fonts). */
export function resyncScroll() {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  }
  prevScroll = motion.scroll = window.scrollY;
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
