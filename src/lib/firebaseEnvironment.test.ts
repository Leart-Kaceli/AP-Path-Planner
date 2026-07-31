import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getFirebaseEnvironment,
  validateFirebaseEnvironment,
} from "@/lib/firebaseEnvironment";

const firebaseVariableNames = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_USE_FIREBASE_EMULATORS",
] as const;

function clearFirebaseEnvironment() {
  for (
    const variableName
    of firebaseVariableNames
  ) {
    vi.stubEnv(
      variableName,
      "",
    );
  }
}

function provideFirebaseEnvironment() {
  vi.stubEnv(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "test-api-key",
  );

  vi.stubEnv(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "test.firebaseapp.com",
  );

  vi.stubEnv(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "test-project",
  );

  vi.stubEnv(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "test.appspot.com",
  );

  vi.stubEnv(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "123456789",
  );

  vi.stubEnv(
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "test-app-id",
  );

  vi.stubEnv(
    "NEXT_PUBLIC_USE_FIREBASE_EMULATORS",
    "false",
  );
}

describe(
  "Firebase environment validation",
  () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it(
      "returns the configured Firebase environment",
      () => {
        provideFirebaseEnvironment();

        expect(
          getFirebaseEnvironment(),
        ).toEqual({
          apiKey:
            "test-api-key",

          authDomain:
            "test.firebaseapp.com",

          projectId:
            "test-project",

          storageBucket:
            "test.appspot.com",

          messagingSenderId:
            "123456789",

          appId:
            "test-app-id",
        });
      },
    );

    it(
      "accepts complete production configuration",
      () => {
        provideFirebaseEnvironment();

        expect(
          () =>
            validateFirebaseEnvironment(),
        ).not.toThrow();
      },
    );

    it(
      "rejects incomplete production configuration",
      () => {
        clearFirebaseEnvironment();

        vi.stubEnv(
          "NEXT_PUBLIC_USE_FIREBASE_EMULATORS",
          "false",
        );

        expect(
          () =>
            validateFirebaseEnvironment(),
        ).toThrow(
          /Missing Firebase environment variables/,
        );
      },
    );

    it(
      "allows missing production values while emulator mode is enabled",
      () => {
        clearFirebaseEnvironment();

        vi.stubEnv(
          "NEXT_PUBLIC_USE_FIREBASE_EMULATORS",
          "true",
        );

        expect(
          () =>
            validateFirebaseEnvironment(),
        ).not.toThrow();
      },
    );
  },
);