import { chromium } from 'playwright';
const url = 'http://localhost:5173';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForSelector('text=Ventana dorada', { timeout: 15000 });
await p.waitForTimeout(600);
// open name editor
await p.getByRole('button', { name: /Vic/ }).first().click();
await p.waitForSelector('input[placeholder="Tu nombre"]');
await p.fill('input[placeholder="Tu nombre"]', 'Capitana Vic');
await p.waitForTimeout(300);
await p.screenshot({ path: 'docs/screenshots/09-edit-name.png' });
await p.getByRole('button', { name: /Guardar/ }).click();
// go to availability to show propagated name
await p.waitForTimeout(1000);
await p.getByRole('button', { name: /Disponibilidad/ }).click();
await p.waitForSelector('text=Tu disponibilidad', { timeout: 8000 });
await p.waitForTimeout(800);
await p.screenshot({ path: 'docs/screenshots/10-name-propagated.png' });
console.log('done');
await b.close();
