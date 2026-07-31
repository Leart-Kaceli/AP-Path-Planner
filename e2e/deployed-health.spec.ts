import {
  expect,
  test,
} from "@playwright/test";

test(
  "deployed application returns a healthy homepage",
  async ({
    page,
  }) => {
    const response =
      await page.goto(
        "/",
      );

    expect(
      response,
    ).not.toBeNull();

    expect(
      response?.status(),
    ).toBeLessThan(
      400,
    );

    await expect(
      page,
    ).toHaveTitle(
      /AP Path Planner/i,
    );

    await expect(
      page.locator(
        "body",
      ),
    ).not.toBeEmpty();
  },
);

test(
  "deployed application renders its not-found page",
  async ({
    page,
  }) => {
    const response =
      await page.goto(
        "/deployed-health-unknown-route",
      );

    expect(
      response,
    ).not.toBeNull();

    await expect(
      page.getByText(
        /page not found/i,
      ),
    ).toBeVisible();
  },
);