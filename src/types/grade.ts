export type GradeCategory =
  | "Homework"
  | "Quiz"
  | "Test"
  | "Project"
  | "Other";

export type GradeEntry = {
  id: string;
  course: string;
  title: string;
  category: GradeCategory;
  earnedPoints: number;
  possiblePoints: number;
  date: string;
};