"use client";

import { useEffect, useState } from "react";

import GradeCard from "@/components/grades/GradeCard";
import GradeFilters, {
  type GradeCategoryFilter,
} from "@/components/grades/GradeFilters";
import GradeForm from "@/components/grades/GradeForm";
import CourseGradeSummaryCard from "@/components/grades/CourseGradeSummaryCard";
import GradeWeightEditor from "@/components/grades/GradeWeightEditor";
import { DEFAULT_GRADE_WEIGHTS } from "@/constants/grades";

import {
  COURSE_STORAGE_KEY,
  GRADE_STORAGE_KEY,
  GRADE_WEIGHT_STORAGE_KEY,
} from "@/constants/storage";

import type { Course } from "@/types/course";
import type {
  CourseGradeWeights,
  GradeCategory,
  GradeEntry,
} from "@/types/grade";
import {
  calculatePointAverage,
  calculateWeightedAverage,
} from "@/utils/grades";

export default function GradeManager() {
  const [grades, setGrades] =
    useState<GradeEntry[]>([]);

  const [weightsByCourse, setWeightsByCourse] =
  useState<CourseGradeWeights>({});

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
    const storedWeights =
  localStorage.getItem(
    GRADE_WEIGHT_STORAGE_KEY,
  );
    
    try {
      const storedGrades =
        localStorage.getItem(
          GRADE_STORAGE_KEY,
        );
      if (storedWeights) {
  const parsedWeights = JSON.parse(
    storedWeights,
  ) as CourseGradeWeights;

  if (
    parsedWeights &&
    typeof parsedWeights === "object" &&
    !Array.isArray(parsedWeights)
  ) {
    // Add the ESLint comment only if
    // your linter reports this exact line.
    // eslint-disable-next-line react-hooks/set-state-in-effect
setWeightsByCourse(parsedWeights);
  }
}

      if (storedGrades) {
        const parsedGrades = JSON.parse(
          storedGrades,
        ) as GradeEntry[];

        if (Array.isArray(parsedGrades)) {
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
      GRADE_WEIGHT_STORAGE_KEY,
      JSON.stringify(weightsByCourse),
    );
  } catch (error) {
    console.error(
      "Could not save grade weights:",
      error,
    );
  }
}, [weightsByCourse, hasLoaded]);

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

function changeGradeWeight(
  course: string,
  category: GradeCategory,
  weight: number,
) {
  setWeightsByCourse((currentWeights) => ({
    ...currentWeights,
    [course]: {
      ...(currentWeights[course] ??
        DEFAULT_GRADE_WEIGHTS),
      [category]: weight,
    },
  }));
}

function resetGradeWeights(course: string) {
  setWeightsByCourse((currentWeights) => ({
    ...currentWeights,
    [course]: {
      ...DEFAULT_GRADE_WEIGHTS,
    },
  }));
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

  const coursesWithGrades = Array.from(
  new Set(
    grades.map((grade) => grade.course),
  ),
);

const overallPointAverage =
  calculatePointAverage(grades);

const weightedCourseAverages =
  coursesWithGrades
    .map((course) => {
      const courseGrades = grades.filter(
        (grade) =>
          grade.course === course,
      );

      const courseWeights =
        weightsByCourse[course] ??
        DEFAULT_GRADE_WEIGHTS;

      return calculateWeightedAverage(
        courseGrades,
        courseWeights,
      );
    })
    .filter(
      (
        average,
      ): average is number =>
        average !== null,
    );

const overallWeightedAverage =
  weightedCourseAverages.length === 0
    ? null
    : Math.round(
        weightedCourseAverages.reduce(
          (total, average) =>
            total + average,
          0,
        ) /
          weightedCourseAverages.length,
      );


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
    title="Point Average"
    value={
      overallPointAverage === null
        ? "—"
        : `${overallPointAverage}%`
    }
  />

  <GradeStatCard
    title="Weighted Average"
    value={
      overallWeightedAverage === null
        ? "—"
        : `${overallWeightedAverage}%`
    }
  />

  <GradeStatCard
    title="Courses Tracked"
    value={String(
      coursesWithGrades.length,
    )}
  />
</div>

    <div className="mt-8">
  <GradeWeightEditor
    courseNames={courseNames}
    weightsByCourse={
      weightsByCourse
    }
    onWeightChange={
      changeGradeWeight
    }
    onResetWeights={
      resetGradeWeights
    }
  />
</div>

{coursesWithGrades.length > 0 && (
  <section className="mt-8">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Course Grade Summaries
      </h2>

      <p className="mt-1 text-slate-600">
        Compare weighted and point-based
        averages for each course.
      </p>
    </div>

    <div className="mt-5 grid gap-5">
      {coursesWithGrades.map((course) => {
        const courseGrades =
          grades.filter(
            (grade) =>
              grade.course === course,
          );

        const courseWeights =
          weightsByCourse[course] ??
          DEFAULT_GRADE_WEIGHTS;

        return (
          <CourseGradeSummaryCard
            key={course}
            course={course}
            grades={courseGrades}
            weights={courseWeights}
          />
        );
      })}
    </div>
  </section>
)}

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