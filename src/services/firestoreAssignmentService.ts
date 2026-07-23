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

import {
  normalizeAssignment,
} from "@/utils/assignments";

import type {
  Assignment,
} from "@/types/assignment";

import type {
  DataService,
} from "@/services/dataService";

function getAssignmentCollection(
  userId: string,
) {
  return collection(
    firestoreDatabase,
    "users",
    userId,
    "assignments",
  );
}

export const firestoreAssignmentService:
  DataService<Assignment> = {
    async loadAll(userId) {
      if (!userId) {
        throw new Error(
          "A user ID is required to load Firestore assignments.",
        );
      }

      const snapshot =
        await getDocs(
          getAssignmentCollection(
            userId,
          ),
        );

      return snapshot.docs
        .map((assignmentDocument) =>
          normalizeAssignment({
            id: assignmentDocument.id,
            ...assignmentDocument.data(),
          } as Assignment),
        )
        .sort((first, second) =>
          first.dueDate.localeCompare(
            second.dueDate,
          ),
        );
    },

    async saveAll(
      assignments,
      userId,
    ) {
      if (!userId) {
        throw new Error(
          "A user ID is required to save Firestore assignments.",
        );
      }

      const assignmentCollection =
        getAssignmentCollection(
          userId,
        );

      const existingSnapshot =
        await getDocs(
          assignmentCollection,
        );

      const currentIds =
        new Set(
          assignments.map(
            (assignment) =>
              assignment.id,
          ),
        );

      const batch =
        writeBatch(
          firestoreDatabase,
        );

      existingSnapshot.docs.forEach(
        (assignmentDocument) => {
          if (
            !currentIds.has(
              assignmentDocument.id,
            )
          ) {
            batch.delete(
              assignmentDocument.ref,
            );
          }
        },
      );

      assignments.forEach(
        (assignment) => {
          const assignmentReference =
            doc(
              assignmentCollection,
              assignment.id,
            );

          batch.set(
            assignmentReference,
            assignment,
          );
        },
      );

      await batch.commit();
    },
  };

export async function deleteFirestoreAssignment(
  userId: string,
  assignmentId: string,
) {
  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "assignments",
      assignmentId,
    ),
  );
}

export async function saveFirestoreAssignment(
  userId: string,
  assignment: Assignment,
) {
  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "assignments",
      assignment.id,
    ),
    assignment,
  );
}