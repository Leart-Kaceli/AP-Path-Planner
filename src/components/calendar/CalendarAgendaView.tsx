import Link from "next/link";

import {
  formatCalendarTime,
} from "@/utils/calendar";

import type {
  CalendarEvent,
} from "@/types/calendar";

type CalendarAgendaViewProps = {
  events: CalendarEvent[];
};

export default function CalendarAgendaView({
  events,
}: CalendarAgendaViewProps) {
  const groupedEvents =
    events.reduce<
      Record<
        string,
        CalendarEvent[]
      >
    >((groups, event) => {
      const existingEvents =
        groups[event.date] ?? [];

      return {
        ...groups,
        [event.date]: [
          ...existingEvents,
          event,
        ],
      };
    }, {});

  const dates =
    Object.keys(
      groupedEvents,
    ).sort();

  if (dates.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          No matching calendar events
        </h3>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Change the filters, search, or
          navigate to another month.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {dates.map((dateKey) => {
        const date =
          new Date(
            `${dateKey}T12:00:00`,
          );

        const dateLabel =
          new Intl.DateTimeFormat(
            "en-US",
            {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            },
          ).format(date);

        return (
          <section
            key={dateKey}
            className="p-5"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {dateLabel}
            </h3>

            <div className="mt-3 grid gap-3">
              {groupedEvents[
                dateKey
              ].map((event) => (
                <Link
                  key={event.id}
                  href={event.href}
                  className={`flex flex-col gap-3 rounded-xl border p-4 transition hover:shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                    event.kind ===
                    "assignment"
                      ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40"
                      : "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40"
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold uppercase tracking-wide ${
                        event.kind ===
                        "assignment"
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-violet-700 dark:text-violet-300"
                      }`}
                    >
                      {event.kind ===
                      "assignment"
                        ? "Assignment"
                        : "Study Session"}
                    </p>

                    <h4
                      className={`mt-1 truncate font-semibold text-slate-900 dark:text-white ${
                        event.completed
                          ? "line-through opacity-60"
                          : ""
                      }`}
                    >
                      {event.title}
                    </h4>

                    <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                      {event.course}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {event.time
                      ? formatCalendarTime(
                          event.time,
                        )
                      : "Due this day"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}