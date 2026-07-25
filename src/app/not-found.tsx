import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          404
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
  The page you&apos;re looking for
  doesn&apos;t exist.
</p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}