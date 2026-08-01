import {
  expect,
  test,
} from "@playwright/test";

test(
  "application sends basic security headers",
  async ({
    request,
  }) => {
    const response =
      await request.get(
        "/",
      );

    expect(
      response.status(),
    ).toBeLessThan(
      400,
    );

    expect(
      response.headers()[
        "x-content-type-options"
      ],
    ).toBe(
      "nosniff",
    );

    expect(
      response.headers()[
        "x-frame-options"
      ],
    ).toBe(
      "DENY",
    );

    expect(
      response.headers()[
        "referrer-policy"
      ],
    ).toBe(
      "strict-origin-when-cross-origin",
    );

    expect(
      response.headers()[
        "permissions-policy"
      ],
    ).toContain(
      "camera=()",
    );
  },
);