"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  validateBackup,
} from "@/utils/backupValidation";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  migrateAppBackup,
} from "@/utils/backup";

import {
  createCloudAwareBackup,
  downloadBackupObject,
} from "@/services/exportService";

import {
  restoreCloudAwareBackup,
} from "@/services/importService";

import type {
  AppBackup,
} from "@/types/backup";

export default function DataManagement() {
  const {
    user,
  } = useAuth();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [
    backupPendingImport,
    setBackupPendingImport,
  ] = useState<AppBackup | null>(
    null,
  );

  const [
    isWorking,
    setIsWorking,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  async function handleExport() {
    setIsWorking(true);
    setMessage("");

    try {
      const backup =
        await createCloudAwareBackup(
          user?.uid,
        );

      downloadBackupObject(
        backup,
      );

      setMessage(
        "Backup downloaded successfully.",
      );
    } catch (error) {
      console.error(
        "Could not export app data:",
        error,
      );

      setMessage(
        "Your backup could not be created.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    try {
      const fileText =
        await selectedFile.text();

      const parsedBackup: unknown =
        JSON.parse(fileText);

      const migratedBackup =
  migrateAppBackup(
    parsedBackup,
  );

if (!migratedBackup) {
  setMessage(
    "This file is not a valid AP Path Planner backup.",
  );

  return;
}

const validationErrors =
  validateBackup(
    migratedBackup,
  );

if (
  validationErrors.length > 0
) {
  setMessage(
    validationErrors.join(" "),
  );

  return;
}

setBackupPendingImport(
  migratedBackup,
);

      setMessage(
        "Backup loaded. Confirm the import to continue.",
      );
    } catch (error) {
      console.error(
        "Could not read backup file:",
        error,
      );

      setMessage(
        "The selected backup could not be read.",
      );
    }
  }

  async function confirmImport() {
  if (!backupPendingImport) {
    return;
  }

  setIsWorking(true);
  setMessage("");

  let previousBackup;

  try {
    /*
     * Save the current app state in
     * memory before replacing anything.
     */
    previousBackup =
      await createCloudAwareBackup(
        user?.uid,
      );

    await restoreCloudAwareBackup(
      backupPendingImport,
      user?.uid,
    );

    setBackupPendingImport(
      null,
    );

    window.location.reload();
  } catch (error) {
    console.error(
      "Could not restore backup:",
      error,
    );

    /*
     * If importing failed after some
     * data changed, try to restore the
     * previous state.
     */
    if (previousBackup) {
      try {
        await restoreCloudAwareBackup(
          previousBackup,
          user?.uid,
        );
      } catch (
        rollbackError
      ) {
        console.error(
          "Backup rollback also failed:",
          rollbackError,
        );
      }
    }

    setMessage(
      "The backup could not be restored. Your previous data was restored when possible.",
    );
  } finally {
    setIsWorking(false);
  }
}

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Data Management
        </h2>

        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Export your app data or restore
          a previously downloaded backup.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={
            handleExport
          }
          disabled={isWorking}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          Export Backup
        </button>

        <button
          type="button"
          onClick={
            openFilePicker
          }
          disabled={isWorking}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Import Backup
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      {message && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {message}
        </p>
      )}

      <ConfirmDialog
        open={
          backupPendingImport !==
          null
        }
        title="Import backup?"
        description="This backup will replace your currently saved courses, assignments, study sessions, grades, weights, profile, and notification state."
        confirmText="Import Backup"
        destructive
        onConfirm={
          confirmImport
        }
        onCancel={() =>
          setBackupPendingImport(
            null,
          )
        }
      />
    </section>
  );
}