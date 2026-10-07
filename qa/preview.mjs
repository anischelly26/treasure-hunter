// Preview the staged site exactly as GitHub Pages serves it: under /treasure-hunter/.
//   node qa/stage-site.mjs && node qa/preview.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { root } from './server.mjs';

const site = resolve(root, '_site');
const prefix = '/treasure-hunter';
const port = Number(process.argv[2] || 4173);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain', '.glb': 'model/gltf-binary' };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/' || pathname === prefix) { response.writeHead(302, { Location: prefix + '/' }).end(); return; }
    if (!pathname.startsWith(prefix + '/')) { response.writeHead(404).end(); return; }
    let path = resolve(site, '.' + pathname.slice(prefix.length));
    if (!path.startsWith(site + sep) && path !== site) { response.writeHead(403).end(); return; }
    if (pathname.endsWith('/') || (await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { response.writeHead(404).end(); }
}).listen(port, '127.0.0.1', () => console.log(`Staged site: http://127.0.0.1:${port}${prefix}/`));
