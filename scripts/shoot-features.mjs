// Captures the new dashboard visuals + profile page (demo mode).
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const baseUrl = process.argv[2] ?? 'http://localhost:5173';
const outDir = 'docs/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 1100 } });
const shot = async (name) => {
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`Saved ${name}.png`);
};

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Mapa de destinos', { timeout: 15000 });
await page.waitForTimeout(800);
await shot('11-dashboard-charts');

// Expand availability gantt
await page.getByRole('button', { name: /Disponibilidad de la cuadrilla/ }).click();
await page.waitForTimeout(500);
await shot('12-gantt');

// Destinations with procedural scenes
await page.getByRole('button', { name: 'Destinos' }).click();
await page.waitForSelector('text=Propuestas');
await page.waitForTimeout(800);
await shot('13-destinations-scenes');

// Profile page
await page.goto(`${baseUrl}/profile`, { waitUntil: 'networkidle' });
await page.waitForSelector('text=Tu perfil', { timeout: 15000 });
await page.waitForTimeout(800);
await shot('14-profile');

await browser.close();
