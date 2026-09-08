export type CourseColorStyles = {
  badge: string;
  cardAccent: string;
  calendarEvent: string;
};

const courseColorPalettes:
  CourseColorStyles[] = [
    {
      badge:
        "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
      cardAccent:
        "border-l-blue-500",
      calendarEvent:
        "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200",
    },

    {
      badge:
        "bg-violet-100 text-violet-800 ring-1 ring-inset ring-violet-200",
      cardAccent:
        "border-l-violet-500",
      calendarEvent:
        "border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200",
    },

    {
      badge:
        "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
      cardAccent:
        "border-l-emerald-500",
      calendarEvent:
        "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
    },

    {
      badge:
        "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200",
      cardAccent:
        "border-l-orange-500",
      calendarEvent:
        "border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-200",
    },

    {
      badge:
        "bg-cyan-100 text-cyan-800 ring-1 ring-inset ring-cyan-200",
      cardAccent:
        "border-l-cyan-500",
      calendarEvent:
        "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200",
    },

    {
      badge:
        "bg-pink-100 text-pink-800 ring-1 ring-inset ring-pink-200",
      cardAccent:
        "border-l-pink-500",
      calendarEvent:
        "border-pink-200 bg-pink-50 text-pink-800 hover:bg-pink-100 dark:border-pink-900 dark:bg-pink-950/50 dark:text-pink-200",
    },

    {
      badge:
        "bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-200",
      cardAccent:
        "border-l-indigo-500",
      calendarEvent:
        "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200",
    },

    {
      badge:
        "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
      cardAccent:
        "border-l-rose-500",
      calendarEvent:
        "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
    },
  ];

const fallbackCourseColor:
  CourseColorStyles = {
  badge:
    "bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200",
  cardAccent:
    "border-l-slate-400",
  calendarEvent:
    "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
};

function normalizeCourseName(
  courseName: string,
) {
  return courseName
    .trim()
    .toLowerCase();
}

function hashCourseName(
  courseName: string,
) {
  let hash = 0;

  for (
    let index = 0;
    index <
    courseName.length;
    index += 1
  ) {
    hash =
      (hash * 31 +
        courseName.charCodeAt(
          index,
        )) >>>
      0;
  }

  return hash;
}

export function getCourseColorStyles(
  courseName: string,
): CourseColorStyles {
  const normalizedCourseName =
    normalizeCourseName(
      courseName,
    );

  if (!normalizedCourseName) {
    return fallbackCourseColor;
  }

  const paletteIndex =
    hashCourseName(
      normalizedCourseName,
    ) %
    courseColorPalettes.length;

  return courseColorPalettes[
    paletteIndex
  ];
}