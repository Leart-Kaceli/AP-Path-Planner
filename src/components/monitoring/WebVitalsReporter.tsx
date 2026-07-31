"use client";

import {
  useReportWebVitals,
} from "next/web-vitals";

import type {
  NextWebVitalsMetric,
} from "next/app";

function reportMetric(
  metric:
    NextWebVitalsMetric,
) {
  const payload = {
    name:
      metric.name,

    value:
      metric.value,

    rating:
      "rating" in metric
        ? metric.rating
        : undefined,

    id:
      metric.id,

    navigationType:
      "navigationType" in
        metric
        ? metric.navigationType
        : undefined,
  };

  if (
    process.env.NODE_ENV ===
    "development"
  ) {
    console.info(
      "Web Vital:",
      payload,
    );
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals(
    reportMetric,
  );

  return null;
}