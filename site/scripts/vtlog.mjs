// Ground truth for route transitions: log every startViewTransition call and every
// animation that starts on a ::view-transition pseudo-element. Usage:
//   node scripts/vtlog.mjs http://localhost:3000 aura-music-house [scrollStudyBy]
import { chromium } from "playwright-core";
const [url = "http://localhost:3000", slug = "aura-music-house", scrollStudy = "0"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__vt = [];
  const t0 = () => Math.round(performance.now());
  const orig = Document.prototype.startViewTransition;
  if (orig) {
    Document.prototype.startViewTransition = function (...args) {
      const started = t0();
      const tr = orig.apply(this, args);
      const entry = { started, names: new Set(), ready: null, finished: null, skipped: false };
      window.__vt.push(entry);
      tr.ready.then(() => (entry.ready = t0() - started)).catch(() => (entry.skipped = true));
      tr.finished.then(() => (entry.finished = t0() - started));
      return tr;
    };
  }
  document.addEventListener(
    "animationstart",
    (e) => {
      const last = window.__vt[window.__vt.length - 1];
      if (last && e.pseudoElement?.startsWith("::view-transition")) last.names.add(e.pseudoElement);
    },
    true,
  );
});
const dump = (label) =>
  page
    .evaluate(() => window.__vt.map((v) => ({ ...v, names: [...v.names].filter((n) => !/\(_t_|\(root\)|^::view-transition$/.test(n) || /media/.test(n)), all: v.names.size })))
    .then((v) => console.log(label, JSON.stringify(v)));

await page.goto(url, { waitUntil: "load" });
await page.waitForFunction(() => document.documentElement.dataset.ready === "1", null, { timeout: 30000 });
await page.waitForTimeout(1500);
await page.evaluate((id) => {
  const el = document.getElementById(id);
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.__lenis.scrollTo(top + (el.offsetHeight - window.innerHeight) * 0.7, { immediate: true, force: true });
}, `p-${slug}`);
await page.waitForTimeout(3000);

await page.locator(`#p-${slug} .project__media`).click({ noWaitAfter: true });
await page.waitForTimeout(3000);
await dump("enter:");
console.log("on", page.url(), "coverTop", await page.evaluate(() => Math.round(document.querySelector(".study__frame")?.getBoundingClientRect().top ?? -1)));

await page.evaluate(() => (window.__vt.length = 0));
if (Number(scrollStudy)) {
  await page.evaluate((y) => window.__lenis.scrollTo(y, { immediate: true, force: true }), Number(scrollStudy));
  await page.waitForTimeout(800);
}
await page.locator(".study__crumbs a").first().click({ noWaitAfter: true });
await page.waitForTimeout(3000);
await dump("back: ");
console.log("on", page.url(), "scrollY", await page.evaluate(() => Math.round(window.scrollY)));
await browser.close();
