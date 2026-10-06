// Serves the production build under /Portfolio/, mirroring GitHub Pages. Usage: node scripts/preview.mjs [dir] [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.argv[2] ?? 'dist/portfolio/browser';
const port = Number(process.argv[3] ?? 4300);
const BASE = '/Portfolio/';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain',
};

async function resolve(path) {
  const file = normalize(join(root, path));
  try {
    const s = await stat(file);
    return s.isDirectory() ? resolve(join(path, 'index.html')) : file;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (url === '/' || url === '/Portfolio') return res.writeHead(302, { Location: BASE }).end();
  const file = url.startsWith(BASE) ? await resolve(url.slice(BASE.length)) : null;
  const target = file ?? join(root, '404.html');
  res.writeHead(file ? 200 : 404, { 'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream' });
  res.end(await readFile(target));
}).listen(port, () => console.log(`Preview: http://localhost:${port}${BASE}`));
