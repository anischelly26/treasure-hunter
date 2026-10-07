"use client";

import { useRef, type CSSProperties } from "react";
import type { ArchNode } from "@/content/projects";
import { gsap } from "@/lib/motion";
import { useScene } from "@/lib/useScene";

/**
 * The system as one line of flow. The rail draws itself when it enters the
 * viewport, a pulse keeps travelling along it, and the node under the pointer
 * widens while the others step back.
 */
export default function Architecture({ nodes }: { nodes: ArchNode[] }) {
  const root = useRef<HTMLDivElement>(null);

  useScene(root, ({ motion }, el) => {
    if (!motion) return;
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 76%" } })
      .fromTo(q(".arch__rail i"), { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.8, ease: "power2.inOut" }, 0)
      .from(q(".arch__node"), { autoAlpha: 0, y: 18, duration: 0.8, ease: "power3.out", stagger: 1.5 / nodes.length }, 0.1)
      .add(() => el.classList.add("is-live"), 1.7);
  });

  return (
    <div ref={root} className="arch" style={{ "--count": nodes.length } as CSSProperties}>
      <span className="arch__rail" aria-hidden="true">
        <i />
        <b />
      </span>
      <ol className="arch__list">
        {nodes.map((node, i) => (
          <li className="arch__node" key={node.label}>
            <span className="arch__dot" aria-hidden="true" />
            <span className="arch__index mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="arch__label display">{node.label}</span>
            <span className="arch__note mono">{node.note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
