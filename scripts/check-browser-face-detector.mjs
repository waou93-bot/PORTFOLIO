import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
console.log(await page.evaluate(() => typeof FaceDetector));
await browser.close();
