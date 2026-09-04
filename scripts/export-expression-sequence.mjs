import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('site/package.json'));
const sharp = require('sharp');
const source = path.resolve('assets/derived-portraits/hero-sequence/expressive-aligned-v4');
const output = path.resolve('site/public/media/identity/sequence-expression-v1');
const files = (await fs.readdir(source)).filter((name) => /^frame-\d{2}-.*\.png$/i.test(name)).sort();

if (files.length !== 30) throw new Error(`30 images attendues, ${files.length} trouvées`);
await fs.mkdir(output, { recursive: true });

for (let index = 0; index < files.length; index += 1) {
  await sharp(path.join(source, files[index]))
    .resize(1672, 941, { fit: 'cover' })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(output, `frame-${String(index + 1).padStart(2, '0')}.webp`));
}

console.log(`Exported ${files.length} expression frames to ${output}`);
