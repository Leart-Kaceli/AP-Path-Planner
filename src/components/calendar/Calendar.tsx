"use client";

import {
  useEffect,
  useState,
} from "react";

import CalendarDay from "@/components/calendar/CalendarDay";
import CalendarHeader from "@/components/calendar/CalendarHeader";

import {
  APP_DATA_CHANGED_EVENT,
} from "@/utils/appEvents";

import {
  getCalendarEvents,
  getMonthGridDates,
} from "@/utils/calendar";

import {
  normalizeAssignment,
} from "@/utils/assignments";

import {
  normalizeStudySession,
} from "@/utils/studySessions";

import {
  ASSIGNMENT_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import type {
  Assignment,
} from "@/types/assignment";

import type {
  CalendarEvent,
} from "@/types/calendar";

import type {
  StudySession,
} from "@/types/studySession";

const weekdayLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function loadStoredArray<T>(
  storageKey: string,
) {
  try {
    const storedValue =
      localStorage.getItem(
        storageKey,
      );

    if (!storedValue) {
      return [] as T[];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as T[])
      : [];
  } catch {
    return [] as T[];
  }
}

export default function Calendar() {
  const [
    displayedMonth,
    setDisplayedMonth,
  ] = useState(
    () => {
      const today = new Date();

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
    },
  );

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  function loadCalendarData() {
    const assignments =
      loadStoredArray<Assignment>(
        ASSIGNMENT_STORAGE_KEY,
      ).map(normalizeAssignment);

    const studySessions =
      loadStoredArray<StudySession>(
        STUDY_SESSION_STORAGE_KEY,
      ).map(normalizeStudySession);

    setEvents(
      getCalendarEvents(
        assignments,
        studySessions,
      ),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCalendarData();

    setHasLoaded(true);

    function handleAppDataChanged() {
      loadCalendarData();
    }

    function handleStorageChange() {
      loadCalendarData();
    }

    window.addEventListener(
      APP_DATA_CHANGED_EVENT,
      handleAppDataChanged,
    );

    window.addEventListener(
      "storage",
      handleStorageChange,
    );

    return () => {
      window.removeEventListener(
        APP_DATA_CHANGED_EVENT,
        handleAppDataChanged,
      );

      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
    };
  }, []);

  function showPreviousMonth() {
    setDisplayedMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1,
        ),
    );
  }

  function showNextMonth() {
    setDisplayedMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1,
        ),
    );
  }

  function showCurrentMonth() {
    const today = new Date();

    setDisplayedMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    );
  }

  if (!hasLoaded) {
    return (
      <div className="h-[600px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    );
  }

  const calendarDates =
    getMonthGridDates(
      displayedMonth,
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <CalendarHeader
        displayedMonth={
          displayedMonth
        }
        onPreviousMonth={
          showPreviousMonth
        }
        onNextMonth={
          showNextMonth
        }
        onToday={showCurrentMonth}
      />

      <div className="border-b border-slate-200 px-5 py-3 dark:border-slate-700">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-100 ring-1 ring-blue-200 dark:bg-blue-950 dark:ring-blue-900" />

            <span className="text-slate-600 dark:text-slate-300">
              Assignments
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-violet-100 ring-1 ring-violet-200 dark:bg-violet-950 dark:ring-violet-900" />

            <span className="text-slate-600 dark:text-slate-300">
              Study sessions
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
            {weekdayLabels.map(
              (weekday) => (
                <div
                  key={weekday}
                  className="border-r border-slate-200 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500 last:border-r-0 dark:border-slate-700 dark:text-slate-400"
                >
                  {weekday}
                </div>
              ),
            )}
          </div>

          <div className="grid grid-cols-7 border-l border-t border-slate-200 dark:border-slate-700">
            {calendarDates.map(
              (date) => (
                <CalendarDay
                  key={
                    date.toISOString()
                  }
                  date={date}
                  displayedMonth={
                    displayedMonth
                  }
                  events={events}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}