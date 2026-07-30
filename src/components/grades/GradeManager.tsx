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

import {
  hasObjectChanged,
} from "@/utils/conflicts";

import LoadingCard from "@/components/ui/LoadingCard";
import UndoToast from "@/components/ui/UndoToast";

import {
  subscribeToGrades,
  subscribeToGradeWeights,
} from "@/services/realtimeDataService";

import SyncStatus from "@/components/ui/SyncStatus";

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
  gradeEditSnapshot,
  setGradeEditSnapshot,
] = useState<GradeEntry | null>(
  null,
);

const [
  hasGradeConflict,
  setHasGradeConflict,
] = useState(false);

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
  gradesFromCache,
  setGradesFromCache,
] = useState(false);

const [
  gradesHavePendingWrites,
  setGradesHavePendingWrites,
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
setHasLoaded(false);
setGradeDataError(null);

  /*
   * SIGNED OUT
   *
   * Load everything from the local
   * data services.
   */
  if (!user?.uid) {
    let isCancelled = false;

    async function loadLocalGradeData() {
      try {
        const [
          loadedGrades,
          loadedWeights,
          loadedCourses,
        ] = await Promise.all([
          loadGrades(),
          loadGradeWeights(),
          loadCourses(),
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

        setGradesFromCache(
          false,
        );

        setGradesHavePendingWrites(
          false,
        );
      } catch (error) {
        console.error(
          "Could not load local grade data:",
          error,
        );

        if (!isCancelled) {
          setGradeDataError(
            "Your saved grade data could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setHasLoaded(true);
        }
      }
    }

    void loadLocalGradeData();

    return () => {
      isCancelled = true;
    };
  }

  /*
   * SIGNED IN
   *
   * Capture the UID so nested
   * callbacks do not use User | null.
   */
  const userId =
    user.uid;

  let isCancelled = false;

  let hasReceivedGrades =
    false;

  let hasReceivedWeights =
    false;

  function finishInitialLoad() {
    if (
      !isCancelled &&
      hasReceivedGrades &&
      hasReceivedWeights
    ) {
      setHasLoaded(true);
    }
  }

  /*
   * Courses do not need their own
   * listener on the Grades page yet.
   * We only need their names for the
   * grade form and filters.
   */
  async function loadCourseNames() {
    try {
      const loadedCourses =
        await loadCourses(
          userId,
        );

      if (isCancelled) {
        return;
      }

      setCourseNames(
        loadedCourses.map(
          (course) =>
            course.name,
        ),
      );
    } catch (error) {
      console.error(
        "Could not load courses for grades:",
        error,
      );

      if (!isCancelled) {
        setGradeDataError(
          "Your course list could not be loaded.",
        );
      }
    }
  }

  void loadCourseNames();

  /*
   * Real-time grades.
   */
  const unsubscribeGrades =
    subscribeToGrades(
      userId,

      (snapshot) => {
        if (isCancelled) {
          return;
        }

        setGrades(
          snapshot.data,
        );

        setGradesFromCache(
          snapshot.fromCache,
        );

        setGradesHavePendingWrites(
          snapshot.hasPendingWrites,
        );

        hasReceivedGrades =
          true;

        finishInitialLoad();
      },

      (error) => {
        console.error(
          "Grade listener failed:",
          error,
        );

        if (!isCancelled) {
          setGradeDataError(
            "Real-time grade sync could not be started.",
          );

          setHasLoaded(true);
        }
      },
    );

  /*
   * Real-time grade weights.
   */
  const unsubscribeWeights =
    subscribeToGradeWeights(
      userId,

      (snapshot) => {
        if (isCancelled) {
          return;
        }

        setWeightsByCourse(
          snapshot.data,
        );

        hasReceivedWeights =
          true;

        finishInitialLoad();
      },

      (error) => {
        console.error(
          "Grade-weight listener failed:",
          error,
        );

        if (!isCancelled) {
          setGradeDataError(
            "Real-time grade-weight sync could not be started.",
          );

          setHasLoaded(true);
        }
      },
    );

  return () => {
    isCancelled = true;

    unsubscribeGrades();
    unsubscribeWeights();
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
  if (
  hasGradeConflict &&
  gradeToEdit
) {
  const shouldOverwrite =
    window.confirm(
      "This grade changed on another device while you were editing it. Save your version anyway?",
    );

  if (!shouldOverwrite) {
    return;
  }
}
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
  setGradeEditSnapshot(
  null,
);

setHasGradeConflict(
  false,
);
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

    setGradeEditSnapshot(
  grade,
);

setHasGradeConflict(
  false,
);
    setGradeToEdit(grade);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditingGrade() {
    setGradeToEdit(null);
    setGradeEditSnapshot(
  null,
);

setHasGradeConflict(
  false,
);
  }

  useEffect(() => {
  if (
    !gradeToEdit ||
    !gradeEditSnapshot
  ) {
    return;
  }

  const latestGrade =
    grades.find(
      (grade) =>
        grade.id ===
        gradeToEdit.id,
    );

  if (!latestGrade) {
    return;
  }

 if (
  hasObjectChanged(
    gradeEditSnapshot,
    latestGrade,
  )
) {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setHasGradeConflict(
    true,
  );
}
}, [
  grades,
  gradeToEdit,
  gradeEditSnapshot,
]);

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

      <SyncStatus
  isSaving={
    isSavingGrades
  }
  error={
    gradeDataError
  }
  fromCache={
    gradesFromCache
  }
  hasPendingWrites={
    gradesHavePendingWrites
  }
  realtime={
    Boolean(user?.uid)
  }
/>
    </div>
  

    <div className="grid gap-8 xl:grid-cols-[380px_1fr]"></div>

    {hasGradeConflict && (
  <div
    role="alert"
    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
  >
    This grade changed on another
    device while you were editing it.
    Review before saving.
  </div>
)}
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