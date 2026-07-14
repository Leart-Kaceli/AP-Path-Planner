"use client";

import { useState } from "react";
import CourseForm from "@/components/courses/CourseForm";
import ManagedCourseCard from "@/components/courses/ManagedCourseCard";
import type { Course } from "@/types/course";

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
  const [courses, setCourses] =
    useState<Course[]>(initialCourses);

  function addCourse(course: Course) {
    setCourses((currentCourses) => [
      ...currentCourses,
      course,
    ]);
  }

 function deleteCourse(courseId: string) {
  const courseToDelete = courses.find(
    (course) => course.id === courseId,
  );

  if (!courseToDelete) {
    return;
  }

  const shouldDelete = window.confirm(
    `Delete ${courseToDelete.name}?`,
  );

  if (!shouldDelete) {
    return;
  }

  setCourses((currentCourses) =>
    currentCourses.filter(
      (course) => course.id !== courseId,
    ),
  );
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
      <CourseForm onAddCourse={addCourse} />

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
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your Courses
            </h2>

            <p className="mt-1 text-slate-600">
              Manage your AP classes and progress goals.
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {courses.map((course) => (
                <ManagedCourseCard
                  key={course.id}
                  course={course}
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