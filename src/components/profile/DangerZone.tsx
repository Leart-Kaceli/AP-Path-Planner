"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
  GRADE_STORAGE_KEY,
  GRADE_WEIGHT_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
} from "@/constants/storage";

export default function DangerZone() {
  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);

  function clearAllAppData() {
    const storageKeys = [
      COURSE_STORAGE_KEY,
      ASSIGNMENT_STORAGE_KEY,
      STUDY_SESSION_STORAGE_KEY,
      GRADE_STORAGE_KEY,
      GRADE_WEIGHT_STORAGE_KEY,
      PROFILE_STORAGE_KEY,
    ];

    storageKeys.forEach((storageKey) => {
      localStorage.removeItem(storageKey);
    });

    setIsDeleteDialogOpen(false);

    window.location.href = "/dashboard";
  }

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/30">
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
        Danger Zone
      </h2>

      <p className="mt-2 text-red-700/80 dark:text-red-200">
        Permanently remove all locally saved
        AP Path Planner data from this browser.
      </p>

      <button
        type="button"
        onClick={() =>
          setIsDeleteDialogOpen(true)
        }
        className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Delete All App Data
      </button>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete all app data?"
        description="This will permanently delete your courses, assignments, study sessions, grades, settings, and profile from this browser. Export a backup first if you may need the data later."
        confirmText="Delete Everything"
        destructive
        onConfirm={clearAllAppData}
        onCancel={() =>
          setIsDeleteDialogOpen(false)
        }
      />
    </section>
  );
}