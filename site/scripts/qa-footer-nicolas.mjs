import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch();
const base = 'http://127.0.0.1:4176';
try {
  for (const mode of ['desktop', 'mobile', 'reduced']) {
    const context = await browser.newContext({
      viewport: mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      isMobile: mode === 'mobile', hasTouch: mode === 'mobile',
      reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'load' });
    await page.evaluate(() => document.querySelector('[data-mind-loader-skip]')?.click());
    await page.evaluate(() => {
      window.footerFrames = [];
      const root = document.querySelector('[data-footer-nicolas]');
      new MutationObserver(records => {
        if (records.some(record => record.attributeName === 'data-pose')) window.footerFrames.push(root.dataset.pose);
      }).observe(root, { attributes: true, attributeFilter: ['data-pose'] });
    });
    const footer = page.locator('[data-footer-nicolas]');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-footer-nicolas]')?.dataset.state === 'settled');
    const result = await footer.evaluate(element => ({
      pose: element.dataset.pose, frames: window.footerFrames,
      overflow: document.documentElement.scrollWidth > innerWidth,
      animation: getComputedStyle(element.querySelector('[data-footer-actor]')).animationName,
      href: element.querySelector('a').getAttribute('href'),
    }));
    assert.equal(result.pose, '8'); assert.equal(result.overflow, false);
    assert.equal(result.href, 'mailto:nicolas.jez75@gmail.com');
    if (mode === 'desktop') assert.deepEqual([...new Set(result.frames)], ['1','2','3','4','5','6','7','8']);
    else assert.equal(result.animation, 'none');
    await page.evaluate(() => scrollTo(0, 0));
    await footer.scrollIntoViewIfNeeded();
    assert.equal(await footer.getAttribute('data-state'), 'settled');
    await footer.screenshot({ path: `../footer-${mode}-verified.png` });
    // Astro navigation must not restart the completed performance.
    await page.locator('.site-footer a[href="/contact"]').first().click();
    await page.waitForURL('**/contact');
    assert.equal(await page.locator('.field[hidden]').isVisible(), false);
    await page.locator('header a[href="/"]').first().click();
    await page.waitForURL(base + '/');
    await page.evaluate(() => document.querySelector('[data-mind-loader-skip]')?.click());
    await page.locator('[data-footer-nicolas]').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('[data-footer-nicolas]')?.dataset.state === 'settled');
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(mode, JSON.stringify(result), 'scroll/route persistence PASS');
    await context.close();
  }
} finally { await browser.close(); }
