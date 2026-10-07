"use client";

import { useRef } from "react";
import { stackRows } from "@/content/site";
import { gsap, motion, onFrame } from "@/lib/motion";
import { useScene } from "@/lib/useScene";

/** Rows of type drifting in opposite directions. Scroll speed pushes them; stillness lets them idle. */
export default function Stack() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ motion: animate }, el) => {
    if (!animate) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".stack__row"));
    const state = rows.map((row, i) => ({ row, x: 0, dir: i % 2 === 0 ? -1 : 1, half: 0 }));
    const measure = () => state.forEach((s) => (s.half = s.row.scrollWidth / 2));
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);

    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "20%" });
    observer.observe(el);

    const skew = gsap.quickSetter(rows, "skewX", "deg");
    const off = onFrame((_, dt) => {
      if (!visible) return;
      for (const s of state) {
        if (!s.half) continue;
        // Idle drift plus whatever the scroll adds, always in the row's own direction.
        s.x += s.dir * (34 + Math.abs(motion.v) * 1500) * dt;
        if (s.x <= -s.half) s.x += s.half;
        if (s.x > 0) s.x -= s.half;
        s.row.style.translate = `${s.x}px 0`;
      }
      skew(motion.v * -7);
    });

    return () => {
      off();
      observer.disconnect();
      window.removeEventListener("resize", measure);
      rows.forEach((row) => row.style.removeProperty("translate"));
    };
  });

  const all = stackRows.flat();

  return (
    <section ref={root} className="stack" id="stack" data-world="stack" data-section="06 — Building with" aria-labelledby="stack-title">
      <h2 className="stack__title mono" id="stack-title">
        <span>06</span>
        <span>Building with</span>
      </h2>
      <p className="sr-only">{all.join(", ")}.</p>
      <div className="stack__rows" aria-hidden="true">
        {stackRows.map((row, i) => (
          <div className="stack__clip" key={i}>
            <div className={`stack__row display${i === 1 ? " is-hollow" : ""}`}>
              {[0, 1].map((copy) => (
                <span className="stack__set" key={copy}>
                  {row.map((word) => (
                    <span className="stack__word" key={word}>
                      {word}
                      <i>—</i>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
