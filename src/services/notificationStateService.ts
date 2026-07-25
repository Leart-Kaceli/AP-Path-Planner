import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  firestoreDatabase,
} from "@/lib/firebase";

import {
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
} from "@/constants/storage";

import type {
  SnoozedNotification,
} from "@/types/notification";

export type NotificationState = {
  dismissedNotificationIds: string[];
  snoozedNotifications:
    SnoozedNotification[];
};

const emptyNotificationState:
  NotificationState = {
    dismissedNotificationIds: [],
    snoozedNotifications: [],
  };

function loadLocalNotificationState():
  NotificationState {
  try {
    const dismissedValue =
      localStorage.getItem(
        DISMISSED_NOTIFICATION_STORAGE_KEY,
      );

    const snoozedValue =
      localStorage.getItem(
        SNOOZED_NOTIFICATION_STORAGE_KEY,
      );

    const dismissedParsed: unknown =
      dismissedValue
        ? JSON.parse(dismissedValue)
        : [];

    const snoozedParsed: unknown =
      snoozedValue
        ? JSON.parse(snoozedValue)
        : [];

    return {
      dismissedNotificationIds:
        Array.isArray(dismissedParsed)
          ? dismissedParsed.filter(
              (
                value,
              ): value is string =>
                typeof value ===
                "string",
            )
          : [],

      snoozedNotifications:
        Array.isArray(snoozedParsed)
          ? (snoozedParsed as
              SnoozedNotification[])
          : [],
    };
  } catch {
    return emptyNotificationState;
  }
}

function saveLocalNotificationState(
  state: NotificationState,
) {
  localStorage.setItem(
    DISMISSED_NOTIFICATION_STORAGE_KEY,
    JSON.stringify(
      state.dismissedNotificationIds,
    ),
  );

  localStorage.setItem(
    SNOOZED_NOTIFICATION_STORAGE_KEY,
    JSON.stringify(
      state.snoozedNotifications,
    ),
  );
}

export async function loadNotificationState(
  userId?: string | null,
): Promise<NotificationState> {
  if (!userId) {
    return loadLocalNotificationState();
  }

  const reference =
    doc(
      firestoreDatabase,
      "users",
      userId,
      "settings",
      "notifications",
    );

  const snapshot =
    await getDoc(reference);

  if (snapshot.exists()) {
    const data =
      snapshot.data();

    return {
      dismissedNotificationIds:
        Array.isArray(
          data.dismissedNotificationIds,
        )
          ? data.dismissedNotificationIds.filter(
              (
                value,
              ): value is string =>
                typeof value ===
                "string",
            )
          : [],

      snoozedNotifications:
        Array.isArray(
          data.snoozedNotifications,
        )
          ? data.snoozedNotifications
          : [],
    };
  }

  const localState =
    loadLocalNotificationState();

  await setDoc(
    reference,
    localState,
  );

  return localState;
}

export async function saveNotificationState(
  state: NotificationState,
  userId?: string | null,
) {
  saveLocalNotificationState(
    state,
  );

  if (!userId) {
    return;
  }

  await setDoc(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "settings",
      "notifications",
    ),
    state,
  );
}