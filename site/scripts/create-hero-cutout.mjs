import sharp from 'sharp';

const input = 'C:/Users/waou9/.codex/generated_images/01a08289-e7c9-7482-a38c-79f8fc0cd5f1/exec-419f2fc8-cd61-411a-8bc0-f34d40052281.png';
const output = 'public/media/identity/nicolas-jez-hero-cutout-v1.png';

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const background = new Uint8Array(width * height);
const queue = [];

const isCheckerboard = (offset) => {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const brightness = (red + green + blue) / 3;
  return Math.max(red, green, blue) - Math.min(red, green, blue) <= 8 && brightness >= 100;
};

const enqueue = (x, y) => {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const index = y * width + x;
  if (background[index]) return;
  const offset = index * channels;
  if (!isCheckerboard(offset)) return;
  background[index] = 1;
  queue.push(index);
};

// The generated preview carries a checkerboard preview behind the subject.
// Flood-fill only from the visible outer background, so neutral clothing is kept.
for (let x = 0; x < width; x += 1) {
  enqueue(x, 0);
  enqueue(x, Math.min(height - 1, 900));
}
for (let y = 0; y <= 900; y += 1) {
  enqueue(0, y);
  enqueue(width - 1, y);
}

for (let cursor = 0; cursor < queue.length; cursor += 1) {
  const index = queue[cursor];
  const x = index % width;
  const y = Math.floor(index / width);
  enqueue(x - 1, y);
  enqueue(x + 1, y);
  enqueue(x, y - 1);
  enqueue(x, y + 1);
}

const alpha = Buffer.alloc(width * height, 255);
for (let index = 0; index < background.length; index += 1) {
  if (background[index]) alpha[index] = 0;
}

await sharp(data, { raw: { width, height, channels } })
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png()
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(JSON.stringify({ output, width: metadata.width, height: metadata.height, channels: metadata.channels, hasAlpha: metadata.hasAlpha }));
