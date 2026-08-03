import {
  defineConfig,
  devices,
} from "@playwright/test";

const useFirebaseEmulators =
  process.env
    .NEXT_PUBLIC_USE_FIREBASE_EMULATORS ===
  "true";

export default defineConfig({
  testDir:
    "./e2e",

  fullyParallel:
    false,

  workers:
    useFirebaseEmulators
      ? 1
      : undefined,

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

  expect: {
    toHaveScreenshot: {
      animations:
        "disabled",

      caret:
        "hide",

      maxDiffPixelRatio:
        0.01,

      stylePath:
        "./e2e/visual.css",
    },
  },

  use: {
    baseURL:
      "http://localhost:3000",

    trace:
      "on-first-retry",

    screenshot:
      "only-on-failure",

    video:
      "retain-on-failure",
  },

  projects: [
    {
      name:
        "setup",

      testMatch:
        /auth\.setup\.ts/,
    },

    {
      name:
        "public-chromium",

      testIgnore: [
        /auth\.setup\.ts/,
        /authenticated[\\/].*\.spec\.ts/,
        /visual[\\/].*\.visual\.spec\.ts/,
      ],

      use: {
        ...devices[
          "Desktop Chrome"
        ],

        storageState: {
          cookies: [],
          origins: [],
        },
      },
    },

    {
      name:
        "authenticated-chromium",

      fullyParallel:
        false,

      testMatch:
        /authenticated[\\/](?!.*\.visual\.spec\.ts).*\.spec\.ts/,

      dependencies: [
        "setup",
      ],

      use: {
        ...devices[
          "Desktop Chrome"
        ],

        storageState:
          "playwright/.auth/student.json",
      },
    },

    {
      name:
        "visual-chromium",

      testMatch:
        /visual[\\/].*\.visual\.spec\.ts/,

      use: {
        ...devices[
          "Desktop Chrome"
        ],

        storageState: {
          cookies: [],
          origins: [],
        },
      },
    },

    {
      name:
        "authenticated-visual-chromium",

      testMatch:
        /authenticated[\\/].*\.visual\.spec\.ts/,

      dependencies: [
        "setup",
      ],

      use: {
        ...devices[
          "Desktop Chrome"
        ],

        storageState:
          "playwright/.auth/student.json",
      },
    },
  ],

  webServer: {
    command:
      "npm run dev",

    url:
      "http://localhost:3000",

    reuseExistingServer:
      !process.env.CI,

    timeout:
      120_000,
  },
});