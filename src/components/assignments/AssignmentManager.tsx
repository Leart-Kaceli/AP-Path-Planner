"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import AssignmentFilters, {
  type PriorityFilter,
  type StatusFilter,
} from "@/components/assignments/AssignmentFilters";

import AssignmentForm from "@/components/assignments/AssignmentForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { normalizeAssignment } from "@/utils/assignments";

import ManagedAssignmentCard from "@/components/assignments/ManagedAssignmentCard";

import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";
import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
} from "@/constants/storage";
import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

import {
  useSearchParams,
} from "next/navigation";




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

  const searchParams =
  useSearchParams();

const handledEditId =
  useRef<string | null>(null);
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
    try {
      const storedAssignments =
        localStorage.getItem(
          ASSIGNMENT_STORAGE_KEY,
        );

      if (storedAssignments) {
        const parsedAssignments =
          JSON.parse(
            storedAssignments,
          ) as Assignment[];

        if (
          Array.isArray(
            parsedAssignments,
          )
        ) {
         const normalizedAssignments =
  parsedAssignments.map(
    normalizeAssignment,
  );

// eslint-disable-next-line react-hooks/set-state-in-effect
setAssignments(
  normalizedAssignments,
);
        }
      }

      const storedCourses =
        localStorage.getItem(
          COURSE_STORAGE_KEY,
        );

      if (storedCourses) {
        const parsedCourses = JSON.parse(
          storedCourses,
        ) as Course[];

        if (Array.isArray(parsedCourses)) {
          setCourseNames(
            parsedCourses.map(
              (course) => course.name,
            ),
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not load assignments:",
        error,
      );
    } finally {
      setHasLoadedAssignments(true);
    }
  }, []);

  useEffect(() => {
  if (!hasLoadedAssignments) {
    return;
  }

  try {
    localStorage.setItem(
      ASSIGNMENT_STORAGE_KEY,
      JSON.stringify(assignments),
    );

    notifyAppDataChanged();
  } catch (error) {
    console.error(
      "Could not save assignments:",
      error,
    );
  }
}, [
  assignments,
  hasLoadedAssignments,
]);

useEffect(() => {
  if (!hasLoadedAssignments) {
    return;
  }

  const requestedEditId =
    searchParams.get("edit");

  if (
    !requestedEditId ||
    handledEditId.current ===
      requestedEditId
  ) {
    return;
  }

  const requestedAssignment =
    assignments.find(
      (assignment) =>
        assignment.id ===
        requestedEditId,
    );

  if (!requestedAssignment) {
    return;
  }

  handledEditId.current =
    requestedEditId;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setAssignmentToEdit(
    requestedAssignment,
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [
  assignments,
  hasLoadedAssignments,
  searchParams,
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

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <AssignmentForm
        key={
          assignmentToEdit?.id ??
          "new-assignment"
        }
        assignmentToEdit={
          assignmentToEdit
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