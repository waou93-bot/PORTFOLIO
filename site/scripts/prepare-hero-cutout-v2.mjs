import sharp from 'sharp';

const input = process.env.NJ_HERO_CUTOUT_INPUT ?? 'C:/Users/waou9/.codex/generated_images/01a08289-e7c9-7482-a38c-79f8fc0cd5f1/exec-b7eea5df-c5b0-4966-9c1c-ffc21921c8c9.png';
const output = process.env.NJ_HERO_CUTOUT_OUTPUT ?? 'public/media/identity/nicolas-jez-hero-cutout-v2.png';

const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const visited = new Uint8Array(width * height);
const queue = [];
const seedLimit = Math.floor(height * 0.62);

const isCheckerboard = (offset) => {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const brightness = (red + green + blue) / 3;
  // Keep warm jacket pixels (especially the left shoulder) opaque. The
  // checkerboard squares are near-neutral; a tighter chroma gate avoids
  // flooding through the light beige subject edge.
  return Math.max(red, green, blue) - Math.min(red, green, blue) <= 8 && brightness >= 90;
};

const enqueue = (x, y) => {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const index = y * width + x;
  if (visited[index] || !isCheckerboard(index * channels)) return;
  visited[index] = 1;
  queue.push(index);
};

for (let x = 0; x < width; x += 1) enqueue(x, 0);
for (let y = 0; y <= seedLimit; y += 1) {
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
for (let index = 0; index < visited.length; index += 1) {
  if (visited[index]) alpha[index] = 0;
}

// The preview still contains a few isolated opaque checkerboard pixels after
// the tighter chroma gate. Keep the single connected subject and discard only
// tiny islands, preserving the continuous jacket and shoulder contour.
const componentSeen = new Uint8Array(width * height);
const componentQueue = new Int32Array(width * height);
for (let index = 0; index < alpha.length; index += 1) {
  if (componentSeen[index] || alpha[index] === 0) continue;
  let head = 0;
  let tail = 0;
  componentQueue[tail++] = index;
  componentSeen[index] = 1;
  while (head < tail) {
    const current = componentQueue[head++];
    const x = current % width;
    const y = Math.floor(current / width);
    for (const neighbor of [current - 1, current + 1, current - width, current + width]) {
      const neighborX = neighbor % width;
      const neighborY = Math.floor(neighbor / width);
      if (
        neighborX < 0 ||
        neighborX >= width ||
        neighborY < 0 ||
        neighborY >= height ||
        componentSeen[neighbor] ||
        alpha[neighbor] === 0
      ) continue;
      componentSeen[neighbor] = 1;
      componentQueue[tail++] = neighbor;
    }
  }
  if (tail < 256) {
    for (let cursor = 0; cursor < tail; cursor += 1) alpha[componentQueue[cursor]] = 0;
  }
}

// Remove the bright neutral fringe left by the checkerboard preview around
// the head. Limit this edge cleanup to the upper portrait so pale clothing
// remains untouched.
for (let y = 0; y < Math.floor(height * 0.3); y += 1) {
  for (let x = 0; x < width; x += 1) {
    const index = y * width + x;
    if (alpha[index] === 0) continue;
    let touchesTransparent = false;
    for (const neighbor of [index - 1, index + 1, index - width, index + width]) {
      if (neighbor >= 0 && neighbor < alpha.length && alpha[neighbor] === 0) {
        touchesTransparent = true;
        break;
      }
    }
    const offset = index * channels;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const brightness = (red + green + blue) / 3;
    const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
    if (touchesTransparent && brightness > 170 && spread <= 14) alpha[index] = 0;
  }
}

await sharp(data, { raw: { width, height, channels } })
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png()
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(JSON.stringify({ output, width: metadata.width, height: metadata.height, channels: metadata.channels, hasAlpha: metadata.hasAlpha }));
