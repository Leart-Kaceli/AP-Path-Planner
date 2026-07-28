import {
  firebaseApp,
} from "@/lib/firebase";

let hasInitializedPerformance =
  false;

export async function initializeFirebasePerformance() {
  if (
    typeof window ===
      "undefined" ||
    process.env.NODE_ENV !==
      "production" ||
    hasInitializedPerformance
  ) {
    return;
  }

  try {
    const {
      getPerformance,
    } = await import(
      "firebase/performance"
    );

    getPerformance(
      firebaseApp,
    );

    hasInitializedPerformance =
      true;
  } catch (error) {
    console.warn(
      "Firebase Performance Monitoring could not be initialized:",
      error,
    );
  }
}