import Link from "next/link";

export default function CoursesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-slate-900">
        Track Your Grades
      </h1>

      <p className="mt-4 text-lg text-slate-600">
        Grade tracking features will be added soon.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Return to Dashboard
      </Link>
    </main>
  );
}