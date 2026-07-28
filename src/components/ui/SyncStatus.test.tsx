import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import SyncStatus from "@/components/ui/SyncStatus";

describe(
  "SyncStatus",
  () => {
    it(
      "shows an error message",
      () => {
        render(
          <SyncStatus
            error="Live sync disconnected."
          />,
        );

        expect(
          screen.getByRole(
            "alert",
          ),
        ).toHaveTextContent(
          "Live sync disconnected.",
        );
      },
    );

    it(
      "shows syncing while saving",
      () => {
        render(
          <SyncStatus
            isSaving
          />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "Syncing changes...",
        );
      },
    );

    it(
      "shows syncing for pending Firestore writes",
      () => {
        render(
          <SyncStatus
            hasPendingWrites
          />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "Syncing changes...",
        );
      },
    );

    it(
      "shows cached-data status",
      () => {
        render(
          <SyncStatus
            fromCache
          />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "Showing cached data",
        );
      },
    );

    it(
      "shows active real-time sync",
      () => {
        render(
          <SyncStatus
            realtime
          />,
        );

        expect(
          screen.getByRole(
            "status",
          ),
        ).toHaveTextContent(
          "Cloud sync active",
        );
      },
    );

    it(
      "renders nothing when no status applies",
      () => {
        const {
          container,
        } = render(
          <SyncStatus />,
        );

        expect(
          container,
        ).toBeEmptyDOMElement();
      },
    );
  },
);