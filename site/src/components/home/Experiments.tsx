"use client";

import { useRef } from "react";
import { experiments } from "@/content/site";
import { getLenis, gsap, motion, onFrame } from "@/lib/motion";
import { useScene } from "@/lib/useScene";

/** The one horizontal moment: vertical scroll (or a drag) carries the rail sideways. */
export default function Experiments() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ wide, motion: animate }, el) => {
    if (!wide || !animate) return;
    const q = gsap.utils.selector(el);
    const track = q(".lab__track")[0] as HTMLElement;
    const stage = q(".lab__stage")[0] as HTMLElement;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    // One pixel down is one pixel across.
    const size = () => el.style.setProperty("--travel", `${distance()}px`);
    size();

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: true,
        invalidateOnRefresh: true,
        onRefreshInit: size,
      },
    });

    // Words lean with the scroll speed.
    const skew = gsap.quickSetter(q(".lab__word"), "skewX", "deg");
    const off = onFrame(() => skew(motion.v * -9));

    // Dragging the rail scrolls the page by the same amount.
    let dragging = false;
    let lastX = 0;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragging = true;
      lastX = e.clientX;
      stage.classList.add("is-dragging");
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(lenis.targetScroll - dx * 1.6, { immediate: false, lerp: 0.2 });
      else window.scrollBy(0, -dx * 1.6);
    };
    const up = () => {
      dragging = false;
      stage.classList.remove("is-dragging");
    };
    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      off();
      tween.kill();
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.style.removeProperty("--travel");
    };
  });

  return (
    <section ref={root} className="lab" id="experiments" data-world="experiments" data-section="05 — Experiments" aria-labelledby="lab-title">
      <div className="lab__stage" data-cursor="drag">
        <div className="lab__track">
          <header className="lab__panel lab__panel--title">
            <p className="mono">05 — Fields I have built in</p>
            <h2 className="lab__heading display" id="lab-title">
              Experi
              <br />
              ments
            </h2>
            <p className="lab__hint mono">
              Scroll or drag <span aria-hidden="true">→</span>
            </p>
          </header>
          {experiments.map((item, i) => (
            <article className="lab__panel" key={item.word}>
              <p className="lab__num mono">
                <span aria-hidden="true">→</span> {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="lab__word display">{item.word}</h3>
              <p className="lab__text">{item.text}</p>
              <p className="lab__from mono">{item.from}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
