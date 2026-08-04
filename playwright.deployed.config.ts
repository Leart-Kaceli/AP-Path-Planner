import {
  defineConfig,
  devices,
} from "@playwright/test";

const deploymentUrl =
  process.env.DEPLOYMENT_URL;

if (!deploymentUrl) {
  throw new Error(
    "DEPLOYMENT_URL must be provided when running deployed tests.",
  );
}

const normalizedDeploymentUrl =
  deploymentUrl.replace(
    /\/+$/,
    "",
  );

const bypassSecret =
  process.env
    .VERCEL_AUTOMATION_BYPASS_SECRET;

const bypassHeaders =
  bypassSecret
    ? {
        "x-vercel-protection-bypass":
          bypassSecret,

        "x-vercel-set-bypass-cookie":
          "true",
      }
    : undefined;

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

  timeout:
    30_000,

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
    ...devices[
      "Desktop Chrome"
    ],

    baseURL:
      normalizedDeploymentUrl,

    extraHTTPHeaders:
      bypassHeaders,

    trace:
      "on-first-retry",

    screenshot:
      "only-on-failure",

    video:
      "retain-on-failure",

    navigationTimeout:
      20_000,

    actionTimeout:
      10_000,
  },

  projects: [
    {
      name:
        "deployed-chromium",

      testIgnore: [
        /auth\.setup\.ts/,
        /authenticated[\\/].*\.spec\.ts/,
        /visual[\\/].*\.visual\.spec\.ts/,
      ],

      use: {
        storageState: {
          cookies: [],
          origins: [],
        },
      },
    },
  ],
});