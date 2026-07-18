import type { StudySession } from "@/types/studySession";

export function normalizeStudySession(
  session: StudySession,
): StudySession {
  const hasCompletedAt =
    typeof session.completedAt === "string";

  const estimatedCompletedAt =
    session.completed
      ? `${session.date}T${session.startTime}:00`
      : null;

  return {
    ...session,
    completedAt: hasCompletedAt
      ? session.completedAt
      : estimatedCompletedAt,
  };
}

export type StudySessionTiming =
  | "Completed"
  | "Overdue"
  | "Today"
  | "Upcoming";

export function getStudySessionTiming(
  session: StudySession,
): StudySessionTiming {
  if (session.completed) {
    return "Completed";
  }

  const sessionDateTime = new Date(
    `${session.date}T${session.startTime}:00`,
  );

  const now = new Date();

  if (sessionDateTime < now) {
    return "Overdue";
  }

  const isToday =
    sessionDateTime.getFullYear() ===
      now.getFullYear() &&
    sessionDateTime.getMonth() ===
      now.getMonth() &&
    sessionDateTime.getDate() ===
      now.getDate();

  if (isToday) {
    return "Today";
  }

  return "Upcoming";
}