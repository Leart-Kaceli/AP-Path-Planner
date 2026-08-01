import {
  expect,
  test,
} from "@playwright/test";

test(
  "privacy page explains application data practices",
  async ({
    page,
  }) => {
    await page.goto(
      "/privacy",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Privacy",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Information stored",
        },
      ),
    ).toBeVisible();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "Deleting your information",
        },
      ),
    ).toBeVisible();
  },
);