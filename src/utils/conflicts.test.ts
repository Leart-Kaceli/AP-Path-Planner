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
      "returns false for equal flat objects",
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
      "returns true when a number changes",
      () => {
        const original = {
          id: "course-1",
          progress: 30,
        };

        const latest = {
          id: "course-1",
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
      "returns true when a string changes",
      () => {
        const original = {
          name: "AP Physics C",
        };

        const latest = {
          name: "AP Calculus BC",
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
      "detects a nested object change",
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

    it(
      "returns false for equal arrays",
      () => {
        const original = {
          categories: [
            "Homework",
            "Tests",
          ],
        };

        const latest = {
          categories: [
            "Homework",
            "Tests",
          ],
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
      "detects an array item change",
      () => {
        const original = {
          categories: [
            "Homework",
            "Tests",
          ],
        };

        const latest = {
          categories: [
            "Homework",
            "Quizzes",
          ],
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
      "detects a newly added property",
      () => {
        const original = {
          id: "assignment-1",
          completed: false,
        };

        const latest = {
          id: "assignment-1",
          completed: false,
          completedAt:
            "2026-07-29T12:00:00.000Z",
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
      "detects a removed property",
      () => {
        const original = {
          id: "assignment-1",
          notes:
            "Review chapter five",
        };

        const latest = {
          id: "assignment-1",
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