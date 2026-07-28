import {
  expect,
  test,
} from "@playwright/test";

test(
  "main homepage action opens the application",
  async ({
    page,
  }) => {
    await page.goto("/");

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
    ).toBeVisible();

    const startingUrl =
      page.url();

    await applicationLink.click();

    await expect(
      page,
    ).not.toHaveURL(
      startingUrl,
    );
  },
);