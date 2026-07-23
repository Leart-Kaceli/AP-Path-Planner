"use client";

import { useState, type FormEvent } from "react";
import type { StudySession } from "@/types/studySession";

type StudySessionFormProps = {
  sessionToEdit: StudySession | null;
  initialDate: string;
  courseNames: string[];
  onSaveSession: (
    session: StudySession,
  ) => void;
  onCancelEdit: () => void;
};

export default function StudySessionForm({
  sessionToEdit,
  initialDate,
  courseNames,
  onSaveSession,
  onCancelEdit,
}: StudySessionFormProps) {
  const [course, setCourse] = useState(
    sessionToEdit?.course ?? "",
  );

  const [topic, setTopic] = useState(
    sessionToEdit?.topic ?? "",
  );

  const [date, setDate] = useState(
  sessionToEdit?.date ??
    initialDate,
);

  const [startTime, setStartTime] = useState(
    sessionToEdit?.startTime ?? "",
  );

  const [durationMinutes, setDurationMinutes] = useState(
    String(sessionToEdit?.durationMinutes ?? 45),
  );

  const [notes, setNotes] = useState(
    sessionToEdit?.notes ?? "",
  );

  const [error, setError] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTopic = topic.trim();
    const trimmedNotes = notes.trim();
    const durationNumber = Number(durationMinutes);

    if (!course) {
      setError("Please select a course.");
      return;
    }

    if (!trimmedTopic) {
      setError("Please enter a study topic.");
      return;
    }

    if (!date) {
      setError("Please select a study date.");
      return;
    }

    if (!startTime) {
      setError("Please select a start time.");
      return;
    }

    if (
      Number.isNaN(durationNumber) ||
      durationNumber < 10 ||
      durationNumber > 300
    ) {
      setError(
        "Duration must be between 10 and 300 minutes.",
      );
      return;
    }

    const savedSession: StudySession = {
  id:
    sessionToEdit?.id ??
    crypto.randomUUID(),
  course,
  topic: trimmedTopic,
  date,
  startTime,
  durationMinutes: durationNumber,
  completed:
    sessionToEdit?.completed ?? false,
  completedAt:
    sessionToEdit?.completedAt ?? null,
  notes: trimmedNotes,
};

    onSaveSession(savedSession);

    setCourse("");
    setTopic("");
    setDate("");
    setStartTime("");
    setDurationMinutes("45");
    setNotes("");
    setError("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {sessionToEdit
            ? "Edit Study Session"
            : "Schedule Study Session"}
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {sessionToEdit
            ? "Update the details of this session."
            : "Plan focused study time for one of your AP courses."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5"
      >
        <div>
          <label
            htmlFor="study-course"
            className="text-sm font-medium text-slate-700"
          >
            Course
          </label>

          <select
            id="study-course"
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
            htmlFor="study-topic"
            className="text-sm font-medium text-slate-700"
          >
            Study topic
          </label>

          <input
            id="study-topic"
            type="text"
            value={topic}
            onChange={(event) =>
              setTopic(event.target.value)
            }
            placeholder="Example: Integration by parts"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="study-date"
              className="text-sm font-medium text-slate-700"
            >
              Date
            </label>

            <input
              id="study-date"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="study-time"
              className="text-sm font-medium text-slate-700"
            >
              Start time
            </label>

            <input
              id="study-time"
              type="time"
              value={startTime}
              onChange={(event) =>
                setStartTime(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="study-duration"
            className="text-sm font-medium text-slate-700"
          >
            Duration in minutes
          </label>

          <input
            id="study-duration"
            type="number"
            min="10"
            max="300"
            step="5"
            value={durationMinutes}
            onChange={(event) =>
              setDurationMinutes(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="study-notes"
            className="text-sm font-medium text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="study-notes"
            rows={4}
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Optional goals, resources, or reminders"
            className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            {sessionToEdit
              ? "Save Changes"
              : "Schedule Session"}
          </button>

          {sessionToEdit && (
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
            Add at least one course before scheduling
            a study session.
          </p>
        )}
      </form>
    </section>
  );
}