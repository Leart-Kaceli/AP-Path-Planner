const features = [
  {
    title: "Course Management",
    description:
      "Add your AP classes, set exam goals, and keep your academic plans organized.",
    icon: "📚",
  },
  {
    title: "Assignment Tracking",
    description:
      "Record assignments, deadlines, and priorities so nothing gets forgotten.",
    icon: "✅",
  },
  {
    title: "Study Planning",
    description:
      "Create structured study schedules based on your courses, goals, and available time.",
    icon: "📅",
  },
  {
    title: "Grade Tracking",
    description:
      "Monitor quizzes, tests, and assignments to understand your course progress.",
    icon: "📈",
  },
  {
    title: "AP Score Predictor",
    description:
      "Use practice results to estimate your AP exam performance and identify weak areas.",
    icon: "🎯",
  },
  {
    title: "Progress Dashboard",
    description:
      "View upcoming tasks, study progress, and academic goals from one dashboard.",
    icon: "📊",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Everything in one place
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Tools designed for AP success
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Stay organized, study consistently, and understand your progress
            throughout the school year.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-3xl" aria-hidden="true">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}