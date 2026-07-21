import type { AppNotification } from "@/types/notification";
import type { StudentProfile } from "@/types/profile";

export function canSendBrowserNotifications() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission ===
      "granted"
  );
}

export function shouldSendBrowserNotification(
  notification: AppNotification,
  profile: StudentProfile,
) {
  if (
    !profile.browserNotificationsEnabled
  ) {
    return false;
  }

  if (
    notification.kind ===
      "assignment" &&
    !profile
      .browserNotificationsForAssignments
  ) {
    return false;
  }

  if (
    notification.kind ===
      "study-session" &&
    !profile
      .browserNotificationsForStudySessions
  ) {
    return false;
  }

  return true;
}

export function sendBrowserNotification(
  notification: AppNotification,
) {
  if (!canSendBrowserNotifications()) {
    return;
  }

  new Notification(
    notification.title,
    {
      body:
        notification.description,
      tag: notification.id,
    },
  );
}