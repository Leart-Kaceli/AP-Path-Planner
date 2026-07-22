import Link from "next/link";

import {
  formatCalendarTime,
} from "@/utils/calendar";

import type {
  CalendarEvent,
} from "@/types/calendar";

type SelectedDayPanelProps = {
  selectedDate: Date;
  events: CalendarEvent[];
};

export default function SelectedDayPanel({
  selectedDate,
  events,
}: SelectedDayPanelProps) {
  const formattedDate =
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    ).format(selectedDate);

  const assignmentCount =
    events.filter(
      (event) =>
        event.kind === "assignment",
    ).length;

  const studySessionCount =
    events.filter(
      (event) =>
        event.kind ===
        "study-session",
    ).length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Selected day
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {formattedDate}
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {events.length === 0
              ? "No events scheduled."
              : `${events.length} event${
                  events.length === 1
                    ? ""
                    : "s"
                } scheduled.`}
          </p>
        </div>

        {events.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {assignmentCount} assignment
              {assignmentCount === 1
                ? ""
                : "s"}
            </span>

            <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {studySessionCount} study session
              {studySessionCount === 1
                ? ""
                : "s"}
            </span>
          </div>
        )}
      </div>

      {events.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {events.map((event) => {
            const kindLabel =
              event.kind ===
              "assignment"
                ? "Assignment"
                : "Study Session";

            return (
              <article
                key={event.id}
                className={`rounded-xl border p-4 ${
                  event.kind ===
                  "assignment"
                    ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40"
                    : "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wide ${
                          event.kind ===
                          "assignment"
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-violet-700 dark:text-violet-300"
                        }`}
                      >
                        {kindLabel}
                      </span>

                      {event.completed && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Completed
                        </span>
                      )}
                    </div>

                    <h3
                      className={`mt-1 font-bold text-slate-900 dark:text-white ${
                        event.completed
                          ? "line-through opacity-70"
                          : ""
                      }`}
                    >
                      {event.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {event.course}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {event.time
                        ? formatCalendarTime(
                            event.time,
                          )
                        : "Due this day"}
                    </p>
                  </div>

                  <Link
                    href={event.href}
                    className="inline-flex w-fit items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Edit
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-950">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Nothing scheduled
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Select another calendar day or
            add a new assignment or study
            session.
          </p>
        </div>
      )}
    </section>
  );
}