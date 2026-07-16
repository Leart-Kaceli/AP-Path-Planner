import type { GradeCategory } from "@/types/grade";

export type GradeCategoryFilter =
  | "All"
  | GradeCategory;

type GradeFiltersProps = {
  courseFilter: string;
  categoryFilter: GradeCategoryFilter;
  searchTerm: string;
  courseNames: string[];
  onCourseChange: (value: string) => void;
  onCategoryChange: (
    value: GradeCategoryFilter,
  ) => void;
  onSearchChange: (value: string) => void;
};

export default function GradeFilters({
  courseFilter,
  categoryFilter,
  searchTerm,
  courseNames,
  onCourseChange,
  onCategoryChange,
  onSearchChange,
}: GradeFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="grade-search"
            className="text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="grade-search"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search grades"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="grade-course-filter"
            className="text-sm font-medium text-slate-700"
          >
            Course
          </label>

          <select
            id="grade-course-filter"
            value={courseFilter}
            onChange={(event) =>
              onCourseChange(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">
              All Courses
            </option>

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
            htmlFor="grade-category-filter"
            className="text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="grade-category-filter"
            value={categoryFilter}
            onChange={(event) =>
              onCategoryChange(
                event.target
                  .value as GradeCategoryFilter,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">
              All Categories
            </option>

            <option value="Homework">
              Homework
            </option>

            <option value="Quiz">
              Quiz
            </option>

            <option value="Test">
              Test
            </option>

            <option value="Project">
              Project
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}