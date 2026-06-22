// Captures the architecture page + the editable group header (demo mode).
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const baseUrl = process.argv[2] ?? 'http://localhost:5173';
const outDir = 'docs/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 1100 } });
const shot = async (name, full = true) => {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: full });
  console.log(`Saved ${name}.png`);
};

// Architecture page
await page.goto(`${baseUrl}/architecture`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Con qué está construida', { timeout: 15000 });
await page.waitForTimeout(800);
await shot('15-architecture');

// Group header emoji picker open
await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Ventana dorada', { timeout: 15000 });
await page.getByTitle('Cambiar emoji').click();
await page.waitForSelector('text=Elige un emoji');
await page.waitForTimeout(400);
await shot('16-group-emoji-edit', false);

await browser.close();
