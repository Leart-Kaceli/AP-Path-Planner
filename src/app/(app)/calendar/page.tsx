import Calendar from "@/components/calendar/Calendar";

export default function CalendarPage() {
  return (
    <main className="min-w-0 flex-1 bg-slate-50 p-5 dark:bg-slate-950 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Calendar
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Review assignment deadlines and
            scheduled study sessions in one
            place.
          </p>
        </div>

        <Calendar />
      </div>
    </main>
  );
}