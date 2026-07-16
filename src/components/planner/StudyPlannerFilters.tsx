export type StudyStatusFilter =
  | "All"
  | "Scheduled"
  | "Completed";

type StudyPlannerFiltersProps = {
  courseFilter: string;
  statusFilter: StudyStatusFilter;
  searchTerm: string;
  courseNames: string[];
  onCourseChange: (value: string) => void;
  onStatusChange: (
    value: StudyStatusFilter,
  ) => void;
  onSearchChange: (value: string) => void;
};

export default function StudyPlannerFilters({
  courseFilter,
  statusFilter,
  searchTerm,
  courseNames,
  onCourseChange,
  onStatusChange,
  onSearchChange,
}: StudyPlannerFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="study-search"
            className="text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="study-search"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search topics or notes"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="study-course-filter"
            className="text-sm font-medium text-slate-700"
          >
            Course
          </label>

          <select
            id="study-course-filter"
            value={courseFilter}
            onChange={(event) =>
              onCourseChange(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Courses</option>

            {courseNames.map((courseName) => (
              <option
                key={courseName}
                value={courseName}
              >
                {courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="study-status-filter"
            className="text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="study-status-filter"
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(
                event.target
                  .value as StudyStatusFilter,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All</option>
            <option value="Scheduled">
              Scheduled
            </option>
            <option value="Completed">
              Completed
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}