import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect } from '@playwright/test';
import { root, servePortfolio } from './server.mjs';

const server = await servePortfolio();
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  const errors = [], apiRequests = [], externalRequests = [];
  const origin = new URL(server.baseURL).origin;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).pathname.includes('/api/')) apiRequests.push(request.url());
  });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (!['http:', 'https:'].includes(url.protocol) || url.origin === origin) return route.continue();
    externalRequests.push(route.request().url());
    return route.abort();
  });
  await page.goto(new URL('form-studio/', server.baseURL).href);
  await expect(page.getByRole('heading', { name: 'Interactive demo', exact: true })).toBeVisible();
  await expect(page.frameLocator('iframe[title="Reconstructed interface preview"]').getByRole('heading', { name: /Your work/ })).toBeVisible();
  assert.equal(await page.getByRole('button', { name: 'Generate interface', exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Export code', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Demo information', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('No processing server or paid API is contacted.');
  assert.equal(await page.getByLabel('Server access key').count(), 0);
  await page.getByRole('button', { name: 'Close dialog' }).click();

  // Edits flow directly to the isolated canvas and persist across a reload.
  const html = '<main><h1>My live FORM demo</h1><p>Built in the browser.</p></main>';
  const css = 'body { margin: 0; padding: 32px; background: #e9f4cf; font: 18px system-ui; } h1 { color: #28451b; }';
  await page.getByRole('button', { name: 'Edit the example', exact: true }).click();
  await page.getByLabel('HTML code editor', { exact: true }).fill(html);
  await page.getByRole('tab', { name: 'styles.css', exact: true }).click();
  await page.getByLabel('CSS code editor', { exact: true }).fill(css);
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Preview', exact: true }).click();
  await expect(page.frameLocator('iframe[title="Reconstructed interface preview"]').getByRole('heading', { name: 'My live FORM demo' })).toBeVisible();
  await page.getByRole('button', { name: 'Tablet preview', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tablet preview', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Mobile preview', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mobile preview', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.frameLocator('iframe[title="Reconstructed interface preview"]').getByRole('heading', { name: 'My live FORM demo' })).toBeVisible();
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.getByLabel('HTML code editor', { exact: true })).toHaveValue(html);
  await page.getByRole('tab', { name: 'styles.css', exact: true }).click();
  await expect(page.getByLabel('CSS code editor', { exact: true })).toHaveValue(css);
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(database => database.name));
  assert.ok(databases.includes('form-demo-workspaces'));
  assert.equal(databases.includes('form-workspaces'), false);

  // Hostile markup stays inert while parsing, previewing and downloading.
  await page.getByRole('tab', { name: 'index.html', exact: true }).click();
  await page.getByLabel('HTML code editor', { exact: true }).fill(html + '<img src="https://example.test/leak" srcset="https://example.test/leak2 2x" onerror="parent.document.body.dataset.demoLeak=1"><script>parent.document.body.dataset.demoLeak=1</script><iframe src="https://example.test/frame"></iframe>');
  await page.getByRole('tab', { name: 'Preview', exact: true }).click();
  await expect(page.frameLocator('iframe[title="Reconstructed interface preview"]').getByRole('heading', { name: 'My live FORM demo' })).toBeVisible();
  assert.equal(await page.evaluate(() => document.body.dataset.demoLeak), undefined);
  const htmlDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download HTML', exact: true }).click();
  const preview = await htmlDownload;
  assert.equal(preview.suggestedFilename(), 'form-preview.html');
  const exported = await readFile(await preview.path(), 'utf8');
  assert.match(exported, /My live FORM demo/);
  assert.match(exported, /Content-Security-Policy/);
  assert.match(exported, /default-src 'none'/);
  assert.equal(/<script|<iframe|onerror|example\.test/.test(exported), false);

  // Uploaded images and backups work locally without pretending to run OCR.
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 180;
    const context = canvas.getContext('2d'); context.fillStyle = '#eef4df'; context.fillRect(0, 0, 320, 180);
    context.fillStyle = '#223a22'; context.font = '24px sans-serif'; context.fillText('Demo screenshot', 24, 64);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  await page.getByLabel('Upload screenshot', { exact: true }).setInputFiles({ name: 'Demo screenshot.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
  await expect(page.getByRole('tab', { name: 'Source', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('no OCR run', { exact: true })).toBeVisible();
  await expect(page.getByText('not measured', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^My workspaces/ }).click();
  const backupDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up current workspace' }).click();
  const backup = await backupDownload;
  const workspace = JSON.parse(await readFile(await backup.path(), 'utf8'));
  assert.match(workspace.source, /^data:image\/webp;base64,/);
  assert.equal(workspace.result.elements.length, 0);
  workspace.name = 'Imported demo workspace';
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByLabel('Import workspace backup', { exact: true }).setInputFiles({ name: 'demo-workspace.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(workspace)) });
  await expect(page.getByLabel('Workspace name', { exact: true })).toHaveValue('Imported demo workspace');

  await page.getByRole('button', { name: 'Load example', exact: true }).click();
  await expect(page.frameLocator('iframe[title="Reconstructed interface preview"]').getByRole('heading', { name: /Your work/ })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const dismiss = page.getByRole('button', { name: 'Dismiss notification', exact: true });
  if (await dismiss.count()) await dismiss.click();
  await page.evaluate(() => window.scrollTo(0, 0));
  const evidence = resolve(root, 'qa/evidence');
  await mkdir(evidence, { recursive: true });
  await page.screenshot({ path: resolve(evidence, 'demo-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Mobile preview', exact: true }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  await page.getByRole('tab', { name: 'Preview', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Code', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Preview', exact: true }).click();
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.getByRole('button', { name: /^My workspaces/ })).toBeVisible();
  await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: resolve(evidence, 'demo-mobile.png'), fullPage: true, animations: 'disabled' });
  assert.deepEqual(apiRequests, []);
  assert.deepEqual(externalRequests, []);
  assert.deepEqual(errors, []);
  console.log('FORM demo: editing, responsive previews, autosave/reload, inert HTML download, local image upload, backup/import, isolated storage and mobile keyboard/navigation passed. No API or external processing requests.');
} finally {
  await browser?.close();
  await server.close();
}
