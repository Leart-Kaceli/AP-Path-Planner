import {
  expect,
  test,
} from "@playwright/test";

test.use({
  viewport: {
    width: 1440,
    height: 1000,
  },
});

test(
  "authenticated Dashboard matches its visual baseline",
  async ({
    page,
  }) => {
    await page.goto(
      "/dashboard",
    );

    const mainContent =
      page.getByRole(
        "main",
      );

    await expect(
      mainContent,
    ).toBeVisible({
      timeout:
        15_000,
    });

    /*
     * Wait for dashboard content that is
     * known to exist instead of assuming
     * there is a "Dashboard" heading.
     */
    await expect(
      page.getByText(
        /upcoming assignments|weekly progress|study sessions|courses/i,
      ).first(),
    ).toBeVisible({
      timeout:
        15_000,
    });

    /*
     * Allow the final layout and realtime
     * data listeners to settle briefly.
     */
    await page.waitForTimeout(
      750,
    );

    await expect(
      page,
    ).toHaveScreenshot(
      "dashboard-authenticated.png",
      {
        fullPage:
          true,

        mask: [
          page.getByRole(
            "status",
          ),
        ],
      },
    );
  },
);