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
  normalizeStudySession,
} from "@/utils/studySessions";

import type {
  StudySession,
} from "@/types/studySession";

import type {
  DataService,
} from "@/services/dataService";

function getStudySessionCollection(
  userId: string,
) {
  return collection(
    firestoreDatabase,
    "users",
    userId,
    "studySessions",
  );
}

export const firestoreStudySessionService:
  DataService<StudySession> = {
    async loadAll(userId) {
      if (!userId) {
        throw new Error(
          "A user ID is required to load Firestore study sessions.",
        );
      }

      const snapshot =
        await getDocs(
          getStudySessionCollection(
            userId,
          ),
        );

      return snapshot.docs
        .map((sessionDocument) =>
          normalizeStudySession({
            id: sessionDocument.id,
            ...sessionDocument.data(),
          } as StudySession),
        )
        .sort((first, second) =>
          `${first.date}T${first.startTime}`.localeCompare(
            `${second.date}T${second.startTime}`,
          ),
        );
    },

    async saveAll(
      sessions,
      userId,
    ) {
      if (!userId) {
        throw new Error(
          "A user ID is required to save Firestore study sessions.",
        );
      }

      const sessionCollection =
        getStudySessionCollection(
          userId,
        );

      const existingSnapshot =
        await getDocs(
          sessionCollection,
        );

      const currentIds =
        new Set(
          sessions.map(
            (session) =>
              session.id,
          ),
        );

      const batch =
        writeBatch(
          firestoreDatabase,
        );

      existingSnapshot.docs.forEach(
        (sessionDocument) => {
          if (
            !currentIds.has(
              sessionDocument.id,
            )
          ) {
            batch.delete(
              sessionDocument.ref,
            );
          }
        },
      );

      sessions.forEach(
        (session) => {
          batch.set(
            doc(
              sessionCollection,
              session.id,
            ),
            session,
          );
        },
      );

      await batch.commit();
    },
  };

export async function saveFirestoreStudySession(
  userId: string,
  session: StudySession,
) {
  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "studySessions",
      session.id,
    ),
    session,
  );
}

export async function deleteFirestoreStudySession(
  userId: string,
  sessionId: string,
) {
  await deleteDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "studySessions",
      sessionId,
    ),
  );
}