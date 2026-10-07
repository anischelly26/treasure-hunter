"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { archive, projects } from "@/content/projects";
import { clamp, damp } from "@/lib/math";
import { gsap, motion, onFrame } from "@/lib/motion";
import { useScene } from "@/lib/useScene";
import { setOverride } from "@/lib/world/store";
import { ProjectLink } from "../ui/TransitionLink";

const rows = [
  ...projects.map((p) => ({ key: p.slug, num: p.num, name: p.name, category: p.category, year: p.year, cover: p.cover, world: p.world, href: `/work/${p.slug}`, external: false })),
  ...archive.map((p) => ({ key: p.slug, num: p.num, name: p.name, category: p.category, year: p.year, cover: p.cover, world: p.world, href: p.href, external: true })),
];

/**
 * Every project in one compact list. On a mouse, a row lends the shader its
 * palette and a preview trails the pointer, leaning with its speed.
 */
export default function ProjectIndex() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());

  useScene(root, ({ motion: animate }, el) => {
    if (!animate) return;
    const q = gsap.utils.selector(el);
    gsap.from(q(".index__row"), {
      yPercent: 40,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.045,
      scrollTrigger: { trigger: q(".index__list")[0], start: "top 80%" },
    });
    gsap.from(q(".index__title .line__inner"), {
      yPercent: 108,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 72%" },
    });
  });

  // The preview follows with inertia and rotates with horizontal speed.
  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = motion.pointer.px;
    let y = motion.pointer.py;
    let rot = 0;
    let skew = 0;
    return onFrame((_, dt) => {
      if (!el.classList.contains("is-on") && Math.abs(rot) < 0.01) return;
      const nx = damp(x, motion.pointer.px, 9, dt);
      const ny = damp(y, motion.pointer.py, 9, dt);
      rot = damp(rot, clamp((nx - x) * 0.9, -14, 14), 8, dt);
      skew = damp(skew, clamp((ny - y) * 0.35 + motion.v * 6, -8, 8), 8, dt);
      x = nx;
      y = ny;
      el.style.transform = `translate3d(${x + 56}px, ${y}px, 0) translate(0, -50%) rotate(${rot}deg) skewY(${skew}deg)`;
    }, 60);
  }, []);

  const enter = (i: number) => {
    setActive(i);
    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
    setOverride(rows[i].world);
  };
  const leave = () => {
    setActive(-1);
    setOverride(null);
  };

  useEffect(() => () => setOverride(null), []);

  return (
    <section ref={root} className="index" id="index" data-world="index" data-section="03 — Index" aria-labelledby="index-title">
      <header className="index__head">
        <h2 className="index__title display" id="index-title">
          <span className="line">
            <span className="line__inner">Index</span>
          </span>
        </h2>
        <p className="mono">
          {rows.length} projects
          <br />
          2024 — 2026
        </p>
      </header>

      <ol className="index__list" onPointerLeave={leave}>
        {rows.map((row, i) => {
          const inner = (
            <>
              <span className="index__num mono">{row.num}</span>
              <span className="index__name display">{row.name}</span>
              <span className="index__cat mono">{row.category}</span>
              <span className="index__year mono">{row.year}</span>
              <span className="index__arrow" aria-hidden="true">
                ↗
              </span>
            </>
          );
          const props = {
            className: "index__link",
            onPointerEnter: () => enter(i),
            onFocus: () => enter(i),
            onBlur: leave,
          };
          return (
            <li className={`index__row${active === i ? " is-active" : ""}${active >= 0 && active !== i ? " is-dim" : ""}`} key={row.key}>
              {row.external ? (
                <a {...props} href={row.href} target="_blank" rel="noopener noreferrer" data-cursor="open">
                  {inner}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <ProjectLink {...props} href={row.href} data-cursor="view">
                  {inner}
                </ProjectLink>
              )}
            </li>
          );
        })}
      </ol>

      <div ref={preview} className={`index__preview${active >= 0 ? " is-on" : ""}`} aria-hidden="true">
        {rows.map((row, i) =>
          seen.has(i) ? (
            <Image key={row.key} className={active === i ? "is-on" : undefined} src={row.cover.src} alt="" sizes="420px" placeholder="blur" />
          ) : null,
        )}
      </div>
    </section>
  );
}
