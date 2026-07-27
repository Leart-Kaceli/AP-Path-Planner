"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  hasObjectChanged,
} from "@/utils/conflicts";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingCard from "@/components/ui/LoadingCard";
import SyncStatus from "@/components/ui/SyncStatus";
import UndoToast from "@/components/ui/UndoToast";

import StudyPlannerFilters, {
  type StudyStatusFilter,
} from "@/components/planner/StudyPlannerFilters";

import StudySessionCard from "@/components/planner/StudySessionCard";
import StudySessionForm from "@/components/planner/StudySessionForm";

import {
  subscribeToStudySessions,
} from "@/services/realtimeDataService";

import {
  deleteOneStudySession,
  loadStudySessions,
  saveOneStudySession,
  saveStudySessions,
} from "@/services/studySessionService";

import {
  loadCourses,
} from "@/services/courseService";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

import type {
  StudySession,
} from "@/types/studySession";

const initialSessions: StudySession[] = [];

export default function StudyPlannerManager() {
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

  const handledEditId =
    useRef<string | null>(
      null,
    );

  const [
    requestedCreateDate,
  ] = useState(
    () =>
      searchParams.get("date") ??
      "",
  );

  const [
    sessions,
    setSessions,
  ] = useState<StudySession[]>(
    initialSessions,
  );

  const [
    sessionPendingDeletion,
    setSessionPendingDeletion,
  ] = useState<StudySession | null>(
    null,
  );

  const [
    recentlyDeletedSession,
    setRecentlyDeletedSession,
  ] = useState<StudySession | null>(
    null,
  );

  const [
    isClearCompletedDialogOpen,
    setIsClearCompletedDialogOpen,
  ] = useState(false);

  const [
    sessionsFromCache,
    setSessionsFromCache,
  ] = useState(false);

  const [
    sessionsHavePendingWrites,
    setSessionsHavePendingWrites,
  ] = useState(false);

  const [
    courseNames,
    setCourseNames,
  ] = useState<string[]>([]);

  const [
    sessionToEdit,
    setSessionToEdit,
  ] = useState<StudySession | null>(
    null,
  );

  const [
  sessionEditSnapshot,
  setSessionEditSnapshot,
] = useState<StudySession | null>(
  null,
);

const [
  hasSessionConflict,
  setHasSessionConflict,
] = useState(false);

  const [
    hasLoaded,
    setHasLoaded,
  ] = useState(false);

  const [
    isSavingSessions,
    setIsSavingSessions,
  ] = useState(false);

  const [
    studySessionDataError,
    setStudySessionDataError,
  ] = useState<string | null>(
    null,
  );

  const [
    courseFilter,
    setCourseFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StudyStatusFilter>(
      "All",
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  /*
   * Load study-planner data.
   *
   * Signed-out users:
   * - load sessions locally
   * - load courses locally
   *
   * Signed-in users:
   * - subscribe to sessions in Firestore
   * - load courses through courseService
   */
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
setHasLoaded(false);

setStudySessionDataError(
  null,
);

    /*
     * SIGNED OUT
     */
    if (!user?.uid) {
      let isCancelled = false;

      async function loadLocalData() {
        try {
          const [
            loadedSessions,
            loadedCourses,
          ] = await Promise.all([
            loadStudySessions(),
            loadCourses(),
          ]);

          if (isCancelled) {
            return;
          }

          setSessions(
            loadedSessions,
          );

          setCourseNames(
            loadedCourses.map(
              (course) =>
                course.name,
            ),
          );

          setSessionsFromCache(
            false,
          );

          setSessionsHavePendingWrites(
            false,
          );
        } catch (error) {
          console.error(
            "Could not load study planner data:",
            error,
          );

          if (!isCancelled) {
            setStudySessionDataError(
              "Your saved study planner data could not be loaded.",
            );
          }
        } finally {
          if (!isCancelled) {
            setHasLoaded(true);
          }
        }
      }

      void loadLocalData();

      return () => {
        isCancelled = true;
      };
    }

    /*
     * SIGNED IN
     *
     * Capture the UID here so nested
     * async functions do not have to
     * access User | null.
     */
    const userId =
      user.uid;

    let isCancelled = false;

    async function loadCourseNames() {
      try {
        const loadedCourses =
          await loadCourses(
            userId,
          );

        if (isCancelled) {
          return;
        }

        setCourseNames(
          loadedCourses.map(
            (course) =>
              course.name,
          ),
        );
      } catch (error) {
        console.error(
          "Could not load courses for study planner:",
          error,
        );

        if (!isCancelled) {
          setStudySessionDataError(
            "Your course list could not be loaded.",
          );
        }
      }
    }

    void loadCourseNames();

    const unsubscribe =
      subscribeToStudySessions(
        userId,

        (snapshot) => {
          setSessions(
            snapshot.data,
          );

          setSessionsFromCache(
            snapshot.fromCache,
          );

          setSessionsHavePendingWrites(
            snapshot.hasPendingWrites,
          );

          setHasLoaded(true);

          setStudySessionDataError(
            null,
          );
        },

        (error) => {
          console.error(
            "Study-session listener failed:",
            error,
          );

          setStudySessionDataError(
            "Real-time study-session sync could not be started.",
          );

          setHasLoaded(true);
        },
      );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [
    isAuthLoading,
    user?.uid,
  ]);

  /*
   * Signed-out users continue saving
   * the entire local array.
   *
   * Signed-in users use individual
   * Firestore writes instead.
   */
  useEffect(() => {
    if (
      !hasLoaded ||
      isAuthLoading ||
      user?.uid
    ) {
      return;
    }

    let isCancelled = false;

    async function persistSessions() {
      setIsSavingSessions(true);
      setStudySessionDataError(
        null,
      );

      try {
        await saveStudySessions(
          sessions,
        );

        notifyAppDataChanged();
      } catch (error) {
        console.error(
          "Could not save study sessions:",
          error,
        );

        if (!isCancelled) {
          setStudySessionDataError(
            "Your study sessions could not be saved on this device.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSavingSessions(
            false,
          );
        }
      }
    }

    void persistSessions();

    return () => {
      isCancelled = true;
    };
  }, [
    sessions,
    hasLoaded,
    isAuthLoading,
    user?.uid,
  ]);

  /*
   * Open a study session for editing
   * when arriving from:
   *
   * /planner?edit=SESSION_ID
   */
  useEffect(() => {
    if (!hasLoaded) {
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

    const requestedSession =
      sessions.find(
        (session) =>
          session.id ===
          requestedEditId,
      );

    if (!requestedSession) {
      return;
    }

    handledEditId.current =
      requestedEditId;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionToEdit(
      requestedSession,
    );

    router.replace(
      pathname,
      {
        scroll: false,
      },
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    sessions,
    hasLoaded,
    searchParams,
    pathname,
    router,
  ]);

  /*
   * Remove the ?date= parameter after
   * StudySessionForm has received it.
   */
  useEffect(() => {
    if (
      !hasLoaded ||
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
    hasLoaded,
    pathname,
    requestedCreateDate,
    router,
  ]);

  useEffect(() => {
  if (
    !sessionToEdit ||
    !sessionEditSnapshot
  ) {
    return;
  }

  const latestSession =
    sessions.find(
      (session) =>
        session.id ===
        sessionToEdit.id,
    );

  if (!latestSession) {
    return;
  }

  if (
    hasObjectChanged(
      sessionEditSnapshot,
      latestSession,
    )
  ) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasSessionConflict(
      true,
    );
  }
}, [
  sessions,
  sessionToEdit,
  sessionEditSnapshot,
]);

  async function saveSession(
    session: StudySession,
  ) {
    if (
  hasSessionConflict &&
  sessionToEdit
) {
  const shouldOverwrite =
    window.confirm(
      "This study session changed on another device while you were editing it. Save your version anyway?",
    );

  if (!shouldOverwrite) {
    return;
  }
}
    const previousSessions =
      sessions;

    const sessionExists =
      sessions.some(
        (currentSession) =>
          currentSession.id ===
          session.id,
      );

    const nextSessions =
      sessionExists
        ? sessions.map(
            (currentSession) =>
              currentSession.id ===
              session.id
                ? session
                : currentSession,
          )
        : [
            ...sessions,
            session,
          ];

    setSessions(
      nextSessions,
    );

    setSessionToEdit(null);
    setSessionToEdit(null);

setSessionEditSnapshot(
  null,
);

setHasSessionConflict(
  false,
);
    setStudySessionDataError(
      null,
    );

    /*
     * Signed-out changes are persisted
     * by the local saving effect.
     */
    if (!user?.uid) {
      return;
    }

    setIsSavingSessions(true);

    try {
      await saveOneStudySession(
        session,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not save study session:",
        error,
      );

      setSessions(
        previousSessions,
      );

      setStudySessionDataError(
        "The study session could not be saved. Your previous data was restored.",
      );
    } finally {
      setIsSavingSessions(false);
    }
  }

  function startEditingSession(
  session: StudySession,
) {
  setSessionToEdit(
    session,
  );

  setSessionEditSnapshot(
    session,
  );

  setHasSessionConflict(
    false,
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

 function cancelEditingSession() {
  setSessionToEdit(null);

  setSessionEditSnapshot(
    null,
  );

  setHasSessionConflict(
    false,
  );
}

  async function toggleSessionComplete(
    sessionId: string,
  ) {
    const session =
      sessions.find(
        (currentSession) =>
          currentSession.id ===
          sessionId,
      );

    if (!session) {
      return;
    }

    const previousSessions =
      sessions;

    const isCompleting =
      !session.completed;

    const updatedSession: StudySession = {
      ...session,
      completed:
        isCompleting,
      completedAt:
        isCompleting
          ? new Date().toISOString()
          : null,
    };

    setSessions(
      (currentSessions) =>
        currentSessions.map(
          (currentSession) =>
            currentSession.id ===
            sessionId
              ? updatedSession
              : currentSession,
        ),
    );

    if (!user?.uid) {
      return;
    }

    setIsSavingSessions(true);

    try {
      await saveOneStudySession(
        updatedSession,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not update study session completion:",
        error,
      );

      setSessions(
        previousSessions,
      );

      setStudySessionDataError(
        "The study session could not be updated. Your previous data was restored.",
      );
    } finally {
      setIsSavingSessions(false);
    }
  }

  function requestSessionDeletion(
    sessionId: string,
  ) {
    const session =
      sessions.find(
        (currentSession) =>
          currentSession.id ===
          sessionId,
      );

    if (!session) {
      return;
    }

    setSessionPendingDeletion(
      session,
    );
  }

  async function confirmSessionDeletion() {
    if (!sessionPendingDeletion) {
      return;
    }

    const sessionToDelete =
      sessionPendingDeletion;

    const sessionId =
      sessionToDelete.id;

    const previousSessions =
      sessions;

    setSessions(
      (currentSessions) =>
        currentSessions.filter(
          (session) =>
            session.id !==
            sessionId,
        ),
    );

    if (
      sessionToEdit?.id ===
      sessionId
    ) {
      setSessionToEdit(null);
    }

    setSessionPendingDeletion(
      null,
    );

    if (!user?.uid) {
      setRecentlyDeletedSession(
        sessionToDelete,
      );

      return;
    }

    setIsSavingSessions(true);

    try {
      await deleteOneStudySession(
        sessionId,
        user.uid,
      );

      setRecentlyDeletedSession(
        sessionToDelete,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not delete study session:",
        error,
      );

      setSessions(
        previousSessions,
      );

      setStudySessionDataError(
        "The study session could not be deleted. It has been restored.",
      );
    } finally {
      setIsSavingSessions(false);
    }
  }

  async function undoSessionDeletion() {
    if (!recentlyDeletedSession) {
      return;
    }

    const sessionToRestore =
      recentlyDeletedSession;

    setSessions(
      (currentSessions) => [
        ...currentSessions,
        sessionToRestore,
      ],
    );

    setRecentlyDeletedSession(
      null,
    );

    if (!user?.uid) {
      return;
    }

    setIsSavingSessions(true);

    try {
      await saveOneStudySession(
        sessionToRestore,
        user.uid,
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not restore study session:",
        error,
      );

      setSessions(
        (currentSessions) =>
          currentSessions.filter(
            (session) =>
              session.id !==
              sessionToRestore.id,
          ),
      );

      setStudySessionDataError(
        "The study session could not be restored.",
      );
    } finally {
      setIsSavingSessions(false);
    }
  }

  function requestClearCompletedSessions() {
    if (
      completedSessions.length === 0
    ) {
      return;
    }

    setIsClearCompletedDialogOpen(
      true,
    );
  }

  async function confirmClearCompletedSessions() {
    const previousSessions =
      sessions;

    const sessionsToDelete =
      sessions.filter(
        (session) =>
          session.completed,
      );

    const remainingSessions =
      sessions.filter(
        (session) =>
          !session.completed,
      );

    setSessions(
      remainingSessions,
    );

    if (
      sessionToEdit?.completed
    ) {
      setSessionToEdit(null);
    }

    setIsClearCompletedDialogOpen(
      false,
    );

    /*
     * Signed-out users are handled by
     * the local persistence effect.
     */
    if (!user?.uid) {
      return;
    }

    setIsSavingSessions(true);

    try {
      await Promise.all(
        sessionsToDelete.map(
          (session) =>
            deleteOneStudySession(
              session.id,
              user.uid,
            ),
        ),
      );

      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not clear completed study sessions:",
        error,
      );

      setSessions(
        previousSessions,
      );

      setStudySessionDataError(
        "Completed study sessions could not be cleared. Your previous data was restored.",
      );
    } finally {
      setIsSavingSessions(false);
    }
  }

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();

  const filteredSessions =
    sessions
      .filter((session) => {
        if (
          courseFilter !==
            "All" &&
          session.course !==
            courseFilter
        ) {
          return false;
        }

        if (
          statusFilter ===
            "Scheduled" &&
          session.completed
        ) {
          return false;
        }

        if (
          statusFilter ===
            "Completed" &&
          !session.completed
        ) {
          return false;
        }

        if (normalizedSearch) {
          const searchableText =
            `${session.topic} ${session.course} ${session.notes}`.toLowerCase();

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
          sessionA,
          sessionB,
        ) => {
          const firstDateTime =
            `${sessionA.date}T${sessionA.startTime}`;

          const secondDateTime =
            `${sessionB.date}T${sessionB.startTime}`;

          return firstDateTime.localeCompare(
            secondDateTime,
          );
        },
      );

  const completedSessions =
    sessions.filter(
      (session) =>
        session.completed,
    );

  const scheduledSessions =
    sessions.filter(
      (session) =>
        !session.completed,
    );

  const totalPlannedMinutes =
    sessions.reduce(
      (
        total,
        session,
      ) =>
        total +
        session.durationMinutes,
      0,
    );

  const completedMinutes =
    completedSessions.reduce(
      (
        total,
        session,
      ) =>
        total +
        session.durationMinutes,
      0,
    );

  if (
    isAuthLoading ||
    !hasLoaded
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
            <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
              Study sessions are
              connected to{" "}
              <span className="font-semibold">
                {user.email}
              </span>
              .
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              You are signed out. Study
              sessions are being saved
              only on this device.
            </div>
          )}

          <SyncStatus
            isSaving={
              isSavingSessions
            }
            error={
              studySessionDataError
            }
            fromCache={
              sessionsFromCache
            }
            hasPendingWrites={
              sessionsHavePendingWrites
            }
            realtime={
              Boolean(user?.uid)
            }
          />
        </div>

        {hasSessionConflict && (
  <div
    role="alert"
    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
  >
    This study session changed on another
    device while you were editing it.
    Review before saving.
  </div>
)}

        <StudySessionForm
          key={
            sessionToEdit?.id ??
            `new-study-session-${requestedCreateDate}`
          }
          sessionToEdit={
            sessionToEdit
          }
          initialDate={
            requestedCreateDate
          }
          courseNames={
            courseNames
          }
          onSaveSession={
            saveSession
          }
          onCancelEdit={
            cancelEditingSession
          }
        />
      </div>

      <section className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StudyStatCard
            title="Total Sessions"
            value={String(
              sessions.length,
            )}
          />

          <StudyStatCard
            title="Scheduled"
            value={String(
              scheduledSessions.length,
            )}
          />

          <StudyStatCard
            title="Completed"
            value={String(
              completedSessions.length,
            )}
          />

          <StudyStatCard
            title="Completed Time"
            value={formatMinutes(
              completedMinutes,
            )}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Completed scheduled time
            </span>

            <span className="font-semibold text-slate-900 dark:text-white">
              {formatMinutes(
                completedMinutes,
              )}{" "}
              completed out of{" "}
              {formatMinutes(
                totalPlannedMinutes,
              )}{" "}
              scheduled
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${
                  totalPlannedMinutes ===
                  0
                    ? 0
                    : Math.round(
                        (completedMinutes /
                          totalPlannedMinutes) *
                          100,
                      )
                }%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <StudyPlannerFilters
            courseFilter={
              courseFilter
            }
            statusFilter={
              statusFilter
            }
            searchTerm={
              searchTerm
            }
            courseNames={
              courseNames
            }
            onCourseChange={
              setCourseFilter
            }
            onStatusChange={
              setStatusFilter
            }
            onSearchChange={
              setSearchTerm
            }
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Your Study Sessions
            </h2>

            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Showing{" "}
              {filteredSessions.length}{" "}
              of {sessions.length}{" "}
              sessions.
            </p>
          </div>

          {completedSessions.length >
            0 && (
            <button
              type="button"
              onClick={
                requestClearCompletedSessions
              }
              className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear Completed
            </button>
          )}
        </div>

        {filteredSessions.length > 0 ? (
          <div className="mt-5 grid gap-5">
            {filteredSessions.map(
              (session) => (
                <StudySessionCard
                  key={session.id}
                  session={session}
                  onToggleComplete={
                    toggleSessionComplete
                  }
                  onEdit={
                    startEditingSession
                  }
                  onDelete={
                    requestSessionDeletion
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              No study sessions found
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Schedule a session or
              change your filters.
            </p>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={
          sessionPendingDeletion !==
          null
        }
        title="Delete study session?"
        description={
          sessionPendingDeletion
            ? `Delete "${sessionPendingDeletion.topic}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Session"
        destructive
        onConfirm={
          confirmSessionDeletion
        }
        onCancel={() =>
          setSessionPendingDeletion(
            null,
          )
        }
      />

      <ConfirmDialog
        open={
          isClearCompletedDialogOpen
        }
        title="Clear completed sessions?"
        description={`Delete ${completedSessions.length} completed study session${
          completedSessions.length ===
          1
            ? ""
            : "s"
        }? This action cannot be undone.`}
        confirmText="Clear Completed"
        destructive
        onConfirm={
          confirmClearCompletedSessions
        }
        onCancel={() =>
          setIsClearCompletedDialogOpen(
            false,
          )
        }
      />

      {recentlyDeletedSession && (
        <UndoToast
          message={`Deleted "${recentlyDeletedSession.topic}".`}
          onUndo={
            undoSessionDeletion
          }
          onDismiss={() =>
            setRecentlyDeletedSession(
              null,
            )
          }
        />
      )}
    </div>
  );
}

type StudyStatCardProps = {
  title: string;
  value: string;
};

function StudyStatCard({
  title,
  value,
}: StudyStatCardProps) {
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

function formatMinutes(
  minutes: number,
) {
  const hours =
    Math.floor(
      minutes / 60,
    );

  const remainingMinutes =
    minutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (
    remainingMinutes === 0
  ) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}