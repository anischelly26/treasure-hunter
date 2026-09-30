import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root } from './server.mjs';

const source = resolve(process.argv[2] || resolve(root, '.form-source'), 'web/dist-demo');
const destination = resolve(root, 'form-studio');
const html = await readFile(resolve(source, 'index.html'), 'utf8');
if (!html.includes('src="./assets/')) throw new Error('Build the demo with relative asset paths before publishing.');
await mkdir(destination, { recursive: true });
await rm(resolve(destination, 'assets'), { recursive: true, force: true });
await cp(source, destination, { recursive: true });
console.log('Prepared the FORM browser demo from the source build.');
