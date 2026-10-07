// Viewport QA screenshots. Usage:
//   node scripts/shot.mjs --url http://localhost:3000 --out .shots/desktop --vw 1440 --vh 900 --scrolls 0,900,1800
// --scrolls takes pixel offsets, or fractions of the page when suffixed with "p" (e.g. 0.5p).
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]?.startsWith("--") || arr[i + 1] === undefined ? "true" : arr[i + 1]]);
    return acc;
  }, []),
);

const url = args.url ?? "http://localhost:3000";
const out = args.out ?? ".shots";
const vw = Number(args.vw ?? 1440);
const vh = Number(args.vh ?? 900);
const wait = Number(args.wait ?? 900);
const settle = Number(args.settle ?? 2200);
const scrolls = (args.scrolls ?? "0").split(",");
const mobile = args.mobile === "true";
const reduced = args.reduced === "true";
const name = args.name ?? "shot";

await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  channel: args.channel ?? "chrome",
  headless: true,
  // --nogl true simulates a browser without WebGL, to check the CSS fallback.
  args:
    args.nogl === "true"
      ? ["--disable-gpu", "--disable-3d-apis", "--hide-scrollbars"]
      : ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
});
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  deviceScaleFactor: Number(args.dpr ?? 1),
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(settle);

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
let i = 0;
for (const s of scrolls) {
  const y = s.endsWith("p") ? Math.round(parseFloat(s) * total) : Number(s);
  await page.evaluate((top) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo(0, top);
  }, y);
  await page.waitForTimeout(wait);
  const file = path.join(out, `${name}-${String(i).padStart(2, "0")}-${y}.png`);
  await page.screenshot({ path: file });
  console.log(file);
  i += 1;
}

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(JSON.stringify({ pageHeight: total + vh, horizontalOverflow: overflow, errors: errors.slice(0, 12) }));
await browser.close();
