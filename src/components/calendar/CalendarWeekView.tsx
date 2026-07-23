import CalendarEvent from "@/components/calendar/CalendarEvent";

import {
  formatDateKey,
  getWeekDates,
  isToday,
} from "@/utils/calendar";

import type {
  CalendarEvent as CalendarEventType,
} from "@/types/calendar";

type CalendarWeekViewProps = {
  selectedDate: Date;
  events: CalendarEventType[];
  onSelectDate: (
    date: Date,
  ) => void;
};

export default function CalendarWeekView({
  selectedDate,
  events,
  onSelectDate,
}: CalendarWeekViewProps) {
  const selectedDateKey =
    formatDateKey(selectedDate);

  const weekDates =
    getWeekDates(selectedDate);

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[900px] grid-cols-7 border-l border-t border-slate-200 dark:border-slate-700">
        {weekDates.map((date) => {
          const dateKey =
            formatDateKey(date);

          const dayEvents =
            events.filter(
              (event) =>
                event.date === dateKey,
            );

          const isSelected =
            dateKey ===
            selectedDateKey;

          const today =
            isToday(date);

          return (
            <section
              key={dateKey}
              className={`min-h-[420px] border-b border-r border-slate-200 p-3 dark:border-slate-700 ${
                isSelected
                  ? "bg-blue-50 ring-2 ring-inset ring-blue-500 dark:bg-blue-950/30"
                  : "bg-white dark:bg-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  onSelectDate(date)
                }
                aria-pressed={
                  isSelected
                }
                className="w-full rounded-lg p-2 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {new Intl.DateTimeFormat(
                    "en-US",
                    {
                      weekday:
                        "short",
                    },
                  ).format(date)}
                </span>

                <span
                  className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                    today
                      ? "bg-blue-600 text-white"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {date.getDate()}
                </span>
              </button>

              <div className="mt-3 space-y-2">
                {dayEvents.map(
                  (event) => (
                    <CalendarEvent
                      key={event.id}
                      event={event}
                    />
                  ),
                )}

                {dayEvents.length ===
                  0 && (
                  <p className="px-2 py-3 text-xs text-slate-400">
                    No events
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}