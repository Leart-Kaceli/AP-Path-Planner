import {
  expect,
  test,
} from "@playwright/test";

test(
  "homepage includes application metadata",
  async ({
    page,
  }) => {
    await page.goto(
      "/",
    );

    await expect(
      page,
    ).toHaveTitle(
      /AP Path Planner/i,
    );

    await expect(
      page.locator(
        'meta[name="description"]',
      ),
    ).toHaveAttribute(
      "content",
      /Plan AP courses/i,
    );
  },
);

test(
  "robots metadata is available",
  async ({
    request,
  }) => {
    const response =
      await request.get(
        "/robots.txt",
      );

    expect(
      response.status(),
    ).toBe(
      200,
    );

    const body =
      await response.text();

    expect(
      body,
    ).toContain(
      "User-Agent:",
    );

    expect(
      body,
    ).toContain(
      "Disallow: /dashboard",
    );
  },
);

test(
  "sitemap contains public pages",
  async ({
    request,
  }) => {
    const response =
      await request.get(
        "/sitemap.xml",
      );

    expect(
      response.status(),
    ).toBe(
      200,
    );

    const body =
      await response.text();

    expect(
      body,
    ).toContain(
      "<urlset",
    );

    expect(
      body,
    ).toContain(
      "/privacy",
    );
  },
);