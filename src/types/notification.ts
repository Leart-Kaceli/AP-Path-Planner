export type NotificationKind =
  | "assignment"
  | "study-session";

export type NotificationUrgency =
  | "overdue"
  | "today"
  | "upcoming";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  urgency: NotificationUrgency;
  title: string;
  description: string;
  href: string;
  eventDateTime: string;
};

export type SnoozedNotification = {
  notificationId: string;
  snoozedUntil: string;
};