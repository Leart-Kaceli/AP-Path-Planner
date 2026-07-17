import { GRADE_CATEGORIES } from "@/constants/grades";

import type {
  GradeCategory,
  GradeEntry,
  GradeWeights,
} from "@/types/grade";

export function calculateGradePercentage(
  grade: GradeEntry,
) {
  if (grade.possiblePoints === 0) {
    return 0;
  }

  return Math.round(
    (grade.earnedPoints /
      grade.possiblePoints) *
      100,
  );
}

export function calculatePointAverage(
  grades: GradeEntry[],
) {
  const totalEarned = grades.reduce(
    (total, grade) =>
      total + grade.earnedPoints,
    0,
  );

  const totalPossible = grades.reduce(
    (total, grade) =>
      total + grade.possiblePoints,
    0,
  );

  if (totalPossible === 0) {
    return null;
  }

  return Math.round(
    (totalEarned / totalPossible) * 100,
  );
}

export function calculateCategoryAverage(
  grades: GradeEntry[],
  category: GradeCategory,
) {
  const categoryGrades = grades.filter(
    (grade) => grade.category === category,
  );

  return calculatePointAverage(categoryGrades);
}

export function calculateWeightedAverage(
  grades: GradeEntry[],
  weights: GradeWeights,
) {
  let weightedTotal = 0;
  let activeWeightTotal = 0;

  for (const category of GRADE_CATEGORIES) {
    const categoryAverage =
      calculateCategoryAverage(
        grades,
        category,
      );

    if (categoryAverage === null) {
      continue;
    }

    const categoryWeight = weights[category];

    weightedTotal +=
      categoryAverage * categoryWeight;

    activeWeightTotal += categoryWeight;
  }

  if (activeWeightTotal === 0) {
    return null;
  }

  return Math.round(
    weightedTotal / activeWeightTotal,
  );
}

export function getLetterGrade(
  percentage: number,
) {
  if (percentage >= 93.5) {
    return "A";
  }

  if (percentage >= 89.5) {
    return "A-";
  }

  if (percentage >= 86.5) {
    return "B+";
  }

  if (percentage >= 82.5) {
    return "B";
  }

  if (percentage >= 79.5) {
    return "B-";
  }

  if (percentage >= 76.5) {
    return "C+";
  }

  if (percentage >= 72.5) {
    return "C";
  }

  if (percentage >= 69.5) {
    return "C-";
  }

  if (percentage >= 66.5) {
    return "D+";
  }

  if (percentage >= 62.5) {
    return "D";
  }

  if (percentage >= 59.5) {
    return "D-";
  }

  return "F";
}