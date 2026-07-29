import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  isDateTimeInCurrentWeek,
  isDateTimeToday,
} from "@/utils/dates";

describe(
  "date utilities",
  () => {
    beforeEach(() => {
      vi.useFakeTimers();

      vi.setSystemTime(
        new Date(
          "2026-07-29T12:00:00",
        ),
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe(
      "isDateTimeToday",
      () => {
        it(
          "returns true for today",
          () => {
            expect(
              isDateTimeToday(
                "2026-07-29T09:30:00",
              ),
            ).toBe(true);
          },
        );

        it(
          "returns false for yesterday",
          () => {
            expect(
              isDateTimeToday(
                "2026-07-28T23:59:00",
              ),
            ).toBe(false);
          },
        );

        it(
          "returns false for tomorrow",
          () => {
            expect(
              isDateTimeToday(
                "2026-07-30T00:01:00",
              ),
            ).toBe(false);
          },
        );
      },
    );

    describe(
      "isDateTimeInCurrentWeek",
      () => {
        it(
          "returns true for a date in the current week",
          () => {
            expect(
              isDateTimeInCurrentWeek(
                "2026-07-29T09:30:00",
              ),
            ).toBe(true);
          },
        );

        it(
          "returns false for a date several weeks earlier",
          () => {
            expect(
              isDateTimeInCurrentWeek(
                "2026-07-01T09:30:00",
              ),
            ).toBe(false);
          },
        );
      },
    );
  },
);