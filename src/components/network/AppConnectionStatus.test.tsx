import {
  render,
  screen,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import AppConnectionStatus from "@/components/network/AppConnectionStatus";

const mockUseNetworkStatus =
  vi.fn();

vi.mock(
  "@/components/network/NetworkStatusProvider",
  () => ({
    useNetworkStatus:
      () =>
        mockUseNetworkStatus(),
  }),
);

describe(
  "AppConnectionStatus",
  () => {
    beforeEach(() => {
      mockUseNetworkStatus.mockReset();
    });

    it(
      "shows Online",
      () => {
        mockUseNetworkStatus.mockReturnValue({
          isOnline: true,
        });

        render(
          <AppConnectionStatus />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "Online",
        );
      },
    );

    it(
      "shows Offline",
      () => {
        mockUseNetworkStatus.mockReturnValue({
          isOnline: false,
        });

        render(
          <AppConnectionStatus />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "Offline",
        );
      },
    );
  },
);