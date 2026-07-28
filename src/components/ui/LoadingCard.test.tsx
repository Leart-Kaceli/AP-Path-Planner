import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import LoadingCard from "@/components/ui/LoadingCard";

describe(
  "LoadingCard",
  () => {
    it(
      "renders an accessible loading status",
      () => {
        render(
          <LoadingCard
            heightClassName="h-64"
          />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uses the requested height class",
      () => {
        render(
          <LoadingCard
            heightClassName="h-64"
          />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveClass(
          "h-64",
        );
      },
    );
  },
);