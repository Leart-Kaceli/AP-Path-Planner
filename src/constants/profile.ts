import type { StudentProfile } from "@/types/profile";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: "Leart",
  school: "",
  graduationYear: "2027",
  weeklyStudyGoalMinutes: 300,
  theme: "system",

  assignmentRemindersEnabled: true,
  studyRemindersEnabled: true,

  assignmentReminderTiming:
    "one-day",

  studyReminderTiming:
    "one-day",

  browserNotificationsEnabled: false,
  browserNotificationsForAssignments: true,
  browserNotificationsForStudySessions: true,
};