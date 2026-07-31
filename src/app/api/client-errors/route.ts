import {
  NextResponse,
} from "next/server";

import type {
  ClientErrorReport,
} from "@/types/clientErrorReport";

const maximumRequestLength =
  10_000;

const allowedSources =
  new Set<
    ClientErrorReport["source"]
  >([
    "window-error",
    "unhandled-rejection",
    "react-error",
    "manual",
  ]);

function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    value.trim().length >
      0
  );
}

function isValidReport(
  value: unknown,
): value is ClientErrorReport {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  const report =
    value as Partial<
      ClientErrorReport
    >;

  return (
    typeof report.source ===
      "string" &&
    allowedSources.has(
      report.source as
        ClientErrorReport["source"],
    ) &&
    isNonEmptyString(
      report.name,
    ) &&
    isNonEmptyString(
      report.message,
    ) &&
    isNonEmptyString(
      report.pathname,
    ) &&
    isNonEmptyString(
      report.timestamp,
    ) &&
    (
      report.stack ===
        null ||
      typeof report.stack ===
        "string"
    )
  );
}

export async function POST(
  request: Request,
) {
  const contentLength =
    Number(
      request.headers.get(
        "content-length",
      ) ??
        "0",
    );

  if (
    contentLength >
    maximumRequestLength
  ) {
    return NextResponse.json(
      {
        error:
          "Payload too large.",
      },
      {
        status:
          413,
      },
    );
  }

  let body: unknown;

  try {
    body =
      await request.json();
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid JSON.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    !isValidReport(
      body,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid error report.",
      },
      {
        status:
          400,
      },
    );
  }

  console.error(
    JSON.stringify({
      type:
        "client-error",

      source:
        body.source,

      name:
        body.name,

      message:
        body.message,

      stack:
        body.stack,

      pathname:
        body.pathname,

      timestamp:
        body.timestamp,
    }),
  );

  return new NextResponse(
    null,
    {
      status:
        204,
    },
  );
}