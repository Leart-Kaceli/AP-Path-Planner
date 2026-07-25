import {
  restoreAppBackup,
} from "@/utils/backup";

import {
  saveAssignments,
} from "@/services/assignmentService";

import {
  saveCourses,
} from "@/services/courseService";

import {
  saveGrades,
} from "@/services/gradeService";

import {
  saveGradeWeights,
} from "@/services/gradeWeightService";

import {
  saveNotificationState,
} from "@/services/notificationStateService";

import {
  saveProfile,
} from "@/services/profileService";

import {
  saveStudySessions,
} from "@/services/studySessionService";

import type {
  AppBackup,
} from "@/types/backup";

export async function restoreCloudAwareBackup(
  backup: AppBackup,
  userId?: string | null,
) {
  /*
   * Always restore the local cache.
   */
  restoreAppBackup(
    backup,
  );

  if (!userId) {
    return;
  }

  /*
   * Signed-in users also restore their
   * data into Firestore.
   */
  await Promise.all([
    saveCourses(
      backup.courses,
      userId,
    ),

    saveAssignments(
      backup.assignments,
      userId,
    ),

    saveStudySessions(
      backup.studySessions,
      userId,
    ),

    saveGrades(
      backup.grades,
      userId,
    ),

    saveGradeWeights(
      backup.gradeWeights,
      userId,
    ),

    saveProfile(
      backup.profile,
      userId,
    ),

    saveNotificationState(
      {
        dismissedNotificationIds:
          backup
            .dismissedNotificationIds,

        snoozedNotifications:
          backup
            .snoozedNotifications,
      },
      userId,
    ),
  ]);
}