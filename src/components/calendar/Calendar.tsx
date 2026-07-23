"use client";

import {
  useEffect,
  useState,
} from "react";

import CalendarDay from "@/components/calendar/CalendarDay";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import SelectedDayPanel from "@/components/calendar/SelectedDayPanel";
import CalendarAgendaView from "@/components/calendar/CalendarAgendaView";
import CalendarViewControls from "@/components/calendar/CalendarViewControls";
import CalendarWeekView from "@/components/calendar/CalendarWeekView";

import {
  APP_DATA_CHANGED_EVENT,
} from "@/utils/appEvents";

import {
  formatCalendarWeek,
  formatDateKey,
  getCalendarEvents,
  getMonthGridDates,
} from "@/utils/calendar";

import {
  loadAssignments,
} from "@/services/assignmentService";

import {
  loadStudySessions,
} from "@/services/studySessionService";

import type {
  CalendarEvent,
  CalendarFilter,
  CalendarView,
} from "@/types/calendar";


const weekdayLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];



export default function Calendar() {
  const [
    displayedMonth,
    setDisplayedMonth,
  ] = useState(() => {
    const today = new Date();

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );
  });

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(() => new Date());

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [filter, setFilter] =
    useState<CalendarFilter>("all");

    const [view, setView] =
  useState<CalendarView>("month");

  const [
  calendarSearch,
  setCalendarSearch,
] = useState("");

  const [hasLoaded, setHasLoaded] =
    useState(false);

  function loadCalendarData() {
  setEvents(
    getCalendarEvents(
      loadAssignments(),
      loadStudySessions(),
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

  function showPreviousPeriod() {
  if (view === "week") {
    const previousWeek =
      new Date(selectedDate);

    previousWeek.setDate(
      selectedDate.getDate() - 7,
    );

    setSelectedDate(previousWeek);

    setDisplayedMonth(
      new Date(
        previousWeek.getFullYear(),
        previousWeek.getMonth(),
        1,
      ),
    );

    return;
  }

  setDisplayedMonth(
    (currentMonth) =>
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1,
      ),
  );
}

  function showNextPeriod() {
  if (view === "week") {
    const nextWeek =
      new Date(selectedDate);

    nextWeek.setDate(
      selectedDate.getDate() + 7,
    );

    setSelectedDate(nextWeek);

    setDisplayedMonth(
      new Date(
        nextWeek.getFullYear(),
        nextWeek.getMonth(),
        1,
      ),
    );

    return;
  }

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

    setSelectedDate(today);
  }

  function getFilterButtonClass(
    buttonFilter: CalendarFilter,
  ) {
    const isSelected =
      filter === buttonFilter;

    return `inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
      isSelected
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-slate-800"
    }`;
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

  const displayedYear =
    displayedMonth.getFullYear();

  const displayedMonthIndex =
    displayedMonth.getMonth();

  const monthEvents =
    events.filter((event) => {
      const eventDate = new Date(
        `${event.date}T12:00:00`,
      );

      return (
        eventDate.getFullYear() ===
          displayedYear &&
        eventDate.getMonth() ===
          displayedMonthIndex
      );
    });

  const assignmentCount =
    monthEvents.filter(
      (event) =>
        event.kind === "assignment",
    ).length;

  const studySessionCount =
    monthEvents.filter(
      (event) =>
        event.kind ===
        "study-session",
    ).length;

    const completedEventCount =
  monthEvents.filter(
    (event) => event.completed,
  ).length;

const activeEventCount =
  monthEvents.length -
  completedEventCount;

  const normalizedCalendarSearch =
  calendarSearch
    .trim()
    .toLowerCase();

const filteredEvents =
  events.filter((event) => {
    if (
      filter !== "all" &&
      event.kind !== filter
    ) {
      return false;
    }

    if (
      normalizedCalendarSearch
    ) {
      const kindLabel =
        event.kind ===
        "assignment"
          ? "assignment"
          : "study session";

      const searchableText =
        `${event.title} ${event.course} ${kindLabel}`.toLowerCase();

      if (
        !searchableText.includes(
          normalizedCalendarSearch,
        )
      ) {
        return false;
      }
    }

    return true;
  });

  const selectedDateKey =
    formatDateKey(selectedDate);

  const selectedDayEvents =
    filteredEvents.filter(
      (event) =>
        event.date ===
        selectedDateKey,
    );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <CalendarHeader
  displayedMonth={
    displayedMonth
  }
  onPreviousMonth={
    showPreviousPeriod
  }
  onNextMonth={
    showNextPeriod
  }
  onToday={showCurrentMonth}
/>

<div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
  <div>
    <p className="text-sm font-semibold text-slate-900 dark:text-white">
      {view === "month"
        ? "Month view"
        : view === "week"
          ? formatCalendarWeek(
              selectedDate,
            )
          : "Monthly agenda"}
    </p>

    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
      Choose how calendar events are
      displayed.
    </p>
  </div>

  <CalendarViewControls
    view={view}
    onViewChange={setView}
  />
</div>

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-700 dark:bg-slate-950">
  <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      Total Events
    </p>

    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
      {monthEvents.length}
    </p>
  </article>

  <article className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
      Assignments
    </p>

    <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
      {assignmentCount}
    </p>
  </article>

  <article className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/40">
    <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
      Study Sessions
    </p>

    <p className="mt-1 text-2xl font-bold text-violet-900 dark:text-violet-100">
      {studySessionCount}
    </p>
  </article>

  <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
      Active / Completed
    </p>

    <p className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
      {activeEventCount} /{" "}
      {completedEventCount}
    </p>
  </article>
</div>

        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div
            className="flex flex-wrap gap-2"
            aria-label="Calendar event filters"
          >
            <button
              type="button"
              onClick={() =>
                setFilter("all")
              }
              aria-pressed={
                filter === "all"
              }
              className={getFilterButtonClass(
                "all",
              )}
            >
              <span>All</span>

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filter === "all"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {monthEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setFilter(
                  "assignment",
                )
              }
              aria-pressed={
                filter ===
                "assignment"
              }
              className={getFilterButtonClass(
                "assignment",
              )}
            >
              <span>Assignments</span>

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filter ===
                  "assignment"
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                {assignmentCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setFilter(
                  "study-session",
                )
              }
              aria-pressed={
                filter ===
                "study-session"
              }
              className={getFilterButtonClass(
                "study-session",
              )}
            >
              <span>Study Sessions</span>

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filter ===
                  "study-session"
                    ? "bg-white/20 text-white"
                    : "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                }`}
              >
                {studySessionCount}
              </span>
            </button>
          </div>
          <label className="block w-full lg:max-w-sm">
    <span className="sr-only">
      Search calendar events
    </span>

    <input
      type="search"
      value={calendarSearch}
      onChange={(event) =>
        setCalendarSearch(
          event.target.value,
        )
      }
      placeholder="Search title or course..."
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900"
    />
  </label>
</div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
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
        {view === "month" && (
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
  key={date.toISOString()}
  date={date}
  displayedMonth={
    displayedMonth
  }
  events={filteredEvents}
  selectedDateKey={
    selectedDateKey
  }
  onSelectDate={
    setSelectedDate
  }
  onShowAllEvents={
    setSelectedDate
  }
/>
                  
                ),
              )}
            </div>
          </div>
        </div>
        )}

        {view === "week" && (
  <CalendarWeekView
    selectedDate={selectedDate}
    events={filteredEvents}
    onSelectDate={setSelectedDate}
  />
)}

{view === "agenda" && (
  <CalendarAgendaView
  events={filteredEvents.filter(
    (event) => {
      const eventDate =
        new Date(
          `${event.date}T12:00:00`,
        );

      return (
        eventDate.getFullYear() ===
          displayedYear &&
        eventDate.getMonth() ===
          displayedMonthIndex
      );
    },
  )}
/>
)}
      </section>

      <SelectedDayPanel
        selectedDate={selectedDate}
        events={selectedDayEvents}
      />
    </div>
  );
}