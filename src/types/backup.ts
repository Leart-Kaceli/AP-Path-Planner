import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";
import type {
  CourseGradeWeights,
  GradeEntry,
} from "@/types/grade";
import type { StudentProfile } from "@/types/profile";
import type { StudySession } from "@/types/studySession";

export type AppBackup = {
  version: 2;
  exportedAt: string;
  courses: Course[];
  assignments: Assignment[];
  studySessions: StudySession[];
  grades: GradeEntry[];
  gradeWeights: CourseGradeWeights;
  profile: StudentProfile;
  dismissedNotificationIds: string[];
};