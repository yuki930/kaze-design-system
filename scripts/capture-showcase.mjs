/**
 * Screenshots the sample pages shown on the site top (public/showcase/*.jpg),
 * once in light and once in dark.
 *
 *   npm run build && npx next start -p 4190
 *   node scripts/capture-showcase.mjs http://localhost:4190
 *   (CHROMIUM_PATH=/path/to/chrome to use a browser that is already installed)
 *
 * Re-run when a featured sample changes visibly.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:4190";
const out = path.resolve("public/showcase");
const pages = [
  ["dashboard", "/dashboard"],
  ["lp", "/lp"],
  ["article", "/article"],
  ["analytics", "/analytics"],
  ["pricing", "/pricing"],
  ["settings", "/settings"],
];

fs.mkdirSync(out, { recursive: true });
// CHROMIUM_PATH lets you reuse a Chromium that is already installed
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: theme,
  });
  // ThemeProvider reads "kaze-theme"; set it before any page script runs
  await context.addInitScript((t) => {
    try {
      localStorage.setItem("kaze-theme", t);
    } catch {}
  }, theme);
  const page = await context.newPage();
  for (const [name, route] of pages) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Hide the floating source link and theme buttons that only belong to the live site
    await page.addStyleTag({
      content: 'nav[aria-label="ソースコード"], .fab { display: none !important; }',
    });
    await page.waitForTimeout(300);
    const file = path.join(out, `${name}-${theme}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 82 });
    console.log(`[showcase] ${path.relative(process.cwd(), file)}`);
  }
  await context.close();
}
await browser.close();
