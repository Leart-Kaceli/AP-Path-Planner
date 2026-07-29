import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
} from "firebase/auth";

import {
  connectFirestoreEmulator,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
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
      localCache:
        process.env.NODE_ENV ===
        "development"
          ? memoryLocalCache()
          : persistentLocalCache({
              tabManager:
                persistentMultipleTabManager(),
            }),
    },
  );

const shouldUseFirebaseEmulator =
  process.env
    .NEXT_PUBLIC_USE_FIREBASE_EMULATOR ===
  "true";

if (
  typeof window !== "undefined" &&
  shouldUseFirebaseEmulator
) {
  try {
    connectFirestoreEmulator(
      firestoreDatabase,
      "127.0.0.1",
      8085,
    );
  } catch {
    /*
     * Next.js development hot reload can
     * evaluate this module more than once.
     */
  }
}

export default firebaseApp;