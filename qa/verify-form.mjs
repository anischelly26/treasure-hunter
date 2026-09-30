import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
    if (!path.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { response.writeHead(404).end(); }
});
let browser;
try {
  let base = process.env.PORTFOLIO_BASE_URL;
  if (!base) {
    await new Promise(done => server.listen(0, '127.0.0.1', done));
    base = `http://127.0.0.1:${server.address().port}/`;
  }
  base = base.endsWith('/') ? base : `${base}/`;
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  // Core navigation must work without optional 3D assets, external fonts or AI services.
  const origin = new URL(base).origin;
  await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  await page.goto(base);
  const card = page.locator('[data-project="vermeg"]');
  await card.getByRole('heading', { name: 'FORM Studio', exact: true }).waitFor();
  assert.match(await card.innerText(), /57 CHECKS PASSED/);
  assert.equal(await card.locator('.mission__launch').getAttribute('href'), 'case-studies/form-vision-to-code.html');
  await card.scrollIntoViewIfNeeded();
  await card.locator('img').evaluate(image => image.decode());
  assert.equal(await card.locator('img').evaluate(image => image.complete && image.naturalWidth > 0), true);
  await card.getByRole('button', { name: 'READ CASE STUDY' }).click();
  const dialog = page.locator('#case-study');
  await dialog.waitFor({ state: 'visible' });
  assert.match(await dialog.innerText(), /PERSONAL REBUILD 2026/);
  assert.match(await dialog.innerText(), /57 checks passed/);
  assert.equal(await dialog.getByRole('link', { name: 'EXPLORE THE STUDIO' }).getAttribute('href'), 'case-studies/form-vision-to-code.html');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await card.locator('.mission__launch').click();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('heading', { name: 'A screenshot. A starting point. A workspace.' }).waitFor();
  assert.match(await page.locator('.scope').innerText(), /single-process tool/);
  const image = page.locator('#studio-capture');
  await image.evaluate(image => image.decode());
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await image.evaluate(image => image.decode());
  assert.match(await image.getAttribute('src'), /form-studio-dark.webp$/);
  assert.equal(await page.getByRole('button', { name: 'Dark', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.getByRole('button', { name: 'Light', exact: true }).getAttribute('aria-pressed'), 'false');
  const evidence = resolve(root, 'qa/evidence');
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: resolve(evidence, 'form-desktop.png'), animations: 'disabled' });
  await page.screenshot({ path: resolve(evidence, 'form-story-full.png'), fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  await page.locator('.mobile-story img').scrollIntoViewIfNeeded();
  await page.locator('.mobile-story img').evaluate(image => image.decode());
  assert.equal(await page.locator('.mobile-story img').evaluate(image => image.complete && image.naturalWidth > 0), true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: resolve(evidence, 'form-mobile.png'), animations: 'disabled' });
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await image.evaluate(image => image.decode());
  await page.getByRole('button', { name: 'Dark', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.getByRole('button', { name: 'Dark', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.deepEqual(errors, []);
  await page.goto(new URL('alpine.html', base).href);
  await page.locator('[data-case="vermeg"]').click();
  await page.locator('#case-study').waitFor({ state: 'visible' });
  assert.match(await page.locator('#case-study').innerText(), /FORM — Vision to Code Studio/);
  console.log('Portfolio navigation, dated case study, real screenshots, keyboard theme controls and 390px layout passed.');
} finally {
  await browser?.close();
  if (server.listening) await new Promise(done => server.close(done));
}
