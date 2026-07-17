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

export type GradeWeights = Record<
  GradeCategory,
  number
>;

export type CourseGradeWeights = Record<
  string,
  GradeWeights
>;