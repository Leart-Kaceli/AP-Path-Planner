"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  ASSIGNMENT_STORAGE_KEY,
  COURSE_STORAGE_KEY,
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  GRADE_STORAGE_KEY,
  GRADE_WEIGHT_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  STUDY_SESSION_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
  SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
} from "@/constants/storage";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  deleteUserCloudData,
} from "@/services/accountDataService";

export default function DangerZone() {

  const [
  accountDeleteError,
  setAccountDeleteError,
] = useState("");

  const {
  user,
  deleteAccount,
} = useAuth();

const [
  isAccountDeleteDialogOpen,
  setIsAccountDeleteDialogOpen,
] = useState(false);

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
  DISMISSED_NOTIFICATION_STORAGE_KEY,
  SNOOZED_NOTIFICATION_STORAGE_KEY,
  SENT_BROWSER_NOTIFICATION_STORAGE_KEY,
];

    storageKeys.forEach((storageKey) => {
      localStorage.removeItem(storageKey);
    });

    setIsDeleteDialogOpen(false);

    window.location.href = "/dashboard";
  }

  async function confirmDeleteAccount() {
  if (!user?.uid) {
    return;
  }

  setAccountDeleteError("");

  try {
    await deleteUserCloudData(
      user.uid,
    );

    await deleteAccount();

    localStorage.clear();

    window.location.href = "/";
  } catch (error) {
    console.error(
      "Could not delete account:",
      error,
    );

    setAccountDeleteError(
      "Your account could not be fully deleted. Sign out, sign back in, and try again.",
    );
  }
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

      {accountDeleteError && (
  <div
    role="alert"
    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
  >
    {accountDeleteError}
  </div>
)}

      {user && (
  <button
    type="button"
    onClick={() =>
      setIsAccountDeleteDialogOpen(
        true,
      )
    }
    className="mt-4 rounded-lg border border-red-600 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-950"
  >
    Delete Firebase Account
  </button>

)}

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

      <ConfirmDialog
  open={
    isAccountDeleteDialogOpen
  }
  title="Delete Firebase account?"
  description="This will permanently remove your cloud courses, assignments, study sessions, grades, profile, and Firebase account. This cannot be undone."
  confirmText="Delete Account"
  destructive
  onConfirm={
    confirmDeleteAccount
  }
  onCancel={() =>
    setIsAccountDeleteDialogOpen(
      false,
    )
  }
/>
    </section>
  );
}