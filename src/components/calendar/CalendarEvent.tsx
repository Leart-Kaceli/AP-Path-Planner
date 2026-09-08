import Link from "next/link";

import type {
  CalendarEvent as CalendarEventType,
} from "@/types/calendar";

import {
  formatCalendarTime,
} from "@/utils/calendar";

import {
  getCourseColorStyles,
} from "@/utils/courseColors";

type CalendarEventProps = {
  event:
    CalendarEventType;
};

export default function CalendarEvent({
  event,
}: CalendarEventProps) {
  const kindLabel =
    event.kind ===
    "assignment"
      ? "Assignment"
      : "Study";

  const courseColors =
    getCourseColorStyles(
      event.course,
    );

  const eventStyles =
    event.kind ===
    "assignment"
      ? courseColors.calendarEvent
      : "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200";

  return (
    <Link
      href={event.href}
      title={`${kindLabel}: ${event.title}`}
      className={`block rounded-md border px-2 py-1.5 text-xs transition hover:shadow-sm ${eventStyles} ${
        event.completed
          ? "opacity-60"
          : ""
      }`}
    >
      <span
        className={`block truncate font-semibold ${
          event.completed
            ? "line-through"
            : ""
        }`}
      >
        {event.title}
      </span>

      <span className="mt-0.5 block truncate opacity-80">
        {event.course}
      </span>

      <span className="mt-0.5 block truncate opacity-80">
        {event.time
          ? formatCalendarTime(
              event.time,
            )
          : "Due this day"}
      </span>
    </Link>
  );
}