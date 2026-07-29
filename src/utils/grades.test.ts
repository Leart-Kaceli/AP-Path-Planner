import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculatePointAverage,
  calculateWeightedAverage,
} from "@/utils/grades";

import type {
  GradeEntry,
  GradeWeights,
} from "@/types/grade";

const sampleGrades:
  GradeEntry[] = [
    {
      id: "grade-1",
      course:
        "AP Calculus BC",
      title:
        "Limits Quiz",
      category:
        "Quiz",
      earnedPoints: 18,
      possiblePoints: 20,
      date:
        "2026-07-20",
    },

    {
      id: "grade-2",
      course:
        "AP Calculus BC",
      title:
        "Derivative Test",
      category:
        "Test",
      earnedPoints: 90,
      possiblePoints: 100,
      date:
        "2026-07-25",
    },
  ];

const sampleWeights:
  GradeWeights = {
    Homework: 0,
    Quiz: 40,
    Test: 60,
    Project: 0,
    Other: 0,
  };

describe(
  "grade utilities",
  () => {
    describe(
      "calculatePointAverage",
      () => {
        it(
          "returns null when there are no grades",
          () => {
            expect(
              calculatePointAverage(
                [],
              ),
            ).toBeNull();
          },
        );

        it(
          "calculates a point-based average",
          () => {
            expect(
              calculatePointAverage(
                sampleGrades,
              ),
            ).toBe(90);
          },
        );
      },
    );

    describe(
      "calculateWeightedAverage",
      () => {
        it(
          "returns null when there are no grades",
          () => {
            expect(
              calculateWeightedAverage(
                [],
                sampleWeights,
              ),
            ).toBeNull();
          },
        );

        it(
          "calculates an average from populated categories",
          () => {
            expect(
              calculateWeightedAverage(
                sampleGrades,
                sampleWeights,
              ),
            ).toBe(90);
          },
        );
      },
    );
  },
);