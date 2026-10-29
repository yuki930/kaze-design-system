import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression tests: every Storybook story is screenshotted and compared
 * with the baseline in vrt/__screenshots__. Baselines are rendered on Linux in
 * CI (fonts render differently per OS), so update them with the "Visual
 * regression" workflow (Run workflow → update), not locally.
 *
 *   npm run vrt:build   # build Storybook into storybook-static
 *   npm run vrt         # compare
 */
export default defineConfig({
  testDir: ".",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : [["list"]],
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      // anti-aliasing noise only; any real change is far above this
      maxDiffPixelRatio: 0.002,
    },
  },
  use: {
    baseURL: "http://localhost:6007",
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 800, height: 600 } },
    },
  ],
  webServer: {
    command: "node vrt/serve.mjs storybook-static 6007",
    url: "http://localhost:6007/index.json",
    reuseExistingServer: !process.env.CI,
    cwd: "..",
  },
});
