import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center bg-gradient-to-b from-blue-50 to-white px-6 py-20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Built for ambitious AP students
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
  Your Success Starts With a Plan
</h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
  Organize your AP classes, track assignments, build personalized study
  schedules, and monitor your academic progress in one place.
</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Start Planning
          </Link>

          <Link
            href="#features"
            className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Explore Features
          </Link>
        </div>
      </div>
    </section>
  );
}