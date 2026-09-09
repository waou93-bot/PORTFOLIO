import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../test-results/hero-video-reel/', import.meta.url));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/91744-636709154_medium.mp4', async route => {
    await gate;
    await route.continue();
  });
  await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('[data-inside-mind]')?.dataset.state === 'portrait');
  // Seek the outgoing clip close to its real splice point; only the network wait is simulated.
  await page.locator('[data-mind-hero-video]').first().evaluate(v => { v.currentTime = v.duration * 0.56 - 0.1; });
  await page.waitForFunction(() => document.querySelector('[data-mind-hero-video]').paused);
  await page.waitForTimeout(4500);
  assert.equal(await page.locator('[data-inside-mind]').getAttribute('data-hero-clip'), '1');
  assert.equal(await page.locator('[data-mind-hero-video]').first().evaluate(v => getComputedStyle(v).opacity), '1');
  await page.screenshot({ path: `${output}/delayed-next-frame-held.png` });
  release();
  await page.waitForFunction(() => document.querySelector('[data-inside-mind]')?.dataset.heroClip === '2', null, { timeout: 15000 });
  console.log('PASS: outgoing image retained during delayed download; resumes into clip 2 once decoded.');
  for (const width of [390, 320]) {
    const mobile = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
    await mobile.waitForFunction(() => document.querySelector('[data-inside-mind]')?.dataset.state === 'portrait');
    await mobile.waitForTimeout(500);
    await mobile.screenshot({ path: `${output}/mobile-${width}-final.png` });
    const name = await mobile.locator('.mind-name').boundingBox();
    assert(name.y >= 128, 'Identity must remain below the mobile header');
    assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await mobile.close();
  }
  console.log('PASS: final mobile layout at 390px and 320px.');
} finally {
  await browser.close();
}
