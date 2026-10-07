"use client";

import { useEffect, useRef } from "react";
import { damp } from "@/lib/math";
import { motion, onFrame } from "@/lib/motion";

const LABELS: Record<string, string> = {
  view: "View ↗",
  open: "Open ↗",
  ext: "↗",
  drag: "Drag",
  sound: "Sound",
};

/** Desktop-only pointer. Never mounted for touch; never hides the system cursor without replacing it. */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const text = label.current;
    if (!el || !text || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let seen = false;

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const tagged = target?.closest<HTMLElement>("[data-cursor]");
      const kind = tagged?.dataset.cursor ?? (target?.closest("a, button, [role='button'], summary") ? "link" : "");
      if (el.dataset.state !== kind) {
        el.dataset.state = kind;
        text.textContent = LABELS[kind] ?? "";
      }
    };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    const leave = () => el.classList.remove("is-visible");
    const enter = () => seen && el.classList.add("is-visible");

    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);

    const off = onFrame((_, dt) => {
      const p = motion.pointer;
      if (!p.active) return;
      if (!seen) {
        seen = true;
        x = p.px;
        y = p.py;
        el.classList.add("is-visible");
      }
      const nx = damp(x, p.px, 22, dt);
      const ny = damp(y, p.py, 22, dt);
      // The dot leans into its own movement — a trail without a trail.
      const vx = nx - x;
      const vy = ny - y;
      const speed = Math.min(Math.hypot(vx, vy) / 26, 0.5);
      x = nx;
      y = ny;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.setProperty("--stretch", String(1 + speed));
      el.style.setProperty("--angle", `${Math.atan2(vy, vx)}rad`);
    }, 50);

    return () => {
      off();
      document.documentElement.classList.remove("has-cursor");
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <span className="cursor__dot" />
      <span ref={label} className="cursor__label mono" />
    </div>
  );
}
