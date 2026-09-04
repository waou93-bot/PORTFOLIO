import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const [, , inputArg, outputArg] = process.argv;
if (!inputArg || !outputArg) {
  throw new Error('Usage: node scripts/extract-vantel-assets.mjs <VANTEL-FINAL.html> <output-dir>');
}

const input = resolve(inputArg);
const output = resolve(outputArg);
const html = readFileSync(input, 'utf8');
mkdirSync(output, { recursive: true });

const pattern = /data:image\/(webp|png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)/g;
const seen = new Map();
const manifest = [];
let match;

while ((match = pattern.exec(html)) !== null) {
  const [, rawExtension, base64] = match;
  const bytes = Buffer.from(base64, 'base64');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (seen.has(sha256)) continue;

  const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension;
  const index = seen.size + 1;
  const filename = `asset-${String(index).padStart(2, '0')}.${extension}`;
  const contextStart = Math.max(0, match.index - 600);
  const contextEnd = Math.min(html.length, pattern.lastIndex + 240);
  const context = html.slice(contextStart, contextEnd).replace(base64, '[BASE64]');
  const altMatches = [...context.matchAll(/alt=["']([^"']*)["']/g)];
  const idMatches = [...context.matchAll(/id=["']([^"']*)["']/g)];
  const classMatches = [...context.matchAll(/class=["']([^"']*)["']/g)];

  writeFileSync(join(output, filename), bytes);
  seen.set(sha256, filename);
  manifest.push({
    index,
    filename,
    bytes: bytes.length,
    sha256,
    nearestAlt: altMatches.at(-1)?.[1] ?? '',
    nearestId: idMatches.at(-1)?.[1] ?? '',
    nearestClass: classMatches.at(-1)?.[1] ?? '',
  });
}

writeFileSync(
  join(output, 'manifest.json'),
  `${JSON.stringify({ source: basename(input), count: manifest.length, assets: manifest }, null, 2)}\n`,
  'utf8',
);

console.log(
  JSON.stringify({ source: input, output, count: manifest.length, assets: manifest }, null, 2),
);
