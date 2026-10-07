"use client";

import Link from "next/link";
import { useRef } from "react";
import { about, site } from "@/content/site";
import { gsap, motion, onFrame } from "@/lib/motion";
import { useScene } from "@/lib/useScene";
import Magnetic from "../ui/Magnetic";

const lines: { words: string[]; indent?: number; serif?: boolean; hollow?: boolean }[] = [
  { words: ["I", "don’t", "just"] },
  { words: ["write", "code."], indent: 2 },
  { words: ["I", "build"], indent: 0 },
  { words: ["systems,"], indent: 3, hollow: true },
  { words: ["experiments,"], indent: 1, serif: true },
  { words: ["tools,"], indent: 4 },
  { words: ["and", "digital"], indent: 0 },
  { words: ["experiences."], indent: 2 },
];

const sentence = lines.map((l) => l.words.join(" ")).join(" ");

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ motion: animate }, el) => {
    if (!animate) return;
    const q = gsap.utils.selector(el);

    // Words light up in reading order as the block travels through the viewport.
    gsap.fromTo(
      q(".manifesto__word"),
      { opacity: 0.1 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.6,
        scrollTrigger: { trigger: q(".manifesto__text")[0], start: "top 82%", end: "bottom 58%", scrub: true },
      },
    );

    gsap.from(q(".about__reveal"), {
      y: 28,
      autoAlpha: 0,
      duration: 1.1,
      ease: "power3.out",
      stagger: 0.07,
      scrollTrigger: { trigger: q(".about")[0], start: "top 76%" },
    });

    // Fast scrolling leans the type; it settles when the scroll does.
    const text = q(".manifesto__text")[0] as HTMLElement;
    const skew = gsap.quickSetter(text, "skewY", "deg");
    return onFrame(() => skew(motion.v * -2.2));
  });

  return (
    <section ref={root} className="manifesto" id="about" data-world="manifesto" data-section="01 — Manifesto">
      <p className="manifesto__label mono" aria-hidden="true">
        <span>01</span>
        <span>Manifesto</span>
      </p>
      <h2 className="manifesto__text display" aria-label={sentence}>
        {lines.map((line, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`manifesto__line${line.serif ? " is-serif" : ""}${line.hollow ? " is-hollow" : ""}`}
            style={{ "--indent": line.indent ?? 0 } as React.CSSProperties}
          >
            {line.words.map((w) => (
              <span className="manifesto__word" key={w}>
                {w}{" "}
              </span>
            ))}
          </span>
        ))}
      </h2>

      <div className="about" data-world="about">
        <p className="about__label mono about__reveal">
          <span>About</span>
          <span>{site.location}</span>
        </p>
        <div className="about__body">
          <p className="about__lede about__reveal">{about.paragraph}</p>
          <ul className="about__fields mono about__reveal" aria-label="Fields">
            {about.fields.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <dl className="about__facts">
            {about.facts.map((f) => (
              <div className="about__fact about__reveal" key={f.label}>
                <dt className="mono">{f.label}</dt>
                <dd>
                  <span>{f.value}</span>
                  <small className="mono">{f.note}</small>
                </dd>
              </div>
            ))}
          </dl>
          <p className="about__reveal">
            <Magnetic>
              <Link className="textlink" href="/resume" data-cursor="open">
                Read the résumé <span aria-hidden="true">↗</span>
              </Link>
            </Magnetic>
          </p>
        </div>
      </div>
    </section>
  );
}
