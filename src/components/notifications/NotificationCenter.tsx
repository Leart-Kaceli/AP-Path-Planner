"use client";

import Link from "next/link";

import type { AppNotification } from "@/types/notification";

type NotificationCenterProps = {
  open: boolean;
  notifications: AppNotification[];
  onClose: () => void;
  onDismiss: (
    notificationId: string,
  ) => void;
  onDismissAll: () => void;
};

const urgencyStyles = {
  overdue:
    "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  today:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  upcoming:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
};

const urgencyLabels = {
  overdue: "Overdue",
  today: "Today",
  upcoming: "Upcoming",
};

export default function NotificationCenter({
  open,
  notifications,
  onClose,
  onDismiss,
  onDismissAll,
}: NotificationCenterProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close notification center"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/40"
      />

      <aside
        aria-label="Notification center"
        className="fixed right-4 top-20 z-50 max-h-[calc(100vh-6rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {notifications.length} active
              reminder
              {notifications.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span aria-hidden="true">
              ×
            </span>
          </button>
        </div>

        {notifications.length > 0 ? (
          <>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {notifications.map(
                (notification) => (
                  <article
                    key={notification.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            urgencyStyles[
                              notification
                                .urgency
                            ]
                          }`}
                        >
                          {
                            urgencyLabels[
                              notification
                                .urgency
                            ]
                          }
                        </span>

                        <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
                          {notification.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {
                            notification.description
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onDismiss(
                            notification.id,
                          )
                        }
                        aria-label={`Dismiss ${notification.title}`}
                        className="shrink-0 text-sm font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400"
                      >
                        Dismiss
                      </button>
                    </div>

                    <Link
                      href={notification.href}
                      onClick={onClose}
                      className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      View details
                    </Link>
                  </article>
                ),
              )}
            </div>

            <div className="border-t border-slate-200 p-5 dark:border-slate-700">
              <button
                type="button"
                onClick={onDismissAll}
                className="w-full rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Dismiss All
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-slate-900 dark:text-white">
              You are all caught up
            </p>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              No active assignment or study
              reminders.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}