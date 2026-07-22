import Link from "next/link";

import {
  formatCalendarTime,
  formatDateKey,
  getCalendarEvents,
} from "@/utils/calendar";

import type {
  Assignment,
} from "@/types/assignment";

import type {
  StudySession,
} from "@/types/studySession";

type DashboardCalendarPreviewProps = {
  assignments: Assignment[];
  studySessions: StudySession[];
};

export default function DashboardCalendarPreview({
  assignments,
  studySessions,
}: DashboardCalendarPreviewProps) {
  const todayKey =
    formatDateKey(new Date());

  const upcomingEvents =
    getCalendarEvents(
      assignments,
      studySessions,
    )
      .filter(
        (event) =>
          !event.completed &&
          event.date >= todayKey,
      )
      .slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Calendar Preview
          </h2>

          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Your next assignments and study
            sessions.
          </p>
        </div>

        <Link
          href="/calendar"
          className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Open Calendar
        </Link>
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-700">
          {upcomingEvents.map(
            (event) => {
              const eventDate =
                new Date(
                  `${event.date}T12:00:00`,
                );

              const formattedDate =
                new Intl.DateTimeFormat(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                ).format(eventDate);

              return (
                <Link
                  key={event.id}
                  href={event.href}
                  className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          event.kind ===
                          "assignment"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        }`}
                      >
                        {event.kind ===
                        "assignment"
                          ? "Assignment"
                          : "Study"}
                      </span>

                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="mt-1 truncate font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                      {event.course}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {event.time
                      ? formatCalendarTime(
                          event.time,
                        )
                      : "Due"}
                  </span>
                </Link>
              );
            },
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-950">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            No upcoming events
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Add assignments or study sessions
            to see them here.
          </p>
        </div>
      )}
    </section>
  );
}