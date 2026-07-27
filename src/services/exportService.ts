import {
  loadAssignments,
} from "@/services/assignmentService";

import {
  loadCourses,
} from "@/services/courseService";

import {
  loadGrades,
} from "@/services/gradeService";

import {
  loadGradeWeights,
} from "@/services/gradeWeightService";

import {
  loadProfile,
} from "@/services/profileService";

import {
  loadStudySessions,
} from "@/services/studySessionService";

import type {
  AppBackup,
} from "@/types/backup";

export async function createCloudAwareBackup(
  userId?: string | null,
): Promise<AppBackup> {
  const [
    courses,
    assignments,
    studySessions,
    grades,
    gradeWeights,
    profile,
  ] = await Promise.all([
    loadCourses(userId),
    loadAssignments(userId),
    loadStudySessions(userId),
    loadGrades(userId),
    loadGradeWeights(userId),
    loadProfile(userId),
  ]);

  return {
    version: 4,
    exportedAt:
      new Date().toISOString(),
    courses,
    assignments,
    studySessions,
    grades,
    gradeWeights,
    profile,

    dismissedNotificationIds:
      [],

    snoozedNotifications:
      [],

    sentBrowserNotificationIds:
      [],
  };
}

export function downloadBackupObject(
  backup: AppBackup,
) {
  const backupJson =
    JSON.stringify(
      backup,
      null,
      2,
    );

  const blob =
    new Blob(
      [backupJson],
      {
        type: "application/json",
      },
    );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;

  anchor.download =
    `ap-path-planner-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

  document.body.appendChild(
    anchor,
  );

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}