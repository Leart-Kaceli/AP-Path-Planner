import AssignmentCard from "@/components/dashboard/AssignmentCard";
import CourseCard from "@/components/dashboard/CourseCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProgressCard from "@/components/dashboard/ProgressCard";
import StatCard from "@/components/dashboard/StatCard";

const courses = [
  {
    name: "AP Calculus BC",
    teacher: "Ms. Thompson",
    goalScore: 5,
    progress: 72,
  },
  {
    name: "AP Physics C",
    teacher: "Mr. Rivera",
    goalScore: 5,
    progress: 58,
  },
  {
    name: "AP Computer Science A",
    teacher: "Mrs. Patel",
    goalScore: 5,
    progress: 81,
  },
];

const assignments = [
  {
    title: "Integration Practice Set",
    course: "AP Calculus BC",
    dueDate: "Tomorrow",
    priority: "High" as const,
  },
  {
    title: "Momentum Lab Report",
    course: "AP Physics C",
    dueDate: "Wednesday",
    priority: "Medium" as const,
  },
  {
    title: "ArrayList Coding Exercise",
    course: "AP Computer Science A",
    dueDate: "Friday",
    priority: "Low" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        <DashboardHeader />

        <main className="px-6 py-8">
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="AP Courses"
              value="3"
              description="Currently enrolled"
            />

            <StatCard
              title="Upcoming Tasks"
              value="5"
              description="Due within seven days"
            />

            <StatCard
              title="Study Hours"
              value="6.5"
              description="Completed this week"
            />

            <StatCard
              title="Average Progress"
              value="70%"
              description="Across all AP courses"
            />
          </section>

          <div className="mt-8 grid gap-8 xl:grid-cols-[2fr_1fr]">
            <section>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Your AP Courses
                </h2>

                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View all
                </button>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {courses.map((course) => (
                  <CourseCard
                    key={course.name}
                    name={course.name}
                    teacher={course.teacher}
                    goalScore={course.goalScore}
                    progress={course.progress}
                  />
                ))}
              </div>
            </section>

            <ProgressCard />
          </div>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Upcoming Assignments
              </h2>

              <button
                type="button"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>

            <div className="mt-3">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.title}
                  title={assignment.title}
                  course={assignment.course}
                  dueDate={assignment.dueDate}
                  priority={assignment.priority}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}