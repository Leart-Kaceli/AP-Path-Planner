"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  APP_DATA_CHANGED_EVENT,
} from "@/utils/appEvents";

import {
  loadNotificationData,
} from "@/utils/notifications";

import {
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
} from "@/constants/storage";

import type {
  AppNotification,
  SnoozedNotification,
} from "@/types/notification";

import {
  PROFILE_STORAGE_KEY,
  SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
} from "@/constants/storage";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";

import type {
  StudentProfile,
} from "@/types/profile";

import {
  sendBrowserNotification,
  shouldSendBrowserNotification,
} from "@/utils/browserNotifications";

function loadProfile():
  StudentProfile {
  try {
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

    return {
      ...DEFAULT_STUDENT_PROFILE,
      ...parsedProfile,
    };
  } catch {
    return {
      ...DEFAULT_STUDENT_PROFILE,
    };
  }
}

function loadSentBrowserNotificationIds() {
  try {
    const storedValue =
      localStorage.getItem(
        SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
      );

    const parsedValue: unknown =
      storedValue
        ? JSON.parse(storedValue)
        : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (
            value,
          ): value is string =>
            typeof value === "string",
        )
      : [];
  } catch {
    return [];
  }
}

type NotificationContextValue = {
  notifications: AppNotification[];
  dismissedNotificationIds: string[];
  snoozedNotifications:
    SnoozedNotification[];
  refreshNotifications: () => void;
  dismissNotification: (
    notificationId: string,
  ) => void;
  dismissAllNotifications: () => void;
  snoozeNotification: (
    notificationId: string,
    snoozedUntil: Date,
  ) => void;
};

const NotificationContext =
  createContext<
    NotificationContextValue | undefined
  >(undefined);

type NotificationProviderProps = {
  children: ReactNode;
};

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [
    notifications,
    setNotifications,
  ] = useState<AppNotification[]>([]);

  const [
    dismissedNotificationIds,
    setDismissedNotificationIds,
  ] = useState<string[]>([]);

  const [
    snoozedNotifications,
    setSnoozedNotifications,
  ] = useState<SnoozedNotification[]>([]);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  function refreshNotifications() {
    const loadedData =
      loadNotificationData();

    const profile = loadProfile();

const sentIds =
  loadSentBrowserNotificationIds();

const newSentIds = [...sentIds];

loadedData.notifications.forEach(
  (notification) => {
    if (
      sentIds.includes(
        notification.id,
      )
    ) {
      return;
    }

    if (
      !shouldSendBrowserNotification(
        notification,
        profile,
      )
    ) {
      return;
    }

    sendBrowserNotification(
      notification,
    );

    newSentIds.push(
      notification.id,
    );
  },
);

localStorage.setItem(
  SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
  JSON.stringify(newSentIds),
);

    setNotifications(
      loadedData.notifications,
    );

    setDismissedNotificationIds(
      loadedData
        .dismissedNotificationIds,
    );

    setSnoozedNotifications(
      loadedData.snoozedNotifications,
    );
  }

 useEffect(() => {
    
  // eslint-disable-next-line react-hooks/set-state-in-effect
  refreshNotifications();


  setHasLoaded(true);

  function handleAppDataChanged() {
    refreshNotifications();
  }

  function handleStorageChange() {
    refreshNotifications();
  }

  window.addEventListener(
    APP_DATA_CHANGED_EVENT,
    handleAppDataChanged,
  );

  window.addEventListener(
    "storage",
    handleStorageChange,
  );

  return () => {
    window.removeEventListener(
      APP_DATA_CHANGED_EVENT,
      handleAppDataChanged,
    );

    window.removeEventListener(
      "storage",
      handleStorageChange,
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

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    localStorage.setItem(
      SNOOZED_NOTIFICATION_STORAGE_KEY,
      JSON.stringify(
        snoozedNotifications,
      ),
    );
  }, [
    snoozedNotifications,
    hasLoaded,
  ]);

  function dismissNotification(
    notificationId: string,
  ) {
    setDismissedNotificationIds(
      (currentIds) =>
        currentIds.includes(
          notificationId,
        )
          ? currentIds
          : [
              ...currentIds,
              notificationId,
            ],
    );

    setNotifications(
      (currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification.id !==
            notificationId,
        ),
    );
  }

  function dismissAllNotifications() {
    setDismissedNotificationIds(
      (currentIds) =>
        Array.from(
          new Set([
            ...currentIds,
            ...notifications.map(
              (notification) =>
                notification.id,
            ),
          ]),
        ),
    );

    setNotifications([]);
  }

  function snoozeNotification(
    notificationId: string,
    snoozedUntil: Date,
  ) {
    setSnoozedNotifications(
      (currentItems) => [
        ...currentItems.filter(
          (item) =>
            item.notificationId !==
            notificationId,
        ),
        {
          notificationId,
          snoozedUntil:
            snoozedUntil.toISOString(),
        },
      ],
    );

    setNotifications(
      (currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification.id !==
            notificationId,
        ),
    );
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        dismissedNotificationIds,
        snoozedNotifications,
        refreshNotifications,
        dismissNotification,
        dismissAllNotifications,
        snoozeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider.",
    );
  }

  return context;
}