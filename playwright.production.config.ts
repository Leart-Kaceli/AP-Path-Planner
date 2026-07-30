import baseConfig from "./playwright.config";

import {
  defineConfig,
} from "@playwright/test";

export default defineConfig({
  ...baseConfig,

  webServer: {
    command:
      "npm run start",

    url:
      "http://localhost:3000",

    reuseExistingServer:
      false,

    timeout:
      120_000,
  },

  projects:
    baseConfig.projects?.filter(
      (
        project,
      ) =>
        project.name ===
          "public-chromium",
    ),
});