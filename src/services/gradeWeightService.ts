import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  firestoreDatabase,
} from "@/lib/firebase";

import {
  GRADE_WEIGHT_STORAGE_KEY,
} from "@/constants/storage";

import type {
  CourseGradeWeights,
} from "@/types/grade";

function loadLocalGradeWeights():
  CourseGradeWeights {
  try {
    const storedWeights =
      localStorage.getItem(
        GRADE_WEIGHT_STORAGE_KEY,
      );

    if (!storedWeights) {
      return {};
    }

    const parsed: unknown =
      JSON.parse(storedWeights);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return cleanGradeWeights(
      parsed as CourseGradeWeights,
    );
  } catch {
    return {};
  }
}

function saveLocalGradeWeights(
  weights: CourseGradeWeights,
) {
  localStorage.setItem(
    GRADE_WEIGHT_STORAGE_KEY,
    JSON.stringify(weights),
  );
}

/*
 * Removes invalid blank course keys
 * before sending the object to Firestore.
 */
function cleanGradeWeights(
  weights: CourseGradeWeights,
): CourseGradeWeights {
  return Object.fromEntries(
    Object.entries(weights).filter(
      ([courseName]) =>
        courseName.trim().length > 0,
    ),
  ) as CourseGradeWeights;
}

export async function loadGradeWeights(
  userId?: string | null,
) {
  if (!userId) {
    return loadLocalGradeWeights();
  }

  const reference =
    doc(
      firestoreDatabase,
      "users",
      userId,
      "settings",
      "gradeWeights",
    );

  const snapshot =
    await getDoc(reference);

  if (snapshot.exists()) {
    const data =
      snapshot.data();

    if (
      data.weights &&
      typeof data.weights ===
        "object" &&
      !Array.isArray(
        data.weights,
      )
    ) {
      return cleanGradeWeights(
        data.weights as
          CourseGradeWeights,
      );
    }
  }

  const localWeights =
    loadLocalGradeWeights();

  const cleanedWeights =
    cleanGradeWeights(
      localWeights,
    );

  if (
    Object.keys(
      cleanedWeights,
    ).length > 0
  ) {
    await setDoc(
      reference,
      {
        weights:
          cleanedWeights,
      },
    );
  }

  return cleanedWeights;
}

export async function saveGradeWeights(
  weights: CourseGradeWeights,
  userId?: string | null,
) {
  const cleanedWeights =
    cleanGradeWeights(
      weights,
    );

  saveLocalGradeWeights(
    cleanedWeights,
  );

  if (!userId) {
    return;
  }

  /*
   * Do not create a Firestore settings
   * document when there are no actual
   * course weights yet.
   */
  if (
    Object.keys(
      cleanedWeights,
    ).length === 0
  ) {
    return;
  }

  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "settings",
      "gradeWeights",
    ),
    {
      weights:
        cleanedWeights,
    },
  );
}