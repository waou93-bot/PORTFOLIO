/**
 * Vérifie les liens internes et (optionnellement) externes.
 *  - Liens internes : résolus contre dist/ (build requis) et public/.
 *  - Liens externes : HEAD via fetch (désactivés sans --external pour éviter
 *    les appels réseau lents ; utiles pour documenter le plan réseau d'un projet).
 * Usage :
 *   pnpm build
 *   pnpm validate:links            # interne uniquement
 *   pnpm validate:links --external # interne + externe
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve('.');
const DIST_DIR = resolve('dist');
const PUBLIC_DIR = resolve('public');
const SRC_DIR = resolve('src');

const EXTERNAL = process.argv.includes('--external');

interface Problem {
  level: 'error' | 'warning';
  message: string;
}

const problems: Problem[] = [];

const URL_RE = /(?:href|src|poster)=["']([^"']+)["']/g;
const HASH_ONLY = /^#/;
const MAILTO = /^mailto:/;
const TEL = /^tel:/;
const DATA = /^data:/;
const JS = /^javascript:/;

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) {
        walk(p);
      } else if (/\.(astro|md|html)$/.test(e)) {
        out.push(p);
      }
    }
  };
  walk(dir);
  return out;
}

function urlToFile(url: string): string | null {
  // /work/down-trigger/ → dist/work/down-trigger/index.html
  const [queryPart] = url.split('?');
  const [cleanPath] = (queryPart ?? url).split('#');
  const clean = (cleanPath ?? '').replace(/\/+$/, '');
  const candidates = [
    join(DIST_DIR, clean, 'index.html'),
    join(DIST_DIR, clean, '.html'),
    join(DIST_DIR, clean),
    join(PUBLIC_DIR, clean.slice(1)),
  ];
  return candidates.find((c) => existsSync(c)) ?? null;
}

async function checkExternal(url: string, source: string) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if (res.ok) return;
    // Certains serveurs refusent HEAD : retenter en GET léger.
    const res2 = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    if (res2.ok) return;
    problems.push({
      level: 'warning',
      message: `externe ${res2.status} ${url} (depuis ${source})`,
    });
  } catch {
    problems.push({ level: 'warning', message: `externe injoignable ${url} (depuis ${source})` });
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const files = [...collectFiles(SRC_DIR), ...collectFiles(DIST_DIR)];
  const seen = new Set<string>();

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const rel = file.replace(`${ROOT}\\`, '').replace(`${ROOT}/`, '');
    for (const m of src.matchAll(URL_RE)) {
      const url = m[1];
      if (
        !url ||
        HASH_ONLY.test(url) ||
        MAILTO.test(url) ||
        TEL.test(url) ||
        DATA.test(url) ||
        JS.test(url)
      )
        continue;
      if (seen.has(`${rel}→${url}`)) continue;
      seen.add(`${rel}→${url}`);

      if (url.startsWith('http://') || url.startsWith('https://')) {
        if (EXTERNAL) await checkExternal(url, rel);
        continue;
      }

      if (!url.startsWith('/')) {
        problems.push({
          level: 'warning',
          message: `lien relatif non résolu (préfixer avec /) : ${url} (${rel})`,
        });
        continue;
      }

      if (!urlToFile(url)) {
        problems.push({ level: 'error', message: `lien interne cassé : ${url} (${rel})` });
      }
    }
  }

  if (EXTERNAL) console.log('Vérification des liens externes incluse.');
  if (!existsSync(DIST_DIR)) {
    console.warn("dist/ absent — liens internes non résolus. Lancer `pnpm build` d'abord.");
  }

  const errors = problems.filter((p) => p.level === 'error');
  for (const p of problems) console.log(`[${p.level.toUpperCase()}] ${p.message}`);
  console.log(`\n${errors.length} erreur(s), ${problems.length - errors.length} avertissement(s).`);
  if (errors.length > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
