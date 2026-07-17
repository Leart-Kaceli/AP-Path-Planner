import type {
  GradeCategory,
  GradeWeights,
} from "@/types/grade";

export const GRADE_CATEGORIES: GradeCategory[] = [
  "Homework",
  "Quiz",
  "Test",
  "Project",
  "Other",
];

export const DEFAULT_GRADE_WEIGHTS: GradeWeights = {
  Homework: 20,
  Quiz: 20,
  Test: 40,
  Project: 15,
  Other: 5,
};