import type { Assignment } from "@/types/assignment";
import type { AppNotification } from "@/types/notification";
import type {
  ReminderTiming,
  StudentProfile,
} from "@/types/profile";
import type { StudySession } from "@/types/studySession";

import {
  getDifferenceInCalendarDays,
  getStartOfToday,
} from "@/utils/dates";

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
    profile.reminderTiming === "none"
  ) {
    return [];
  }

  const reminderDayLimit =
    getReminderDayLimit(
      profile.reminderTiming,
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
    profile.reminderTiming === "none"
  ) {
    return [];
  }

  const reminderDayLimit =
    getReminderDayLimit(
      profile.reminderTiming,
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
) {
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