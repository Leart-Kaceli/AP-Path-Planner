import AxeBuilder from "@axe-core/playwright";

import {
  expect,
  test,
} from "@playwright/test";

test.describe(
  "accessibility",
  () => {
    test(
      "homepage has no automatically detectable serious violations",
      async ({
        page,
      }) => {
        await page.goto("/");

        await page.waitForLoadState(
          "networkidle",
        );

        const results =
          await new AxeBuilder({
            page,
          })
            .withTags([
              "wcag2a",
              "wcag2aa",
              "wcag21a",
              "wcag21aa",
            ])
            .analyze();

        const seriousViolations =
          results.violations.filter(
            (violation) =>
              violation.impact ===
                "serious" ||
              violation.impact ===
                "critical",
          );

        expect(
          seriousViolations,
        ).toEqual([]);
      },
    );

    test(
      "not-found page has no automatically detectable serious violations",
      async ({
        page,
      }) => {
        await page.goto(
          "/this-page-does-not-exist",
        );

        await page.waitForLoadState(
          "networkidle",
        );

        const results =
          await new AxeBuilder({
            page,
          })
            .withTags([
              "wcag2a",
              "wcag2aa",
              "wcag21a",
              "wcag21aa",
            ])
            .analyze();

        const seriousViolations =
          results.violations.filter(
            (violation) =>
              violation.impact ===
                "serious" ||
              violation.impact ===
                "critical",
          );

        expect(
          seriousViolations,
        ).toEqual([]);
      },
    );
  },
);