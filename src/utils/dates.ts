import type { AssignmentTiming } from "@/types/dashboard";

const MILLISECONDS_PER_DAY =
  24 * 60 * 60 * 1000;

export function parseDateOnly(dateString: string) {
  return new Date(`${dateString}T00:00:00`);
}

export function startOfToday() {
  const today = new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
}

export function getDaysUntilDue(
  dueDate: string,
) {
  const due = parseDateOnly(dueDate);
  const today = startOfToday();

  return Math.round(
    (due.getTime() - today.getTime()) /
      MILLISECONDS_PER_DAY,
  );
}

export function getAssignmentTiming(
  dueDate: string,
  completed: boolean,
): AssignmentTiming {
  if (completed) {
    return "Completed";
  }

  const daysUntilDue =
    getDaysUntilDue(dueDate);

  if (daysUntilDue < 0) {
    return "Overdue";
  }

  if (daysUntilDue === 0) {
    return "Due Today";
  }

  if (daysUntilDue <= 3) {
    return "Due Soon";
  }

  return "Upcoming";
}

export function formatDate(
  dateString: string,
) {
  const date = parseDateOnly(dateString);

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

export function getStartOfCurrentWeek() {
  const today = startOfToday();

  const dayOfWeek = today.getDay();

  const daysSinceMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1;

  const startOfWeek = new Date(today);

  startOfWeek.setDate(
    today.getDate() - daysSinceMonday,
  );

  return startOfWeek;
}

export function getEndOfCurrentWeek() {
  const endOfWeek =
    getStartOfCurrentWeek();

  endOfWeek.setDate(
    endOfWeek.getDate() + 6,
  );

  endOfWeek.setHours(
    23,
    59,
    59,
    999,
  );

  return endOfWeek;
}

export function isDateInCurrentWeek(
  dateString: string,
) {
  const date = parseDateOnly(dateString);
  const startOfWeek =
    getStartOfCurrentWeek();
  const endOfWeek =
    getEndOfCurrentWeek();

  return (
    date >= startOfWeek &&
    date <= endOfWeek
  );
}

export function isDateTimeInCurrentWeek(
  dateTimeString: string,
) {
  const date = new Date(dateTimeString);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const startOfWeek =
    getStartOfCurrentWeek();

  const endOfWeek =
    getEndOfCurrentWeek();

  return (
    date >= startOfWeek &&
    date <= endOfWeek
  );
}