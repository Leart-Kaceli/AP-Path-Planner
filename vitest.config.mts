import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import {
  defineConfig,
} from "vitest/config";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
  ],

  test: {
    environment: "jsdom",

    setupFiles: [
      "./src/test/setup.ts",
    ],

    globals: true,
    clearMocks: true,
    restoreMocks: true,
    css: true,

    /*
     * Only run Vitest tests located
     * inside the src folder.
     *
     * This prevents Vitest from running:
     * tests/firestore.rules.test.mjs
     */
    include: [
      "src/**/*.test.{ts,tsx}",
    ],

    exclude: [
      "tests/firestore.rules.test.mjs",
      "node_modules/**",
      ".next/**",
      "e2e/**",
    ],
  },
});