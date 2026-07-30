import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";

import {
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";

import {
  validateFirebaseEnvironment,
} from "@/lib/firebaseEnvironment";

import {
  connectFirestoreEmulator,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const shouldUseFirebaseEmulators =
  process.env
    .NEXT_PUBLIC_USE_FIREBASE_EMULATORS ===
  "true";

const emulatorProjectId =
  "demo-ap-path-planner";

  validateFirebaseEnvironment();

const firebaseConfig =
  shouldUseFirebaseEmulators
    ? {
        /*
         * These values are safe local
         * placeholders. The project ID
         * must match the Firebase CLI
         * emulator project.
         */
        apiKey:
          "demo-api-key",

        authDomain:
          `${emulatorProjectId}.firebaseapp.com`,

        projectId:
          emulatorProjectId,

        storageBucket:
          `${emulatorProjectId}.appspot.com`,

        messagingSenderId:
          "000000000000",

        appId:
          "1:000000000000:web:demo",
      }
    : {
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

export const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(
        firebaseConfig,
      );

export const firebaseAuth =
  getAuth(
    firebaseApp,
  );

export const firestoreDatabase =
  initializeFirestore(
    firebaseApp,
    {
      /*
       * Memory cache avoids stale local
       * emulator data during development.
       *
       * Production keeps persistent
       * multi-tab caching.
       */
      localCache:
        shouldUseFirebaseEmulators ||
        process.env.NODE_ENV ===
          "development"
          ? memoryLocalCache()
          : persistentLocalCache({
              tabManager:
                persistentMultipleTabManager(),
            }),
    },
  );

if (
  typeof window !== "undefined" &&
  shouldUseFirebaseEmulators
) {
  try {
    connectAuthEmulator(
      firebaseAuth,
      "http://127.0.0.1:9099",
      {
        disableWarnings: true,
      },
    );
  } catch {
    /*
     * Next.js hot reload may evaluate
     * this module more than once.
     */
  }

  try {
    connectFirestoreEmulator(
      firestoreDatabase,
      "127.0.0.1",
      8085,
    );
  } catch {
    /*
     * Next.js hot reload may evaluate
     * this module more than once.
     */
  }
}

export default firebaseApp;