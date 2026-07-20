import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
  GRADE_STORAGE_KEY,
  GRADE_WEIGHT_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";

import type { AppBackup } from "@/types/backup";
import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";
import type {
  CourseGradeWeights,
  GradeEntry,
} from "@/types/grade";
import type { StudentProfile } from "@/types/profile";
import type { StudySession } from "@/types/studySession";

function readArray<T>(
  storageKey: string,
): T[] {
  const storedValue =
    localStorage.getItem(storageKey);

  if (!storedValue) {
    return [];
  }

  const parsedValue: unknown =
    JSON.parse(storedValue);

  return Array.isArray(parsedValue)
    ? (parsedValue as T[])
    : [];
}

function readObject<T extends object>(
  storageKey: string,
  fallback: T,
): T {
  const storedValue =
    localStorage.getItem(storageKey);

  if (!storedValue) {
    return fallback;
  }

  const parsedValue: unknown =
    JSON.parse(storedValue);

  if (
    !parsedValue ||
    typeof parsedValue !== "object" ||
    Array.isArray(parsedValue)
  ) {
    return fallback;
  }

  return parsedValue as T;
}

export function createAppBackup(): AppBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    courses:
      readArray<Course>(
        COURSE_STORAGE_KEY,
      ),
    assignments:
      readArray<Assignment>(
        ASSIGNMENT_STORAGE_KEY,
      ),
    studySessions:
      readArray<StudySession>(
        STUDY_SESSION_STORAGE_KEY,
      ),
    grades:
      readArray<GradeEntry>(
        GRADE_STORAGE_KEY,
      ),
    gradeWeights:
      readObject<CourseGradeWeights>(
        GRADE_WEIGHT_STORAGE_KEY,
        {},
      ),
    profile: {
      ...DEFAULT_STUDENT_PROFILE,
      ...readObject<
        Partial<StudentProfile>
      >(
        PROFILE_STORAGE_KEY,
        {},
      ),
    },
  };
}

export function downloadAppBackup() {
  const backup = createAppBackup();

  const backupJson = JSON.stringify(
    backup,
    null,
    2,
  );

  const blob = new Blob(
    [backupJson],
    {
      type: "application/json",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  const dateText =
    new Date()
      .toISOString()
      .slice(0, 10);

  anchor.href = url;
  anchor.download =
    `ap-path-planner-backup-${dateText}.json`;

  anchor.click();

  URL.revokeObjectURL(url);
}

export function restoreAppBackup(
  backup: AppBackup,
) {
  localStorage.setItem(
    COURSE_STORAGE_KEY,
    JSON.stringify(backup.courses),
  );

  localStorage.setItem(
    ASSIGNMENT_STORAGE_KEY,
    JSON.stringify(
      backup.assignments,
    ),
  );

  localStorage.setItem(
    STUDY_SESSION_STORAGE_KEY,
    JSON.stringify(
      backup.studySessions,
    ),
  );

  localStorage.setItem(
    GRADE_STORAGE_KEY,
    JSON.stringify(backup.grades),
  );

  localStorage.setItem(
    GRADE_WEIGHT_STORAGE_KEY,
    JSON.stringify(
      backup.gradeWeights,
    ),
  );

  localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify(backup.profile),
  );
}

export function isValidAppBackup(
  value: unknown,
): value is AppBackup {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const possibleBackup =
    value as Partial<AppBackup>;

  return (
    possibleBackup.version === 1 &&
    Array.isArray(
      possibleBackup.courses,
    ) &&
    Array.isArray(
      possibleBackup.assignments,
    ) &&
    Array.isArray(
      possibleBackup.studySessions,
    ) &&
    Array.isArray(
      possibleBackup.grades,
    ) &&
    Boolean(
      possibleBackup.gradeWeights &&
        typeof possibleBackup.gradeWeights ===
          "object",
    ) &&
    Boolean(
      possibleBackup.profile &&
        typeof possibleBackup.profile ===
          "object",
    )
  );
}