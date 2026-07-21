"use client";

import { useEffect, useState } from "react";
import { normalizeStudySession } from "@/utils/studySessions";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import StudyPlannerFilters, {
  type StudyStatusFilter,
} from "@/components/planner/StudyPlannerFilters";

import StudySessionCard from "@/components/planner/StudySessionCard";
import StudySessionForm from "@/components/planner/StudySessionForm";

import {
  COURSE_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import type { Course } from "@/types/course";
import type { StudySession } from "@/types/studySession";

import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

const initialSessions: StudySession[] = [];


export default function StudyPlannerManager() {
  const [sessions, setSessions] =
    useState<StudySession[]>(initialSessions);

    const [
  sessionPendingDeletion,
  setSessionPendingDeletion,
] = useState<StudySession | null>(null);

const [
  isClearCompletedDialogOpen,
  setIsClearCompletedDialogOpen,
] = useState(false);

  const [courseNames, setCourseNames] =
    useState<string[]>([]);

  const [sessionToEdit, setSessionToEdit] =
    useState<StudySession | null>(null);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState<StudyStatusFilter>("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    try {
      const storedSessions =
        localStorage.getItem(
          STUDY_SESSION_STORAGE_KEY,
        );

      if (storedSessions) {
        const parsedSessions = JSON.parse(
          storedSessions,
        ) as StudySession[];

        if (Array.isArray(parsedSessions)) {
  const normalizedSessions =
    parsedSessions.map(
      normalizeStudySession,
    );
// eslint-disable-next-line react-hooks/set-state-in-effect
  setSessions(normalizedSessions);
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
        "Could not load study planner data:",
        error,
      );
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        STUDY_SESSION_STORAGE_KEY,
        JSON.stringify(sessions),
      );
      notifyAppDataChanged();
    } catch (error) {
      console.error(
        "Could not save study sessions:",
        error,
      );
    }
  }, [sessions, hasLoaded]);

  function saveSession(
    session: StudySession,
  ) {
    setSessions((currentSessions) => {
      const sessionExists =
        currentSessions.some(
          (currentSession) =>
            currentSession.id === session.id,
        );

      if (sessionExists) {
        return currentSessions.map(
          (currentSession) =>
            currentSession.id === session.id
              ? session
              : currentSession,
        );
      }

      return [...currentSessions, session];
    });

    setSessionToEdit(null);
  }

  function startEditingSession(
    session: StudySession,
  ) {
    setSessionToEdit(session);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditingSession() {
    setSessionToEdit(null);
  }

  function toggleSessionComplete(
  sessionId: string,
) {
  setSessions((currentSessions) =>
    currentSessions.map((session) => {
      if (session.id !== sessionId) {
        return session;
      }

      const isCompleting =
        !session.completed;

      return {
        ...session,
        completed: isCompleting,
        completedAt: isCompleting
          ? new Date().toISOString()
          : null,
      };
    }),
  );
}

  function requestSessionDeletion(
  sessionId: string,
) {
  const session = sessions.find(
    (currentSession) =>
      currentSession.id === sessionId,
  );

  if (!session) {
    return;
  }

  setSessionPendingDeletion(session);
}

function confirmSessionDeletion() {
  if (!sessionPendingDeletion) {
    return;
  }

  const sessionId =
    sessionPendingDeletion.id;

  setSessions((currentSessions) =>
    currentSessions.filter(
      (session) =>
        session.id !== sessionId,
    ),
  );

  if (
    sessionToEdit?.id === sessionId
  ) {
    setSessionToEdit(null);
  }

  setSessionPendingDeletion(null);
}

  function requestClearCompletedSessions() {
  if (completedSessions.length === 0) {
    return;
  }

  setIsClearCompletedDialogOpen(true);
}

function confirmClearCompletedSessions() {
  setSessions((currentSessions) =>
    currentSessions.filter(
      (session) =>
        !session.completed,
    ),
  );

  if (sessionToEdit?.completed) {
    setSessionToEdit(null);
  }

  setIsClearCompletedDialogOpen(false);
}

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredSessions = sessions
    .filter((session) => {
      if (
        courseFilter !== "All" &&
        session.course !== courseFilter
      ) {
        return false;
      }

      if (
        statusFilter === "Scheduled" &&
        session.completed
      ) {
        return false;
      }

      if (
        statusFilter === "Completed" &&
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
    .sort((sessionA, sessionB) => {
      const firstDateTime =
        `${sessionA.date}T${sessionA.startTime}`;

      const secondDateTime =
        `${sessionB.date}T${sessionB.startTime}`;

      return firstDateTime.localeCompare(
        secondDateTime,
      );
    });

  const completedSessions =
    sessions.filter(
      (session) => session.completed,
    );

  const scheduledSessions =
    sessions.filter(
      (session) => !session.completed,
    );

  const totalPlannedMinutes =
    sessions.reduce(
      (total, session) =>
        total + session.durationMinutes,
      0,
    );

  const completedMinutes =
    completedSessions.reduce(
      (total, session) =>
        total + session.durationMinutes,
      0,
    );

  return (
    <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
      <StudySessionForm
        key={
          sessionToEdit?.id ??
          "new-study-session"
        }
        sessionToEdit={sessionToEdit}
        courseNames={courseNames}
        onSaveSession={saveSession}
        onCancelEdit={cancelEditingSession}
      />

      <section className="min-w-0">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StudyStatCard
            title="Total Sessions"
            value={String(sessions.length)}
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

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-slate-600">
  Completed scheduled time
</span>

            <span className="font-semibold text-slate-900">
              {formatMinutes(completedMinutes)} completed out of{" "}
{formatMinutes(totalPlannedMinutes)} scheduled
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${
                  totalPlannedMinutes === 0
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
            courseFilter={courseFilter}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            courseNames={courseNames}
            onCourseChange={setCourseFilter}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your Study Sessions
            </h2>

            <p className="mt-1 text-slate-600">
              Showing {filteredSessions.length} of{" "}
              {sessions.length} sessions.
            </p>
          </div>

          {completedSessions.length > 0 && (
            <button
              type="button"
             onClick={
  requestClearCompletedSessions
}
              className="w-fit text-sm font-semibold text-red-600 transition hover:text-red-700"
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
                  onDelete={requestSessionDeletion}
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="font-semibold text-slate-900">
              No study sessions found
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Schedule a session or change
              your filters.
            </p>
          </div>
        )}
      </section>
      <ConfirmDialog
  open={
    sessionPendingDeletion !== null
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
    setSessionPendingDeletion(null)
  }
/>

<ConfirmDialog
  open={
    isClearCompletedDialogOpen
  }
  title="Clear completed sessions?"
  description={`Delete ${completedSessions.length} completed study session${
    completedSessions.length === 1
      ? ""
      : "s"
  }? This action cannot be undone.`}
  confirmText="Clear Completed"
  destructive
  onConfirm={
    confirmClearCompletedSessions
  }
  onCancel={() =>
    setIsClearCompletedDialogOpen(false)
  }
/>
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
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </article>

  );
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}