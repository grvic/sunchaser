// Walks the demo app (VITE_DEMO=1) and captures the authenticated flow.
// Usage: node scripts/shoot-app.mjs [baseUrl]
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
await shot('02-dashboard');

await page.getByRole('button', { name: /Destinos/ }).click();
await page.waitForSelector('text=Propuestas');
await page.waitForTimeout(1200);
await shot('03-destinations');

await page.getByRole('button', { name: /Proponer destino/ }).click();
await page.waitForSelector('text=Elige uno rápido');
await page.waitForTimeout(400);
await shot('04-propose-form');
await page.getByRole('button', { name: /Cerrar/ }).click();

await page.getByRole('button', { name: /Disponibilidad/ }).click();
await page.waitForSelector('text=Tu disponibilidad');
await page.waitForTimeout(600);
await shot('05-availability');

await browser.close();
