import {
  expect,
  test,
} from "@playwright/test";

test(
  "unknown routes show the not-found page",
  async ({
    page,
  }) => {
    await page.goto(
      "/this-page-does-not-exist",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Page not found",
        },
      ),
    ).toBeVisible();

    const homeLink =
      page.getByRole(
        "link",
        {
          name:
            "Return Home",
        },
      );

    await expect(
      homeLink,
    ).toBeVisible();

    await homeLink.click();

    await expect(
      page,
    ).toHaveURL(
      "/",
    );
  },
);