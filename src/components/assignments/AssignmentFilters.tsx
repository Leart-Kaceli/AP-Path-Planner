import type { AssignmentPriority } from "@/types/assignment";

export type StatusFilter =
  | "All"
  | "Active"
  | "Completed";

export type PriorityFilter =
  | "All"
  | AssignmentPriority;

type AssignmentFiltersProps = {
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  searchTerm: string;
  onStatusChange: (
    value: StatusFilter,
  ) => void;
  onPriorityChange: (
    value: PriorityFilter,
  ) => void;
  onSearchChange: (value: string) => void;
};

export default function AssignmentFilters({
  statusFilter,
  priorityFilter,
  searchTerm,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
}: AssignmentFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="assignment-search"
            className="text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <input
            id="assignment-search"
            type="search"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search assignments"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(
                event.target
                  .value as StatusFilter,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All</option>
            <option value="Active">
              Active
            </option>
            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority-filter"
            className="text-sm font-medium text-slate-700"
          >
            Priority
          </label>

          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) =>
              onPriorityChange(
                event.target
                  .value as PriorityFilter,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">
              Medium
            </option>
            <option value="High">
              High
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}