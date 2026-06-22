// Captures the demo user switcher (VITE_DEMO=1): the "Ver como" control and the
// app re-rendered as a different crew member.
// Usage: node scripts/shoot-switcher.mjs [baseUrl]
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const baseUrl = process.argv[2] ?? 'http://localhost:5173';
const outDir = 'docs/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });

const shot = async (name) => {
  await page.screenshot({ path: `${outDir}/${name}.png` });
  console.log(`Saved ${name}.png`);
};

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Ventana dorada', { timeout: 15000 });
await page.waitForTimeout(800);

// 1) The switcher control in the header (signed in as Vic).
await shot('06-user-switcher');

// 2) Switch identity to Lucía — the app reloads her groups/votes/availability.
await page.getByRole('combobox').selectOption({ label: 'Lucía' });
await page.waitForSelector('text=Ventana dorada', { timeout: 15000 });
await page.waitForTimeout(1000);
await shot('07-as-lucia');

await browser.close();
