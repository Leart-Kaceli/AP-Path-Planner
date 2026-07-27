"use client";

import {
  useEffect,
  useState,
} from "react";

import CourseForm from "@/components/courses/CourseForm";
import ManagedCourseCard from "@/components/courses/ManagedCourseCard";

import LoadingCard from "@/components/ui/LoadingCard";

import type {
  Course,
} from "@/types/course";

import {
  deleteOneCourse,
  loadCourses,
  saveCourses,
  saveOneCourse,
} from "@/services/courseService";

import {
  subscribeToCourses,
} from "@/services/realtimeDataService";

import SyncStatus from "@/components/ui/SyncStatus";

import {
  loadAssignments,
  saveAssignments,
} from "@/services/assignmentService";

import {
  hasObjectChanged,
} from "@/utils/conflicts";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

const initialCourses: Course[] = [
  {
    id: "calculus-bc",
    name: "AP Calculus BC",
    teacher: "Ms. Thompson",
    goalScore: 5,
    progress: 72,
  },
  {
    id: "physics-c",
    name: "AP Physics C",
    teacher: "Mr. Rivera",
    goalScore: 5,
    progress: 58,
  },
  {
    id: "computer-science-a",
    name: "AP Computer Science A",
    teacher: "Mrs. Patel",
    goalScore: 5,
    progress: 81,
  },
];

export default function CourseManager() {
  const {
    user,
    isLoading: isAuthLoading,
  } = useAuth();

  const [
    courses,
    setCourses,
  ] = useState<Course[]>(
    initialCourses,
  );

  const [
    hasLoadedCourses,
    setHasLoadedCourses,
  ] = useState(false);

  const [
  coursesFromCache,
  setCoursesFromCache,
] = useState(false);

const [
  coursesHavePendingWrites,
  setCoursesHavePendingWrites,
] = useState(false);

  const [
    courseToEdit,
    setCourseToEdit,
  ] = useState<Course | null>(
    null,
  );

  const [
  courseEditSnapshot,
  setCourseEditSnapshot,
] = useState<Course | null>(
  null,
);

const [
  hasCourseConflict,
  setHasCourseConflict,
] = useState(false);

  const [
    isSavingCourses,
    setIsSavingCourses,
  ] = useState(false);

  const [
    courseDataError,
    setCourseDataError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
  if (isAuthLoading) {
    return;
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
setHasLoadedCourses(false);
setCourseDataError(null);

  /*
   * Signed-out users still load from
   * the local course service.
   */
  if (!user?.uid) {
    let isCancelled = false;

    async function loadLocalCourses() {
      try {
        const loadedCourses =
          await loadCourses();

        if (isCancelled) {
          return;
        }

        setCourses(
          loadedCourses,
        );

        setCoursesFromCache(
          false,
        );

        setCoursesHavePendingWrites(
          false,
        );
      } catch (error) {
        console.error(
          "Could not load courses:",
          error,
        );

        if (!isCancelled) {
          setCourseDataError(
            "Your saved courses could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setHasLoadedCourses(
            true,
          );
        }
      }
    }

    void loadLocalCourses();

    return () => {
      isCancelled = true;
    };
  }

  /*
   * Signed-in users listen to Firestore
   * continuously.
   */
  const unsubscribe =
    subscribeToCourses(
      user.uid,

      (snapshot) => {
        setCourses(
          snapshot.data,
        );

        setCoursesFromCache(
          snapshot.fromCache,
        );

        setCoursesHavePendingWrites(
          snapshot.hasPendingWrites,
        );

        setHasLoadedCourses(
          true,
        );

        setCourseDataError(
          null,
        );
      },

      (error) => {
        console.error(
          "Course listener failed:",
          error,
        );

        setCourseDataError(
          "Real-time course sync could not be started.",
        );

        setHasLoadedCourses(
          true,
        );
      },
    );

  return unsubscribe;
}, [
  isAuthLoading,
  user?.uid,
]);

  /*
   * Signed-out users still save the
   * whole course array to localStorage.
   *
   * Signed-in users now use the
   * individual Firestore functions
   * in saveCourse() and deleteCourse().
   */
  useEffect(() => {
    if (
      !hasLoadedCourses ||
      isAuthLoading ||
      user?.uid
    ) {
      return;
    }

    let isCancelled = false;

    async function persistCourses() {
      setIsSavingCourses(true);
      setCourseDataError(null);

      try {
        await saveCourses(
          courses,
        );

        notifyAppDataChanged();
      } catch (error) {
        console.error(
          "Could not save courses:",
          error,
        );

        if (!isCancelled) {
          setCourseDataError(
            "Your courses could not be saved.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSavingCourses(
            false,
          );
        }
      }
    }

    void persistCourses();

    return () => {
      isCancelled = true;
    };
  }, [
    courses,
    hasLoadedCourses,
    isAuthLoading,
    user?.uid,
  ]);

  useEffect(() => {
  if (
    !courseToEdit ||
    !courseEditSnapshot
  ) {
    return;
  }

  const latestCourse =
    courses.find(
      (course) =>
        course.id ===
        courseToEdit.id,
    );

  if (!latestCourse) {
    return;
  }

  if (
  hasObjectChanged(
    courseEditSnapshot,
    latestCourse,
  )
) {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setHasCourseConflict(
    true,
  );
}
}, [
  courses,
  courseToEdit,
  courseEditSnapshot,
]);

  async function saveCourse(
    course: Course,
  ) {
    if (
  hasCourseConflict &&
  courseToEdit
) {
  const shouldOverwrite =
    window.confirm(
      "This course changed on another device while you were editing it. Save your version anyway?",
    );

  if (!shouldOverwrite) {
    return;
  }
}
    const previousCourses =
      courses;

    const courseAlreadyExists =
      courses.some(
        (currentCourse) =>
          currentCourse.id ===
          course.id,
      );

    const nextCourses =
      courseAlreadyExists
        ? courses.map(
            (currentCourse) =>
              currentCourse.id ===
              course.id
                ? course
                : currentCourse,
          )
        : [
            ...courses,
            course,
          ];

    /*
     * Optimistic update:
     * update the screen immediately.
     */
    setCourses(
      nextCourses,
    );

    setCourseToEdit(null);
    setCourseEditSnapshot(
  null,
);

setHasCourseConflict(
  false,
);
    setCourseDataError(null);

    /*
     * Signed-out users are handled by
     * the local saving useEffect above.
     */
    if (!user?.uid) {
      return;
    }

    setIsSavingCourses(true);

    try {
      await saveOneCourse(
        course,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not save course:",
        error,
      );

      /*
       * Firestore failed, so restore the
       * previous React state.
       */
      setCourses(
        previousCourses,
      );

      setCourseDataError(
        "The course could not be saved. Your previous data was restored.",
      );
    } finally {
      setIsSavingCourses(false);
    }
  }

  function startEditingCourse(
  course: Course,
) {
  setCourseToEdit(course);

  setCourseEditSnapshot(
    course,
  );

  setHasCourseConflict(
    false,
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  function cancelEditingCourse() {
  setCourseToEdit(null);

  setCourseEditSnapshot(
    null,
  );

  setHasCourseConflict(
    false,
  );
}

  async function deleteCourse(
    courseId: string,
  ) {
    const courseToDelete =
      courses.find(
        (course) =>
          course.id ===
          courseId,
      );

    if (!courseToDelete) {
      return;
    }

    const shouldDelete =
      window.confirm(
        `Delete ${courseToDelete.name} and its connected assignments?`,
      );

    if (!shouldDelete) {
      return;
    }

    setCourseDataError(null);

    /*
     * First remove assignments connected
     * to this course.
     */
    try {
      const currentAssignments =
        await loadAssignments(
          user?.uid,
        );

      const remainingAssignments =
        currentAssignments.filter(
          (assignment) =>
            assignment.course !==
            courseToDelete.name,
        );

      await saveAssignments(
        remainingAssignments,
        user?.uid,
      );
    } catch (error) {
      console.error(
        "Could not remove connected assignments:",
        error,
      );

      setCourseDataError(
        "The connected assignments could not be removed.",
      );

      return;
    }

    const previousCourses =
      courses;

    /*
     * Optimistic deletion:
     * remove it from the UI immediately.
     */
    setCourses(
      (currentCourses) =>
        currentCourses.filter(
          (course) =>
            course.id !==
            courseId,
        ),
    );

    if (
      courseToEdit?.id ===
      courseId
    ) {
      setCourseToEdit(null);
    }

    /*
     * Signed-out deletion is persisted
     * by the local-saving effect.
     */
    if (!user?.uid) {
      return;
    }

    setIsSavingCourses(true);

    try {
      await deleteOneCourse(
        courseId,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not delete course:",
        error,
      );

      /*
       * Restore the course if the
       * Firestore deletion fails.
       */
      setCourses(
        previousCourses,
      );

      setCourseDataError(
        "The course could not be deleted. It has been restored.",
      );
    } finally {
      setIsSavingCourses(false);
    }
  }

  async function clearAllCourses() {
    if (courses.length === 0) {
      return;
    }

    const shouldClear =
      window.confirm(
        "Delete all courses and their connected assignments? This action cannot be undone.",
      );

    if (!shouldClear) {
      return;
    }

    setCourseDataError(null);

    try {
      const currentAssignments =
        await loadAssignments(
          user?.uid,
        );

      const courseNames =
        new Set(
          courses.map(
            (course) =>
              course.name,
          ),
        );

      const remainingAssignments =
        currentAssignments.filter(
          (assignment) =>
            !courseNames.has(
              assignment.course,
            ),
        );

      await saveAssignments(
        remainingAssignments,
        user?.uid,
      );
    } catch (error) {
      console.error(
        "Could not remove connected assignments:",
        error,
      );

      setCourseDataError(
        "Connected assignments could not be removed.",
      );

      return;
    }

    /*
     * Clear All remains a bulk operation.
     * That is okay because multiple
     * courses are being removed at once.
     */
    try {
      setIsSavingCourses(true);

      if (user?.uid) {
        await saveCourses(
          [],
          user.uid,
        );
      }

      setCourses([]);
      setCourseToEdit(null);

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not clear courses:",
        error,
      );

      setCourseDataError(
        "Your courses could not be cleared.",
      );
    } finally {
      setIsSavingCourses(false);
    }
  }
  
  if (
  isAuthLoading ||
  !hasLoadedCourses
) {
  return (
    <div className="space-y-6">
      <LoadingCard heightClassName="h-72" />
      <LoadingCard heightClassName="h-80" />
    </div>
  );
}

  const averageProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce(
            (
              total,
              course,
            ) =>
              total +
              course.progress,
            0,
          ) /
            courses.length,
        );

  const goalFiveCount =
    courses.filter(
      (course) =>
        course.goalScore === 5,
    ).length;

  return (
    <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <SyncStatus
  isSaving={
    isSavingCourses
  }
  error={
    courseDataError
  }
  fromCache={
    coursesFromCache
  }
  hasPendingWrites={
    coursesHavePendingWrites
  }
  realtime={
    Boolean(user?.uid)
  }
/>

{hasCourseConflict && (
  <div
    role="alert"
    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
  >
    This course changed on another
    device while you were editing it.
    Review before saving.
  </div>
)}

        <CourseForm
          key={
            courseToEdit?.id ??
            "new-course"
          }
          courseToEdit={
            courseToEdit
          }
          onSaveCourse={
            saveCourse
          }
          onCancelEdit={
            cancelEditingCourse
          }
        />
      </div>

      <section>
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Courses
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {courses.length}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Average Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {averageProgress}%
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Goal Score of 5
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {goalFiveCount}
            </p>
          </article>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Courses
              </h2>

              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Manage your AP classes and
                progress goals.
              </p>
            </div>

            {courses.length > 0 && (
              <button
                type="button"
                onClick={
                  clearAllCourses
                }
                className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear All Courses
              </button>
            )}
          </div>

          {courses.length > 0 ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {courses.map(
                (course) => (
                  <ManagedCourseCard
                    key={
                      course.id
                    }
                    course={
                      course
                    }
                    onEdit={
                      startEditingCourse
                    }
                    onDelete={
                      deleteCourse
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                No courses added
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Use the form to add your
                first AP course.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}