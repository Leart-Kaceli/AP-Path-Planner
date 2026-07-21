import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  GRADE_STORAGE_KEY,
  GRADE_WEIGHT_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
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
import type {
  SnoozedNotification,
} from "@/types/notification";
import type { StudentProfile } from "@/types/profile";
import type { StudySession } from "@/types/studySession";

function readArray<T>(
  storageKey: string,
): T[] {
  try {
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
  } catch {
    return [];
  }
}

function readObject<T extends object>(
  storageKey: string,
  fallback: T,
): T {
  try {
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
  } catch {
    return fallback;
  }
}

export function createAppBackup(): AppBackup {
  return {
    version: 3,
    exportedAt: new Date().toISOString(),

    courses: readArray<Course>(
      COURSE_STORAGE_KEY,
    ),

    assignments: readArray<Assignment>(
      ASSIGNMENT_STORAGE_KEY,
    ),

    studySessions:
      readArray<StudySession>(
        STUDY_SESSION_STORAGE_KEY,
      ),

    grades: readArray<GradeEntry>(
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

    dismissedNotificationIds:
      readArray<string>(
        DISMISSED_NOTIFICATION_STORAGE_KEY,
      ),

    snoozedNotifications:
      readArray<SnoozedNotification>(
        SNOOZED_NOTIFICATION_STORAGE_KEY,
      ),

    sentBrowserNotificationIds:
      readArray<string>(
        SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
      ),
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

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

type LegacyAppBackupV1 = {
  version: 1;
  exportedAt: string;
  courses: AppBackup["courses"];
  assignments:
    AppBackup["assignments"];
  studySessions:
    AppBackup["studySessions"];
  grades: AppBackup["grades"];
  gradeWeights:
    AppBackup["gradeWeights"];
  profile: AppBackup["profile"];
};

type LegacyAppBackupV2 = {
  version: 2;
  exportedAt: string;
  courses: AppBackup["courses"];
  assignments:
    AppBackup["assignments"];
  studySessions:
    AppBackup["studySessions"];
  grades: AppBackup["grades"];
  gradeWeights:
    AppBackup["gradeWeights"];
  profile: AppBackup["profile"];
  dismissedNotificationIds:
    string[];
};

export function migrateAppBackup(
  value: unknown,
): AppBackup | null {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  const possibleBackup =
    value as Record<string, unknown>;

  if (possibleBackup.version === 3) {
    return value as AppBackup;
  }

  if (possibleBackup.version === 2) {
    const legacyBackup =
      value as LegacyAppBackupV2;

    return {
      ...legacyBackup,
      version: 3,
      snoozedNotifications: [],
      sentBrowserNotificationIds: [],
    };
  }

  if (possibleBackup.version === 1) {
    const legacyBackup =
      value as LegacyAppBackupV1;

    return {
      ...legacyBackup,
      version: 3,
      dismissedNotificationIds: [],
      snoozedNotifications: [],
      sentBrowserNotificationIds: [],
    };
  }

  return null;
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

  localStorage.setItem(
    DISMISSED_NOTIFICATION_STORAGE_KEY,
    JSON.stringify(
      backup.dismissedNotificationIds,
    ),
  );

  localStorage.setItem(
    SNOOZED_NOTIFICATION_STORAGE_KEY,
    JSON.stringify(
      backup.snoozedNotifications,
    ),
  );

  localStorage.setItem(
    SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
    JSON.stringify(
      backup.sentBrowserNotificationIds,
    ),
  );
}

export function isValidAppBackup(
  value: unknown,
): value is AppBackup {
  const migratedBackup =
    migrateAppBackup(value);

  if (!migratedBackup) {
    return false;
  }

  return (
    Array.isArray(
      migratedBackup.courses,
    ) &&
    Array.isArray(
      migratedBackup.assignments,
    ) &&
    Array.isArray(
      migratedBackup.studySessions,
    ) &&
    Array.isArray(
      migratedBackup.grades,
    ) &&
    Boolean(
      migratedBackup.gradeWeights &&
        typeof migratedBackup
          .gradeWeights === "object" &&
        !Array.isArray(
          migratedBackup.gradeWeights,
        ),
    ) &&
    Boolean(
      migratedBackup.profile &&
        typeof migratedBackup.profile ===
          "object" &&
        !Array.isArray(
          migratedBackup.profile,
        ),
    ) &&
    Array.isArray(
      migratedBackup
        .dismissedNotificationIds,
    ) &&
    Array.isArray(
      migratedBackup
        .snoozedNotifications,
    ) &&
    Array.isArray(
      migratedBackup
        .sentBrowserNotificationIds,
    )
  );
}