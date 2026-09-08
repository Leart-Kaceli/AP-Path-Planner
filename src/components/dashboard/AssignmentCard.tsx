import type {
  AssignmentPriority,
} from "@/types/assignment";

import {
  getCourseColorStyles,
} from "@/utils/courseColors";

import {
  formatDate,
  getAssignmentTiming,
} from "@/utils/dates";

type AssignmentCardProps = {
  title: string;
  course: string;
  dueDate: string;
  priority:
    AssignmentPriority;
};

const priorityStyles = {
  Low:
    "bg-green-100 text-green-700",
  Medium:
    "bg-amber-100 text-amber-700",
  High:
    "bg-red-100 text-red-700",
};

const timingStyles = {
  Overdue:
    "text-red-600",
  "Due Today":
    "text-orange-600",
  "Due Soon":
    "text-amber-600",
  Upcoming:
    "text-slate-500",
  Completed:
    "text-green-600",
};

export default function AssignmentCard({
  title,
  course,
  dueDate,
  priority,
}: AssignmentCardProps) {
  const timing =
    getAssignmentTiming(
      dueDate,
      false,
    );

  const courseColors =
    getCourseColorStyles(
      course,
    );

  return (
    <article
      className={`flex flex-col gap-4 border-b border-l-4 border-slate-200 py-5 pl-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between ${courseColors.cardAccent}`}
    >
      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${courseColors.badge}`}
          >
            {course}
          </span>

          <span className="text-sm text-slate-500">
            Due{" "}
            {formatDate(
              dueDate,
            )}
          </span>
        </div>

        <p
          className={`mt-2 text-xs font-semibold ${timingStyles[timing]}`}
        >
          {timing}
        </p>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          priorityStyles[
            priority
          ]
        }`}
      >
        {priority}
      </span>
    </article>
  );
}