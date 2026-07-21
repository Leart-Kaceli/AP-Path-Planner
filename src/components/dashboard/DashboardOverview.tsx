"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import AssignmentCard from "@/components/dashboard/AssignmentCard";
import CourseCard from "@/components/dashboard/CourseCard";
import StatCard from "@/components/dashboard/StatCard";
import DashboardStudySession from "@/components/dashboard/DashboardStudySession";
import { DEFAULT_GRADE_WEIGHTS } from "@/constants/grades";
import DashboardGradeSummary from "@/components/dashboard/DashboardGradeSummary";
import { normalizeStudySession } from "@/utils/studySessions";
import { normalizeAssignment } from "@/utils/assignments";
import DashboardReminderSummary from "@/components/dashboard/DashboardReminderSummary";

import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
  GRADE_STORAGE_KEY,
  GRADE_WEIGHT_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";

import {
  calculatePointAverage,
  calculateWeightedAverage,
} from "@/utils/grades";
import {
  isDateTimeInCurrentWeek,
  isDateTimeToday,
} from "@/utils/dates";

import type { Assignment } from "@/types/assignment";
import type { Course } from "@/types/course";
import type { StudySession } from "@/types/studySession";
import type {
  CourseGradeWeights,
  GradeEntry,
} from "@/types/grade";
import type { StudentProfile } from "@/types/profile";

import {
  loadNotificationData,
} from "@/utils/notifications";

import type {
  AppNotification,
} from "@/types/notification";

import {
  APP_DATA_CHANGED_EVENT,
} from "@/utils/appEvents";

type LoadedDashboardData = {
  courses: Course[];
  assignments: Assignment[];
  studySessions: StudySession[];
  grades: GradeEntry[];
  weightsByCourse: CourseGradeWeights;
  profile: StudentProfile;
};
const emptyDashboardData: LoadedDashboardData = {
  courses: [],
  assignments: [],
  studySessions: [],
  grades: [],
  weightsByCourse: {},
  profile: DEFAULT_STUDENT_PROFILE,
};


export default function DashboardOverview() {

 const [
  dashboardNotifications,
  setDashboardNotifications,
] = useState<AppNotification[]>([]);

const [dashboardData, setDashboardData] =
  useState<LoadedDashboardData>(
    emptyDashboardData,
  );

  const [hasLoaded, setHasLoaded] =
    useState(false);

   

  useEffect(() => {
    try {
      const storedCourses =
        localStorage.getItem(
          COURSE_STORAGE_KEY,
        );

      const storedAssignments =
        localStorage.getItem(
          ASSIGNMENT_STORAGE_KEY,
        );

        const storedStudySessions =
  localStorage.getItem(
    STUDY_SESSION_STORAGE_KEY,
  );

    const storedGrades =
  localStorage.getItem(
    GRADE_STORAGE_KEY,
  );

const storedGradeWeights =
  localStorage.getItem(
    GRADE_WEIGHT_STORAGE_KEY,
  );
  


  const storedProfile =
  localStorage.getItem(
    PROFILE_STORAGE_KEY,
  );

      const courses = storedCourses
        ? (JSON.parse(
            storedCourses,
          ) as Course[])
        : [];

      const assignments =
        storedAssignments
          ? (JSON.parse(
              storedAssignments,
            ) as Assignment[])
          : [];

          const studySessions =
  storedStudySessions
    ? (JSON.parse(
        storedStudySessions,
      ) as StudySession[])
    : [];

    const grades = storedGrades
  ? (JSON.parse(
      storedGrades,
    ) as GradeEntry[])
  : [];

const weightsByCourse =
  storedGradeWeights
    ? (JSON.parse(
        storedGradeWeights,
      ) as CourseGradeWeights)
    : {};

const safeStudySessions =
  Array.isArray(studySessions)
    ? studySessions.map(
        normalizeStudySession,
      )
    : [];

      const safeCourses =
        Array.isArray(courses)
          ? courses
          : [];

      const safeAssignments =
  Array.isArray(assignments)
    ? assignments.map(
        normalizeAssignment,
      )
    : [];

        const safeGrades =
  Array.isArray(grades)
    ? grades
    : [];

const safeWeightsByCourse =
  weightsByCourse &&
  typeof weightsByCourse === "object" &&
  !Array.isArray(weightsByCourse)
    ? weightsByCourse
    : {};

    const parsedProfile = storedProfile
  ? (JSON.parse(
      storedProfile,
    ) as Partial<StudentProfile>)
  : {};

const safeProfile: StudentProfile = {
  ...DEFAULT_STUDENT_PROFILE,
  ...parsedProfile,
};

const loadedNotificationData =
  loadNotificationData();

      // eslint-disable-next-line react-hooks/set-state-in-effect
     setDashboardData({
  courses: safeCourses,
  assignments: safeAssignments,
  studySessions: safeStudySessions,
  grades: safeGrades,
  weightsByCourse: safeWeightsByCourse,
  profile: safeProfile,
});

const refreshedNotifications =
  loadNotificationData();


setDashboardNotifications(
  loadedNotificationData.notifications,
);

function handleAppDataChanged() {
  

  setDashboardNotifications(
    refreshedNotifications.notifications,
  );
}

window.addEventListener(
  APP_DATA_CHANGED_EVENT,
  handleAppDataChanged,
);

return () => {
  window.removeEventListener(
    APP_DATA_CHANGED_EVENT,
    handleAppDataChanged,
  );
};


    } catch (error) {
      console.error(
        "Could not load dashboard data:",
        error,
      );

      setDashboardData(
        emptyDashboardData,
      );
    } finally {
      setHasLoaded(true);
    }
  }, []);

  if (!hasLoaded) {
    return <DashboardLoading />;
  }

const {
  courses,
  assignments,
  studySessions,
  grades,
  weightsByCourse,
  profile,
} = dashboardData;

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.completed,
    );

    const assignmentsCompletedToday =
  completedAssignments.filter(
    (assignment) =>
      assignment.completedAt !== null &&
      isDateTimeToday(
        assignment.completedAt,
      ),
  );

  const activeAssignments =
    assignments.filter(
      (assignment) =>
        !assignment.completed,
    );

    const completedSessionsThisWeek =
  studySessions.filter(
    (session) =>
      session.completed &&
      session.completedAt !== null &&
      isDateTimeInCurrentWeek(
        session.completedAt,
      ),
  );

const completedMinutesThisWeek =
  completedSessionsThisWeek.reduce(
    (total, session) =>
      total + session.durationMinutes,
    0,
  );

const weeklyStudyGoal =
  profile.weeklyStudyGoalMinutes;



const weeklyStudyPercentage =
  weeklyStudyGoal === 0
    ? 0
    : Math.min(
        100,
        Math.round(
          (completedMinutesThisWeek /
            weeklyStudyGoal) *
            100,
        ),
      );

const scheduledStudySessions =
  studySessions.filter(
    (session) => !session.completed,
  );


const upcomingStudySessions =
  scheduledStudySessions
    .slice()
    .sort((sessionA, sessionB) => {
      const firstDateTime =
        `${sessionA.date}T${sessionA.startTime}`;

      const secondDateTime =
        `${sessionB.date}T${sessionB.startTime}`;

      return firstDateTime.localeCompare(
        secondDateTime,
      );
    })
    .slice(0, 3);



  const averageProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce(
            (total, course) =>
              total + course.progress,
            0,
          ) / courses.length,
        );

  const assignmentCompletion =
    assignments.length === 0
      ? 0
      : Math.round(
          (completedAssignments.length /
            assignments.length) *
            100,
        );

  const upcomingAssignments =
    activeAssignments
      .slice()
      .sort(
        (assignmentA, assignmentB) =>
          assignmentA.dueDate.localeCompare(
            assignmentB.dueDate,
          ),
      )
      .slice(0, 5);

  const displayedCourses =
    courses.slice(0, 4);

  const overallPointAverage =
  calculatePointAverage(grades);

const coursesWithGrades = Array.from(
  new Set(
    grades.map((grade) => grade.course),
  ),
);

const weightedCourseSummaries =
  coursesWithGrades
    .map((course) => {
      const courseGrades = grades.filter(
        (grade) =>
          grade.course === course,
      );

      const weights =
        weightsByCourse[course] ??
        DEFAULT_GRADE_WEIGHTS;

      const weightedAverage =
        calculateWeightedAverage(
          courseGrades,
          weights,
        );

      

      return {
        course,
        weightedAverage,
      };
    })
    .filter(
      (
        summary,
      ): summary is {
        course: string;
        weightedAverage: number;
      } =>
        summary.weightedAverage !== null,
    );

const overallWeightedAverage =
  weightedCourseSummaries.length === 0
    ? null
    : Math.round(
        weightedCourseSummaries.reduce(
          (total, summary) =>
            total +
            summary.weightedAverage,
          0,
        ) /
          weightedCourseSummaries.length,
      );

  return (
    <main
  id="main-content"
  className="px-6 py-8"
>
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="AP Courses"
          value={String(courses.length)}
          description="Currently enrolled"
        />

        <StatCard
  title="Active Tasks"
  value={String(
    activeAssignments.length,
  )}
  description={`${assignmentsCompletedToday.length} completed today`}
/>

        <StatCard
  title="Study Time This Week"
  value={formatStudyMinutes(
    completedMinutesThisWeek,
  )}
  description={`Goal: ${formatStudyMinutes(
    weeklyStudyGoal,
  )}`}
/>

        <StatCard
          title="Average Progress"
          value={`${averageProgress}%`}
          description="Across all AP courses"
        />
        
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Your AP Courses
              </h2>

              <p className="mt-1 text-slate-600">
                Progress across your saved
                courses.
              </p>
            </div>

            <Link
              href="/courses"
              className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Manage Courses
            </Link>
          </div>

          {displayedCourses.length > 0 ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {displayedCourses.map(
                (course) => (
                  <CourseCard
                    key={course.id}
                    name={course.name}
                    teacher={
                      course.teacher
                    }
                    goalScore={
                      course.goalScore
                    }
                    progress={
                      course.progress
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <DashboardEmptyState
              title="No courses added"
              description="Add your AP courses to start tracking progress."
              href="/courses"
              linkText="Add a Course"
            />
          )}
        </div>

        

        <DashboardProgressSummary
  courseProgress={averageProgress}
  assignmentCompletion={
    assignmentCompletion
  }
  completedAssignments={
    completedAssignments.length
  }
  totalAssignments={
    assignments.length
  }
  weeklyStudyPercentage={
    weeklyStudyPercentage
  }
  completedStudyMinutes={
    completedMinutesThisWeek
  }
  weeklyStudyGoal={
    weeklyStudyGoal
  }
/>
      </section>

      

      <div className="mt-8">
  <DashboardGradeSummary
    pointAverage={overallPointAverage}
    weightedAverage={
      overallWeightedAverage
    }
    courseSummaries={
      weightedCourseSummaries
    }
  />
</div>

<div className="mt-8">
  <DashboardReminderSummary
    notifications={
      dashboardNotifications
    }
  />
</div>



      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Upcoming Assignments
            </h2>

            <p className="mt-1 text-slate-600">
              Your next active deadlines,
              sorted by date.
            </p>
          </div>

          <Link
            href="/assignments"
            className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Manage Assignments
          </Link>
        </div>

        {upcomingAssignments.length > 0 ? (
          <div className="mt-3">
            {upcomingAssignments.map(
              (assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  title={assignment.title}
                  course={assignment.course}
                  dueDate={
                    assignment.dueDate
                  }
                  priority={
                    assignment.priority
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <h3 className="font-semibold text-slate-900">
              No active assignments
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Add an assignment or enjoy
              having everything completed.
            </p>

            <Link
              href="/assignments"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Assignment
            </Link>
          </div>
        )}
      </section>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Upcoming Study Sessions
      </h2>

      <p className="mt-1 text-slate-600">
        Your next scheduled study blocks.
      </p>
    </div>

    <Link
      href="/planner"
      className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700"
    >
      Open Study Planner
    </Link>
  </div>

  {upcomingStudySessions.length > 0 ? (
    <div className="mt-3">
      {upcomingStudySessions.map(
        (session) => (
          <DashboardStudySession
            key={session.id}
            session={session}
          />
        ),
      )}
    </div>
  ) : (
    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <h3 className="font-semibold text-slate-900">
        No study sessions scheduled
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        Schedule focused study time for one
        of your courses.
      </p>

      <Link
        href="/planner"
        className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Schedule Session
      </Link>
    </div>
  )}
</section>
    </main>
  );
}

function DashboardLoading() {
  return (
    <main className="px-6 py-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (placeholder) => (
            <div
              key={placeholder}
              className="h-36 animate-pulse rounded-2xl bg-slate-200"
            />
          ),
        )}
      </div>

      <div className="mt-8 h-96 animate-pulse rounded-2xl bg-slate-200" />
    </main>
  );
}

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  href: string;
  linkText: string;
};

function DashboardEmptyState({
  title,
  description,
  href,
  linkText,
}: DashboardEmptyStateProps) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {linkText}
      </Link>
    </div>
  );
}

type DashboardProgressSummaryProps = {
  courseProgress: number;
  assignmentCompletion: number;
  completedAssignments: number;
  totalAssignments: number;
  weeklyStudyPercentage: number;
  completedStudyMinutes: number;
  weeklyStudyGoal: number;
};

function DashboardProgressSummary({
  courseProgress,
  assignmentCompletion,
  completedAssignments,
  totalAssignments,
  weeklyStudyPercentage,
  completedStudyMinutes,
  weeklyStudyGoal,
}: DashboardProgressSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Overall Progress
      </h2>

      <div className="mt-6 space-y-7">
  <ProgressRow
    label="Average course progress"
    percentage={courseProgress}
    description={`${courseProgress}%`}
  />

  <ProgressRow
    label="Assignments completed"
    percentage={
      assignmentCompletion
    }
    description={`${completedAssignments}/${totalAssignments}`}
  />

  <ProgressRow
    label="Weekly study goal"
    percentage={
      weeklyStudyPercentage
    }
    description={`${formatStudyMinutes(
      completedStudyMinutes,
    )}/${formatStudyMinutes(
      weeklyStudyGoal,
    )}`}
  />
</div>
    </section>
  );
}

type ProgressRowProps = {
  label: string;
  percentage: number;
  description: string;
};

function ProgressRow({
  label,
  percentage,
  description,
}: ProgressRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-600">
          {label}
        </span>

        <span className="font-semibold text-slate-900">
          {description}
        </span>
      </div>

      <div
  role="progressbar"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={percentage}
  className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
>
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function formatStudyMinutes(minutes: number) {
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