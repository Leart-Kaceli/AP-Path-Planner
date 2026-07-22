import {
  formatCalendarMonth,
} from "@/utils/calendar";

type CalendarHeaderProps = {
  displayedMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

export default function CalendarHeader({
  displayedMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatCalendarMonth(
            displayedMonth,
          )}
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Assignments and study sessions
          scheduled for this month.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onToday}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Today
        </button>

        <button
          type="button"
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          ←
        </button>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          →
        </button>
      </div>
    </div>
  );
}