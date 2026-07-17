import { GRADE_CATEGORIES } from "@/constants/grades";

import type {
  GradeEntry,
  GradeWeights,
} from "@/types/grade";

import {
  calculateCategoryAverage,
  calculatePointAverage,
  calculateWeightedAverage,
  getLetterGrade,
} from "@/utils/grades";

type CourseGradeSummaryCardProps = {
  course: string;
  grades: GradeEntry[];
  weights: GradeWeights;
};

export default function CourseGradeSummaryCard({
  course,
  grades,
  weights,
}: CourseGradeSummaryCardProps) {
  const pointAverage =
    calculatePointAverage(grades);

  const weightedAverage =
    calculateWeightedAverage(
      grades,
      weights,
    );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            {course}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {grades.length} grade entr
            {grades.length === 1 ? "y" : "ies"}
          </p>
        </div>

        {weightedAverage !== null && (
          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-slate-900">
              {weightedAverage}%
            </p>

            <p className="mt-1 text-sm font-semibold text-blue-600">
              {getLetterGrade(
                weightedAverage,
              )}{" "}
              weighted average
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Point average
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {pointAverage === null
              ? "—"
              : `${pointAverage}%`}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Weighted average
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {weightedAverage === null
              ? "—"
              : `${weightedAverage}%`}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {GRADE_CATEGORIES.map((category) => {
          const categoryAverage =
            calculateCategoryAverage(
              grades,
              category,
            );

          return (
            <div
              key={category}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-slate-600">
                {category} ({weights[category]}%)
              </span>

              <span className="font-semibold text-slate-900">
                {categoryAverage === null
                  ? "No grades"
                  : `${categoryAverage}%`}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}