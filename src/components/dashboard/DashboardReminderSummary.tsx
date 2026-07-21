import Link from "next/link";

import type {
  AppNotification,
} from "@/types/notification";

type DashboardReminderSummaryProps = {
  notifications: AppNotification[];
};

export default function DashboardReminderSummary({
  notifications,
}: DashboardReminderSummaryProps) {
  const overdueCount =
    notifications.filter(
      (notification) =>
        notification.urgency ===
        "overdue",
    ).length;

  const todayCount =
    notifications.filter(
      (notification) =>
        notification.urgency ===
        "today",
    ).length;

  const upcomingCount =
    notifications.filter(
      (notification) =>
        notification.urgency ===
        "upcoming",
    ).length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Reminder Summary
        </h2>

        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Assignment and study reminders
          that need your attention.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <ReminderCount
          label="Overdue"
          count={overdueCount}
          className="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
        />

        <ReminderCount
          label="Today"
          count={todayCount}
          className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
        />

        <ReminderCount
          label="Upcoming"
          count={upcomingCount}
          className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
        />
      </div>

      {notifications.length > 0 ? (
        <div className="mt-6 space-y-3">
          {notifications
            .slice(0, 3)
            .map((notification) => (
              <Link
                key={notification.id}
                href={notification.href}
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {notification.title}
                </p>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {
                    notification.description
                  }
                </p>
              </Link>
            ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">
            No active reminders
          </p>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            You are currently all caught up.
          </p>
        </div>
      )}
    </section>
  );
}

type ReminderCountProps = {
  label: string;
  count: number;
  className: string;
};

function ReminderCount({
  label,
  count,
  className,
}: ReminderCountProps) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
    >
      <p className="text-sm font-semibold">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {count}
      </p>
    </div>
  );
}