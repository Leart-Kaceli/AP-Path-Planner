import type { Assignment } from "@/types/assignment";
import {
  getAssignmentTiming,
} from "@/utils/dates";

type ManagedAssignmentCardProps = {
  assignment: Assignment;
  onToggleComplete: (
    assignmentId: string,
  ) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
};

const priorityStyles = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

function formatDueDate(dueDate: string) {
  const date = new Date(
    `${dueDate}T00:00:00`,
  );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

const timingStyles = {
  Overdue: "bg-red-100 text-red-700",
  "Due Today":
    "bg-orange-100 text-orange-700",
  "Due Soon":
    "bg-amber-100 text-amber-700",
  Upcoming:
    "bg-slate-100 text-slate-700",
  Completed:
    "bg-green-100 text-green-700",
};

export default function ManagedAssignmentCard({
  assignment,
  onToggleComplete,
  onEdit,
  onDelete,
}: ManagedAssignmentCardProps) {
  const timing = getAssignmentTiming(
    assignment.dueDate,
    assignment.completed,
  );

  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
        assignment.completed
          ? "border-green-200 opacity-75"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={assignment.completed}
          onChange={() =>
            onToggleComplete(assignment.id)
          }
          aria-label={`Mark ${assignment.title} as ${
            assignment.completed
              ? "incomplete"
              : "complete"
          }`}
          className="mt-1 h-5 w-5 rounded border-slate-300 accent-blue-600"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  assignment.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-900"
                }`}
              >
                {assignment.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {assignment.course}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                priorityStyles[
                  assignment.priority
                ]
              }`}
            >
              {assignment.priority}
            </span>
            <span
  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
    timingStyles[timing]
  }`}
>
  {timing}
</span>
          </div>



          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <p>
              Due:{" "}
              <span className="font-medium text-slate-800">
                {formatDueDate(
                  assignment.dueDate,
                )}
              </span>
            </p>

            <p>
              Status:{" "}
              <span className="font-medium text-slate-800">
                {assignment.completed
                  ? "Completed"
                  : "Active"}
              </span>
            </p>
          </div>

          {assignment.notes && (
            <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {assignment.notes}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() =>
                onEdit(assignment)
              }
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(assignment.id)
              }
              className="text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}