import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: "story" | "docs";
  tags?: string[];
}

// Playwright runs from the repository root (npm run vrt)
const indexFile = path.resolve("storybook-static/index.json");
if (!fs.existsSync(indexFile)) {
  throw new Error("storybook-static/index.json not found. Run `npm run vrt:build` first.");
}
const index = JSON.parse(fs.readFileSync(indexFile, "utf8")) as {
  entries: Record<string, IndexEntry>;
};
const stories = Object.values(index.entries).filter((entry) => entry.type === "story");

for (const story of stories) {
  test(`${story.title} / ${story.name}`, async ({ page }) => {
    // Stories tagged "vrt-phone" depend on viewport media queries (< 768px)
    if (story.tags?.includes("vrt-phone")) {
      await page.setViewportSize({ width: 375, height: 667 });
    }
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // Storybook marks <body> once the story has rendered (or failed to)
    await page.waitForSelector("body.sb-show-main, body.sb-show-errordisplay");
    await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);
    await page.evaluate(() => document.fonts.ready);
    // Charts measure their container with ResizeObserver on the next frame
    await page.waitForTimeout(150);
    await expect(page).toHaveScreenshot(`${story.id}.png`);
  });
}
