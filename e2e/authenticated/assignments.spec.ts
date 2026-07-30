import {
  expect,
  test,
} from "@playwright/test";

import type {
  Page,
} from "@playwright/test";

import {
  clearFirestoreEmulator,
} from "../helpers/emulators";

test.beforeEach(
  async () => {
    await clearFirestoreEmulator();
  },
);

async function createRequiredCourse(
  page: Page,
) {
  await page.goto(
    "/courses",
  );

  const courseNameInput =
    page.getByLabel(
      /course name/i,
    );

  await expect(
    courseNameInput,
  ).toBeVisible();

  await courseNameInput.fill(
    "AP Calculus BC",
  );

  await page
    .getByRole(
      "button",
      {
        name:
          /add course|save course/i,
      },
    )
    .click();

  await expect(
    page.getByText(
      "AP Calculus BC",
      {
        exact: true,
      },
    ),
  ).toBeVisible({
    timeout:
      15_000,
  });
}

test(
  "authenticated student can create an assignment",
  async ({
    page,
  }) => {
    await createRequiredCourse(
      page,
    );

    await page.goto(
      "/assignments",
    );

    const assignmentTitleInput =
      page.getByLabel(
        /assignment title|title/i,
      );

    await expect(
      assignmentTitleInput,
    ).toBeVisible();

    await assignmentTitleInput.fill(
      "Integration Practice",
    );

    const courseSelect =
      page.locator(
        "#assignment-course",
      );

    await expect(
      courseSelect,
    ).toBeVisible();

    await expect(
      courseSelect.locator(
        "option",
        {
          hasText:
            "AP Calculus BC",
        },
      ),
    ).toHaveCount(
      1,
      {
        timeout:
          15_000,
      },
    );

    await courseSelect.selectOption({
      label:
        "AP Calculus BC",
    });

    const dueDateInput =
      page.getByLabel(
        /due date/i,
      );

    await expect(
      dueDateInput,
    ).toBeVisible();

    await dueDateInput.fill(
      "2026-08-15",
    );

    const prioritySelect =
  page.locator(
    "#assignment-priority",
  );

await expect(
  prioritySelect,
).toBeVisible();

await prioritySelect.selectOption(
  "High",
);

    await page
      .getByRole(
        "button",
        {
          name:
            /add assignment|save assignment/i,
        },
      )
      .click();

    await expect(
      page.getByText(
        "Integration Practice",
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout:
        15_000,
    });


  },
);