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
  selectedDateKey: string;
  onSelectDate: (
    date: Date,
  ) => void;
  onShowAllEvents: (
    date: Date,
  ) => void;
};

export default function CalendarDay({
  date,
  displayedMonth,
  events,
  selectedDateKey,
  onSelectDate,
  onShowAllEvents,
}: CalendarDayProps) {
  const dateKey =
    formatDateKey(date);

    const isSelected =
  dateKey === selectedDateKey;

  const dayEvents =
    events.filter(
      (event) =>
        event.date === dateKey,
    );

    const visibleEvents =
  dayEvents.slice(0, 3);

const hiddenEventCount =
  Math.max(
    dayEvents.length -
      visibleEvents.length,
    0,
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
  className={`min-h-36 border-b border-r border-slate-200 p-2 align-top transition dark:border-slate-700 ${
    isSelected
      ? "ring-2 ring-inset ring-blue-500"
      : ""
  } ${
        belongsToDisplayedMonth
          ? "bg-white dark:bg-slate-900"
          : "bg-slate-50 dark:bg-slate-950"
      }`}
    >
      <div className="flex items-center justify-between">
        <button
  type="button"
  onClick={() =>
    onSelectDate(date)
  }
  aria-label={`Select ${date.toLocaleDateString()}`}
  aria-pressed={isSelected}
  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition hover:ring-2 hover:ring-blue-300 ${
            today
              ? "bg-blue-600 text-white"
              : belongsToDisplayedMonth
                ? "text-slate-900 dark:text-white"
                : "text-slate-400 dark:text-slate-600"
          }`}
        >
          {date.getDate()}
        </button>

        {dayEvents.length > 0 && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {dayEvents.length}
          </span>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {visibleEvents.map((event) => (
          <CalendarEvent
            key={event.id}
            event={event}
          />
        ))}
        {hiddenEventCount > 0 && (
  <button
    type="button"
    onClick={() =>
      onShowAllEvents(date)
    }
    className="w-full rounded-md border border-dashed border-slate-300 px-2 py-1.5 text-left text-xs font-semibold text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
  >
    +{hiddenEventCount} more
  </button>
)}
      </div>
    </div>
  );
}