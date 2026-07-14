"use client";

import { useState, type FormEvent } from "react";
import type { Course, GoalScore } from "@/types/course";

type CourseFormProps = {
  onAddCourse: (course: Course) => void;
};

export default function CourseForm({
  onAddCourse,
}: CourseFormProps) {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [goalScore, setGoalScore] = useState<GoalScore>(5);
  const [progress, setProgress] = useState("0");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedTeacher = teacher.trim();
    const progressNumber = Number(progress);

    if (!trimmedName) {
      setError("Please enter a course name.");
      return;
    }

    if (
      Number.isNaN(progressNumber) ||
      progressNumber < 0 ||
      progressNumber > 100
    ) {
      setError("Progress must be a number from 0 to 100.");
      return;
    }

    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: trimmedName,
      teacher: trimmedTeacher || "Teacher not entered",
      goalScore,
      progress: progressNumber,
    };

    onAddCourse(newCourse);

    setName("");
    setTeacher("");
    setGoalScore(5);
    setProgress("0");
    setError("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Add an AP Course
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Enter your course information and current progress.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5"
      >
        <div>
          <label
            htmlFor="course-name"
            className="text-sm font-medium text-slate-700"
          >
            Course name
          </label>

          <input
            id="course-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: AP Calculus BC"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="teacher-name"
            className="text-sm font-medium text-slate-700"
          >
            Teacher
          </label>

          <input
            id="teacher-name"
            type="text"
            value={teacher}
            onChange={(event) => setTeacher(event.target.value)}
            placeholder="Example: Ms. Thompson"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="goal-score"
              className="text-sm font-medium text-slate-700"
            >
              AP score goal
            </label>

            <select
              id="goal-score"
              value={goalScore}
              onChange={(event) =>
                setGoalScore(Number(event.target.value) as GoalScore)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="course-progress"
              className="text-sm font-medium text-slate-700"
            >
              Current progress
            </label>

            <div className="relative mt-2">
              <input
                id="course-progress"
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(event) => setProgress(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-10 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                %
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add Course
        </button>
      </form>
    </section>
  );
}