import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import {
  firestoreDatabase,
} from "@/lib/firebase";

import type {
  Course,
} from "@/types/course";

import type {
  DataService,
} from "@/services/dataService";

function getCourseCollection(
  userId: string,
) {
  return collection(
    firestoreDatabase,
    "users",
    userId,
    "courses",
  );
}

export const firestoreCourseService:
  DataService<Course> = {
    async loadAll(userId) {
      if (!userId) {
        throw new Error(
          "A user ID is required to load Firestore courses.",
        );
      }

      const snapshot =
        await getDocs(
          getCourseCollection(
            userId,
          ),
        );

      return snapshot.docs
        .map((courseDocument) => ({
          id: courseDocument.id,
          ...courseDocument.data(),
        } as Course))
        .sort((first, second) =>
          first.name.localeCompare(
            second.name,
          ),
        );
    },

    async saveAll(
      courses,
      userId,
    ) {
      if (!userId) {
        throw new Error(
          "A user ID is required to save Firestore courses.",
        );
      }

      const courseCollection =
        getCourseCollection(userId);

      const existingSnapshot =
        await getDocs(
          courseCollection,
        );

      const currentIds =
        new Set(
          courses.map(
            (course) => course.id,
          ),
        );

      const batch =
        writeBatch(
          firestoreDatabase,
        );

      existingSnapshot.docs.forEach(
        (courseDocument) => {
          if (
            !currentIds.has(
              courseDocument.id,
            )
          ) {
            batch.delete(
              courseDocument.ref,
            );
          }
        },
      );

      courses.forEach((course) => {
        batch.set(
          doc(
            courseCollection,
            course.id,
          ),
          course,
        );
      });

      await batch.commit();
    },
  };

export async function saveFirestoreCourse(
  userId: string,
  course: Course,
) {
  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "courses",
      course.id,
    ),
    course,
  );
}

export async function deleteFirestoreCourse(
  userId: string,
  courseId: string,
) {
  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "courses",
      courseId,
    ),
  );
}