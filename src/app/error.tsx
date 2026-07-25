"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          AP Path Planner encountered an
          unexpected error.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}