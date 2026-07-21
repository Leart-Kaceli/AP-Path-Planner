"use client";

import { useState } from "react";

import NotificationCenter from "@/components/notifications/NotificationCenter";

import {
  useNotifications,
} from "@/components/notifications/NotificationProvider";

export default function NotificationController() {
  const [isOpen, setIsOpen] =
    useState(false);

  const {
    notifications,
    dismissNotification,
    dismissAllNotifications,
    snoozeNotification,
  } = useNotifications();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (currentOpen) =>
              !currentOpen,
          )
        }
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span aria-hidden="true">
          🔔
        </span>

        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
            {notifications.length > 99
              ? "99+"
              : notifications.length}
          </span>
        )}
      </button>

      <NotificationCenter
        open={isOpen}
        notifications={notifications}
        onClose={() =>
          setIsOpen(false)
        }
        onDismiss={
          dismissNotification
        }
        onDismissAll={
          dismissAllNotifications
        }
        onSnooze={
          snoozeNotification
        }
      />
    </>
  );
}