"use client";

import { useState } from "react";

import {
  DEFAULT_GRADE_WEIGHTS,
  GRADE_CATEGORIES,
} from "@/constants/grades";

import type {
  CourseGradeWeights,
  GradeCategory,
} from "@/types/grade";

type GradeWeightEditorProps = {
  courseNames: string[];
  weightsByCourse: CourseGradeWeights;
  onWeightChange: (
    course: string,
    category: GradeCategory,
    weight: number,
  ) => void;
  onResetWeights: (course: string) => void;
};

export default function GradeWeightEditor({
  courseNames,
  weightsByCourse,
  onWeightChange,
  onResetWeights,
}: GradeWeightEditorProps) {
  const [selectedCourse, setSelectedCourse] =
    useState(courseNames[0] ?? "");

  const weights =
    weightsByCourse[selectedCourse] ??
    DEFAULT_GRADE_WEIGHTS;

  const totalWeight = GRADE_CATEGORIES.reduce(
    (total, category) =>
      total + weights[category],
    0,
  );

  if (courseNames.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Grade Weights
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Add a course before setting grade
          weights.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Grade Weights
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Customize how much each category
            contributes to the course average.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onResetWeights(selectedCourse)
          }
          className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Reset Defaults
        </button>
      </div>

      <div className="mt-6">
        <label
          htmlFor="weight-course"
          className="text-sm font-medium text-slate-700"
        >
          Course
        </label>

        <select
          id="weight-course"
          value={selectedCourse}
          onChange={(event) =>
            setSelectedCourse(event.target.value)
          }
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {courseNames.map((courseName) => (
            <option
              key={courseName}
              value={courseName}
            >
              {courseName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {GRADE_CATEGORIES.map((category) => (
          <div key={category}>
            <label
              htmlFor={`weight-${category}`}
              className="text-sm font-medium text-slate-700"
            >
              {category}
            </label>

            <div className="relative mt-2">
              <input
                id={`weight-${category}`}
                type="number"
                min="0"
                max="100"
                value={weights[category]}
                onChange={(event) => {
                  const parsedWeight = Number(
                    event.target.value,
                  );

                  const safeWeight =
                    Number.isNaN(parsedWeight)
                      ? 0
                      : Math.min(
                          100,
                          Math.max(
                            0,
                            parsedWeight,
                          ),
                        );

                  onWeightChange(
                    selectedCourse,
                    category,
                    safeWeight,
                  );
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-10 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                %
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium ${
          totalWeight === 100
            ? "bg-green-50 text-green-700"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        Total weight: {totalWeight}%
        {totalWeight !== 100 &&
          " — Recommended total: 100%"}
      </div>
    </section>
  );
}