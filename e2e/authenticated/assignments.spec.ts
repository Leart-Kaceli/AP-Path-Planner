import {
  expect,
  test,
} from "@playwright/test";

import {
  clearFirestoreEmulator,
} from "../helpers/emulators";

import {
  readFile,
} from "node:fs/promises";


import {
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

import {
  doc,
  setDoc,
} from "firebase/firestore";

const projectId =
  "demo-ap-path-planner";

const firestorePort =
  8085;

const testEnvironmentPromise =
  initializeTestEnvironment({
    projectId,

    firestore: {
      host:
        "127.0.0.1",

      port:
        firestorePort,
    },
  });

  test.afterAll(
  async () => {
    const testEnvironment =
      await testEnvironmentPromise;

    await testEnvironment.cleanup();
  },
);
  


test.beforeEach(
  async () => {
    await clearFirestoreEmulator();
  },
);

type TestUserRecord = {
  uid: string;
  email: string;
};

async function readTestUser() {
  const fileContents =
    await readFile(
      "playwright/.auth/test-user.json",
      "utf8",
    );

  return JSON.parse(
    fileContents,
  ) as TestUserRecord;
}


async function seedRequiredCourse() {
  const testUser =
    await readTestUser();

  const testEnvironment =
    await testEnvironmentPromise;

  await testEnvironment
    .withSecurityRulesDisabled(
      async (
        context,
      ) => {
        await setDoc(
          doc(
            context.firestore(),
            "users",
            testUser.uid,
            "courses",
            "ap-calculus-bc",
          ),
          {
            id:
              "ap-calculus-bc",

            name:
              "AP Calculus BC",

            teacher:
              "Ms. Rivera",

            goalScore:
              5,

            progress:
              0,
          },
        );
      },
    );
}

test(
  "authenticated student can create an assignment",
  async ({
    page,
  }) => {
    await seedRequiredCourse();

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

    const availablePriorities =
      await prioritySelect
        .locator("option")
        .allTextContents();

    const highPriority =
      availablePriorities.find(
        (
          option,
        ) =>
          option
            .trim()
            .toLowerCase() ===
          "high",
      );

    expect(
      highPriority,
    ).toBeTruthy();

    await prioritySelect.selectOption({
      label:
        highPriority!,
    });

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