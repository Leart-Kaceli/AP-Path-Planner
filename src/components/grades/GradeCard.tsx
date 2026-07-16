import type { GradeEntry } from "@/types/grade";
import { formatDate } from "@/utils/dates";

type GradeCardProps = {
  grade: GradeEntry;
  onEdit: (grade: GradeEntry) => void;
  onDelete: (gradeId: string) => void;
};

function calculatePercentage(grade: GradeEntry) {
  return Math.round(
    (grade.earnedPoints / grade.possiblePoints) *
      100,
  );
}

function getGradeStyle(percentage: number) {
  if (percentage >= 90) {
    return "bg-green-100 text-green-700";
  }

  if (percentage >= 80) {
    return "bg-blue-100 text-blue-700";
  }

  if (percentage >= 70) {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
}

export default function GradeCard({
  grade,
  onEdit,
  onDelete,
}: GradeCardProps) {
  const percentage = calculatePercentage(grade);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {grade.title}
          </h3>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {grade.course}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${getGradeStyle(
            percentage,
          )}`}
        >
          {percentage}%
        </span>
      </div>

      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-slate-500">
            Category
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {grade.category}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Score
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {grade.earnedPoints}/
            {grade.possiblePoints}
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Date
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {formatDate(grade.date)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => onEdit(grade)}
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(grade.id)}
          className="text-sm font-semibold text-red-600 transition hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  );
}