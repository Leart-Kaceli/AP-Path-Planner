import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";
import type {
  CourseGradeWeights,
  GradeEntry,
} from "@/types/grade";
import type { StudentProfile } from "@/types/profile";
import type { StudySession } from "@/types/studySession";
import type {
  SnoozedNotification,
} from "@/types/notification";

export type AppBackup = {
  version: 3;
  exportedAt: string;
  courses: Course[];
  assignments: Assignment[];
  studySessions: StudySession[];
  grades: GradeEntry[];
  gradeWeights: CourseGradeWeights;
  profile: StudentProfile;
  dismissedNotificationIds: string[];
  snoozedNotifications:
    SnoozedNotification[];
  sentBrowserNotificationIds:
    string[];
};