
import StudyPlannerManager from "@/components/planner/StudyPlannerManager";

export default function PlannerPage() {
  return (
    <main
  id="main-content"
  className="min-h-screen bg-slate-50"
>
      <header className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Study Planning
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Your Study Planner
            </h1>

            <p className="mt-2 text-slate-600">
              Schedule focused sessions and track
              your completed study time.
            </p>
          </div>

          
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <StudyPlannerManager />
      </div>
    </main>
  );
}