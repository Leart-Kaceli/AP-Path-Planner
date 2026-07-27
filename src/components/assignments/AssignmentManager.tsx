"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import AssignmentFilters, {
  type PriorityFilter,
  type StatusFilter,
} from "@/components/assignments/AssignmentFilters";

import AssignmentForm from "@/components/assignments/AssignmentForm";
import ManagedAssignmentCard from "@/components/assignments/ManagedAssignmentCard";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingCard from "@/components/ui/LoadingCard";
import SyncStatus from "@/components/ui/SyncStatus";
import UndoToast from "@/components/ui/UndoToast";

import {
  deleteOneAssignment,
  loadAssignments,
  saveAssignments,
  saveOneAssignment,
} from "@/services/assignmentService";

import {
  loadCourses,
} from "@/services/courseService";

import {
  subscribeToAssignments,
  subscribeToCourses,
} from "@/services/realtimeDataService";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

import {
  hasObjectChanged,
} from "@/utils/conflicts";

import type {
  Assignment,
} from "@/types/assignment";

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
  const {
    user,
    isLoading: isAuthLoading,
  } = useAuth();

  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const [
    requestedCreateDate,
  ] = useState(
    () =>
      searchParams.get("date") ??
      "",
  );

  const [
    assignments,
    setAssignments,
  ] = useState<Assignment[]>(
    initialAssignments,
  );

  const [
    assignmentToEdit,
    setAssignmentToEdit,
  ] = useState<Assignment | null>(
    null,
  );

  const [
    assignmentEditSnapshot,
    setAssignmentEditSnapshot,
  ] = useState<Assignment | null>(
    null,
  );

  const [
    hasAssignmentConflict,
    setHasAssignmentConflict,
  ] = useState(false);

  const [
    assignmentPendingDeletion,
    setAssignmentPendingDeletion,
  ] = useState<Assignment | null>(
    null,
  );

  const [
    recentlyDeletedAssignment,
    setRecentlyDeletedAssignment,
  ] = useState<Assignment | null>(
    null,
  );

  const [
    isClearCompletedDialogOpen,
    setIsClearCompletedDialogOpen,
  ] = useState(false);

  const [
    assignmentsFromCache,
    setAssignmentsFromCache,
  ] = useState(false);

  const [
    assignmentsHavePendingWrites,
    setAssignmentsHavePendingWrites,
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

  const [
    courseNames,
    setCourseNames,
  ] = useState<string[]>([]);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    "All",
  );

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<PriorityFilter>(
    "All",
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  /*
   * Load local data for signed-out
   * users and real-time Firestore data
   * for signed-in users.
   */
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasLoadedAssignments(false);

    setAssignmentDataError(
      null,
    );

    if (!user?.uid) {
      let isCancelled = false;

      async function loadLocalData() {
        try {
          const [
            loadedAssignments,
            loadedCourses,
          ] = await Promise.all([
            loadAssignments(),
            loadCourses(),
          ]);

          if (isCancelled) {
            return;
          }

          setAssignments(
            loadedAssignments,
          );

          setCourseNames(
            loadedCourses.map(
              (course) =>
                course.name,
            ),
          );

          setAssignmentsFromCache(
            false,
          );

          setAssignmentsHavePendingWrites(
            false,
          );
        } catch (error) {
          console.error(
            "Could not load assignments:",
            error,
          );

          if (!isCancelled) {
            setAssignmentDataError(
              "Your saved assignments could not be loaded.",
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

      void loadLocalData();

      return () => {
        isCancelled = true;
      };
    }

    const userId =
      user.uid;

    const unsubscribeAssignments =
      subscribeToAssignments(
        userId,

        (snapshot) => {
          setAssignments(
            snapshot.data,
          );

          setAssignmentsFromCache(
            snapshot.fromCache,
          );

          setAssignmentsHavePendingWrites(
            snapshot.hasPendingWrites,
          );

          setHasLoadedAssignments(
            true,
          );

          setAssignmentDataError(
            null,
          );
        },

        (error) => {
          console.error(
            "Assignment listener failed:",
            error,
          );

          setAssignmentDataError(
            "Live assignment sync disconnected. Try refreshing the page.",
          );

          setHasLoadedAssignments(
            true,
          );
        },
      );

    const unsubscribeCourses =
      subscribeToCourses(
        userId,

        (snapshot) => {
          setCourseNames(
            snapshot.data.map(
              (course) =>
                course.name,
            ),
          );
        },

        (error) => {
          console.error(
            "Assignment course listener failed:",
            error,
          );

          setAssignmentDataError(
            "Your course list could not be loaded.",
          );
        },
      );

    return () => {
      unsubscribeAssignments();
      unsubscribeCourses();
    };
  }, [
    isAuthLoading,
    user?.uid,
  ]);

  /*
   * Signed-out users save the whole
   * assignment array locally.
   */
  useEffect(() => {
    if (
      !hasLoadedAssignments ||
      isAuthLoading ||
      user?.uid
    ) {
      return;
    }

    let isCancelled = false;

    async function persistAssignments() {
      setIsSavingAssignments(
        true,
      );

      setAssignmentDataError(
        null,
      );

      try {
        await saveAssignments(
          assignments,
        );

        notifyAppDataChanged();
      } catch (error) {
        console.error(
          "Could not save assignments:",
          error,
        );

        if (!isCancelled) {
          setAssignmentDataError(
            "Your assignments could not be saved on this device.",
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
  ]);

  /*
   * Remove the calendar-provided date
   * query parameter after the form has
   * received its initial date.
   */
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
  ]);

  /*
   * Detect when the assignment being
   * edited changes through a real-time
   * Firestore listener.
   */
  useEffect(() => {
    if (
      !assignmentToEdit ||
      !assignmentEditSnapshot
    ) {
      return;
    }

    const latestAssignment =
      assignments.find(
        (assignment) =>
          assignment.id ===
          assignmentToEdit.id,
      );

    if (!latestAssignment) {
      return;
    }

    if (
      hasObjectChanged(
        assignmentEditSnapshot,
        latestAssignment,
      )
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasAssignmentConflict(
        true,
      );
    }
  }, [
    assignments,
    assignmentToEdit,
    assignmentEditSnapshot,
  ]);

  async function saveAssignment(
    assignment: Assignment,
  ) {
    /*
     * Only ask about overwriting when
     * the user actually submits the form.
     */
    if (
      hasAssignmentConflict &&
      assignmentToEdit
    ) {
      const shouldOverwrite =
        window.confirm(
          "This assignment changed on another device while you were editing it. Save your version anyway?",
        );

      if (!shouldOverwrite) {
        return;
      }
    }

    const previousAssignments =
      assignments;

    const assignmentExists =
      assignments.some(
        (currentAssignment) =>
          currentAssignment.id ===
          assignment.id,
      );

    const nextAssignments =
      assignmentExists
        ? assignments.map(
            (currentAssignment) =>
              currentAssignment.id ===
              assignment.id
                ? assignment
                : currentAssignment,
          )
        : [
            ...assignments,
            assignment,
          ];

    setAssignments(
      nextAssignments,
    );

    setAssignmentToEdit(
      null,
    );

    setAssignmentEditSnapshot(
      null,
    );

    setHasAssignmentConflict(
      false,
    );

    setAssignmentDataError(
      null,
    );

    /*
     * Signed-out changes are saved by
     * the local persistence effect.
     */
    if (!user?.uid) {
      return;
    }

    setIsSavingAssignments(
      true,
    );

    try {
      await saveOneAssignment(
        assignment,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not save assignment:",
        error,
      );

      setAssignments(
        previousAssignments,
      );

      setAssignmentDataError(
        "The assignment could not be saved. Your previous data was restored.",
      );
    } finally {
      setIsSavingAssignments(
        false,
      );
    }
  }

  function startEditingAssignment(
    assignment: Assignment,
  ) {
    setAssignmentToEdit(
      assignment,
    );

    setAssignmentEditSnapshot(
      assignment,
    );

    setHasAssignmentConflict(
      false,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditingAssignment() {
    setAssignmentToEdit(
      null,
    );

    setAssignmentEditSnapshot(
      null,
    );

    setHasAssignmentConflict(
      false,
    );
  }

  async function toggleAssignmentComplete(
    assignmentId: string,
  ) {
    const assignment =
      assignments.find(
        (currentAssignment) =>
          currentAssignment.id ===
          assignmentId,
      );

    if (!assignment) {
      return;
    }

    const previousAssignments =
      assignments;

    const isCompleting =
      !assignment.completed;

    const updatedAssignment: Assignment = {
      ...assignment,
      completed:
        isCompleting,
      completedAt:
        isCompleting
          ? new Date().toISOString()
          : null,
    };

    setAssignments(
      (currentAssignments) =>
        currentAssignments.map(
          (currentAssignment) =>
            currentAssignment.id ===
            assignmentId
              ? updatedAssignment
              : currentAssignment,
        ),
    );

    if (!user?.uid) {
      return;
    }

    setIsSavingAssignments(
      true,
    );

    try {
      await saveOneAssignment(
        updatedAssignment,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not update assignment:",
        error,
      );

      setAssignments(
        previousAssignments,
      );

      setAssignmentDataError(
        "The assignment could not be updated. Your previous data was restored.",
      );
    } finally {
      setIsSavingAssignments(
        false,
      );
    }
  }

  function requestAssignmentDeletion(
    assignmentId: string,
  ) {
    const assignment =
      assignments.find(
        (currentAssignment) =>
          currentAssignment.id ===
          assignmentId,
      );

    if (!assignment) {
      return;
    }

    setAssignmentPendingDeletion(
      assignment,
    );
  }

  async function confirmAssignmentDeletion() {
    if (!assignmentPendingDeletion) {
      return;
    }

    const assignmentToDelete =
      assignmentPendingDeletion;

    const previousAssignments =
      assignments;

    setAssignments(
      (currentAssignments) =>
        currentAssignments.filter(
          (assignment) =>
            assignment.id !==
            assignmentToDelete.id,
        ),
    );

    if (
      assignmentToEdit?.id ===
      assignmentToDelete.id
    ) {
      setAssignmentToEdit(
        null,
      );

      setAssignmentEditSnapshot(
        null,
      );

      setHasAssignmentConflict(
        false,
      );
    }

    setAssignmentPendingDeletion(
      null,
    );

    if (!user?.uid) {
      setRecentlyDeletedAssignment(
        assignmentToDelete,
      );

      return;
    }

    setIsSavingAssignments(
      true,
    );

    try {
      await deleteOneAssignment(
        assignmentToDelete.id,
        user.uid,
      );

      setRecentlyDeletedAssignment(
        assignmentToDelete,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not delete assignment:",
        error,
      );

      setAssignments(
        previousAssignments,
      );

      setAssignmentDataError(
        "The assignment could not be deleted. It has been restored.",
      );
    } finally {
      setIsSavingAssignments(
        false,
      );
    }
  }

  async function undoAssignmentDeletion() {
    if (!recentlyDeletedAssignment) {
      return;
    }

    const assignmentToRestore =
      recentlyDeletedAssignment;

    setAssignments(
      (currentAssignments) => [
        ...currentAssignments,
        assignmentToRestore,
      ],
    );

    setRecentlyDeletedAssignment(
      null,
    );

    if (!user?.uid) {
      return;
    }

    setIsSavingAssignments(
      true,
    );

    try {
      await saveOneAssignment(
        assignmentToRestore,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not restore assignment:",
        error,
      );

      setAssignments(
        (currentAssignments) =>
          currentAssignments.filter(
            (assignment) =>
              assignment.id !==
              assignmentToRestore.id,
          ),
      );

      setAssignmentDataError(
        "The assignment could not be restored.",
      );
    } finally {
      setIsSavingAssignments(
        false,
      );
    }
  }

  function requestClearCompletedAssignments() {
    const completedAssignments =
      assignments.filter(
        (assignment) =>
          assignment.completed,
      );

    if (
      completedAssignments.length ===
      0
    ) {
      return;
    }

    setIsClearCompletedDialogOpen(
      true,
    );
  }

  async function confirmClearCompletedAssignments() {
    const completedAssignments =
      assignments.filter(
        (assignment) =>
          assignment.completed,
      );

    const previousAssignments =
      assignments;

    const remainingAssignments =
      assignments.filter(
        (assignment) =>
          !assignment.completed,
      );

    setAssignments(
      remainingAssignments,
    );

    if (
      assignmentToEdit?.completed
    ) {
      setAssignmentToEdit(
        null,
      );

      setAssignmentEditSnapshot(
        null,
      );

      setHasAssignmentConflict(
        false,
      );
    }

    setIsClearCompletedDialogOpen(
      false,
    );

    if (!user?.uid) {
      return;
    }

    setIsSavingAssignments(
      true,
    );

    try {
      await Promise.all(
        completedAssignments.map(
          (assignment) =>
            deleteOneAssignment(
              assignment.id,
              user.uid,
            ),
        ),
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not clear completed assignments:",
        error,
      );

      setAssignments(
        previousAssignments,
      );

      setAssignmentDataError(
        "Completed assignments could not be cleared. Your previous data was restored.",
      );
    } finally {
      setIsSavingAssignments(
        false,
      );
    }
  }

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();

  const filteredAssignments =
    assignments
      .filter((assignment) => {
        if (
          statusFilter ===
            "Active" &&
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
          priorityFilter !==
            "All" &&
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
        (
          assignmentA,
          assignmentB,
        ) =>
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
    assignments.length -
    completedCount;

  const highPriorityCount =
    assignments.filter(
      (assignment) =>
        assignment.priority ===
          "High" &&
        !assignment.completed,
    ).length;

  if (
    isAuthLoading ||
    !hasLoadedAssignments
  ) {
    return (
      <div className="space-y-6">
        <LoadingCard heightClassName="h-80" />
        <LoadingCard heightClassName="h-64" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <div className="space-y-4">
        <div
          aria-live="polite"
          className="space-y-3"
        >
          {user?.uid ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
              Assignments are connected
              to{" "}
              <span className="font-semibold">
                {user.email}
              </span>
              .
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              You are signed out.
              Assignments are being saved
              only on this device.
            </div>
          )}

          <SyncStatus
            isSaving={
              isSavingAssignments
            }
            error={
              assignmentDataError
            }
            fromCache={
              assignmentsFromCache
            }
            hasPendingWrites={
              assignmentsHavePendingWrites
            }
            realtime={
              Boolean(user?.uid)
            }
          />
        </div>

        {hasAssignmentConflict && (
          <div
            role="alert"
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          >
            This assignment changed on
            another device while you were
            editing it. Review before
            saving.
          </div>
        )}

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
          courseNames={
            courseNames
          }
          onSaveAssignment={
            saveAssignment
          }
          onCancelEdit={
            cancelEditingAssignment
          }
        />
      </div>

      <section className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AssignmentStatCard
            title="Total"
            value={
              assignments.length
            }
          />

          <AssignmentStatCard
            title="Active"
            value={
              activeCount
            }
          />

          <AssignmentStatCard
            title="Completed"
            value={
              completedCount
            }
          />

          <AssignmentStatCard
            title="High Priority"
            value={
              highPriorityCount
            }
          />
        </div>

        <div className="mt-8">
          <AssignmentFilters
            statusFilter={
              statusFilter
            }
            priorityFilter={
              priorityFilter
            }
            searchTerm={
              searchTerm
            }
            onStatusChange={
              setStatusFilter
            }
            onPriorityChange={
              setPriorityFilter
            }
            onSearchChange={
              setSearchTerm
            }
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your Assignments
            </h2>

            <p className="mt-1 text-slate-600 dark:text-slate-300">
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
              className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                  key={
                    assignment.id
                  }
                  assignment={
                    assignment
                  }
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
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No assignments found
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Add an assignment or change
              your filters.
            </p>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={
          assignmentPendingDeletion !==
          null
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
          setAssignmentPendingDeletion(
            null,
          )
        }
      />

      <ConfirmDialog
        open={
          isClearCompletedDialogOpen
        }
        title="Clear completed assignments?"
        description={`Delete ${completedCount} completed assignment${
          completedCount === 1
            ? ""
            : "s"
        }? This action cannot be undone.`}
        confirmText="Clear Completed"
        destructive
        onConfirm={
          confirmClearCompletedAssignments
        }
        onCancel={() =>
          setIsClearCompletedDialogOpen(
            false,
          )
        }
      />

      {recentlyDeletedAssignment && (
        <UndoToast
          message={`Deleted "${recentlyDeletedAssignment.title}".`}
          onUndo={
            undoAssignmentDeletion
          }
          onDismiss={() =>
            setRecentlyDeletedAssignment(
              null,
            )
          }
        />
      )}
    </div>
  );
}

type AssignmentStatCardProps = {
  title: string;
  value: number;
};

function AssignmentStatCard({
  title,
  value,
}: AssignmentStatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </article>
  );
}