"use client";

import { useEffect, useRef } from "react";
import { gsap, onFrame } from "@/lib/motion";
import { world } from "@/lib/world/store";

/**
 * Counts real readiness, not time: fonts decoded, then the shader's first frame.
 * A hard ceiling lifts it regardless, so a slow GPU never holds the page hostage.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const num = count.current;
    if (!el || !num) return;

    const state = { shown: 0, target: 8, done: false };
    let fonts = false;
    const started = performance.now();
    document.fonts?.ready.then(() => (fonts = true));

    const finish = () => {
      if (state.done) return;
      state.done = true;
      off();
      document.documentElement.dataset.ready = "1";
      window.dispatchEvent(new Event("app:ready"));
      gsap.to(el, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          el.style.display = "none";
        },
      });
    };

    const off = onFrame((_, dt) => {
      const elapsed = performance.now() - started;
      state.target = 8 + (fonts ? 47 : 0) + (world.rendered ? 45 : 0);
      if (elapsed > 2400) state.target = 100;
      // Ease the displayed number toward what has actually loaded.
      state.shown = Math.min(state.target, state.shown + dt * 260);
      num.textContent = String(Math.round(state.shown)).padStart(3, "0");
      if (state.shown >= 100) finish();
    }, 200);

    return () => {
      off();
    };
  }, []);

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading">
      <span className="loader__mark mono">Anis Chelly — Portfolio 2026</span>
      <span ref={count} className="loader__count display" aria-hidden="true">
        000
      </span>
      <span className="loader__note mono">Compiling shaders</span>
    </div>
  );
}
