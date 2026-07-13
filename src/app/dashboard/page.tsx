import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-slate-900">
        Dashboard Coming Soon
      </h1>

      <p className="mt-4 max-w-lg text-lg text-slate-600">
        This dashboard will eventually display courses, assignments, study
        progress, and upcoming deadlines.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Return Home
      </Link>
    </main>
  );
}