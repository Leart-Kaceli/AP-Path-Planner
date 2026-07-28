import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hasObjectChanged,
} from "@/utils/conflicts";

describe(
  "hasObjectChanged",
  () => {
    it(
      "returns false for equal objects",
      () => {
        const original = {
          id: "course-1",
          name: "AP Physics C",
          progress: 30,
        };

        const latest = {
          id: "course-1",
          name: "AP Physics C",
          progress: 30,
        };

        expect(
          hasObjectChanged(
            original,
            latest,
          ),
        ).toBe(false);
      },
    );

    it(
      "returns true when a field changes",
      () => {
        const original = {
          id: "course-1",
          name: "AP Physics C",
          progress: 30,
        };

        const latest = {
          id: "course-1",
          name: "AP Physics C",
          progress: 60,
        };

        expect(
          hasObjectChanged(
            original,
            latest,
          ),
        ).toBe(true);
      },
    );

    it(
      "detects nested changes",
      () => {
        const original = {
          settings: {
            reminders: true,
          },
        };

        const latest = {
          settings: {
            reminders: false,
          },
        };

        expect(
          hasObjectChanged(
            original,
            latest,
          ),
        ).toBe(true);
      },
    );
  },
);