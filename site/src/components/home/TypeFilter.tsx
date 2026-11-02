"use client";

import { useLayoutEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { countOf, listedCount, projectTypes, tally, type TypeFilter as Filter } from "@/content/projects";
import { ScrollTrigger, gsap, motion, resyncScroll, scrollToTarget } from "@/lib/motion";
import { getTypeFilter, setTypeFilter, typeFromAddress, useTypeFilter } from "@/lib/typeFilter";
import { useScene } from "@/lib/useScene";

const options: { key: Filter; label: string; count: number }[] = [
  { key: "all", label: "All", count: listedCount },
  ...projectTypes.map((t) => ({ key: t.key, label: t.label, count: countOf(t.key) })),
];

const laidOut = (el: Element) => el.getClientRects().length > 0;

/**
 * Hiding a scene moves everything below it, so a choice also decides where the
 * visitor ends up. From the intro they glide into the first match. In the lists
 * below, or on a scene that stays, nothing on screen moves. On a scene that
 * leaves, they cut to the first match.
 */
function choose(next: Filter) {
  if (next === getTypeFilter()) return;
  const middle = window.innerHeight / 2;
  const stage = document.querySelector<HTMLElement>(".projects");
  const scenes = Array.from(document.querySelectorAll<HTMLElement>(".project"));
  const list = [document.getElementById("demos"), document.getElementById("index")].find((el) => el && el.getBoundingClientRect().top < middle);
  const scene = scenes.find((el) => {
    const box = el.getBoundingClientRect();
    return box.height > 0 && box.top < middle && box.bottom > middle;
  });
  const reading = list ?? scene;
  const from = reading?.getBoundingClientRect().top ?? 0;

  flushSync(() => setTypeFilter(next));
  resyncScroll();

  if (reading && laidOut(reading)) {
    scrollToTarget(window.scrollY + reading.getBoundingClientRect().top - from, true);
    return;
  }
  const first = scenes.find(laidOut);
  if (!first) return;
  if (!reading) {
    scrollToTarget(first);
    return;
  }
  scrollToTarget(first, true);
  if (!motion.reduced) gsap.fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out", overwrite: true, clearProps: "opacity,visibility" });
}

/** Stays in reach from the work intro to the end of the demos, the three places it changes. */
export default function TypeFilter() {
  const root = useRef<HTMLDivElement>(null);
  const filter = useTypeFilter();

  useLayoutEffect(() => {
    const wanted = typeFromAddress();
    if (wanted && wanted !== getTypeFilter()) setTypeFilter(wanted);
  }, []);

  useScene(root, (_, el) => {
    ScrollTrigger.create({
      trigger: document.getElementById("work"),
      endTrigger: document.getElementById("demos"),
      start: "top 55%",
      end: "bottom 45%",
      toggleClass: { targets: el, className: "is-on" },
    });
  });

  return (
    <div ref={root} className="typefilter" role="group" aria-label="Show projects by type">
      <span className="typefilter__label mono" aria-hidden="true">
        Show
      </span>
      {options.map((option) => (
        <button className="typefilter__option" type="button" key={option.key} aria-pressed={filter === option.key} onClick={() => choose(option.key)}>
          {option.label} <i>{option.count}</i>
        </button>
      ))}
      <span className="sr-only" role="status">
        {filter === "all" ? "" : `Showing ${tally(filter, options.find((o) => o.key === filter)?.count ?? 0)}`}
      </span>
    </div>
  );
}
