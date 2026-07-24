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
  GradeEntry,
} from "@/types/grade";

import type {
  DataService,
} from "@/services/dataService";

function getGradeCollection(
  userId: string,
) {
  return collection(
    firestoreDatabase,
    "users",
    userId,
    "grades",
  );
}

export const firestoreGradeService:
  DataService<GradeEntry> = {
    async loadAll(userId) {
      if (!userId) {
        throw new Error(
          "A user ID is required to load Firestore grades.",
        );
      }

      const snapshot =
        await getDocs(
          getGradeCollection(userId),
        );

      return snapshot.docs
        .map(
          (gradeDocument) => ({
            id: gradeDocument.id,
            ...gradeDocument.data(),
          }) as GradeEntry,
        )
        .sort((first, second) =>
          second.date.localeCompare(
            first.date,
          ),
        );
    },

    async saveAll(
      grades,
      userId,
    ) {
      if (!userId) {
        throw new Error(
          "A user ID is required to save Firestore grades.",
        );
      }

      const gradeCollection =
        getGradeCollection(userId);

      const existingSnapshot =
        await getDocs(
          gradeCollection,
        );

      const currentIds =
        new Set(
          grades.map(
            (grade) =>
              grade.id,
          ),
        );

      const batch =
        writeBatch(
          firestoreDatabase,
        );

      existingSnapshot.docs.forEach(
        (gradeDocument) => {
          if (
            !currentIds.has(
              gradeDocument.id,
            )
          ) {
            batch.delete(
              gradeDocument.ref,
            );
          }
        },
      );

      grades.forEach((grade) => {
        batch.set(
          doc(
            gradeCollection,
            grade.id,
          ),
          grade,
        );
      });

      await batch.commit();
    },
  };

export async function saveFirestoreGrade(
  userId: string,
  grade: GradeEntry,
) {
  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "grades",
      grade.id,
    ),
    grade,
  );
}

export async function deleteFirestoreGrade(
  userId: string,
  gradeId: string,
) {
  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "grades",
      gradeId,
    ),
  );
}