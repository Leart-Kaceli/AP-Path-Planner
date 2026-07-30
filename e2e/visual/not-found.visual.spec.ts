import {
  expect,
  test,
} from "@playwright/test";

test.use({
  viewport: {
    width: 1280,
    height: 800,
  },
});

test(
  "not-found page matches its visual baseline",
  async ({
    page,
  }) => {
    await page.goto(
      "/this-route-does-not-exist",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            /page not found/i,
        },
      ),
    ).toBeVisible();

    await expect(
      page,
    ).toHaveScreenshot(
      "not-found.png",
      {
        fullPage:
          true,
      },
    );
  },
);