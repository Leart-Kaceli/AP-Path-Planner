import Link from "next/link";

const quickActions = [
  {
    label: "Add Assignment",
    href: "/assignments",
  },
  {
    label: "Plan Study",
    href: "/planner",
  },
  {
    label: "Add Course",
    href: "/courses",
  },
  {
    label: "Add Grade",
    href: "/grades",
  },
];

export default function DashboardQuickActions() {
  return (
    <section className="px-6 pt-6 lg:hidden">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Quick Actions
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {quickActions.map(
          (action) => (
            <Link
              key={
                action.href
              }
              href={
                action.href
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {action.label}
            </Link>
          ),
        )}
      </div>
    </section>
  );
}