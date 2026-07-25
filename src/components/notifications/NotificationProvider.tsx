"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loadNotificationState,
  saveNotificationState,
} from "@/services/notificationStateService";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  loadAssignments,
} from "@/services/assignmentService";

import {
  loadStudySessions,
} from "@/services/studySessionService";

import {
  loadProfile,
} from "@/services/profileService";

import {
  createAppNotifications,
} from "@/utils/notifications";

import {
  APP_DATA_CHANGED_EVENT,
} from "@/utils/appEvents";

import {
  SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
} from "@/constants/storage";

import {
  sendBrowserNotification,
  shouldSendBrowserNotification,
} from "@/utils/browserNotifications";

import type {
  AppNotification,
  SnoozedNotification,
} from "@/types/notification";



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

  refreshNotifications:
    () => Promise<void>;

  dismissNotification: (
    notificationId: string,
  ) => void;

  dismissAllNotifications:
    () => void;

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
  const {
    user,
    isLoading: isAuthLoading,
  } = useAuth();

  const userId =
  user?.uid;

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

  const refreshNotifications =
    useCallback(async () => {
      if (isAuthLoading) {
        return;
      }

      try {
        const [
  assignments,
  studySessions,
  profile,
  notificationState,
] = await Promise.all([
  loadAssignments(
    userId,
  ),

  loadStudySessions(
    userId,
  ),

  loadProfile(
    userId,
  ),

  loadNotificationState(
    userId,
  ),
]);

        const loadedDismissedIds =
  notificationState
    .dismissedNotificationIds;

const loadedSnoozedNotifications =
  notificationState
    .snoozedNotifications;

        const currentTime =
          Date.now();

        const activeSnoozedNotifications =
          loadedSnoozedNotifications.filter(
            (item) =>
              new Date(
                item.snoozedUntil,
              ).getTime() >
              currentTime,
          );

        const generatedNotifications =
          createAppNotifications(
            assignments,
            studySessions,
            profile,
          );

        const activeSnoozedIds =
          new Set(
            activeSnoozedNotifications.map(
              (item) =>
                item.notificationId,
            ),
          );

        const dismissedIds =
          new Set(
            loadedDismissedIds,
          );

        const visibleNotifications =
          generatedNotifications.filter(
            (notification) =>
              !dismissedIds.has(
                notification.id,
              ) &&
              !activeSnoozedIds.has(
                notification.id,
              ),
          );

        const storedSentIds =
          loadSentBrowserNotificationIds();

        const knownNotificationIds =
          new Set([
            ...generatedNotifications.map(
              (notification) =>
                notification.id,
            ),

            ...loadedDismissedIds,

            ...activeSnoozedNotifications.map(
              (item) =>
                item.notificationId,
            ),
          ]);

        const cleanedSentIds =
          storedSentIds.filter(
            (notificationId) =>
              knownNotificationIds.has(
                notificationId,
              ),
          );

        const nextSentIds =
          new Set(cleanedSentIds);

        visibleNotifications.forEach(
          (notification) => {
            if (
              nextSentIds.has(
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

            nextSentIds.add(
              notification.id,
            );
          },
        );

        localStorage.setItem(
          SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
          JSON.stringify(
            Array.from(
              nextSentIds,
            ),
          ),
        );

        localStorage.setItem(
          SNOOZED_NOTIFICATION_STORAGE_KEY,
          JSON.stringify(
            activeSnoozedNotifications,
          ),
        );

        setNotifications(
          visibleNotifications,
        );

        setDismissedNotificationIds(
          loadedDismissedIds,
        );

        setSnoozedNotifications(
          activeSnoozedNotifications,
        );
      } catch (error) {
        console.error(
          "Could not refresh notifications:",
          error,
        );
      }
    }, [
  isAuthLoading,
  userId,
]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    let isCancelled = false;

    async function initializeNotifications() {
      await refreshNotifications();

      if (!isCancelled) {
        setHasLoaded(true);
      }
    }

    void initializeNotifications();

    function handleAppDataChanged() {
      void refreshNotifications();
    }

    function handleStorageChange() {
      void refreshNotifications();
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
      isCancelled = true;

      window.removeEventListener(
        APP_DATA_CHANGED_EVENT,
        handleAppDataChanged,
      );

      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
    };
  }, [
    isAuthLoading,
    refreshNotifications,
  ]);

  useEffect(() => {
  if (!hasLoaded) {
    return;
  }

  async function persistNotificationState() {
    try {
      await saveNotificationState(
        {
          dismissedNotificationIds,
          snoozedNotifications,
        },
        userId,
      );
    } catch (error) {
      console.error(
        "Could not save notification state:",
        error,
      );
    }
  }

  void persistNotificationState();
}, [
  dismissedNotificationIds,
  snoozedNotifications,
  hasLoaded,
  userId,
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
    useContext(
      NotificationContext,
    );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider.",
    );
  }

  return context;
}