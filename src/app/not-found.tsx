import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 dark:bg-slate-950"
    >
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          The page you requested does not
          exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Return Home
        </Link>
      </section>
    </main>
  );
}