export type ThemePreference =
  | "light"
  | "dark"
  | "system";

export type ReminderTiming =
  | "none"
  | "same-day"
  | "one-day"
  | "two-days";

export type StudentProfile = {
  name: string;
  school: string;
  graduationYear: string;
  weeklyStudyGoalMinutes: number;
  theme: ThemePreference;
  assignmentRemindersEnabled: boolean;
  studyRemindersEnabled: boolean;
  assignmentReminderTiming:
    ReminderTiming;
  studyReminderTiming:
    ReminderTiming;
};