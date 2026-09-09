import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseUrl = 'https://vantel-premium.waou93.chatgpt.site/vantel-final.html';
const outputDir = fileURLToPath(new URL('../public/media/projects/vantel/', import.meta.url));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });

await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForTimeout(1_000);

const height = await page.evaluate(() => document.documentElement.scrollHeight);
const captures = [
  { name: 'site-home.png', y: 0 },
  { name: 'site-campaign.png', y: Math.min(3_300, Math.max(0, height - 1000)) },
  { name: 'site-mirror.png', y: Math.min(5_600, Math.max(0, height - 1000)) },
];

for (const capture of captures) {
  await page.evaluate((y) => window.scrollTo(0, y), capture.y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outputDir}${capture.name}`, animations: 'disabled' });
}

console.log(JSON.stringify({ height, outputDir, captures }, null, 2));
await browser.close();
