import react from "@vitejs/plugin-react";

import {
  defineConfig,
} from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    tsconfigPaths: true,
  },

  test: {
    environment: "jsdom",

    setupFiles: [
      "./src/test/setup.ts",
    ],

    globals: true,
    clearMocks: true,
    restoreMocks: true,
    css: true,

    include: [
      "src/**/*.test.{ts,tsx}",
    ],

    exclude: [
      "tests/firestore.rules.test.mjs",
      "node_modules/**",
      ".next/**",
      "e2e/**",
    ],

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "text-summary",
        "html",
        "json",
        "lcov",
      ],

      reportsDirectory:
        "./coverage",

      /*
       * Begin with the files that
       * currently have automated tests.
       *
       * Add more source files here as
       * new tests are written.
       */
      include: [
        "src/components/courses/CourseForm.tsx",
        "src/components/network/AppConnectionStatus.tsx",
        "src/components/ui/ConfirmDialog.tsx",
        "src/components/ui/LoadingCard.tsx",
        "src/components/ui/SyncStatus.tsx",
        "src/utils/conflicts.ts",
        "src/utils/dates.ts",
        "src/utils/grades.ts",
        "src/lib/firebaseEnvironment.ts",
      ],

      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "**/*.d.ts",
      ],

      thresholds: {
        statements: 55,
        branches: 55,
        functions: 55,
        lines: 55,
      },
    },
  },
});