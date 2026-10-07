"use client";

import Link from "next/link";
import { useRef } from "react";
import { site } from "@/content/site";
import { gsap } from "@/lib/motion";
import { useScene } from "@/lib/useScene";
import Magnetic from "../ui/Magnetic";
import { Line } from "../ui/Text";

const socials = [
  { label: "GitHub", href: site.github, external: true },
  ...(site.linkedin ? [{ label: "LinkedIn", href: site.linkedin, external: true }] : []),
  { label: "Email", href: `mailto:${site.email}`, external: true },
  { label: "Résumé", href: "/resume", external: false },
];

/** The ending. The sphere comes back, far too large for the screen; only its crown shows. */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useScene(root, ({ motion }, el) => {
    if (!motion) return;
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 58%" } })
      .from(q(".contact__title .line__inner"), { yPercent: 108, duration: 1.4, ease: "expo.out", stagger: 0.11 }, 0)
      .from(q(".contact__reveal"), { y: 24, autoAlpha: 0, duration: 1, ease: "power3.out", stagger: 0.07 }, 0.5);
  });

  return (
    <section ref={root} className="contact" id="contact" data-world="contact" data-world-lead="1" data-section="07 — Contact" aria-labelledby="contact-title">
      <p className="contact__label mono contact__reveal">
        <span>07</span>
        <span>
          {site.status} · {site.statusPeriod}
        </span>
      </p>

      <h2 className="contact__title display" id="contact-title" aria-label="Let’s build something.">
        <Line>
          <span aria-hidden="true">Let’s</span>
        </Line>
        <Line>
          <span aria-hidden="true">build</span>
        </Line>
        <Line className="contact__serif">
          <span aria-hidden="true">something.</span>
        </Line>
      </h2>

      <div className="contact__actions">
        <Magnetic strength={0.3} className="contact__reveal">
          <a className="cta" href={`mailto:${site.email}`} data-cursor="ext">
            <span>Get in touch</span>
            <span aria-hidden="true">↗</span>
          </a>
        </Magnetic>
        <p className="contact__mail mono contact__reveal">
          {site.email}
          <br />
          {site.focus}
        </p>
        <ul className="contact__social mono contact__reveal">
          {socials.map((s) => (
            <li key={s.label}>
              <Magnetic>
                {s.external ? (
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor="ext">
                    {s.label} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link href={s.href} data-cursor="open">
                    {s.label} <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </Magnetic>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer mono">
        <p>
          {site.name} <span>{site.year}</span>
        </p>
        <p>{site.coords}</p>
        <p>
          Built with <span>Next.js × WebGL × Lenis</span>
        </p>
      </footer>
    </section>
  );
}
