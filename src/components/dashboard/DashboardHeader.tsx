export default function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Monday, July 13
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, Leart
        </h1>

        <p className="mt-2 text-slate-600">
          Here is an overview of your AP coursework and study progress.
        </p>
      </div>

      <button
        type="button"
        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Add Assignment
      </button>
    </header>
  );
}