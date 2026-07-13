type AssignmentCardProps = {
  title: string;
  course: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
};

export default function AssignmentCard({
  title,
  course,
  dueDate,
  priority,
}: AssignmentCardProps) {
  const priorityStyles = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <article className="flex flex-col gap-4 border-b border-slate-200 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {course} · Due {dueDate}
        </p>
      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[priority]}`}
      >
        {priority}
      </span>
    </article>
  );
}