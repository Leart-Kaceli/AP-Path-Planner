export default function About() {
  return (
    <section id="about" className="bg-white dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why AP Path Planner?
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Advanced classes should feel challenging, not disorganized.
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            AP Path Planner brings course planning, assignments, grades, and
            exam preparation into one organized platform. Students can spend
            less time figuring out what to do next and more time making
            progress.
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-600 p-8 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            The goal
          </p>

          <p className="mt-4 text-2xl font-semibold leading-10">
            Help students build clear study plans, develop consistent habits,
            and approach AP exams with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}