"use client";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  console.error(
    "Global application error:",
    error,
  );

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
          <section className="w-full max-w-lg text-center">
            <h1 className="text-3xl font-bold">
              AP Path Planner encountered
              an error
            </h1>

            <p className="mt-4 text-slate-300">
              Reload the application or
              try the request again.
            </p>

            <button
              type="button"
              onClick={
                reset
              }
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Reload Application
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}