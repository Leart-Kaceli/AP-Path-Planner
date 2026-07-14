import type { Course } from "@/types/course";

type ManagedCourseCardProps = {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
};

export default function ManagedCourseCard({
  course,
  onEdit,
  onDelete,
}: ManagedCourseCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {course.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {course.teacher}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          Goal: {course.goalScore}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            Course progress
          </span>

          <span className="font-semibold text-slate-900">
            {course.progress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
  <button
    type="button"
    onClick={() => onEdit(course)}
    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
  >
    Edit Course
  </button>

  <button
    type="button"
    onClick={() => onDelete(course.id)}
    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
  >
    Delete Course
  </button>
</div>
    </article>
  );
}