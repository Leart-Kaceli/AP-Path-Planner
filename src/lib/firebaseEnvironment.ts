type FirebaseEnvironment = {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId:
    string | undefined;
  appId: string | undefined;
};

export function getFirebaseEnvironment():
  FirebaseEnvironment {
  /*
   * NEXT_PUBLIC variables must be read
   * using direct property references.
   *
   * Dynamic access such as:
   * process.env[variableName]
   * is not inlined into client code by
   * Next.js.
   */
  return {
    apiKey:
      process.env
        .NEXT_PUBLIC_FIREBASE_API_KEY,

    authDomain:
      process.env
        .NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

    projectId:
      process.env
        .NEXT_PUBLIC_FIREBASE_PROJECT_ID,

    storageBucket:
      process.env
        .NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

    messagingSenderId:
      process.env
        .NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

    appId:
      process.env
        .NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function validateFirebaseEnvironment() {
  const usesEmulators =
    process.env
      .NEXT_PUBLIC_USE_FIREBASE_EMULATORS ===
    "true";

  if (usesEmulators) {
    return;
  }

  const environment =
    getFirebaseEnvironment();

  const missingVariables:
    string[] = [];

  if (!environment.apiKey) {
    missingVariables.push(
      "NEXT_PUBLIC_FIREBASE_API_KEY",
    );
  }

  if (!environment.authDomain) {
    missingVariables.push(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    );
  }

  if (!environment.projectId) {
    missingVariables.push(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    );
  }

  if (!environment.storageBucket) {
    missingVariables.push(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    );
  }

  if (!environment.messagingSenderId) {
    missingVariables.push(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    );
  }

  if (!environment.appId) {
    missingVariables.push(
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    );
  }

  if (
    missingVariables.length ===
    0
  ) {
    return;
  }

  throw new Error(
    `Missing Firebase environment variables: ${missingVariables.join(
      ", ",
    )}`,
  );
}