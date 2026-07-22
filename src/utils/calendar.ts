import type {
  Assignment,
} from "@/types/assignment";

import type {
  CalendarEvent,
} from "@/types/calendar";

import type {
  StudySession,
} from "@/types/studySession";

export function getCalendarEvents(
  assignments: Assignment[],
  studySessions: StudySession[],
): CalendarEvent[] {
  const assignmentEvents =
    assignments.map(
      (assignment): CalendarEvent => ({
        id: `assignment-${assignment.id}`,
        kind: "assignment",
        title: assignment.title,
        course: assignment.course,
        date: assignment.dueDate,
        time: null,
        completed:
          assignment.completed,
        href: `/assignments?edit=${encodeURIComponent(
  assignment.id,
)}`,
      }),
    );

  const studySessionEvents =
    studySessions.map(
      (session): CalendarEvent => ({
        id: `study-session-${session.id}`,
        kind: "study-session",
        title: session.topic,
        course: session.course,
        date: session.date,
        time: session.startTime,
        completed:
          session.completed,
        href: `/planner?edit=${encodeURIComponent(
  session.id,
)}`,
      }),
    );

  return [
    ...assignmentEvents,
    ...studySessionEvents,
  ].sort((eventA, eventB) => {
    const dateComparison =
      eventA.date.localeCompare(
        eventB.date,
      );

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return (
      eventA.time ?? "23:59"
    ).localeCompare(
      eventB.time ?? "23:59",
    );
  });
}

export function getMonthGridDates(
  month: Date,
) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDayOfMonth =
    new Date(year, monthIndex, 1);

  const gridStartDate =
    new Date(firstDayOfMonth);

  gridStartDate.setDate(
    firstDayOfMonth.getDate() -
      firstDayOfMonth.getDay(),
  );

  return Array.from(
    {
      length: 42,
    },
    (_, index) => {
      const date =
        new Date(gridStartDate);

      date.setDate(
        gridStartDate.getDate() +
          index,
      );

      return date;
    },
  );
}

export function formatDateKey(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isSameMonth(
  date: Date,
  month: Date,
) {
  return (
    date.getFullYear() ===
      month.getFullYear() &&
    date.getMonth() ===
      month.getMonth()
  );
}

export function isToday(
  date: Date,
) {
  const today = new Date();

  return (
    date.getFullYear() ===
      today.getFullYear() &&
    date.getMonth() ===
      today.getMonth() &&
    date.getDate() ===
      today.getDate()
  );
}

export function formatCalendarMonth(
  month: Date,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  ).format(month);
}

export function formatCalendarTime(
  time: string,
) {
  const [hourString, minuteString] =
    time.split(":");

  const hour =
    Number(hourString);

  const minute =
    Number(minuteString);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return time;
  }

  const date = new Date();

  date.setHours(
    hour,
    minute,
    0,
    0,
  );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}