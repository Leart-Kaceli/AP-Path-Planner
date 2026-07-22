import Link from "next/link";

import {
  formatCalendarTime,
} from "@/utils/calendar";

import type {
  CalendarEvent as CalendarEventType,
} from "@/types/calendar";

type CalendarEventProps = {
  event: CalendarEventType;
};

export default function CalendarEvent({
  event,
}: CalendarEventProps) {
  const kindLabel =
    event.kind === "assignment"
      ? "Assignment"
      : "Study";

  return (
    <Link
      href={event.href}
      title={`${kindLabel}: ${event.title}`}
      className={`block rounded-md border px-2 py-1.5 text-xs transition hover:shadow-sm ${
        event.kind === "assignment"
          ? "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200"
          : "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200"
      } ${
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
        {event.time
          ? formatCalendarTime(
              event.time,
            )
          : "Due this day"}
      </span>
    </Link>
  );
}