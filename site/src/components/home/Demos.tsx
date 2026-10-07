"use client";

import { useEffect, useRef } from "react";
import { classicSite, demos } from "@/content/projects";
import { gsap } from "@/lib/motion";
import { useScene } from "@/lib/useScene";
import { setOverride } from "@/lib/world/store";
import Magnetic from "../ui/Magnetic";

/** Everything that can be run right now, in one place. Each row opens the real thing. */
export default function Demos() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ motion }, el) => {
    if (!motion) return;
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 72%" } })
      .from(q(".demos__title .line__inner"), { yPercent: 108, duration: 1.2, ease: "expo.out", stagger: 0.09 }, 0)
      .from(q(".demos__reveal"), { y: 26, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.05 }, 0.25);
  });

  useEffect(() => () => setOverride(null), []);

  return (
    <section ref={root} className="demos" id="demos" data-world="demos" data-section="04 — Live demos" aria-labelledby="demos-title">
      <header className="demos__head">
        <h2 className="demos__title display" id="demos-title" aria-label="Live demos">
          <span className="line">
            <span className="line__inner" aria-hidden="true">
              Live
            </span>
          </span>
          <span className="line">
            <span className="line__inner" aria-hidden="true">
              demos
            </span>
          </span>
        </h2>
        <p className="demos__lede demos__reveal">
          Not screenshots. {demos.length} things you can open and use right now — most of them run entirely in your browser.
        </p>
      </header>

      <ol className="demos__list" onPointerLeave={() => setOverride(null)}>
        {demos.map((demo, i) => (
          <li className="demos__row demos__reveal" key={demo.name}>
            <a
              className="demos__link"
              href={demo.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              onPointerEnter={() => setOverride(demo.world)}
              onFocus={() => setOverride(demo.world)}
              onBlur={() => setOverride(null)}
            >
              <span className="demos__num mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="demos__name display">{demo.name}</span>
              <span className="demos__what">{demo.what}</span>
              <span className="demos__needs mono">{demo.needs}</span>
              <span className="demos__go mono">
                Open <span aria-hidden="true">↗</span>
                <span className="sr-only"> {demo.name} in a new tab</span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="demos__classic mono demos__reveal">
        <span>The earlier ANIS.EXE site is still online, with its terminal and in-card project tests.</span>
        <Magnetic>
          <a className="textlink" href={classicSite} target="_blank" rel="noopener noreferrer" data-cursor="open">
            Open the classic site <span aria-hidden="true">↗</span>
          </a>
        </Magnetic>
      </p>
    </section>
  );
}
