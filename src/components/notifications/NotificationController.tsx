"use client";

import {
  useEffect,
  useState,
} from "react";

import NotificationCenter from "@/components/notifications/NotificationCenter";


import {
  DISMISSED_NOTIFICATION_STORAGE_KEY,
} from "@/constants/storage";

import type { AppNotification } from "@/types/notification";

import {
  loadNotificationData,
} from "@/utils/notifications";

import {
  APP_DATA_CHANGED_EVENT,
} from "@/utils/appEvents";



export default function NotificationController() {
  const [isOpen, setIsOpen] =
    useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<AppNotification[]>([]);

  const [
    dismissedNotificationIds,
    setDismissedNotificationIds,
  ] = useState<string[]>([]);

  const [hasLoaded, setHasLoaded] =
    useState(false);

    function refreshNotifications() {
  try {
    const loadedData =
      loadNotificationData();

    setDismissedNotificationIds(
      loadedData
        .dismissedNotificationIds,
    );

    setNotifications(
      loadedData.notifications,
    );
  } catch (error) {
    console.error(
      "Could not refresh notifications:",
      error,
    );
  }
}

 useEffect(() => {
  const loadedData =
    loadNotificationData();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setDismissedNotificationIds(
    loadedData.dismissedNotificationIds,
  );

  setNotifications(
    loadedData.notifications,
  );

  setHasLoaded(true);

  function handleAppDataChanged() {
    refreshNotifications();
  }

  window.addEventListener(
    APP_DATA_CHANGED_EVENT,
    handleAppDataChanged,
  );

  return () => {
    window.removeEventListener(
      APP_DATA_CHANGED_EVENT,
      handleAppDataChanged,
    );
  };
}, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    localStorage.setItem(
      DISMISSED_NOTIFICATION_STORAGE_KEY,
      JSON.stringify(
        dismissedNotificationIds,
      ),
    );
  }, [
    dismissedNotificationIds,
    hasLoaded,
  ]);

  function dismissNotification(
    notificationId: string,
  ) {
    setNotifications(
      (currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification.id !==
            notificationId,
        ),
    );

    setDismissedNotificationIds(
      (currentIds) => [
        ...currentIds,
        notificationId,
      ],
    );
  }

  function dismissAllNotifications() {
    setDismissedNotificationIds(
      (currentIds) => [
        ...currentIds,
        ...notifications.map(
          (notification) =>
            notification.id,
        ),
      ],
    );

    setNotifications([]);
  }

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
      />
    </>
  );
}