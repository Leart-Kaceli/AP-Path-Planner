"use client";

import {
  useEffect,
  useState,
} from "react";

import AssignmentFilters, {
  type PriorityFilter,
  type StatusFilter,
} from "@/components/assignments/AssignmentFilters";

import AssignmentForm from "@/components/assignments/AssignmentForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DataErrorState from "@/components/ui/DataErrorState";

import ManagedAssignmentCard from "@/components/assignments/ManagedAssignmentCard";

import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";
import {
  COURSE_STORAGE_KEY,
} from "@/constants/storage";
import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";


import {
  loadAssignments,
  saveAssignments,
} from "@/services/assignmentService";

import {
  useAuth,
} from "@/hooks/useAuth";


const initialAssignments: Assignment[] = [
  {
    id: "calculus-practice",
    title: "Integration Practice Set",
    course: "AP Calculus BC",
    dueDate: "2026-07-18",
    priority: "High",
    completed: false,
    completedAt: null,
    notes:
      "Complete problems 1–20 and review incorrect answers.",
  },
  {
    id: "physics-lab",
    title: "Momentum Lab Report",
    course: "AP Physics C",
    dueDate: "2026-07-21",
    priority: "Medium",
    completed: false,
    completedAt: null,
    notes:
      "Include calculations, graph, and conclusion.",
  },
  {
    id: "arraylist-exercise",
    title: "ArrayList Coding Exercise",
    course: "AP Computer Science A",
    dueDate: "2026-07-24",
    priority: "Low",
    completed: true,
    completedAt: null,
    notes: "",
  },
];

export default function AssignmentManager() {

  const [
  assignmentReloadKey,
  setAssignmentReloadKey,
] = useState(0);

  const {
  user,
  isLoading: isAuthLoading,
} = useAuth();

  const router = useRouter();
const pathname = usePathname();

  const searchParams =
  useSearchParams();


const [
  requestedCreateDate,
] = useState(
  () =>
    searchParams.get("date") ??
    "",
);

  const [assignments, setAssignments] =
    useState<Assignment[]>(
      initialAssignments,
    );

    const [
  assignmentPendingDeletion,
  setAssignmentPendingDeletion,
] = useState<Assignment | null>(null);


const [
  isClearCompletedDialogOpen,
  setIsClearCompletedDialogOpen,
] = useState(false);

  const [
    hasLoadedAssignments,
    setHasLoadedAssignments,
  ] = useState(false);

  const [
  isSavingAssignments,
  setIsSavingAssignments,
] = useState(false);

const [
  assignmentDataError,
  setAssignmentDataError,
] = useState<string | null>(
  null,
);

  const [assignmentToEdit, setAssignmentToEdit] =
    useState<Assignment | null>(null);

  const [courseNames, setCourseNames] =
    useState<string[]>([
      "AP Calculus BC",
      "AP Physics C",
      "AP Computer Science A",
    ]);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
  if (isAuthLoading) {
    return;
  }

  let isCancelled = false;

  async function loadAssignmentData() {
    setHasLoadedAssignments(false);
    setAssignmentDataError(null);

    try {
      const storedAssignments =
        await loadAssignments(
          user?.uid,
        );

      if (isCancelled) {
        return;
      }

      if (
        storedAssignments.length >
        0
      ) {
        setAssignments(
          storedAssignments,
        );
      }

      const storedCourses =
        localStorage.getItem(
          COURSE_STORAGE_KEY,
        );

      if (storedCourses) {
        const parsedCourses =
          JSON.parse(
            storedCourses,
          ) as Course[];

        if (
          Array.isArray(
            parsedCourses,
          )
        ) {
          setCourseNames(
            parsedCourses.map(
              (course) =>
                course.name,
            ),
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not load assignments:",
        error,
      );

      if (!isCancelled) {
        setAssignmentDataError(
          user
            ? "Your cloud assignments could not be loaded."
            : "Your saved assignments could not be loaded.",
        );
      }
    } finally {
      if (!isCancelled) {
        setHasLoadedAssignments(
          true,
        );
      }
    }
  }

  void loadAssignmentData();

  return () => {
    isCancelled = true;
  };
}, [
  assignmentReloadKey,
  isAuthLoading,
  user?.uid,
  user,
]);

  useEffect(() => {
  if (
    !hasLoadedAssignments ||
    isAuthLoading
  ) {
    return;
  }

  let isCancelled = false;

  async function persistAssignments() {
    setIsSavingAssignments(true);

    setAssignmentDataError(null);

    try {
      await saveAssignments(
        assignments,
        user?.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not save assignments:",
        error,
      );

      if (!isCancelled) {
        setAssignmentDataError(
          user
            ? "Your assignments could not be saved to the cloud."
            : "Your assignments could not be saved on this device.",
        );
      }
    } finally {
      if (!isCancelled) {
        setIsSavingAssignments(
          false,
        );
      }
    }
  }

  void persistAssignments();

  return () => {
    isCancelled = true;
  };
}, [
  assignments,
  hasLoadedAssignments,
  isAuthLoading,
  user?.uid,
  user,
]);



useEffect(() => {
  if (
    !hasLoadedAssignments ||
    !requestedCreateDate
  ) {
    return;
  }

  router.replace(
    pathname,
    {
      scroll: false,
    },
  );
}, [
  hasLoadedAssignments,
  pathname,
  requestedCreateDate,
  router,
  user,
]);

  function saveAssignment(
    assignment: Assignment,
  ) {
    setAssignments(
      (currentAssignments) => {
        const assignmentExists =
          currentAssignments.some(
            (currentAssignment) =>
              currentAssignment.id ===
              assignment.id,
          );

        if (assignmentExists) {
          return currentAssignments.map(
            (currentAssignment) =>
              currentAssignment.id ===
              assignment.id
                ? assignment
                : currentAssignment,
          );
        }

        return [
          ...currentAssignments,
          assignment,
        ];
      },
    );

    setAssignmentToEdit(null);
  }

  function startEditingAssignment(
    assignment: Assignment,
  ) {
    setAssignmentToEdit(assignment);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditingAssignment() {
    setAssignmentToEdit(null);
  }

  function toggleAssignmentComplete(
  assignmentId: string,
) {
  setAssignments(
    (currentAssignments) =>
      currentAssignments.map(
        (assignment) => {
          if (
            assignment.id !==
            assignmentId
          ) {
            return assignment;
          }

          const isCompleting =
            !assignment.completed;

          return {
            ...assignment,
            completed: isCompleting,
            completedAt: isCompleting
              ? new Date().toISOString()
              : null,
          };
        },
      ),
  );
}

  function requestAssignmentDeletion(
  assignmentId: string,
) {
  const assignment = assignments.find(
    (currentAssignment) =>
      currentAssignment.id === assignmentId,
  );

  if (!assignment) {
    return;
  }

  setAssignmentPendingDeletion(assignment);
}

function confirmAssignmentDeletion() {
  if (!assignmentPendingDeletion) {
    return;
  }

  const assignmentId =
    assignmentPendingDeletion.id;


  setAssignments((currentAssignments) =>
    currentAssignments.filter(
      (assignment) =>
        assignment.id !== assignmentId,
    ),
  );

  if (
    assignmentToEdit?.id === assignmentId
  ) {
    setAssignmentToEdit(null);
  }

  setAssignmentPendingDeletion(null);
} 
    


  function requestClearCompletedAssignments() {
  if (completedCount === 0) {
    return;
  }

  setIsClearCompletedDialogOpen(true);
}

function confirmClearCompletedAssignments() {
  setAssignments(
    (currentAssignments) =>
      currentAssignments.filter(
        (assignment) =>
          !assignment.completed,
      ),
  );

  if (assignmentToEdit?.completed) {
    setAssignmentToEdit(null);
  }

  setIsClearCompletedDialogOpen(false);
}

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredAssignments =
    assignments
      .filter((assignment) => {
        if (
          statusFilter === "Active" &&
          assignment.completed
        ) {
          return false;
        }

        if (
          statusFilter ===
            "Completed" &&
          !assignment.completed
        ) {
          return false;
        }

        if (
          priorityFilter !== "All" &&
          assignment.priority !==
            priorityFilter
        ) {
          return false;
        }

        if (normalizedSearch) {
          const searchableText =
            `${assignment.title} ${assignment.course} ${assignment.notes}`.toLowerCase();

          if (
            !searchableText.includes(
              normalizedSearch,
            )
          ) {
            return false;
          }
        }

        return true;
      })
      .sort(
        (assignmentA, assignmentB) =>
          assignmentA.dueDate.localeCompare(
            assignmentB.dueDate,
          ),
      );

  const completedCount =
    assignments.filter(
      (assignment) =>
        assignment.completed,
    ).length;

  const activeCount =
    assignments.length - completedCount;

  const highPriorityCount =
    assignments.filter(
      (assignment) =>
        assignment.priority === "High" &&
        !assignment.completed,
    ).length;


    if (
  isAuthLoading ||
  !hasLoadedAssignments
) {
  return (
    <div className="space-y-6">
      <div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

  return (

    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <div
  aria-live="polite"
  className="space-y-3"
>
  {user && (
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
      Assignments are connected to{" "}
      <span className="font-semibold">
        {user.email}
      </span>
      .
    </div>
  )}

  {!user && (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      You are signed out. Assignments
      are being saved only on this
      device.
    </div>
  )}

  {isSavingAssignments && (
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      Saving assignments...
    </p>
  )}

  {assignmentDataError && (
  <DataErrorState
    message={assignmentDataError}
    onRetry={() =>
      setAssignmentReloadKey(
        (current) =>
          current + 1,
      )
    }
  />
)}
</div>
      <AssignmentForm
  key={
    assignmentToEdit?.id ??
    `new-assignment-${requestedCreateDate}`
  }
  assignmentToEdit={
    assignmentToEdit
  }
  initialDate={
    requestedCreateDate
  }
  courseNames={courseNames}
        onSaveAssignment={
          saveAssignment
        }
        onCancelEdit={
          cancelEditingAssignment
        }
      />

      <section className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {assignments.length}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {activeCount}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {completedCount}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              High Priority
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {highPriorityCount}
            </p>
          </article>
        </div>

        <div className="mt-8">
          <AssignmentFilters
            statusFilter={statusFilter}
            priorityFilter={
              priorityFilter
            }
            searchTerm={searchTerm}
            onStatusChange={
              setStatusFilter
            }
            onPriorityChange={
              setPriorityFilter
            }
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your Assignments
            </h2>

            <p className="mt-1 text-slate-600">
              Showing{" "}
              {filteredAssignments.length}{" "}
              of {assignments.length}{" "}
              assignments.
            </p>
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={
  requestClearCompletedAssignments
}
              className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700"
            >
              Clear Completed
            </button>
          )}
        </div>

        {filteredAssignments.length >
        0 ? (
          <div className="mt-5 grid gap-5">
            {filteredAssignments.map(
              (assignment) => (
                <ManagedAssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onToggleComplete={
                    toggleAssignmentComplete
                  }
                  onEdit={
                    startEditingAssignment
                  }
                  onDelete={
  requestAssignmentDeletion
}
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="font-semibold text-slate-900">
              No assignments found
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Add an assignment or change
              your filters.
            </p>
          </div>
        )}
      </section>
      <ConfirmDialog

      
  open={
    assignmentPendingDeletion !== null
  }
  title="Delete assignment?"
  description={
    assignmentPendingDeletion
      ? `Delete "${assignmentPendingDeletion.title}"? This action cannot be undone.`
      : ""
  }
  confirmText="Delete Assignment"
  destructive
  onConfirm={
    confirmAssignmentDeletion
  }
  onCancel={() =>
    setAssignmentPendingDeletion(null)
  }

  
/>

<ConfirmDialog
  open={
    isClearCompletedDialogOpen
  }
  title="Clear completed assignments?"
  description={`Delete ${completedCount} completed assignment${
    completedCount === 1 ? "" : "s"
  }? This action cannot be undone.`}
  confirmText="Clear Completed"
  destructive
  onConfirm={
    confirmClearCompletedAssignments
  }
  onCancel={() =>
    setIsClearCompletedDialogOpen(false)
  }
/>
    </div>
  );
}