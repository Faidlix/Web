import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.wasm':'application/wasm', '.br':'application/octet-stream', '.zip':'application/zip', '.ico':'image/x-icon', '.png':'image/png' };
createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = normalize(urlPath === '/' ? 'index.html' : urlPath.slice(1));
    const path = join(root, relative);
    if (!path.startsWith(root)) throw new Error('invalid path');
    const info = await stat(path); if (!info.isFile()) throw new Error('not a file');
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    response.end(await readFile(path));
  } catch { response.writeHead(404).end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
