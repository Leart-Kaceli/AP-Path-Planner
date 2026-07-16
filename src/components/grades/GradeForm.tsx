"use client";

import { useState, type FormEvent } from "react";

import type {
  GradeCategory,
  GradeEntry,
} from "@/types/grade";

type GradeFormProps = {
  gradeToEdit: GradeEntry | null;
  courseNames: string[];
  onSaveGrade: (grade: GradeEntry) => void;
  onCancelEdit: () => void;
};

export default function GradeForm({
  gradeToEdit,
  courseNames,
  onSaveGrade,
  onCancelEdit,
}: GradeFormProps) {
  const [course, setCourse] = useState(
    gradeToEdit?.course ?? "",
  );

  const [title, setTitle] = useState(
    gradeToEdit?.title ?? "",
  );

  const [category, setCategory] =
    useState<GradeCategory>(
      gradeToEdit?.category ?? "Homework",
    );

  const [earnedPoints, setEarnedPoints] = useState(
    String(gradeToEdit?.earnedPoints ?? ""),
  );

  const [possiblePoints, setPossiblePoints] = useState(
    String(gradeToEdit?.possiblePoints ?? ""),
  );

  const [date, setDate] = useState(
    gradeToEdit?.date ?? "",
  );

  const [error, setError] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const earnedNumber = Number(earnedPoints);
    const possibleNumber = Number(possiblePoints);

    if (!course) {
      setError("Please select a course.");
      return;
    }

    if (!trimmedTitle) {
      setError("Please enter a grade title.");
      return;
    }

    if (
      Number.isNaN(earnedNumber) ||
      earnedNumber < 0
    ) {
      setError(
        "Earned points must be zero or greater.",
      );
      return;
    }

    if (
      Number.isNaN(possibleNumber) ||
      possibleNumber <= 0
    ) {
      setError(
        "Possible points must be greater than zero.",
      );
      return;
    }

    if (earnedNumber > possibleNumber) {
      setError(
        "Earned points cannot exceed possible points.",
      );
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const savedGrade: GradeEntry = {
      id:
        gradeToEdit?.id ??
        crypto.randomUUID(),
      course,
      title: trimmedTitle,
      category,
      earnedPoints: earnedNumber,
      possiblePoints: possibleNumber,
      date,
    };

    onSaveGrade(savedGrade);

    setCourse("");
    setTitle("");
    setCategory("Homework");
    setEarnedPoints("");
    setPossiblePoints("");
    setDate("");
    setError("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {gradeToEdit
            ? "Edit Grade"
            : "Add Grade"}
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {gradeToEdit
            ? "Update this grade entry."
            : "Record a score from one of your AP courses."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5"
      >
        <div>
          <label
            htmlFor="grade-course"
            className="text-sm font-medium text-slate-700"
          >
            Course
          </label>

          <select
            id="grade-course"
            value={course}
            onChange={(event) =>
              setCourse(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select a saved course
            </option>

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

        <div>
          <label
            htmlFor="grade-title"
            className="text-sm font-medium text-slate-700"
          >
            Grade title
          </label>

          <input
            id="grade-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Example: Unit 4 Test"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="grade-category"
            className="text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="grade-category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as GradeCategory,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Homework">
              Homework
            </option>

            <option value="Quiz">
              Quiz
            </option>

            <option value="Test">
              Test
            </option>

            <option value="Project">
              Project
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="earned-points"
              className="text-sm font-medium text-slate-700"
            >
              Earned points
            </label>

            <input
              id="earned-points"
              type="number"
              min="0"
              step="0.01"
              value={earnedPoints}
              onChange={(event) =>
                setEarnedPoints(event.target.value)
              }
              placeholder="Example: 92"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="possible-points"
              className="text-sm font-medium text-slate-700"
            >
              Possible points
            </label>

            <input
              id="possible-points"
              type="number"
              min="0.01"
              step="0.01"
              value={possiblePoints}
              onChange={(event) =>
                setPossiblePoints(event.target.value)
              }
              placeholder="Example: 100"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="grade-date"
            className="text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <input
            id="grade-date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={courseNames.length === 0}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {gradeToEdit
              ? "Save Changes"
              : "Add Grade"}
          </button>

          {gradeToEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>

        {courseNames.length === 0 && (
          <p className="text-sm font-medium text-amber-700">
            Add at least one course before recording
            grades.
          </p>
        )}
      </form>
    </section>
  );
}