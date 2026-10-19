import { chromium } from 'playwright';

const pages = [
  { name: 'citizen-login', url: 'http://localhost:5173/citizen/login/email' },
  { name: 'field-login', url: 'http://localhost:5173/field/login' },
  { name: 'contractor-login', url: 'http://localhost:5173/contractor/login' },
];

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

for (const p of pages) {
  const page = await ctx.newPage();
  await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: `C:/Users/USER/AppData/Local/Temp/opencode/${p.name}-mobile.png` });
  console.log(`saved ${p.name}`);
  await page.close();
}

await browser.close();


