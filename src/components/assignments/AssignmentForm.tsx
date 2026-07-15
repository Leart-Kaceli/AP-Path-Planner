"use client";

import { useState, type FormEvent } from "react";
import type {
  Assignment,
  AssignmentPriority,
} from "@/types/assignment";

type AssignmentFormProps = {
  assignmentToEdit: Assignment | null;
  courseNames: string[];
  onSaveAssignment: (assignment: Assignment) => void;
  onCancelEdit: () => void;
};

export default function AssignmentForm({
  assignmentToEdit,
  courseNames,
  onSaveAssignment,
  onCancelEdit,
}: AssignmentFormProps) {
  const [title, setTitle] = useState(
    assignmentToEdit?.title ?? "",
  );

  const [course, setCourse] = useState(
    assignmentToEdit?.course ?? courseNames[0] ?? "",
  );

  const [dueDate, setDueDate] = useState(
    assignmentToEdit?.dueDate ?? "",
  );

  const [priority, setPriority] =
    useState<AssignmentPriority>(
      assignmentToEdit?.priority ?? "Medium",
    );

  const [notes, setNotes] = useState(
    assignmentToEdit?.notes ?? "",
  );

  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedTitle) {
      setError("Please enter an assignment title.");
      return;
    }

    if (!course) {
      setError("Please select a course.");
      return;
    }

    if (!dueDate) {
      setError("Please choose a due date.");
      return;
    }

    const savedAssignment: Assignment = {
      id:
        assignmentToEdit?.id ??
        crypto.randomUUID(),
      title: trimmedTitle,
      course,
      dueDate,
      priority,
      completed:
        assignmentToEdit?.completed ?? false,
      notes: trimmedNotes,
    };

    onSaveAssignment(savedAssignment);

    setTitle("");
    setCourse(courseNames[0] ?? "");
    setDueDate("");
    setPriority("Medium");
    setNotes("");
    setError("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {assignmentToEdit
            ? "Edit Assignment"
            : "Add Assignment"}
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          {assignmentToEdit
            ? "Update this assignment's information."
            : "Add a task and connect it to an AP course."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-5"
      >
        <div>
          <label
            htmlFor="assignment-title"
            className="text-sm font-medium text-slate-700"
          >
            Assignment title
          </label>

          <input
            id="assignment-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Example: Unit 4 Practice FRQ"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="assignment-course"
            className="text-sm font-medium text-slate-700"
          >
            Course
          </label>

          <select
            id="assignment-course"
            value={course}
            onChange={(event) =>
              setCourse(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {courseNames.length === 0 ? (
              <option value="">
                Add a course first
              </option>
            ) : (
              courseNames.map((courseName) => (
                <option
                  key={courseName}
                  value={courseName}
                >
                  {courseName}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="assignment-due-date"
              className="text-sm font-medium text-slate-700"
            >
              Due date
            </label>

            <input
              id="assignment-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="assignment-priority"
              className="text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="assignment-priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target
                    .value as AssignmentPriority,
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">
                Medium
              </option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="assignment-notes"
            className="text-sm font-medium text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="assignment-notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            placeholder="Optional instructions or reminders"
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
            {assignmentToEdit
              ? "Save Changes"
              : "Add Assignment"}
          </button>

          {assignmentToEdit && (
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
          <p className="text-sm text-amber-700">
            Create at least one course before
            adding an assignment.
          </p>
        )}
      </form>
    </section>
  );
}