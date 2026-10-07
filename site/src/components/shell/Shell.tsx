"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger, resyncScroll, startMotion } from "@/lib/motion";
import { inspectAnchors, refreshAnchors, snapWorld, world } from "@/lib/world/store";
import Cursor from "./Cursor";
import Loader from "./Loader";
import Nav from "./Nav";

/** Starts the scroll engine once and keeps it, the triggers and the world's markers in step with the document. */
export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const stop = startMotion();
    (window as unknown as Record<string, unknown>).__world = { world, anchors: inspectAnchors };
    ScrollTrigger.addEventListener("refresh", refreshAnchors);
    refreshAnchors();
    snapWorld();

    // Font swaps and late layout shifts move every trigger and marker.
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    let timer: ReturnType<typeof setTimeout>;
    let height = document.documentElement.scrollHeight;
    const observer = new ResizeObserver(() => {
      const next = document.documentElement.scrollHeight;
      if (Math.abs(next - height) < 2) return;
      height = next;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    observer.observe(document.body);

    return () => {
      alive = false;
      clearTimeout(timer);
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", refreshAnchors);
      stop();
    };
  }, []);

  // A new route is a new document height and a new scroll position. The first
  // render needs none of this: every trigger was just created against it.
  const first = useRef(true);
  // Markers first, before paint: the world must never read the previous route's.
  useLayoutEffect(() => {
    refreshAnchors();
  }, [pathname]);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      resyncScroll();
      refreshAnchors();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <>
      <Loader />
      <Nav />
      {/* Skip-link target. Previous routes stay mounted but hidden, so a per-page id would not be unique. */}
      <div id="content" tabIndex={-1}>
        {children}
      </div>
      <Cursor />
    </>
  );
}
