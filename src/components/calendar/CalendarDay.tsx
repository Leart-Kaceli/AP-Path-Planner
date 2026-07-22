import CalendarEvent from "@/components/calendar/CalendarEvent";

import {
  formatDateKey,
  isSameMonth,
  isToday,
} from "@/utils/calendar";

import type {
  CalendarEvent as CalendarEventType,
} from "@/types/calendar";

type CalendarDayProps = {
  date: Date;
  displayedMonth: Date;
  events: CalendarEventType[];
};

export default function CalendarDay({
  date,
  displayedMonth,
  events,
}: CalendarDayProps) {
  const dateKey =
    formatDateKey(date);

  const dayEvents =
    events.filter(
      (event) =>
        event.date === dateKey,
    );

  const belongsToDisplayedMonth =
    isSameMonth(
      date,
      displayedMonth,
    );

  const today =
    isToday(date);

  return (
    <div
      className={`min-h-36 border-b border-r border-slate-200 p-2 align-top dark:border-slate-700 ${
        belongsToDisplayedMonth
          ? "bg-white dark:bg-slate-900"
          : "bg-slate-50 dark:bg-slate-950"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
            today
              ? "bg-blue-600 text-white"
              : belongsToDisplayedMonth
                ? "text-slate-900 dark:text-white"
                : "text-slate-400 dark:text-slate-600"
          }`}
        >
          {date.getDate()}
        </span>

        {dayEvents.length > 0 && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {dayEvents.length}
          </span>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {dayEvents.map((event) => (
          <CalendarEvent
            key={event.id}
            event={event}
          />
        ))}
      </div>
    </div>
  );
}