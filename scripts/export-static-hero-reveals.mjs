import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('site/package.json'));
const sharp = require('sharp');
const source = path.resolve('assets/derived-portraits/hero-expanded');
const output = path.resolve('site/public/media/identity/reveal-v1');
const selected = ['01', '02', '03', '05'];

await fs.mkdir(output, { recursive: true });
for (let index = 0; index < selected.length; index += 1) {
  const frame = selected[index];
  await sharp(path.join(source, `nicolas-jez-editorial-${frame}-hero-v1.png`))
    .resize(1792, 1024, { fit: 'cover' })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(output, `portrait-${String(index + 1).padStart(2, '0')}.webp`));
}

console.log(`Exported ${selected.length} static hero reveals to ${output}`);
