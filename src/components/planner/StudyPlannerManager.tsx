"use client";

import { useEffect, useState } from "react";

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

const initialSessions: StudySession[] = [];

export default function StudyPlannerManager() {
  const [sessions, setSessions] =
    useState<StudySession[]>(initialSessions);

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
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSessions(parsedSessions);
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
      currentSessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              completed: !session.completed,
            }
          : session,
      ),
    );
  }

  function deleteSession(sessionId: string) {
    const sessionToDelete = sessions.find(
      (session) => session.id === sessionId,
    );

    if (!sessionToDelete) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${sessionToDelete.topic}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setSessions((currentSessions) =>
      currentSessions.filter(
        (session) =>
          session.id !== sessionId,
      ),
    );

    if (sessionToEdit?.id === sessionId) {
      setSessionToEdit(null);
    }
  }

  function clearCompletedSessions() {
    const completedCount = sessions.filter(
      (session) => session.completed,
    ).length;

    if (completedCount === 0) {
      return;
    }

    const shouldClear = window.confirm(
      `Delete ${completedCount} completed study session${
        completedCount === 1 ? "" : "s"
      }?`,
    );

    if (!shouldClear) {
      return;
    }

    setSessions((currentSessions) =>
      currentSessions.filter(
        (session) => !session.completed,
      ),
    );

    if (sessionToEdit?.completed) {
      setSessionToEdit(null);
    }
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
              Completed study time
            </span>

            <span className="font-semibold text-slate-900">
              {formatMinutes(completedMinutes)} of{" "}
              {formatMinutes(totalPlannedMinutes)}
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
              onClick={clearCompletedSessions}
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
                  onDelete={deleteSession}
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