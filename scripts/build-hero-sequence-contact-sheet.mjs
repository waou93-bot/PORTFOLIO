import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('site/package.json'));
const sharp = require('sharp');

const root = path.resolve(process.argv[2] ?? 'assets/derived-portraits/hero-sequence');
const output = path.join(root, process.argv[3] ?? 'hero-sequence-contact-sheet-v2.jpg');
const candidates = (await fs.readdir(root))
  .filter((name) => /^nicolas-jez-hero-sequence-\d{2}-.*\.png$/i.test(name))
  .sort();
const selectedByFrame = new Map();
for (const name of candidates) {
  const frame = name.match(/hero-sequence-(\d{2})-/)?.[1];
  if (!frame) continue;
  const current = selectedByFrame.get(frame);
  if (!current || /-v\d+\.png$/i.test(name)) selectedByFrame.set(frame, name);
}
const files = [...selectedByFrame.values()].sort();

const thumbWidth = 384;
const thumbHeight = 216;
const labelHeight = 34;
const columns = 5;
const rows = Math.ceil(files.length / columns);
const tiles = [];

for (let index = 0; index < files.length; index += 1) {
  const input = path.join(root, files[index]);
  const image = await sharp(input)
    .resize(thumbWidth, thumbHeight, { fit: 'cover' })
    .jpeg({ quality: 82 })
    .toBuffer();
  const label = Buffer.from(
    `<svg width="${thumbWidth}" height="${labelHeight}"><rect width="100%" height="100%" fill="#111"/><text x="14" y="23" fill="#fff" font-family="Arial" font-size="17">${String(index + 1).padStart(2, '0')}</text></svg>`,
  );
  tiles.push({ input: image, left: (index % columns) * thumbWidth, top: Math.floor(index / columns) * (thumbHeight + labelHeight) });
  tiles.push({ input: label, left: (index % columns) * thumbWidth, top: Math.floor(index / columns) * (thumbHeight + labelHeight) + thumbHeight });
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
  .jpeg({ quality: 88 })
  .toFile(output);

console.log(output);
