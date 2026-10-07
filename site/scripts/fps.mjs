// Scroll the whole page at a steady pace and report frame pacing. Usage:
//   node scripts/fps.mjs http://localhost:3000 [seconds] [width] [height]
import { chromium } from "playwright-core";
const [url = "http://localhost:3000", seconds = "40", vw = "1440", vh = "900"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: Number(vw), height: Number(vh) } });
await page.goto(url, { waitUntil: "load" });
await page.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 30000 });
await page.waitForTimeout(2500);
const result = await page.evaluate(
  (duration) =>
    new Promise((resolve) => {
      const lenis = window.__lenis;
      const end = document.documentElement.scrollHeight - window.innerHeight;
      const deltas = [];
      const marks = [];
      let last = performance.now();
      const start = last;
      lenis.scrollTo(end, { duration, easing: (t) => t, force: true });
      const tick = (now) => {
        const dt = now - last;
        deltas.push(dt);
        marks.push(window.scrollY);
        last = now;
        if (now - start < duration * 1000 + 500) requestAnimationFrame(tick);
        else {
          const sorted = [...deltas].sort((a, b) => a - b);
          const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
          // Slowest stretches, by page position.
          const slow = [];
          for (let i = 0; i < deltas.length; i++) if (deltas[i] > 34) slow.push([Math.round(marks[i]), Math.round(deltas[i])]);
          const canvas = document.querySelector(".world canvas");
          resolve({
            frames: deltas.length,
            avgFps: +(1000 / avg).toFixed(1),
            p95ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
            p99ms: +sorted[Math.floor(sorted.length * 0.99)].toFixed(1),
            maxMs: +sorted[sorted.length - 1].toFixed(1),
            over34ms: slow.length,
            worst: [...slow].sort((x, y) => y[1] - x[1]).slice(0, 10),
            canvas: canvas ? `${canvas.width}x${canvas.height}` : "none",
          });
        }
      };
      requestAnimationFrame(tick);
    }),
  Number(seconds),
);
console.log(JSON.stringify(result));
await browser.close();
