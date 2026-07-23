import type {
  CalendarView,
} from "@/types/calendar";

type CalendarViewControlsProps = {
  view: CalendarView;
  onViewChange: (
    view: CalendarView,
  ) => void;
};

const viewOptions: {
  value: CalendarView;
  label: string;
}[] = [
  {
    value: "month",
    label: "Month",
  },
  {
    value: "week",
    label: "Week",
  },
  {
    value: "agenda",
    label: "Agenda",
  },
];

export default function CalendarViewControls({
  view,
  onViewChange,
}: CalendarViewControlsProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
      aria-label="Calendar view"
    >
      {viewOptions.map((option) => {
        const isSelected =
          view === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onViewChange(
                option.value,
              )
            }
            aria-pressed={isSelected}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              isSelected
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}