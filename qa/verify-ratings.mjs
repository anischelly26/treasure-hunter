import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { root, servePortfolio } from './server.mjs';

const api = 'https://anis-project-ratings.rhythmx.chatgpt.site/api/ratings';
const origin = 'https://anischelly26.github.io';
const publicBase = origin + '/treasure-hunter/';
const projects = ['aura','vermeg','orange','zero-eclipse','monoprix','padelvision','here','hmm','barcelona','ml-pipeline','veripath','treasure'];
const server = await servePortfolio();
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  // Run the exact pending portfolio source with its real public origin.
  // API requests reach the deployed service; this check never submits a valid vote.
  await context.route(publicBase + '**', async route => {
    const url = new URL(route.request().url());
    const local = new URL(url.pathname.replace('/treasure-hunter/', '') + url.search, server.baseURL);
    const response = await context.request.get(local.href);
    await route.fulfill({ response });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(publicBase);
  await page.waitForFunction(() =>
    document.querySelectorAll('.project-rating').length === 12 &&
    [...document.querySelectorAll('.project-rating__total')].every(el => !el.textContent.includes('Loading')),
    { timeout: 30_000 }
  );
  assert.equal(await page.locator('.project-rating__star').count(), 60);
  for (const project of projects) {
    const rating = page.locator('[data-project="' + project + '"] .project-rating');
    assert.match(await rating.locator('.project-rating__total').textContent(), /^(No ratings yet|[1-5]\.\d \/ 5 · \d+ ratings?)$/);
    assert.equal(await rating.locator('[aria-checked="true"]').count(), 0);
  }
  const response = await context.request.get(api, { headers: { Origin: origin }, timeout: 15_000 });
  assert.equal(response.status(), 200);
  assert.equal(response.headers()['access-control-allow-origin'], origin);
  assert.match(response.headers()['cache-control'], /no-store/);
  const data = await response.json();
  assert.deepEqual(Object.keys(data.projects).sort(), [...projects].sort());
  for (const row of Object.values(data.projects)) {
    assert.ok(Number.isSafeInteger(row.count) && row.count >= 0);
    assert.ok(row.count === 0 ? row.average === null : row.average >= 1 && row.average <= 5);
    assert.equal(row.mine, null);
  }
  const preflight = await context.request.fetch(api, {
    method: 'OPTIONS',
    headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' },
    timeout: 15_000
  });
  assert.equal(preflight.status(), 204);
  assert.equal(preflight.headers()['access-control-allow-origin'], origin);
  assert.match(preflight.headers()['access-control-allow-methods'], /POST/);
  const invalid = await context.request.post(api, {
    headers: { Origin: origin },
    data: { project: 'aura', score: 6, voter: '00000000-0000-4000-8000-000000000001' },
    timeout: 15_000
  });
  assert.equal(invalid.status(), 400);
  const evidence = resolve(root, 'qa/evidence');
  await mkdir(evidence, { recursive: true });
  for (const width of [1440,390,320]) {
    await page.setViewportSize({ width, height: 900 });
    const rating = page.locator('[data-project="aura"] .project-rating');
    await rating.scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    const sizes = await rating.locator('.project-rating__star').evaluateAll(stars => stars.map(el => {
      const r = el.getBoundingClientRect(); return { height: r.height, left: r.left, right: r.right };
    }));
    assert.ok(sizes.every(r => r.height >= 44 && r.left >= 0 && r.right <= width));
    if (width !== 320) await page.screenshot({ path: resolve(evidence, 'ratings-' + width + '.png'), animations: 'disabled' });
  }
  assert.deepEqual(errors, []);
  console.log('All 12 rating widgets loaded real shared results. Public-origin CORS, preflight, validation and mobile layout passed. No valid production votes were submitted.');
} finally {
  await browser?.close();
  await server.close();
}
