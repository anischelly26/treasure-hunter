import { copyFile, cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root } from './server.mjs';

// The music house is published as its own static build: one page, one script bundle, its stylesheets, typefaces and models.
const checkout = resolve(process.argv[2] || resolve(root, '.aura-source'));
const source = resolve(checkout, 'dist');
const destination = resolve(root, 'aura');
const html = await readFile(resolve(source, 'index.html'), 'utf8');
if (!/<script src="studio\.js\?v=[a-f0-9]+"><\/script>/.test(html)) throw new Error('Build AURA with npm run build before publishing.');
if (/(?:src|href)="\//.test(html)) throw new Error('The AURA build must use relative paths to run from a subfolder.');
await mkdir(destination, { recursive: true });
for (const name of ['index.html', 'studio.js', 'src', 'assets', 'LICENSE', 'THIRD_PARTY_NOTICES.txt']) await rm(resolve(destination, name), { recursive: true, force: true });
await copyFile(resolve(source, 'index.html'), resolve(destination, 'index.html'));
await copyFile(resolve(source, 'studio.js'), resolve(destination, 'studio.js'));
// The page loads its stylesheets from src/; the scripts beside them are already inside the bundle.
await mkdir(resolve(destination, 'src'));
for (const name of await readdir(resolve(source, 'src'))) if (name.endsWith('.css')) await copyFile(resolve(source, 'src', name), resolve(destination, 'src', name));
await cp(resolve(source, 'assets'), resolve(destination, 'assets'), { recursive: true });
// The notices for the bundled library, typefaces and models travel with the build.
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.txt']) await copyFile(resolve(checkout, name), resolve(destination, name));
for (const file of [...html.matchAll(/href="(src\/[\w.-]+\.css)\?/g)].map(match => match[1]).concat('assets/models/manifest.json')) await stat(resolve(destination, file));
console.log('Prepared the AURA music house from the source build.');
