"use client";

import {
  useEffect,
} from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      "Application route error:",
      error,
    );
  }, [
    error,
  ]);

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950"
    >
      <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Application Error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          AP Path Planner could not
          display this page. Try the
          request again.
        </p>

        <button
          type="button"
          onClick={
            reset
          }
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}