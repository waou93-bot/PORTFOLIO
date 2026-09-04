import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('site/package.json'));
const sharp = require('sharp');

const source = path.resolve('assets/derived-portraits/hero-sequence/aligned-v1');
const destination = path.resolve('site/public/media/identity/sequence-v1');
await fs.mkdir(destination, { recursive: true });

const files = (await fs.readdir(source))
  .filter((name) => /hero-sequence-\d{2}-.*-aligned-v1\.png$/i.test(name))
  .sort();

for (let index = 0; index < files.length; index += 1) {
  const output = path.join(destination, `frame-${String(index + 1).padStart(2, '0')}.webp`);
  await sharp(path.join(source, files[index]))
    .resize(1672, 941, { fit: 'fill' })
    .webp({ quality: 82, effort: 5, smartSubsample: true })
    .toFile(output);
}

console.log(`Exported ${files.length} frames to ${destination}`);
