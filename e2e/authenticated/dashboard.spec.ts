import {
  expect,
  test,
} from "@playwright/test";

test(
  "authenticated student can open the dashboard",
  async ({
    page,
  }) => {
    await page.goto(
      "/dashboard",
    );

    await expect(
      page,
    ).toHaveURL(
      /\/dashboard/,
    );

    await expect(
      page.getByRole(
        "main",
      ),
    ).toBeVisible();

    await expect(
  page.getByRole(
    "heading",
    {
      name:
        /dashboard|welcome/i,
    },
  ),
).toBeVisible();
  },
);