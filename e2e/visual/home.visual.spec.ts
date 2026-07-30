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
  "desktop homepage matches its visual baseline",
  async ({
    page,
  }) => {
    await page.goto(
      "/",
    );

    await page.waitForLoadState(
      "networkidle",
    );

    await expect(
      page,
    ).toHaveScreenshot(
      "homepage-desktop.png",
      {
        fullPage:
          true,
      },
    );
  },
);