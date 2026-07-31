import {
  reportClientError,
} from "@/utils/clientErrorReporting";

function getErrorName(
  value: unknown,
) {
  if (
    value instanceof Error
  ) {
    return value.name;
  }

  return "UnknownError";
}

function getErrorMessage(
  value: unknown,
) {
  if (
    value instanceof Error
  ) {
    return value.message;
  }

  if (
    typeof value ===
      "string"
  ) {
    return value;
  }

  return "An unknown client error occurred.";
}

function getErrorStack(
  value: unknown,
) {
  return value instanceof Error
    ? value.stack ??
        null
    : null;
}

window.addEventListener(
  "error",
  (
    event,
  ) => {
    reportClientError({
      source:
        "window-error",

      name:
        event.error instanceof
        Error
          ? event.error.name
          : "WindowError",

      message:
        event.message ||
        "A window error occurred.",

      stack:
        event.error instanceof
        Error
          ? event.error.stack ??
            null
          : null,
    });
  },
);

window.addEventListener(
  "unhandledrejection",
  (
    event,
  ) => {
    reportClientError({
      source:
        "unhandled-rejection",

      name:
        getErrorName(
          event.reason,
        ),

      message:
        getErrorMessage(
          event.reason,
        ),

      stack:
        getErrorStack(
          event.reason,
        ),
    });
  },
);

export function onRouterTransitionStart(
  url: string,
  navigationType:
    | "push"
    | "replace"
    | "traverse",
) {
  performance.mark(
    `navigation-${navigationType}-${url}`,
  );
}