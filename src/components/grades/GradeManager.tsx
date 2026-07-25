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
  useAuth,
} from "@/hooks/useAuth";

import LoadingCard from "@/components/ui/LoadingCard";
import UndoToast from "@/components/ui/UndoToast";

import {
  deleteOneGrade,
  loadGrades,
  saveGrades,
  saveOneGrade,
} from "@/services/gradeService";

import {
  loadGradeWeights,
  saveGradeWeights,
} from "@/services/gradeWeightService";

import {
  loadCourses,
} from "@/services/courseService";

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

  const {
  user,
  isLoading: isAuthLoading,
} = useAuth();

  const [grades, setGrades] =
    useState<GradeEntry[]>([]);

  const [weightsByCourse, setWeightsByCourse] =
  useState<CourseGradeWeights>({});

  const [courseNames, setCourseNames] =
    useState<string[]>([]);

  const [gradeToEdit, setGradeToEdit] =
    useState<GradeEntry | null>(null);

    const [
  recentlyDeletedGrade,
  setRecentlyDeletedGrade,
] = useState<GradeEntry | null>(
  null,
);

  const [hasLoaded, setHasLoaded] =
    useState(false);

    const [
  isSavingGrades,
  setIsSavingGrades,
] = useState(false);

const [
  gradeDataError,
  setGradeDataError,
] = useState<string | null>(
  null,
);

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState<GradeCategoryFilter>("All");

  const [searchTerm, setSearchTerm] =
    useState("");

 useEffect(() => {
  if (isAuthLoading) {
    return;
  }

  let isCancelled = false;

  async function loadGradeData() {
    setHasLoaded(false);
    setGradeDataError(null);

    try {
      const [
        loadedGrades,
        loadedWeights,
        loadedCourses,
      ] = await Promise.all([
        loadGrades(
          user?.uid,
        ),
        loadGradeWeights(
          user?.uid,
        ),
        loadCourses(
          user?.uid,
        ),
      ]);

      if (isCancelled) {
        return;
      }

      setGrades(
        loadedGrades,
      );

      setWeightsByCourse(
        loadedWeights,
      );

      setCourseNames(
        loadedCourses.map(
          (course) =>
            course.name,
        ),
      );
    } catch (error) {
      console.error(
        "Could not load grade data:",
        error,
      );

      if (!isCancelled) {
        setGradeDataError(
          user?.uid
            ? "Your cloud grade data could not be loaded."
            : "Your saved grade data could not be loaded.",
        );
      }
    } finally {
      if (!isCancelled) {
        setHasLoaded(true);
      }
    }
  }

  void loadGradeData();

  return () => {
    isCancelled = true;
  };
}, [
  isAuthLoading,
  user?.uid,
]);

  useEffect(() => {
  if (
    !hasLoaded ||
    isAuthLoading ||
    user?.uid
  ) {
    return;
  }

  let isCancelled = false;

  async function persistGradeData() {
    setIsSavingGrades(true);
    setGradeDataError(null);

    try {
      await Promise.all([
  saveGrades(
    grades,
  ),
  saveGradeWeights(
    weightsByCourse,
  ),
]);
    } catch (error) {
      console.error(
        "Could not save grade data:",
        error,
      );

      if (!isCancelled) {
        setGradeDataError(
          user?.uid
            ? "Your grades could not be saved to the cloud."
            : "Your grades could not be saved on this device.",
        );
      }
    } finally {
      if (!isCancelled) {
        setIsSavingGrades(false);
      }
    }
  }

  void persistGradeData();

  return () => {
    isCancelled = true;
  };
}, [
  grades,
  weightsByCourse,
  hasLoaded,
  isAuthLoading,
  user?.uid,
]);

 async function saveGrade(
  grade: GradeEntry,
) {
  const previousGrades =
    grades;

  const gradeExists =
    grades.some(
      (currentGrade) =>
        currentGrade.id === grade.id,
    );

  const nextGrades =
    gradeExists
      ? grades.map(
          (currentGrade) =>
            currentGrade.id === grade.id
              ? grade
              : currentGrade,
        )
      : [...grades, grade];

  setGrades(nextGrades);
  setGradeToEdit(null);
  setGradeDataError(null);

  if (!user?.uid) {
    return;
  }

  setIsSavingGrades(true);

  try {
    await saveOneGrade(
      grade,
      user.uid,
    );
  } catch (error) {
    console.error(
      "Could not save grade:",
      error,
    );

    setGrades(previousGrades);

    setGradeDataError(
      "The grade could not be saved. Your previous data was restored.",
    );
  } finally {
    setIsSavingGrades(false);
  }
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

 async function deleteGrade(
  gradeId: string,
) {
  const gradeToDelete =
    grades.find(
      (grade) =>
        grade.id === gradeId,
    );

  if (!gradeToDelete) {
    return;
  }

  const shouldDelete =
    window.confirm(
      `Delete "${gradeToDelete.title}"?`,
    );

  if (!shouldDelete) {
    return;
  }

  const previousGrades =
    grades;

  /*
   * Optimistically remove the grade
   * from the screen.
   */
  setGrades(
    (currentGrades) =>
      currentGrades.filter(
        (grade) =>
          grade.id !== gradeId,
      ),
  );

  if (
    gradeToEdit?.id ===
    gradeId
  ) {
    setGradeToEdit(null);
  }

  setGradeDataError(null);

  /*
   * Signed-out users are persisted by
   * the localStorage saving effect.
   */
  if (!user?.uid) {
    setRecentlyDeletedGrade(
      gradeToDelete,
    );

    return;
  }

  setIsSavingGrades(true);

  try {
    await deleteOneGrade(
      gradeId,
      user.uid,
    );

    /*
     * Only show Undo after Firestore
     * confirms the delete.
     */
    setRecentlyDeletedGrade(
      gradeToDelete,
    );
  } catch (error) {
    console.error(
      "Could not delete grade:",
      error,
    );

    setGrades(
      previousGrades,
    );

    setGradeDataError(
      "The grade could not be deleted. It has been restored.",
    );
  } finally {
    setIsSavingGrades(false);
  }
}

async function undoGradeDeletion() {
  if (!recentlyDeletedGrade) {
    return;
  }

  const gradeToRestore =
    recentlyDeletedGrade;

  /*
   * Put it back on screen immediately.
   */
  setGrades(
    (currentGrades) => [
      ...currentGrades,
      gradeToRestore,
    ],
  );

  setRecentlyDeletedGrade(
    null,
  );

  setGradeDataError(null);

  /*
   * Signed-out users are persisted by
   * the localStorage effect.
   */
  if (!user?.uid) {
    return;
  }

  setIsSavingGrades(true);

  try {
    await saveOneGrade(
      gradeToRestore,
      user.uid,
    );
  } catch (error) {
    console.error(
      "Could not restore grade:",
      error,
    );

    /*
     * Firestore restore failed, so
     * remove it from the UI again.
     */
    setGrades(
      (currentGrades) =>
        currentGrades.filter(
          (grade) =>
            grade.id !==
            gradeToRestore.id,
        ),
    );

    setGradeDataError(
      "The grade could not be restored.",
    );
  } finally {
    setIsSavingGrades(false);
  }
}

  async function clearAllGrades() {
  if (grades.length === 0) {
    return;
  }

  const shouldClear =
    window.confirm(
      "Delete all grade entries? This action cannot be undone.",
    );

  if (!shouldClear) {
    return;
  }

  const previousGrades =
    grades;

  setGrades([]);
  setGradeToEdit(null);

  if (!user?.uid) {
    return;
  }

  setIsSavingGrades(true);

  try {
    await saveGrades(
      [],
      user.uid,
    );
  } catch (error) {
    console.error(
      "Could not clear grades:",
      error,
    );

    setGrades(
      previousGrades,
    );

    setGradeDataError(
      "Your grades could not be cleared. They have been restored.",
    );
  } finally {
    setIsSavingGrades(false);
  }
}

async function changeGradeWeight(
  course: string,
  category: GradeCategory,
  weight: number,
) {
  const previousWeights =
    weightsByCourse;

  const nextWeights = {
    ...weightsByCourse,
    [course]: {
      ...(weightsByCourse[course] ??
        DEFAULT_GRADE_WEIGHTS),
      [category]: weight,
    },
  };

  setWeightsByCourse(
    nextWeights,
  );

  if (!user?.uid) {
    return;
  }

  setIsSavingGrades(true);

  try {
    await saveGradeWeights(
      nextWeights,
      user.uid,
    );
  } catch (error) {
    console.error(
      "Could not save grade weights:",
      error,
    );

    setWeightsByCourse(
      previousWeights,
    );

    setGradeDataError(
      "Your grade weights could not be saved.",
    );
  } finally {
    setIsSavingGrades(false);
  }
}

async function resetGradeWeights(
  course: string,
) {
  const previousWeights =
    weightsByCourse;

  const nextWeights = {
    ...weightsByCourse,
    [course]: {
      ...DEFAULT_GRADE_WEIGHTS,
    },
  };

  setWeightsByCourse(
    nextWeights,
  );

  if (!user?.uid) {
    return;
  }

  setIsSavingGrades(true);

  try {
    await saveGradeWeights(
      nextWeights,
      user.uid,
    );
  } catch (error) {
    console.error(
      "Could not reset grade weights:",
      error,
    );

    setWeightsByCourse(
      previousWeights,
    );

    setGradeDataError(
      "Your grade weights could not be reset.",
    );
  } finally {
    setIsSavingGrades(false);
  }
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

     if (
  isAuthLoading ||
  !hasLoaded
) {
  return (
    <div className="space-y-6">
      <LoadingCard heightClassName="h-72" />
      <LoadingCard heightClassName="h-80" />
    </div>
  );
}

  return (
  <div className="space-y-5">
    <div
      aria-live="polite"
      className="space-y-3"
    >
      {user?.uid ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          Grades are connected to{" "}
          <span className="font-semibold">
            {user.email}
          </span>
          .
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          You are signed out. Grades are
          being saved only on this device.
        </div>
      )}

      {isSavingGrades && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Saving grade data...
        </p>
      )}

      {gradeDataError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {gradeDataError}
        </div>
      )}
    </div>
  

    <div className="grid gap-8 xl:grid-cols-[380px_1fr]"></div>
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
      {recentlyDeletedGrade && (
  <UndoToast
    message={`Deleted "${recentlyDeletedGrade.title}".`}
    onUndo={
      undoGradeDeletion
    }
    onDismiss={() =>
      setRecentlyDeletedGrade(
        null,
      )
    }
  />
)}
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