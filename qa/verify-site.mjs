import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';
import { root } from './server.mjs';

// Serves _site under the public base path, exactly as GitHub Pages does.
const site = resolve(root, '_site');
const prefix = '/treasure-hunter';
const live = 'https://anischelly26.github.io' + prefix + '/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix + '/')) { response.writeHead(404).end(); return; }
    let path = resolve(site, '.' + pathname.slice(prefix.length));
    if (!path.startsWith(site + sep) && path !== site) { response.writeHead(403).end(); return; }
    if (pathname.endsWith('/') || (await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { response.writeHead(404).end(); }
});
await new Promise((done, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', done); });
const base = 'http://127.0.0.1:' + server.address().port + prefix + '/';
const local = href => href.startsWith(live) ? base + href.slice(live.length) : href;

let browser;
try {
  browser = await chromium.launch();
  const errors = [];
  const open = async (options) => {
    const context = await browser.newContext(options);
    // The portfolio must stand on its own: no third-party request is needed to render it.
    const origin = new URL(base).origin;
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(20_000);
    page.on('pageerror', error => errors.push(error.message));
    return { context, page };
  };

  // Home: the document itself, without motion.
  const { context, page } = await open({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const failed = [];
  page.on('response', response => { if (response.status() >= 400) failed.push(response.status() + ' ' + response.url()); });
  await page.goto(base);
  await page.getByRole('heading', { level: 1, name: 'Anis Chelly' }).waitFor();
  assert.equal(await page.locator('article.project').count(), 10);
  assert.equal(await page.locator('.index__row').count(), 15);
  for (const image of await page.locator('article.project .project__picture').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
    assert.equal(await image.evaluate(img => img.complete && img.naturalWidth > 0), true);
  }

  // Demos are first-class: listed on the home page, and every hosted one answers.
  const demos = await page.locator('.demos__link').evaluateAll(links => links.map(a => a.href));
  assert.ok(demos.length >= 6, 'The live demos list is missing.');
  const hosted = demos.filter(href => href.startsWith(live));
  assert.ok(hosted.length >= 6);
  for (const href of hosted) {
    const response = await context.request.get(local(href).split('#')[0]);
    assert.equal(response.status(), 200, 'Demo does not load: ' + href);
  }
  for (const name of ['aura', 'form-studio', 'padelvision', 'zero-eclipse', 'aura-mech', 'mara', 'here']) assert.ok(hosted.some(href => href === live + name + '/'), 'Demo not linked: ' + name);
  assert.equal(await page.locator('article.project a.button--solid').count(), 7);
  assert.equal(await page.locator('.nav__links a[href$="#demos"]').count(), 1);

  // AURA MECH is the desktop app's own window: it must start in a plain browser, with or without WebGL,
  // fetch nothing from elsewhere, and answer a typed sentence from the data served beside it.
  const mech = await context.newPage();
  mech.setDefaultTimeout(20_000);
  mech.on('pageerror', error => errors.push('aura-mech: ' + error.message));
  mech.on('response', response => { if (response.status() >= 400) failed.push(response.status() + ' ' + response.url()); });
  await mech.goto(base + 'aura-mech/');
  await mech.waitForFunction(() => document.querySelectorAll('.mech-header nav button').length === 6);
  await mech.keyboard.press('Escape');
  await mech.getByLabel('Ask AURA MECH').fill('BMW 320d 2018');
  await mech.getByLabel('Ask AURA MECH').press('Enter');
  await mech.getByRole('heading', { name: 'BMW 3 Series 320d' }).waitFor();
  await mech.close();

  // The type filter: scenes, index and demos all follow it, and its address can be sent to someone.
  const { context: filtering, page: chooser } = await open({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const shown = async () => [await chooser.locator('article.project:visible').count(), await chooser.locator('.index__row:visible').count(), await chooser.locator('.demos__row:visible').count()];
  await chooser.goto(base + '#work');
  await chooser.getByRole('button', { name: /^Games/ }).click();
  assert.deepEqual(await shown(), [2, 3, 3]);
  assert.ok(chooser.url().endsWith('?type=games#work'), 'The address does not keep the choice: ' + chooser.url());
  assert.equal(await chooser.locator('.demos__lede').innerText(), 'Not screenshots. 3 games you can open and use right now.');
  await chooser.getByRole('button', { name: /^All/ }).click();
  assert.deepEqual(await shown(), [10, 15, 9]);
  assert.equal(new URL(chooser.url()).search, '');
  await chooser.goto(base + '?type=data');
  await chooser.locator('.index__row:visible').first().waitFor();
  assert.deepEqual(await shown(), [2, 4, 1]);
  assert.equal(await chooser.locator('.demos__lede').innerText(), 'Not screenshots. 1 data project you can open and use right now.');
  assert.equal(await chooser.getByRole('button', { name: /^Data/ }).getAttribute('aria-pressed'), 'true');
  await chooser.goto(base + '?type=nonsense');
  await chooser.locator('.index__row:visible').first().waitFor();
  assert.deepEqual(await shown(), [10, 15, 9]);
  await filtering.close();

  // The game is served as itself: its page, its title and the files its start needs.
  const mara = await context.request.get(base + 'mara/');
  assert.equal(mara.status(), 200, 'The game does not load');
  const maraPage = await mara.text();
  assert.ok(maraPage.includes('It Only Needs Mara'), 'The game has the wrong title');
  for (const file of maraPage.match(/assets\/[^"']+\.js/g) ?? []) assert.equal((await context.request.get(base + 'mara/' + file)).status(), 200, 'Missing: ' + file);

  // A case study, the résumé, and the pages that kept their old addresses.
  await page.goto(base + 'work/aura-music-house/');
  await page.getByRole('heading', { level: 1, name: 'AURA Music House' }).waitFor();
  assert.equal(await page.getByRole('link', { name: /Live demo/ }).first().getAttribute('href'), live + 'aura/');
  await page.locator('.study__frame img').evaluate(img => img.decode());
  await page.goto(base + 'resume/');
  await page.getByRole('heading', { level: 1, name: 'Anis Chelly' }).waitFor();
  assert.match(await (await context.request.get(base + 'resume.html')).text(), /url=resume\//);
  const classic = await context.request.get(base + 'classic.html');
  assert.equal(classic.status(), 200);
  assert.match(await classic.text(), /ANIS\.EXE/);
  assert.deepEqual(failed, []);

  const evidence = resolve(root, 'qa/evidence');
  await mkdir(evidence, { recursive: true });
  await page.goto(base);
  await page.locator('#demos').scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(evidence, 'site-demos.png'), animations: 'disabled' });
  await context.close();

  // Phone width: nothing may widen the page.
  const phone = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await phone.page.goto(base);
  await phone.page.getByRole('heading', { level: 1, name: 'Anis Chelly' }).waitFor();
  assert.equal(await phone.page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  await phone.page.screenshot({ path: resolve(evidence, 'site-mobile.png'), animations: 'disabled' });
  await phone.context.close();

  // With motion on: the choreographed version must start and lift its loader, with or without WebGL.
  const motion = await open({ viewport: { width: 1440, height: 900 } });
  await motion.page.goto(base);
  await motion.page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30_000 });
  await motion.page.waitForTimeout(1500);
  await motion.page.screenshot({ path: resolve(evidence, 'site-desktop.png') });
  await motion.context.close();

  assert.deepEqual(errors, []);
  console.log('Portfolio home, 10 project scenes, 15 index rows, the type filter, hosted demos, the AURA MECH window, the game, case study, résumé, classic site and 390px layout passed.');
} finally {
  await browser?.close();
  await new Promise(done => server.close(done));
}
