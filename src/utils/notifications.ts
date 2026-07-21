import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";

import {
  ASSIGNMENT_STORAGE_KEY,
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import type { Assignment } from "@/types/assignment";
import type {
  AppNotification,
  SnoozedNotification,
} from "@/types/notification";
import type {
  ReminderTiming,
  StudentProfile,
} from "@/types/profile";
import type { StudySession } from "@/types/studySession";

import { normalizeAssignment } from "@/utils/assignments";

import {
  getDifferenceInCalendarDays,
  getStartOfToday,
} from "@/utils/dates";

import { normalizeStudySession } from "@/utils/studySessions";

const VALID_REMINDER_TIMINGS: ReminderTiming[] = [
  "none",
  "same-day",
  "one-day",
  "two-days",
];

function isReminderTiming(
  value: unknown,
): value is ReminderTiming {
  return (
    typeof value === "string" &&
    VALID_REMINDER_TIMINGS.includes(
      value as ReminderTiming,
    )
  );
}

function getReminderDayLimit(
  reminderTiming: ReminderTiming,
) {
  if (reminderTiming === "same-day") {
    return 0;
  }

  if (reminderTiming === "one-day") {
    return 1;
  }

  if (reminderTiming === "two-days") {
    return 2;
  }

  return -1;
}

function getUrgency(
  differenceInDays: number,
) {
  if (differenceInDays < 0) {
    return "overdue" as const;
  }

  if (differenceInDays === 0) {
    return "today" as const;
  }

  return "upcoming" as const;
}

function getAssignmentDescription(
  differenceInDays: number,
) {
  if (differenceInDays < 0) {
    const overdueDays =
      Math.abs(differenceInDays);

    return `Overdue by ${overdueDays} day${
      overdueDays === 1 ? "" : "s"
    }.`;
  }

  if (differenceInDays === 0) {
    return "Due today.";
  }

  if (differenceInDays === 1) {
    return "Due tomorrow.";
  }

  return `Due in ${differenceInDays} days.`;
}

function getSessionDescription(
  differenceInDays: number,
  startTime: string,
) {
  if (differenceInDays < 0) {
    return "This scheduled session is overdue.";
  }

  if (differenceInDays === 0) {
    return `Scheduled today at ${startTime}.`;
  }

  if (differenceInDays === 1) {
    return `Scheduled tomorrow at ${startTime}.`;
  }

  return `Scheduled in ${differenceInDays} days at ${startTime}.`;
}

export function createAssignmentNotifications(
  assignments: Assignment[],
  profile: StudentProfile,
): AppNotification[] {
  if (
    !profile.assignmentRemindersEnabled ||
    profile.assignmentReminderTiming ===
      "none"
  ) {
    return [];
  }

  const reminderDayLimit =
    getReminderDayLimit(
      profile.assignmentReminderTiming,
    );

  const today = getStartOfToday();

  return assignments
    .filter(
      (assignment) =>
        !assignment.completed,
    )
    .map((assignment) => {
      const dueDate = new Date(
        `${assignment.dueDate}T12:00:00`,
      );

      const differenceInDays =
        getDifferenceInCalendarDays(
          dueDate,
          today,
        );

      return {
        assignment,
        differenceInDays,
      };
    })
    .filter(
      ({ differenceInDays }) =>
        differenceInDays <=
        reminderDayLimit,
    )
    .map(
      ({
        assignment,
        differenceInDays,
      }) => ({
        id: `assignment-${assignment.id}-${assignment.dueDate}`,
        kind: "assignment",
        urgency: getUrgency(
          differenceInDays,
        ),
        title: assignment.title,
        description:
          getAssignmentDescription(
            differenceInDays,
          ),
        href: "/assignments",
        eventDateTime:
          `${assignment.dueDate}T12:00:00`,
      }),
    );
}

export function createStudySessionNotifications(
  sessions: StudySession[],
  profile: StudentProfile,
): AppNotification[] {
  if (
    !profile.studyRemindersEnabled ||
    profile.studyReminderTiming === "none"
  ) {
    return [];
  }

  const reminderDayLimit =
    getReminderDayLimit(
      profile.studyReminderTiming,
    );

  const today = getStartOfToday();

  return sessions
    .filter(
      (session) =>
        !session.completed,
    )
    .map((session) => {
      const sessionDateTime = new Date(
        `${session.date}T${session.startTime}:00`,
      );

      const differenceInDays =
        getDifferenceInCalendarDays(
          sessionDateTime,
          today,
        );

      return {
        session,
        differenceInDays,
      };
    })
    .filter(
      ({ differenceInDays }) =>
        differenceInDays <=
        reminderDayLimit,
    )
    .map(
      ({
        session,
        differenceInDays,
      }) => ({
        id: `session-${session.id}-${session.date}-${session.startTime}`,
        kind: "study-session",
        urgency: getUrgency(
          differenceInDays,
        ),
        title: session.topic,
        description:
          getSessionDescription(
            differenceInDays,
            session.startTime,
          ),
        href: "/planner",
        eventDateTime:
          `${session.date}T${session.startTime}:00`,
      }),
    );
}

export function createAppNotifications(
  assignments: Assignment[],
  sessions: StudySession[],
  profile: StudentProfile,
): AppNotification[] {
  const assignmentNotifications =
    createAssignmentNotifications(
      assignments,
      profile,
    );

  const sessionNotifications =
    createStudySessionNotifications(
      sessions,
      profile,
    );

  return [
    ...assignmentNotifications,
    ...sessionNotifications,
  ].sort((notificationA, notificationB) =>
    notificationA.eventDateTime.localeCompare(
      notificationB.eventDateTime,
    ),
  );
}

function readStoredArray<T>(
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

export type LoadedNotificationData = {
  notifications: AppNotification[];
  dismissedNotificationIds: string[];
  snoozedNotifications:
    SnoozedNotification[];

};

export function loadNotificationData():
  LoadedNotificationData {
  const assignments =
    readStoredArray<Assignment>(
      ASSIGNMENT_STORAGE_KEY,
    ).map(normalizeAssignment);

  const studySessions =
    readStoredArray<StudySession>(
      STUDY_SESSION_STORAGE_KEY,
    ).map(normalizeStudySession);

    const storedSnoozed =
  readStoredArray<SnoozedNotification>(
    SNOOZED_NOTIFICATION_STORAGE_KEY,
  ).filter(
    (value) =>
      value &&
      typeof value === "object" &&
      typeof value.notificationId ===
        "string" &&
      typeof value.snoozedUntil ===
        "string",
  );

  const now = new Date();

const activeSnoozedNotifications =
  storedSnoozed.filter((item) => {
    const snoozedUntil = new Date(
      item.snoozedUntil,
    );

    return (
      !Number.isNaN(
        snoozedUntil.getTime(),
      ) &&
      snoozedUntil > now
    );
  });

  const activeSnoozedIds =
  new Set(
    activeSnoozedNotifications.map(
      (item) =>
        item.notificationId,
    ),
  );

  let profile: StudentProfile = {
    ...DEFAULT_STUDENT_PROFILE,
  };

  try {
    const storedProfile =
      localStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (storedProfile) {
      const parsedProfile = JSON.parse(
        storedProfile,
      ) as Partial<StudentProfile> & {
        reminderTiming?: unknown;
      };

      const legacyReminderTiming =
        isReminderTiming(
          parsedProfile.reminderTiming,
        )
          ? parsedProfile.reminderTiming
          : null;

      profile = {
        ...DEFAULT_STUDENT_PROFILE,
        ...parsedProfile,

        assignmentRemindersEnabled:
          parsedProfile
            .assignmentRemindersEnabled ??
          DEFAULT_STUDENT_PROFILE
            .assignmentRemindersEnabled,

        studyRemindersEnabled:
          parsedProfile
            .studyRemindersEnabled ??
          DEFAULT_STUDENT_PROFILE
            .studyRemindersEnabled,

        assignmentReminderTiming:
          isReminderTiming(
            parsedProfile
              .assignmentReminderTiming,
          )
            ? parsedProfile
                .assignmentReminderTiming
            : legacyReminderTiming ??
              DEFAULT_STUDENT_PROFILE
                .assignmentReminderTiming,

        studyReminderTiming:
          isReminderTiming(
            parsedProfile.studyReminderTiming,
          )
            ? parsedProfile
                .studyReminderTiming
            : legacyReminderTiming ??
              DEFAULT_STUDENT_PROFILE
                .studyReminderTiming,
      };
    }
  } catch (error) {
    console.error(
      "Could not load notification profile:",
      error,
    );

    profile = {
      ...DEFAULT_STUDENT_PROFILE,
    };
  }

  const generatedNotifications =
    createAppNotifications(
      assignments,
      studySessions,
      profile,
    );

  const storedDismissed =
    readStoredArray<string>(
      DISMISSED_NOTIFICATION_STORAGE_KEY,
    ).filter(
      (value): value is string =>
        typeof value === "string",
    );

  const generatedNotificationIds =
    new Set(
      generatedNotifications.map(
        (notification) =>
          notification.id,
      ),
    );

  const cleanedDismissedIds =
    storedDismissed.filter((id) =>
      generatedNotificationIds.has(id),
    );

  const visibleNotifications =
  generatedNotifications.filter(
    (notification) =>
      !cleanedDismissedIds.includes(
        notification.id,
      ) &&
      !activeSnoozedIds.has(
        notification.id,
      ),
  );


  return {
  notifications:
    visibleNotifications,

  dismissedNotificationIds:
    cleanedDismissedIds,

  snoozedNotifications:
    activeSnoozedNotifications,
};
}

export function formatNotificationDateTime(
  dateTimeString: string,
) {
  const date = new Date(dateTimeString);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}