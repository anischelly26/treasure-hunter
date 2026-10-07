"use client";

import { useRef } from "react";
import { projects } from "@/content/projects";
import { gsap } from "@/lib/motion";
import { prime, useScene } from "@/lib/useScene";

const count = String(projects.length).padStart(2, "0");

/**
 * The shader inside typography, once. The stage is a black sheet in multiply
 * blend, so only the white letters of WORK let the canvas through. Scrolling
 * zooms into the stem of the R until the letter is the whole screen — and the
 * visitor is standing inside the first project's world.
 */
export default function WorkIntro() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ motion }, el) => {
    if (!motion) return;
    const q = gsap.utils.selector(el);
    const word = q(".workintro__word")[0] as HTMLElement;
    const stem = q(".workintro__word [data-stem]")[0] as HTMLElement;

    // Zoom toward solid ink, not a counter: the stem of the R.
    const origin = () => `${stem.offsetLeft + stem.offsetWidth * 0.17}px ${word.offsetHeight * 0.5}px`;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true, onRefresh: () => prime(tl) },
    });
    tl.fromTo(word, { scale: 1, transformOrigin: origin }, { scale: 46, transformOrigin: origin, duration: 0.62, ease: "power3.in" }, 0.22)
      .to(q(".workintro__over > *"), { autoAlpha: 0, y: -30, duration: 0.14, stagger: 0.02, ease: "power1.in" }, 0.2)
      // Once the letter covers the screen the sheet itself clears.
      .to(q(".workintro__mask")[0], { "--sheet": 1, duration: 0.1 }, 0.78)
      .to({}, { duration: 0.12 }, 0.88);
    prime(tl);

    gsap.from(q(".workintro__over > *"), {
      yPercent: 60,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 55%" },
    });
  });

  return (
    <section ref={root} className="workintro" id="work" data-section="02 — Selected work" aria-labelledby="work-title">
      <span className="marker" data-world="work-intro" style={{ top: 0 }} />
      <span className="marker" data-world="p-aura" data-world-lead="1" style={{ top: "74%" }} />

      <div className="workintro__mask" aria-hidden="true">
        <div className="workintro__clip">
          <span className="workintro__word display">
            <span>W</span>
            <span>O</span>
            <span data-stem>R</span>
            <span>K</span>
          </span>
        </div>
      </div>

      <div className="workintro__over">
        <h2 id="work-title" className="workintro__selected display">
          Selected <span className="sr-only">work</span>
        </h2>
        <p className="workintro__count mono">
          <span>01</span>
          <i aria-hidden="true" />
          <span>{count}</span>
        </p>
        <p className="workintro__hint mono">
          {projects.length} projects · scroll to enter
        </p>
      </div>
    </section>
  );
}
