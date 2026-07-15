import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";

export type DashboardData = {
  courses: Course[];
  assignments: Assignment[];
};

export type AssignmentTiming =
  | "Overdue"
  | "Due Today"
  | "Due Soon"
  | "Upcoming"
  | "Completed";