import {
  expect,
  test as setup,
} from "@playwright/test";

import {
  mkdir,
  writeFile,
} from "node:fs/promises";

const projectId =
  "demo-ap-path-planner";

const testEmail =
  "student@example.test";

const testPassword =
  "TestPassword123!";

const authStateFile =
  "playwright/.auth/student.json";

  const testUserFile =
  "playwright/.auth/test-user.json";

async function clearAuthEmulator() {
  const response =
    await fetch(
      `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts`,
      {
        method:
          "DELETE",
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Could not clear the Authentication Emulator: ${response.status}`,
    );
  }
}

type CreatedTestUser = {
  localId: string;
  email: string;
};

async function createTestUser():
  Promise<CreatedTestUser> {
  const response =
    await fetch(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            email:
              testEmail,

            password:
              testPassword,

            returnSecureToken:
              true,
          }),
      },
    );

  if (!response.ok) {
    const responseText =
      await response.text();

    throw new Error(
      `Could not create the emulator test user: ${response.status} ${responseText}`,
    );
  }

  const createdUser =
    await response.json() as
      CreatedTestUser;

  if (!createdUser.localId) {
    throw new Error(
      "The Authentication Emulator did not return a user UID.",
    );
  }

  return createdUser;
}

setup(
  "create and authenticate the emulator test user",
  async ({
    page,
  }) => {
    await clearAuthEmulator();

    const createdUser =
  await createTestUser();

await mkdir(
  "playwright/.auth",
  {
    recursive:
      true,
  },
);

await writeFile(
  testUserFile,
  JSON.stringify(
    {
      uid:
        createdUser.localId,

      email:
        createdUser.email,
    },
    null,
    2,
  ),
  "utf8",
);

    /*
     * Use the route that actually
     * renders <AuthPanel />.
     */
    await page.goto(
      "/profile",
    );

    const emailInput =
      page.locator(
        "#account-email",
      );

    const passwordInput =
      page.locator(
        "#account-password",
      );

    await expect(
      emailInput,
    ).toBeVisible({
      timeout: 15_000,
    });

    await expect(
      passwordInput,
    ).toBeVisible({
      timeout: 15_000,
    });

    await emailInput.fill(
      testEmail,
    );

    await passwordInput.fill(
      testPassword,
    );

    await page
      .getByRole(
        "button",
        {
          name:
            /^sign in$/i,
        },
      )
      .last()
      .click();

    await expect(
      page.getByRole(
        "heading",
        {
          name:
            "You are signed in",
        },
      ),
    ).toBeVisible({
      timeout: 15_000,
    });

    await page
      .context()
      .storageState({
        path:
          authStateFile,

        indexedDB:
          true,
      });
  },
);