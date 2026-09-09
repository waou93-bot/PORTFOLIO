import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseUrl = 'http://localhost:3200/';
const outputDir = fileURLToPath(new URL('../public/media/projects/maison-sillon/', import.meta.url));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });

await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForTimeout(1_000);

const height = await page.evaluate(() => document.documentElement.scrollHeight);
const captures = [
  { name: 'site-home.png', y: 0 },
  { name: 'site-projects.png', y: 1_600 },
  { name: 'site-dossier.png', y: 3_450 },
];

for (const capture of captures) {
  await page.evaluate((y) => window.scrollTo(0, y), capture.y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outputDir}${capture.name}`, animations: 'disabled' });
}

console.log(JSON.stringify({ height, outputDir, captures }, null, 2));
await browser.close();
