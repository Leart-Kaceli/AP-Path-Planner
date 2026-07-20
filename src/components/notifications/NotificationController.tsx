"use client";

import {
  useEffect,
  useState,
} from "react";

import NotificationCenter from "@/components/notifications/NotificationCenter";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";

import {
  ASSIGNMENT_STORAGE_KEY,
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import type { Assignment } from "@/types/assignment";
import type { AppNotification } from "@/types/notification";
import type { StudentProfile } from "@/types/profile";
import type { StudySession } from "@/types/studySession";

import { normalizeAssignment } from "@/utils/assignments";
import { createAppNotifications } from "@/utils/notifications";
import { normalizeStudySession } from "@/utils/studySessions";

function readArray<T>(
  storageKey: string,
) {
  try {
    const storedValue =
      localStorage.getItem(storageKey);

    if (!storedValue) {
      return [] as T[];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as T[])
      : [];
  } catch {
    return [] as T[];
  }
}

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

  useEffect(() => {
    try {
      const assignments =
        readArray<Assignment>(
          ASSIGNMENT_STORAGE_KEY,
        ).map(normalizeAssignment);

      const studySessions =
        readArray<StudySession>(
          STUDY_SESSION_STORAGE_KEY,
        ).map(normalizeStudySession);

      const storedProfile =
        localStorage.getItem(
          PROFILE_STORAGE_KEY,
        );

      const parsedProfile =
        storedProfile
          ? (JSON.parse(
              storedProfile,
            ) as Partial<StudentProfile>)
          : {};

      const profile: StudentProfile = {
        ...DEFAULT_STUDENT_PROFILE,
        ...parsedProfile,
      };

      const storedDismissed =
        localStorage.getItem(
          DISMISSED_NOTIFICATION_STORAGE_KEY,
        );

      const parsedDismissed =
        storedDismissed
          ? (JSON.parse(
              storedDismissed,
            ) as unknown)
          : [];

      const safeDismissed =
        Array.isArray(parsedDismissed)
          ? parsedDismissed.filter(
              (
                value,
              ): value is string =>
                typeof value === "string",
            )
          : [];

      const generatedNotifications =
        createAppNotifications(
          assignments,
          studySessions,
          profile,
        );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissedNotificationIds(
        safeDismissed,
      );

      setNotifications(
        generatedNotifications.filter(
          (notification) =>
            !safeDismissed.includes(
              notification.id,
            ),
        ),
      );
    } catch (error) {
      console.error(
        "Could not load notifications:",
        error,
      );
    } finally {
      setHasLoaded(true);
    }
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