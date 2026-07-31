import type {
  ClientErrorReport,
} from "@/types/clientErrorReport";

const maximumMessageLength =
  500;

const maximumStackLength =
  4_000;

function truncateText(
  value: string,
  maximumLength: number,
) {
  return value.slice(
    0,
    maximumLength,
  );
}

export function reportClientError(
  report:
    Omit<
      ClientErrorReport,
      "pathname" | "timestamp"
    >,
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const payload:
    ClientErrorReport = {
      ...report,

      name:
        truncateText(
          report.name,
          maximumMessageLength,
        ),

      message:
        truncateText(
          report.message,
          maximumMessageLength,
        ),

      stack:
        report.stack
          ? truncateText(
              report.stack,
              maximumStackLength,
            )
          : null,

      pathname:
        window.location.pathname,

      timestamp:
        new Date().toISOString(),
  };

  const body =
    JSON.stringify(
      payload,
    );

  try {
    const blob =
      new Blob(
        [
          body,
        ],
        {
          type:
            "application/json",
        },
      );

    const wasQueued =
      navigator.sendBeacon(
        "/api/client-errors",
        blob,
      );

    if (wasQueued) {
      return;
    }
  } catch {
    /*
     * Fall through to fetch.
     */
  }

  void fetch(
    "/api/client-errors",
    {
      method:
        "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body,

      keepalive:
        true,
    },
  ).catch(() => {
    /*
     * Reporting must never crash
     * the application.
     */
  });
}