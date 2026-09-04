/**
 * Serveur E2E local : sert dist/ (build statique) + monte la Vercel Function
 * api/contact.ts sur /api/contact. Permet de tester le parcours complet
 * formulaire → endpoint → mailto en local, comme en preview Vercel.
 * Usage : pnpm build && pnpm exec tsx scripts/e2e-server.ts [port]
 */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import contactHandler from '../api/contact';

const PORT = Number(process.env.PORT ?? 4321);
const DIST = join(process.cwd(), 'dist');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
};

function safeJoin(base: string, pathname: string): string {
  const decoded = decodeURIComponent(pathname);
  const target = normalize(join(base, decoded));
  return target.startsWith(normalize(base)) ? target : base;
}

function serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end();
    return;
  }
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = safeJoin(DIST, requested);
  const candidates = [
    file,
    join(file, 'index.html'),
    `${file}.html`,
    join(DIST, `${pathname.replace(/\/+$/, '')}.html`),
  ];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', MIME[extname(c)] ?? 'application/octet-stream');
      const data = readFileSync(c);
      res.setHeader('Content-Length', data.length);
      res.end(req.method === 'HEAD' ? undefined : data);
      return;
    }
  }
  const notFound = join(DIST, '404.html');
  if (existsSync(notFound)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', MIME['.html'] ?? 'text/html; charset=utf-8');
    res.end(readFileSync(notFound));
    return;
  }
  res.statusCode = 404;
  res.end('Not found');
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  if (url.pathname.startsWith('/api/')) {
    void contactHandler(req, res);
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`E2E server ready on http://localhost:${PORT} (dist + /api/contact)`);
});
