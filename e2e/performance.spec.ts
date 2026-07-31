import {
  expect,
  test,
} from "@playwright/test";

type PerformanceSummary = {
  domContentLoaded:
    number;

  loadComplete:
    number;

  transferredBytes:
    number;

  scriptBytes:
    number;
};

test(
  "homepage remains within basic performance budgets",
  async ({
    page,
  }) => {
    await page.goto(
      "/",
    );

    await page.waitForLoadState(
      "load",
    );

    const summary =
      await page.evaluate<
        PerformanceSummary
      >(() => {
        const navigation =
          performance.getEntriesByType(
            "navigation",
          )[0] as
            PerformanceNavigationTiming;

        const resources =
          performance.getEntriesByType(
            "resource",
          ) as
            PerformanceResourceTiming[];

        const transferredBytes =
          resources.reduce(
            (
              total,
              resource,
            ) =>
              total +
              resource.transferSize,
            0,
          );

        const scriptBytes =
          resources
            .filter(
              (
                resource,
              ) =>
                resource.initiatorType ===
                  "script",
            )
            .reduce(
              (
                total,
                resource,
              ) =>
                total +
                resource.transferSize,
              0,
            );

        return {
          domContentLoaded:
            navigation
              .domContentLoadedEventEnd,

          loadComplete:
            navigation
              .loadEventEnd,

          transferredBytes,

          scriptBytes,
        };
      });

    expect(
      summary.domContentLoaded,
    ).toBeLessThan(
      5_000,
    );

    expect(
      summary.loadComplete,
    ).toBeLessThan(
      8_000,
    );

    expect(
      summary.transferredBytes,
    ).toBeLessThan(
      5_000_000,
    );

    expect(
      summary.scriptBytes,
    ).toBeLessThan(
      3_000_000,
    );
  },
);