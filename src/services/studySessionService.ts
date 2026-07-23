import {
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import {
  loadStoredArray,
  saveStoredArray,
} from "@/services/localStorageService";

import {
  normalizeStudySession,
} from "@/utils/studySessions";

import type {
  StudySession,
} from "@/types/studySession";

export function loadStudySessions() {
  return loadStoredArray<StudySession>(
    STUDY_SESSION_STORAGE_KEY,
  ).map(normalizeStudySession);
}

export function saveStudySessions(
  sessions: StudySession[],
) {
  saveStoredArray(
    STUDY_SESSION_STORAGE_KEY,
    sessions,
  );
}