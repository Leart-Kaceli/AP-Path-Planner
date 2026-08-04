import {
  expect,
  test,
} from "@playwright/test";

test(
  "main homepage action opens the application",
  async ({
    page,
  }) => {
    await page.goto(
      "/",
    );

    /*
     * Confirm that the deployed page is
     * AP Path Planner before testing its
     * navigation.
     */
    await expect(
      page,
    ).toHaveTitle(
      /AP Path Planner/i,
    );

    const applicationLink =
      page
        .getByRole(
          "link",
          {
            name:
              /get started|open dashboard|go to dashboard|start planning|sign in/i,
          },
        )
        .first();

    await expect(
      applicationLink,
    ).toBeVisible({
      timeout:
        10_000,
    });

    const startingUrl =
      page.url();

    await applicationLink.click();

    await expect(
      page,
    ).not.toHaveURL(
      startingUrl,
      {
        timeout:
          10_000,
      },
    );

    /*
     * Confirm navigation stayed inside
     * the AP Path Planner application.
     */
    await expect(
      page,
    ).toHaveTitle(
      /AP Path Planner/i,
    );
  },
);