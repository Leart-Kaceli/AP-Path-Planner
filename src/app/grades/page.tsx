import Link from "next/link";
import GradeManager from "@/components/grades/GradeManager";

export default function GradesPage() {
  return (
    <main
  id="main-content"
  className="min-h-screen bg-slate-50"
>
      <header className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Grade Tracking
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Your Grades
            </h1>

            <p className="mt-2 text-slate-600">
              Record scores and monitor your
              performance across AP courses.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-fit rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Return to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <GradeManager />
      </div>
    </main>
  );
}