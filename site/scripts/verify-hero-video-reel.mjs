import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../test-results/hero-video-reel/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  // Streaming media can keep networkidle pending: readiness comes from the hero and decoded frames.
  await page.waitForFunction(() => document.querySelector('[data-inside-mind]')?.dataset.state === 'portrait');
  await page.waitForFunction(() => document.querySelector('[data-mind-hero-video]')?.currentTime > 0.3);
  const media = await page.locator('[data-mind-hero-video]').evaluateAll(videos => videos.map(video => ({
    src: video.getAttribute('src'), muted: video.muted, inline: video.playsInline,
    rate: video.playbackRate, duration: video.duration, width: video.videoWidth, height: video.videoHeight,
  })));
  assert.deepEqual(media.map(v => v.src.split('/').pop()), [
    'landing-hero-video.mp4', '91744-636709154_medium.mp4', '165208-832102298_medium.mp4',
  ]);
  assert(media.every(v => v.muted && v.inline && v.rate === 0.8));
  assert.match(await page.locator('[data-composite-portrait]').getAttribute('src'), /cutout-v2\.png$/);
  console.log('Media:', JSON.stringify(media));

  // Observe a real, unaccelerated full round trip, including the third-to-first splice.
  await page.evaluate(() => {
    window.heroSplices = [];
    const root = document.querySelector('[data-inside-mind]');
    new MutationObserver(() => window.heroSplices.push(root.dataset.heroClip))
      .observe(root, { attributes: true, attributeFilter: ['data-hero-clip'] });
  });
  await page.screenshot({ path: `${output}/desktop-clip-1.png` });
  const title = page.locator('#mind-title');
  const box = await title.boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3);
  await page.waitForFunction(() => {
    const lens = document.querySelector('[data-text-loupe]');
    return lens && getComputedStyle(lens).display === 'block' && lens.firstElementChild;
  });
  const gradient = await page.locator('[data-text-loupe] > *').evaluate(el => el.style.backgroundImage);
  assert(gradient.includes('linear-gradient'));
  await page.screenshot({ path: `${output}/desktop-loupe.png` });
  await page.mouse.move(15, 200);
  for (const clip of ['2', '3', '1']) {
    await page.waitForFunction(clip => document.querySelector('[data-inside-mind]')?.dataset.heroClip === clip, clip, { timeout: 35000 });
    await page.waitForFunction(() => !document.querySelector('[data-hero-reel]')?.hasAttribute('data-glitch'));
    const snapshot = await page.locator('[data-mind-hero-video]').evaluateAll(videos => videos.map(v => ({
      active: v.hasAttribute('data-active'), opacity: getComputedStyle(v).opacity, paused: v.paused, time: v.currentTime,
    })));
    assert.equal(snapshot.filter(v => v.active && v.opacity === '1').length, 1);
    assert(snapshot.every(v => v.active || v.opacity === '0'));
    assert.equal(snapshot.filter(v => !v.paused).length, 1);
    await page.screenshot({ path: `${output}/desktop-clip-${clip}.png` });
    console.log(`Splice to ${clip} OK:`, JSON.stringify(snapshot));
  }
  assert.deepEqual(await page.evaluate(() => window.heroSplices), ['2', '3', '1']);

  // Moving to the footer pauses the reel; returning resumes it.
  // A shorter viewport allows the hero to leave the screen completely.
  await page.setViewportSize({ width: 1440, height: 500 });
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForFunction(() => [...document.querySelectorAll('[data-mind-hero-video]')].every(v => v.paused));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => !document.querySelector('[data-mind-hero-video][data-active]').paused);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => [...document.querySelectorAll('[data-mind-hero-video]')].every(v => v.paused));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => !document.querySelector('[data-mind-hero-video][data-active]').paused);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await mobile.waitForFunction(() => document.querySelector('[data-inside-mind]')?.dataset.state === 'portrait');
  await mobile.waitForFunction(() => document.querySelector('[data-mind-hero-video]')?.currentTime > 0.3);
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await mobile.screenshot({ path: `${output}/mobile.png` });
  await mobile.setViewportSize({ width: 320, height: 740 });
  await mobile.screenshot({ path: `${output}/mobile-small.png` });
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.locator('[data-mind-enter]').click();
  await page.waitForURL('**/univers-v2', { timeout: 20000 });
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('[data-inside-mind]')?.dataset.state === 'portrait');
  assert.equal(await page.locator('[data-hero-reel]').count(), 1);
  assert.deepEqual(errors, []);
  console.log('PASS: complete cycle, loupe, pause/resume, reduced motion, mobile, navigation; no page errors.');
} finally {
  await browser.close();
}
