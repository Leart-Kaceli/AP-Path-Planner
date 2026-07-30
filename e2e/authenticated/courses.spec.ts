import {
  expect,
  test,
} from "@playwright/test";

import {
  clearFirestoreEmulator,
} from "../helpers/emulators";

test.beforeEach(
  async () => {
    await clearFirestoreEmulator();
  },
);

test(
  "authenticated student can create a course",
  async ({
    page,
  }) => {
    await page.goto(
      "/courses",
    );

    await expect(
      page,
    ).toHaveURL(
      /\/courses/,
    );

    await page
      .getByLabel(
        /course name/i,
      )
      .fill(
        "AP Computer Science A",
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
        "AP Computer Science A",
        {
          exact: true,
        },
      ),
    ).toBeVisible();
  },
);

test(
  "authenticated student can edit a course",
  async ({
    page,
  }) => {
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
      "AP Physics C",
    );

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
        "AP Physics C",
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout:
        15_000,
    });

    const courseCard =
      page
        .getByText(
          "AP Physics C",
          {
            exact: true,
          },
        )
        .locator(
          "xpath=ancestor::article[1]",
        );

    await expect(
      courseCard,
    ).toBeVisible();

    await courseCard
      .getByRole(
        "button",
        {
          name:
            /edit/i,
        },
      )
      .click();

    await expect(
      courseNameInput,
    ).toHaveValue(
      "AP Physics C",
    );

    await courseNameInput.fill(
      "AP Physics C: Mechanics",
    );

    await expect(
      courseNameInput,
    ).toHaveValue(
      "AP Physics C: Mechanics",
    );

    const saveChangesButton =
      courseForm.getByRole(
        "button",
        {
          name:
            /save changes|update course|save course/i,
        },
      );

    await expect(
      saveChangesButton,
    ).toBeVisible();

    await saveChangesButton.click();

    await expect(
      page.getByText(
        "AP Physics C: Mechanics",
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout:
        15_000,
    });

    await expect(
      page.getByText(
        "AP Physics C",
        {
          exact: true,
        },
      ),
    ).not.toBeVisible({
      timeout:
        15_000,
    });
  },
);

test(
  "authenticated student can delete a course",
  async ({
    page,
  }) => {
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
      "Temporary Test Course",
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
        "Temporary Test Course",
        {
          exact: true,
        },
      ),
    ).toBeVisible({
      timeout:
        15_000,
    });

    const courseCard =
      page
        .getByText(
          "Temporary Test Course",
          {
            exact: true,
          },
        )
        .locator(
          "xpath=ancestor::article[1]",
        );

    await expect(
      courseCard,
    ).toBeVisible();

    page.once(
      "dialog",
      async (
        dialog,
      ) => {
        expect(
          dialog.type(),
        ).toBe(
          "confirm",
        );

        await dialog.accept();
      },
    );

    await courseCard
      .getByRole(
        "button",
        {
          name:
            /delete/i,
        },
      )
      .click();

    await expect(
      page.getByText(
        "Temporary Test Course",
        {
          exact: true,
        },
      ),
    ).not.toBeVisible({
      timeout:
        15_000,
    });
  },
);