import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  retries: 2,
  workers: 1,

  // Report configuration
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  // Default settings for tests
  use: {
    // URL app
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3030",

    // Capture screenshot on failure
    screenshot: "only-on-failure",

    // Record video on failure
    video: "retain-on-failure",

    // Trace debugging
    trace: "on-first-retry",

    // Timeout actions
    actionTimeout: 15000,

    // Timeout navigation
    navigationTimeout: 30000,
  },

  // Config navigators
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
