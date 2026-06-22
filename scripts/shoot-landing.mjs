// Captures the public landing/sign-in screen from the local dev server.
// Usage: node scripts/shoot-landing.mjs [baseUrl]
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const baseUrl = process.argv[2] ?? 'http://localhost:5173';
const outDir = 'docs/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Sunchaser');
await page.screenshot({ path: `${outDir}/01-landing.png` });
console.log('Saved 01-landing.png');

await browser.close();
