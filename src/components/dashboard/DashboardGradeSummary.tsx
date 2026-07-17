import Link from "next/link";

import { getLetterGrade } from "@/utils/grades";

type CourseGradeSummary = {
  course: string;
  weightedAverage: number;
};

type DashboardGradeSummaryProps = {
  pointAverage: number | null;
  weightedAverage: number | null;
  courseSummaries: CourseGradeSummary[];
};

export default function DashboardGradeSummary({
  pointAverage,
  weightedAverage,
  courseSummaries,
}: DashboardGradeSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Grade Summary
          </h2>

          <p className="mt-1 text-slate-600">
            Current averages from your saved
            grade entries.
          </p>
        </div>

        <Link
          href="/grades"
          className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Manage Grades
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <AverageCard
          label="Point Average"
          average={pointAverage}
        />

        <AverageCard
          label="Weighted Average"
          average={weightedAverage}
        />
      </div>

      {courseSummaries.length > 0 ? (
        <div className="mt-6 divide-y divide-slate-200">
          {courseSummaries
            .slice(0, 4)
            .map((summary) => (
              <div
                key={summary.course}
                className="flex items-center justify-between gap-4 py-4"
              >
                <span className="font-medium text-slate-700">
                  {summary.course}
                </span>

                <span className="font-bold text-slate-900">
                  {summary.weightedAverage}% ·{" "}
                  {getLetterGrade(
                    summary.weightedAverage,
                  )}
                </span>
              </div>
            ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
          <p className="font-semibold text-slate-900">
            No grade information yet
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Add grades to begin tracking your
            averages.
          </p>

          <Link
            href="/grades"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add a Grade
          </Link>
        </div>
      )}
    </section>
  );
}

type AverageCardProps = {
  label: string;
  average: number | null;
};

function AverageCard({
  label,
  average,
}: AverageCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {average === null
          ? "—"
          : `${average}%`}
      </p>

      <p className="mt-1 text-sm font-semibold text-blue-600">
        {average === null
          ? "No grades"
          : getLetterGrade(average)}
      </p>
    </div>
  );
}