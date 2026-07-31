import {
  defineConfig,
  devices,
} from "@playwright/test";

const deployedBaseUrl =
  process.env.DEPLOYMENT_URL;

if (!deployedBaseUrl) {
  throw new Error(
    "DEPLOYMENT_URL must be provided before running deployed-site tests.",
  );
}

export default defineConfig({
  testDir:
    "./e2e",

  fullyParallel:
    false,

  workers:
    1,

  forbidOnly:
    Boolean(
      process.env.CI,
    ),

  retries:
    process.env.CI
      ? 2
      : 0,

  reporter: [
    [
      "list",
    ],

    [
      "html",
      {
        open:
          "never",
      },
    ],
  ],

  use: {
    baseURL:
      deployedBaseUrl,

    trace:
      "on-first-retry",

    screenshot:
      "only-on-failure",

    video:
      "retain-on-failure",

    ignoreHTTPSErrors:
      false,
  },

  projects: [
    {
      name:
        "deployed-chromium",

      testMatch: [
  /home\.spec\.ts/,
  /navigation\.spec\.ts/,
  /not-found\.spec\.ts/,
  /accessibility\.spec\.ts/,
  /deployed-health\.spec\.ts/,
  /performance\.spec\.ts/,
],

      use: {
        ...devices[
          "Desktop Chrome"
        ],
      },
    },
  ],
});