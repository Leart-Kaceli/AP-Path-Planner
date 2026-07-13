type ProgressItem = {
  label: string;
  completed: number;
  total: number;
};

const progressItems: ProgressItem[] = [
  {
    label: "Assignments completed",
    completed: 8,
    total: 10,
  },
  {
    label: "Weekly study goal",
    completed: 6,
    total: 8,
  },
  {
    label: "Practice tests completed",
    completed: 2,
    total: 4,
  },
];

export default function ProgressCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Weekly Progress
      </h2>

      <div className="mt-6 space-y-6">
        {progressItems.map((item) => {
          const percentage = Math.round(
            (item.completed / item.total) * 100,
          );

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-slate-600">
                  {item.label}
                </span>

                <span className="font-semibold text-slate-900">
                  {item.completed}/{item.total}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}