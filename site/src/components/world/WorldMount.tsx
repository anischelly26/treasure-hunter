"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { onFrame } from "@/lib/motion";
import { linearToCss, updateWorld, world } from "@/lib/world/store";

const World = dynamic(() => import("./World"), { ssr: false });

let support: boolean | null = null;

/** Probed once per page load; the answer cannot change afterwards. */
function supportsWebGL() {
  if (support === null) {
    try {
      const canvas = document.createElement("canvas");
      support = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      support = false;
    }
  }
  return support;
}

const never = () => () => {};

/** Without WebGL the page keeps its atmosphere: the same scene states drive a CSS gradient. */
function Fallback() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let acc = 1;
    return onFrame((_, dt) => {
      updateWorld(dt);
      acc += dt;
      if (acc < 0.1 || !ref.current) return;
      acc = 0;
      const s = world.cur;
      const el = ref.current.style;
      el.setProperty("--c1", linearToCss(s.c1));
      el.setProperty("--c2", linearToCss(s.c2));
      el.setProperty("--c3", linearToCss(s.c3));
      el.setProperty("--fx", `${50 + s.x * 50}%`);
      el.setProperty("--fy", `${50 - s.y * 50}%`);
      el.setProperty("--fo", String(Math.min(1, s.brightness * s.opacity)));
      world.rendered = true;
    }, 100);
  }, []);
  return <div ref={ref} className="world__fallback" />;
}

export default function WorldMount() {
  // Server render and hydration see "pending"; the client then resolves the real mode.
  const mode = useSyncExternalStore<"pending" | "webgl" | "css">(
    never,
    () => (supportsWebGL() ? "webgl" : "css"),
    () => "pending",
  );

  useEffect(() => {
    if (mode !== "pending") document.documentElement.dataset.webgl = mode === "webgl" ? "on" : "off";
  }, [mode]);

  return (
    <div className="world" aria-hidden="true">
      {mode === "webgl" && <World />}
      {mode === "css" && <Fallback />}
    </div>
  );
}
