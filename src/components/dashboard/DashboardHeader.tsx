"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";
import { PROFILE_STORAGE_KEY } from "@/constants/storage";

import type { StudentProfile } from "@/types/profile";

export default function DashboardHeader() {
  const [studentName, setStudentName] =
    useState(
      DEFAULT_STUDENT_PROFILE.name,
    );

  useEffect(() => {
    try {
      const storedProfile =
        localStorage.getItem(
          PROFILE_STORAGE_KEY,
        );

      if (!storedProfile) {
        return;
      }

      const parsedProfile = JSON.parse(
        storedProfile,
      ) as Partial<StudentProfile>;

      if (
        typeof parsedProfile.name ===
          "string" &&
        parsedProfile.name.trim()
      ) {
       // eslint-disable-next-line react-hooks/set-state-in-effect
        setStudentName(
          parsedProfile.name.trim(),
        );
      }
    } catch (error) {
      console.error(
        "Could not load student name:",
        error,
      );
    }
  }, []);

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-blue-600">
          {getCurrentDate()}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {studentName}
        </h1>

        <p className="mt-2 text-slate-600">
          Here is an overview of your AP
          coursework and study progress.
        </p>
      </div>

      <Link
        href="/assignments"
        className="w-fit rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Add Assignment
      </Link>
    </header>
  );
}

function getCurrentDate() {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  ).format(new Date());
}