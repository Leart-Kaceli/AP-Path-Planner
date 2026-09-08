import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getCourseColorStyles,
} from "@/utils/courseColors";

describe(
  "getCourseColorStyles",
  () => {
    it(
      "returns stable colors for the same course",
      () => {
        const firstResult =
          getCourseColorStyles(
            "AP Calculus BC",
          );

        const secondResult =
          getCourseColorStyles(
            "AP Calculus BC",
          );

        expect(
          secondResult,
        ).toEqual(
          firstResult,
        );
      },
    );

    it(
      "normalizes course name casing and whitespace",
      () => {
        const firstResult =
          getCourseColorStyles(
            "AP Physics C",
          );

        const secondResult =
          getCourseColorStyles(
            "  ap physics c  ",
          );

        expect(
          secondResult,
        ).toEqual(
          firstResult,
        );
      },
    );

    it(
      "returns fallback styling for an empty course name",
      () => {
        const result =
          getCourseColorStyles(
            "",
          );

        expect(
          result.badge,
        ).toContain(
          "slate",
        );

        expect(
          result.cardAccent,
        ).toContain(
          "slate",
        );
      },
    );
  },
);