import {
  expect,
  test,
} from "@playwright/test";

test.use({
  viewport: {
    width: 390,
    height: 844,
  },

  deviceScaleFactor:
    1,

  isMobile:
    true,

  hasTouch:
    true,
});

test(
  "mobile homepage matches its visual baseline",
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
      "homepage-mobile.png",
      {
        fullPage:
          true,
      },
    );
  },
);