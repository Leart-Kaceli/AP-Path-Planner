export type CalendarEventKind =
  | "assignment"
  | "study-session";

export type CalendarEvent = {
  id: string;
  kind: CalendarEventKind;
  title: string;
  course: string;
  date: string;
  time: string | null;
  completed: boolean;
  href: string;
};

export type CalendarFilter =
  | "all"
  | "assignment"
  | "study-session";