import { execFileSync } from 'node:child_process';
import { copyFile, cp, mkdir, rm, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { root } from './server.mjs';

const output = resolve(root, '_site');
const exported = resolve(root, 'site/out');
await stat(resolve(exported, 'index.html')).catch(() => { throw new Error('Build the portfolio first: node scripts/build-pages.mjs in site/.'); });
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Publish tracked public files and the verified demo builds. The new portfolio's sources stay out; only its export is published.
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of files) {
  if (file.startsWith('.') || file.startsWith('site/')) continue;
  const target = resolve(output, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(resolve(root, file), target);
}
await cp(resolve(root, 'form-studio'), resolve(output, 'form-studio'), { recursive: true });
await cp(resolve(root, 'aura'), resolve(output, 'aura'), { recursive: true });
// The portfolio is the site root. It is copied last so its pages own /, /work/… and /resume/.
await cp(exported, output, { recursive: true });
console.log('Staged the portfolio export, the classic site, the FORM demo and the AURA build for GitHub Pages.');
