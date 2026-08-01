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

  await expect(
    page,
  ).toHaveURL(
    /\/courses/,
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

  const teacherInput =
    page.getByLabel(
      /teacher/i,
    );

  if (
    await teacherInput.count()
  ) {
    await teacherInput.fill(
      "Ms. Rivera",
    );
  }

  const goalScoreInput =
    page.getByLabel(
      /goal score/i,
    );

  if (
    await goalScoreInput.count()
  ) {
    await goalScoreInput.fill(
      "5",
    );
  }

  const courseForm =
    courseNameInput.locator(
      "xpath=ancestor::form[1]",
    );

  await courseForm
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
    ).first(),
  ).toBeVisible({
    timeout:
      15_000,
  });

  await expect(
    courseNameInput,
  ).toHaveValue(
    "",
    {
      timeout:
        15_000,
    },
  );
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
    ).toBeVisible({
      timeout:
        15_000,
    });

    await assignmentTitleInput.fill(
      "Integration Practice",
    );

    const courseSelect =
      page.locator(
        "#assignment-course",
      );

    await expect(
      courseSelect,
    ).toBeVisible({
      timeout:
        15_000,
    });

    const calculusOption =
      courseSelect.locator(
        "option",
        {
          hasText:
            "AP Calculus BC",
        },
      );

    await expect(
      calculusOption,
    ).toHaveCount(
      1,
      {
        timeout:
          20_000,
      },
    );

    const courseValue =
      await calculusOption.getAttribute(
        "value",
      );

    expect(
      courseValue,
    ).toBeTruthy();

    await courseSelect.selectOption(
      courseValue!,
    );

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

    const assignmentForm =
      assignmentTitleInput.locator(
        "xpath=ancestor::form[1]",
      );

    await assignmentForm
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
      ).first(),
    ).toBeVisible({
      timeout:
        15_000,
    });
  },
);