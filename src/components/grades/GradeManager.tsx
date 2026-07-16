"use client";

import { useEffect, useState } from "react";

import GradeCard from "@/components/grades/GradeCard";
import GradeFilters, {
  type GradeCategoryFilter,
} from "@/components/grades/GradeFilters";
import GradeForm from "@/components/grades/GradeForm";

import {
  COURSE_STORAGE_KEY,
  GRADE_STORAGE_KEY,
} from "@/constants/storage";

import type { Course } from "@/types/course";
import type { GradeEntry } from "@/types/grade";

export default function GradeManager() {
  const [grades, setGrades] =
    useState<GradeEntry[]>([]);

  const [courseNames, setCourseNames] =
    useState<string[]>([]);

  const [gradeToEdit, setGradeToEdit] =
    useState<GradeEntry | null>(null);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState<GradeCategoryFilter>("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    try {
      const storedGrades =
        localStorage.getItem(
          GRADE_STORAGE_KEY,
        );

      if (storedGrades) {
        const parsedGrades = JSON.parse(
          storedGrades,
        ) as GradeEntry[];

        if (Array.isArray(parsedGrades)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setGrades(parsedGrades);
        }
      }

      const storedCourses =
        localStorage.getItem(
          COURSE_STORAGE_KEY,
        );

      if (storedCourses) {
        const parsedCourses = JSON.parse(
          storedCourses,
        ) as Course[];

        if (Array.isArray(parsedCourses)) {
          setCourseNames(
            parsedCourses.map(
              (course) => course.name,
            ),
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not load grade data:",
        error,
      );
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        GRADE_STORAGE_KEY,
        JSON.stringify(grades),
      );
    } catch (error) {
      console.error(
        "Could not save grade data:",
        error,
      );
    }
  }, [grades, hasLoaded]);

  function saveGrade(grade: GradeEntry) {
    setGrades((currentGrades) => {
      const gradeExists =
        currentGrades.some(
          (currentGrade) =>
            currentGrade.id === grade.id,
        );

      if (gradeExists) {
        return currentGrades.map(
          (currentGrade) =>
            currentGrade.id === grade.id
              ? grade
              : currentGrade,
        );
      }

      return [...currentGrades, grade];
    });

    setGradeToEdit(null);
  }

  function startEditingGrade(
    grade: GradeEntry,
  ) {
    setGradeToEdit(grade);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditingGrade() {
    setGradeToEdit(null);
  }

  function deleteGrade(gradeId: string) {
    const gradeToDelete = grades.find(
      (grade) => grade.id === gradeId,
    );

    if (!gradeToDelete) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${gradeToDelete.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setGrades((currentGrades) =>
      currentGrades.filter(
        (grade) => grade.id !== gradeId,
      ),
    );

    if (gradeToEdit?.id === gradeId) {
      setGradeToEdit(null);
    }
  }

  function clearAllGrades() {
    if (grades.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      "Delete all grade entries? This action cannot be undone.",
    );

    if (!shouldClear) {
      return;
    }

    setGrades([]);
    setGradeToEdit(null);
  }

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredGrades = grades
    .filter((grade) => {
      if (
        courseFilter !== "All" &&
        grade.course !== courseFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== "All" &&
        grade.category !== categoryFilter
      ) {
        return false;
      }

      if (normalizedSearch) {
        const searchableText =
          `${grade.title} ${grade.course} ${grade.category}`.toLowerCase();

        if (
          !searchableText.includes(
            normalizedSearch,
          )
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((gradeA, gradeB) =>
      gradeB.date.localeCompare(gradeA.date),
    );

  const totalEarnedPoints = grades.reduce(
    (total, grade) =>
      total + grade.earnedPoints,
    0,
  );

  const totalPossiblePoints = grades.reduce(
    (total, grade) =>
      total + grade.possiblePoints,
    0,
  );

  const overallPercentage =
    totalPossiblePoints === 0
      ? 0
      : Math.round(
          (totalEarnedPoints /
            totalPossiblePoints) *
            100,
        );

  const testGrades = grades.filter(
    (grade) => grade.category === "Test",
  );

  const testPercentage =
    calculateGroupPercentage(testGrades);

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <GradeForm
        key={
          gradeToEdit?.id ?? "new-grade"
        }
        gradeToEdit={gradeToEdit}
        courseNames={courseNames}
        onSaveGrade={saveGrade}
        onCancelEdit={cancelEditingGrade}
      />

      <section className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <GradeStatCard
            title="Grade Entries"
            value={String(grades.length)}
          />

          <GradeStatCard
            title="Overall Average"
            value={`${overallPercentage}%`}
          />

          <GradeStatCard
            title="Test Average"
            value={
              testGrades.length === 0
                ? "—"
                : `${testPercentage}%`
            }
          />

          <GradeStatCard
            title="Courses Tracked"
            value={String(
              new Set(
                grades.map(
                  (grade) => grade.course,
                ),
              ).size,
            )}
          />
        </div>

        <div className="mt-8">
          <GradeFilters
            courseFilter={courseFilter}
            categoryFilter={categoryFilter}
            searchTerm={searchTerm}
            courseNames={courseNames}
            onCourseChange={setCourseFilter}
            onCategoryChange={
              setCategoryFilter
            }
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your Grades
            </h2>

            <p className="mt-1 text-slate-600">
              Showing {filteredGrades.length} of{" "}
              {grades.length} entries.
            </p>
          </div>

          {grades.length > 0 && (
            <button
              type="button"
              onClick={clearAllGrades}
              className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear All Grades
            </button>
          )}
        </div>

        {filteredGrades.length > 0 ? (
          <div className="mt-5 grid gap-5">
            {filteredGrades.map((grade) => (
              <GradeCard
                key={grade.id}
                grade={grade}
                onEdit={startEditingGrade}
                onDelete={deleteGrade}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="font-semibold text-slate-900">
              No grades found
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Add a grade or change your
              filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function calculateGroupPercentage(
  grades: GradeEntry[],
) {
  const earned = grades.reduce(
    (total, grade) =>
      total + grade.earnedPoints,
    0,
  );

  const possible = grades.reduce(
    (total, grade) =>
      total + grade.possiblePoints,
    0,
  );

  if (possible === 0) {
    return 0;
  }

  return Math.round(
    (earned / possible) * 100,
  );
}

type GradeStatCardProps = {
  title: string;
  value: string;
};

function GradeStatCard({
  title,
  value,
}: GradeStatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </article>
  );
}