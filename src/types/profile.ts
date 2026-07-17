export type ThemePreference =
  | "light"
  | "dark"
  | "system";

export type StudentProfile = {
  name: string;
  school: string;
  graduationYear: string;
  weeklyStudyGoalMinutes: number;
  theme: ThemePreference;
};