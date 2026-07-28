import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

describe(
  "ConfirmDialog",
  () => {
    it(
      "keeps the dialog closed when open is false",
      () => {
        render(
          <ConfirmDialog
            open={false}
            title="Delete assignment?"
            description="This cannot be undone."
            confirmText="Delete"
            destructive
            onConfirm={
              vi.fn()
            }
            onCancel={
              vi.fn()
            }
          />,
        );

        const dialog =
          screen.getByRole(
            "dialog",
            {
              hidden: true,
            },
          );

        expect(
          dialog,
        ).not.toHaveAttribute(
          "open",
        );
      },
    );

    it(
      "shows its title and description",
      () => {
        render(
          <ConfirmDialog
            open
            title="Delete assignment?"
            description="This cannot be undone."
            confirmText="Delete"
            destructive
            onConfirm={
              vi.fn()
            }
            onCancel={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByText(
            "Delete assignment?",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "This cannot be undone.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "calls onConfirm",
      () => {
        const onConfirm =
          vi.fn();

        render(
          <ConfirmDialog
            open
            title="Delete assignment?"
            description="This cannot be undone."
            confirmText="Delete"
            destructive
            onConfirm={
              onConfirm
            }
            onCancel={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Delete",
            },
          ),
        );

        expect(
          onConfirm,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "calls onCancel",
      () => {
        const onCancel =
          vi.fn();

        render(
          <ConfirmDialog
            open
            title="Delete assignment?"
            description="This cannot be undone."
            confirmText="Delete"
            destructive
            onConfirm={
              vi.fn()
            }
            onCancel={
              onCancel
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: /cancel/i,
            },
          ),
        );

        expect(
          onCancel,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );
  },
);