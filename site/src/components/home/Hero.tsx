"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap } from "@/lib/motion";
import { prime, useScene, whenReady } from "@/lib/useScene";
import { Chars, Line } from "../ui/Text";

function Name() {
  return (
    <>
      <Line className="hero__first">
        <Chars text={site.first} />
      </Line>
      <Line className="hero__last">
        <Chars text={site.last} />
      </Line>
    </>
  );
}

/**
 * The name is set twice: solid, behind the shader canvas, and as an outline in
 * front of it. Where the sphere covers a letter you see its contour drawn over
 * the surface — the type passes through the object instead of sitting on it.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ motion }, el) => {
    if (!motion) return;
    const q = gsap.utils.selector(el);

    // Arrival, once the loader lifts.
    const intro = gsap.timeline({ paused: true });
    intro
      .from(q(".hero__name .line__inner"), { yPercent: 108, duration: 1.3, ease: "expo.out", stagger: 0.09 }, 0)
      .from(q(".hero__meta > *"), { autoAlpha: 0, y: 14, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.45);
    const cancel = whenReady(() => intro.play());

    // Scroll: the name clips away, I BUILD arrives large, shrinks into a sentence.
    const build = q(".hero__build")[0] as HTMLElement;
    const big = () => {
      const scale = Math.min((window.innerWidth * 0.86) / build.offsetWidth, (window.innerHeight * 0.5) / build.offsetHeight);
      const block = build.offsetParent as HTMLElement;
      const left = block.offsetLeft + build.offsetLeft;
      const top = block.offsetTop + build.offsetTop;
      return {
        scale,
        x: (window.innerWidth - build.offsetWidth * scale) / 2 - left,
        y: (window.innerHeight - build.offsetHeight * scale) / 2 - top,
      };
    };

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true, onRefresh: () => prime(tl) },
    });

    for (const layer of [".hero__back", ".hero__front"]) {
      tl.to(q(`${layer} .hero__first .char`), { yPercent: -118, scaleY: 1.5, duration: 0.2, ease: "power2.in", stagger: 0.012 }, 0.02).to(
        q(`${layer} .hero__last .char`),
        { yPercent: -118, scaleY: 1.5, duration: 0.2, ease: "power2.in", stagger: 0.01 },
        0.05,
      );
    }
    tl.to(q(".hero__meta"), { autoAlpha: 0, duration: 0.07 }, 0.02)
      .fromTo(q(".hero__build .char"), { yPercent: 112, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.17, ease: "power3.out", stagger: 0.012 }, 0.2)
      .fromTo(
        build,
        { x: () => big().x, y: () => big().y, scale: () => big().scale },
        { x: 0, y: 0, scale: 1, duration: 0.15, ease: "power3.inOut" },
        0.45,
      )
      .fromTo(
        q(".hero__statement .hero__rest .line__inner"),
        { yPercent: 142, "--wght": 240 },
        { yPercent: 0, "--wght": 800, duration: 0.2, ease: "power3.out", stagger: 0.07 },
        0.55,
      )
      .fromTo(q(".hero__note"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.8)
      .to({}, { duration: 0.08 }, 0.92);
    prime(tl);

    return () => {
      cancel();
      intro.kill();
    };
  });

  return (
    <section ref={root} className="hero" id="top" data-section="00 — Anis Chelly">
      <span className="marker" data-world="hero" style={{ top: 0 }} />
      <span className="marker" data-world="hero-build" data-world-lead="0.6" style={{ top: "41%" }} />
      <span className="marker" data-world="hero-statement" data-world-lead="0.7" style={{ top: "62%" }} />

      <div className="hero__layer hero__back" aria-hidden="true">
        <div className="hero__name display">
          <Name />
        </div>
      </div>

      <div className="hero__layer hero__front">
        <h1 className="hero__name hero__name--outline display" aria-label={site.name}>
          <Name />
        </h1>

        <div className="hero__meta mono">
          <p className="hero__roles">
            {site.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </p>
          <p className="hero__coords">
            <span>{site.location}</span>
            <span>{site.coords}</span>
          </p>
          <p className="hero__status">
            <span className="dot" aria-hidden="true" />
            <span>{site.status}</span>
            <span>{site.statusPeriod}</span>
          </p>
          <p className="hero__scroll" aria-hidden="true">
            Scroll <span>↓</span>
          </p>
        </div>

        <div className="hero__statement">
          <p className="sr-only">{site.tagline}</p>
          <div className="display" aria-hidden="true">
            <span className="hero__buildline">
              <span className="hero__build">
                <Chars text="I BUILD" />
              </span>
            </span>
            <div className="hero__rest">
              <Line className="hero__serif">Intelligent</Line>
              <Line>Digital</Line>
              <Line>Experiences.</Line>
            </div>
          </div>
          <p className="hero__note mono" aria-hidden="true">
            AI systems, data pipelines, and the interfaces that make them usable.
          </p>
        </div>
      </div>
    </section>
  );
}
