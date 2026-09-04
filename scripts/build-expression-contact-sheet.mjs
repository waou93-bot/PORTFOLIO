import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('site/package.json'));
const sharp = require('sharp');
const root = path.resolve(
  process.argv[2] ?? 'assets/derived-portraits/hero-sequence/expressive-aligned-v1',
);
const output = path.join(root, 'expression-stop-motion-contact-sheet-v1.jpg');
const files = (await fs.readdir(root)).filter((name) => /^frame-\d{2}-.*\.png$/i.test(name)).sort();
const thumbWidth = 384;
const thumbHeight = 216;
const labelHeight = 34;
const columns = 5;
const rows = Math.ceil(files.length / columns);
const tiles = [];

for (let index = 0; index < files.length; index += 1) {
  const image = await sharp(path.join(root, files[index]))
    .resize(thumbWidth, thumbHeight, { fit: 'cover' })
    .jpeg({ quality: 84 })
    .toBuffer();
  const label = Buffer.from(
    `<svg width="${thumbWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#111"/><text x="14" y="23" fill="#fff" font-family="Arial" font-size="17">${String(index + 1).padStart(2, '0')}</text></svg>`,
  );
  tiles.push({
    input: image,
    left: (index % columns) * thumbWidth,
    top: Math.floor(index / columns) * (thumbHeight + labelHeight),
  });
  tiles.push({
    input: label,
    left: (index % columns) * thumbWidth,
    top: Math.floor(index / columns) * (thumbHeight + labelHeight) + thumbHeight,
  });
}

await sharp({
  create: {
    width: columns * thumbWidth,
    height: rows * (thumbHeight + labelHeight),
    channels: 3,
    background: '#111111',
  },
})
  .composite(tiles)
  .jpeg({ quality: 90 })
  .toFile(output);

console.log(output);
