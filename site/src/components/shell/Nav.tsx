"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { site } from "@/content/site";
import { scrollToTarget } from "@/lib/motion";
import Magnetic from "../ui/Magnetic";

const links = [
  { label: "Work", hash: "work", optional: true },
  { label: "Index", hash: "index", optional: true },
  { label: "Demos", hash: "demos", optional: false },
  { label: "About", hash: "about", optional: true },
];

/**
 * Minimal navigation. It is drawn in difference blend, so it inverts against
 * whatever passes beneath it — shader, screenshot or black.
 */
export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const indicator = useRef<HTMLSpanElement>(null);

  // Current-section readout.
  useEffect(() => {
    const out = indicator.current;
    if (!out) return;
    out.textContent = "";
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) out.textContent = (entry.target as HTMLElement).dataset.section ?? "";
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  const go = (hash: string) => (e: MouseEvent) => {
    if (!home) return;
    e.preventDefault();
    scrollToTarget(`#${hash}`);
  };

  return (
    <>
      <header className="nav">
        <Magnetic strength={0.18}>
          <Link className="nav__mark" href="/" onClick={(e) => home && (e.preventDefault(), scrollToTarget(0))} aria-label={`${site.name} — home`}>
            {site.mark}
          </Link>
        </Magnetic>
        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <Magnetic key={l.hash} strength={0.18} className={l.optional ? "nav__optional" : undefined}>
              <Link className="nav__link" href={`/#${l.hash}`} onClick={go(l.hash)}>
                {l.label}
              </Link>
            </Magnetic>
          ))}
        </nav>
        <Magnetic strength={0.18}>
          <Link className="nav__link nav__contact" href="/#contact" onClick={go("contact")}>
            Contact <span aria-hidden="true">↗</span>
          </Link>
        </Magnetic>
      </header>
      <p className="nav__section mono" aria-hidden="true">
        <span ref={indicator} />
      </p>
    </>
  );
}
