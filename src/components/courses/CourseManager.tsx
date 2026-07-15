"use client";

import { useEffect, useState } from "react";
import CourseForm from "@/components/courses/CourseForm";
import ManagedCourseCard from "@/components/courses/ManagedCourseCard";
import type { Course } from "@/types/course";
import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
} from "@/constants/storage";

import type { Assignment } from "@/types/assignment";

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
 const [courses, setCourses] = useState<Course[]>(initialCourses);
const [hasLoadedCourses, setHasLoadedCourses] = useState(false);
const [courseToEdit, setCourseToEdit] =
  useState<Course | null>(null);

useEffect(() => {
  try {
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);

    if (storedCourses) {
      const parsedCourses = JSON.parse(storedCourses) as Course[];

      if (Array.isArray(parsedCourses)) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
        setCourses(parsedCourses);
      }
    }
  } catch (error) {
    console.error("Could not load saved courses:", error);
  } finally {
    setHasLoadedCourses(true);
  }
}, []);

useEffect(() => {
  if (!hasLoadedCourses) {
    return;
  }

  try {
    localStorage.setItem(
      COURSE_STORAGE_KEY,
      JSON.stringify(courses),
    );
  } catch (error) {
    console.error("Could not save courses:", error);
  }
}, [courses, hasLoadedCourses]);

  function saveCourse(course: Course) {
  setCourses((currentCourses) => {
    const courseAlreadyExists = currentCourses.some(
      (currentCourse) => currentCourse.id === course.id,
    );

    if (courseAlreadyExists) {
      return currentCourses.map((currentCourse) =>
        currentCourse.id === course.id
          ? course
          : currentCourse,
      );
    }

    return [...currentCourses, course];
  });

  setCourseToEdit(null);
}

function startEditingCourse(course: Course) {
  setCourseToEdit(course);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function cancelEditingCourse() {
  setCourseToEdit(null);
}

 function deleteCourse(courseId: string) {
  const courseToDelete = courses.find(
    (course) => course.id === courseId,
  );

  if (!courseToDelete) {
    return;
  }

  const shouldDelete = window.confirm(
    `Delete ${courseToDelete.name} and its connected assignments?`,
  );

  if (!shouldDelete) {
    return;
  }

  try {
    const storedAssignments = localStorage.getItem(
      ASSIGNMENT_STORAGE_KEY,
    );

    if (storedAssignments) {
      const parsedAssignments = JSON.parse(
        storedAssignments,
      ) as Assignment[];

      if (Array.isArray(parsedAssignments)) {
        const remainingAssignments =
          parsedAssignments.filter(
            (assignment) =>
              assignment.course !==
              courseToDelete.name,
          );

        localStorage.setItem(
          ASSIGNMENT_STORAGE_KEY,
          JSON.stringify(remainingAssignments),
        );
      }
    }
  } catch (error) {
    console.error(
      "Could not remove connected assignments:",
      error,
    );
  }

  setCourses((currentCourses) =>
    currentCourses.filter(
      (course) => course.id !== courseId,
    ),
  );

  if (courseToEdit?.id === courseId) {
    setCourseToEdit(null);
  }
}

function clearAllCourses() {
  if (courses.length === 0) {
    return;
  }

  const shouldClear = window.confirm(
    "Delete all courses and their connected assignments? This action cannot be undone.",
  );

  if (!shouldClear) {
    return;
  }

  try {
    const storedAssignments = localStorage.getItem(
      ASSIGNMENT_STORAGE_KEY,
    );

    if (storedAssignments) {
      const parsedAssignments = JSON.parse(
        storedAssignments,
      ) as Assignment[];

      if (Array.isArray(parsedAssignments)) {
        const courseNames = new Set(
          courses.map((course) => course.name),
        );

        const remainingAssignments =
          parsedAssignments.filter(
            (assignment) =>
              !courseNames.has(assignment.course),
          );

        localStorage.setItem(
          ASSIGNMENT_STORAGE_KEY,
          JSON.stringify(remainingAssignments),
        );
      }
    }
  } catch (error) {
    console.error(
      "Could not remove connected assignments:",
      error,
    );
  }

  setCourses([]);
  setCourseToEdit(null);
}

  const averageProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce(
            (total, course) => total + course.progress,
            0,
          ) / courses.length,
        );

  const goalFiveCount = courses.filter(
    (course) => course.goalScore === 5,
  ).length;

  return (
    <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
     <CourseForm
  key={courseToEdit?.id ?? "new-course"}
  courseToEdit={courseToEdit}
  onSaveCourse={saveCourse}
  onCancelEdit={cancelEditingCourse}
/>

      <section>
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Courses
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {courses.length}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Average Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {averageProgress}%
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Goal Score of 5
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {goalFiveCount}
            </p>
          </article>
        </div>

        <div className="mt-8">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <h2 className="text-2xl font-bold text-slate-900">
      Your Courses
    </h2>

    <p className="mt-1 text-slate-600">
      Manage your AP classes and progress goals.
    </p>
  </div>

  {courses.length > 0 && (
    <button
      type="button"
      onClick={clearAllCourses}
      className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700"
    >
      Clear All Courses
    </button>
  )}
</div>

          {courses.length > 0 ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {courses.map((course) => (
               <ManagedCourseCard
  key={course.id}
  course={course}
  onEdit={startEditingCourse}
  onDelete={deleteCourse}
/>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="font-semibold text-slate-900">
                No courses added
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Use the form to add your first AP course.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}