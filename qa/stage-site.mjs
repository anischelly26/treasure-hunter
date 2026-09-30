import { execFileSync } from 'node:child_process';
import { copyFile, cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { root } from './server.mjs';

const output = resolve(root, '_site');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Publish tracked public files and the verified demo build, excluding local dependencies and the source checkout.
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of files) {
  if (file.startsWith('.')) continue;
  const target = resolve(output, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(resolve(root, file), target);
}
await cp(resolve(root, 'form-studio'), resolve(output, 'form-studio'), { recursive: true });
console.log('Staged verified portfolio files and FORM demo for GitHub Pages.');
