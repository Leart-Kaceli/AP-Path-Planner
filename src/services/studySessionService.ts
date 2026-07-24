import {
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import {
  loadStoredArray,
  saveStoredArray,
} from "@/services/localStorageService";

import {
  deleteFirestoreStudySession,
  firestoreStudySessionService,
  saveFirestoreStudySession,
} from "@/services/firestoreStudySessionService";

import {
  normalizeStudySession,
} from "@/utils/studySessions";

import type {
  StudySession,
} from "@/types/studySession";

import type {
  DataService,
} from "@/services/dataService";

export const localStudySessionService:
  DataService<StudySession> = {
    async loadAll() {
      return loadStoredArray<StudySession>(
        STUDY_SESSION_STORAGE_KEY,
      ).map(normalizeStudySession);
    },

    async saveAll(sessions) {
      saveStoredArray(
        STUDY_SESSION_STORAGE_KEY,
        sessions,
      );
    },
  };

function getStudySessionService(
  userId?: string | null,
) {
  return userId
    ? firestoreStudySessionService
    : localStudySessionService;
}

export async function loadStudySessions(
  userId?: string | null,
) {
  const service =
    getStudySessionService(userId);

  const sessions =
    await service.loadAll(userId);

  if (
    userId &&
    sessions.length === 0
  ) {
    const localSessions =
      await localStudySessionService.loadAll();

    if (localSessions.length > 0) {
      await firestoreStudySessionService.saveAll(
        localSessions,
        userId,
      );

      return localSessions;
    }
  }

  return sessions;
}

export async function saveStudySessions(
  sessions: StudySession[],
  userId?: string | null,
) {
  const service =
    getStudySessionService(userId);

  await service.saveAll(
    sessions,
    userId,
  );
}

export async function saveOneStudySession(
  session: StudySession,
  userId?: string | null,
) {
  if (!userId) {
    return;
  }

  await saveFirestoreStudySession(
    userId,
    session,
  );
}

export async function deleteOneStudySession(
  sessionId: string,
  userId?: string | null,
) {
  if (!userId) {
    return;
  }

  await deleteFirestoreStudySession(
    userId,
    sessionId,
  );
}