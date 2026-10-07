"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "./motion";

/**
 * Breakpoints every scene shares.
 * `motion` is false when the visitor asked for reduced motion: scenes then keep
 * their plain document layout and no scrubbed choreography is created.
 */
export const media = {
  wide: "(min-width: 861px)",
  narrow: "(max-width: 860px)",
  motion: "(prefers-reduced-motion: no-preference)",
  fine: "(hover: hover) and (pointer: fine)",
} as const;

export type SceneConditions = Record<keyof typeof media, boolean>;

/**
 * Run GSAP setup scoped to `scope`, re-run when a breakpoint flips, and revert
 * everything on unmount. Layout effect: initial states must exist before the
 * browser captures the page for a view transition.
 */
export function useScene(
  scope: RefObject<HTMLElement | null>,
  setup: (conditions: SceneConditions, root: HTMLElement) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add(media, (ctx) => setup(ctx.conditions as SceneConditions, root));
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Scrubbed timelines are reverted and invalidated on every ScrollTrigger refresh
 * (that is how their viewport-dependent values get re-measured). Tweens ahead of
 * the playhead then lose their starting state, so run the timeline end to end
 * once: every tween records its values and renders where it starts.
 */
export function prime(tl: gsap.core.Timeline) {
  const progress = tl.scrollTrigger?.progress ?? 0;
  tl.progress(1).progress(0).progress(progress);
}

/** Run once the loader has lifted (immediately on later client navigations). */
export function whenReady(fn: () => void) {
  if (document.documentElement.dataset.ready === "1") {
    fn();
    return () => {};
  }
  const handler = () => fn();
  window.addEventListener("app:ready", handler, { once: true });
  return () => window.removeEventListener("app:ready", handler);
}
