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
        {
          waitUntil:
            "domcontentloaded",
        },
      );

    expect(
      response,
    ).not.toBeNull();

    expect(
      response?.ok(),
    ).toBe(
      true,
    );

    await expect(
      page,
    ).toHaveTitle(
      /AP Path Planner/i,
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            /your success starts with a plan/i,
        },
      ),
    ).toBeVisible();
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
        {
          waitUntil:
            "domcontentloaded",
        },
      );

    expect(
      response,
    ).not.toBeNull();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            /page not found/i,
        },
      ),
    ).toBeVisible({
      timeout:
        10_000,
    });

    await expect(
      page.getByRole(
        "link",
        {
          name:
            /return home|go home|back to home/i,
        },
      ),
    ).toBeVisible();
  },
);