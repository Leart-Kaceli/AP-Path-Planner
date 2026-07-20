"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  downloadAppBackup,
  migrateAppBackup,
  restoreAppBackup,
} from "@/utils/backup";

import type { AppBackup } from "@/types/backup";

export default function DataManagement() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [
    backupPendingImport,
    setBackupPendingImport,
  ] = useState<AppBackup | null>(null);

  const [message, setMessage] =
    useState("");

  function handleExport() {
    try {
      downloadAppBackup();

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
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
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
  migrateAppBackup(parsedBackup);

if (!migratedBackup) {
  setMessage(
    "This file is not a valid AP Path Planner backup.",
  );

  return;
}

setBackupPendingImport(
  migratedBackup,
);
        setMessage(
          "This file is not a valid AP Path Planner backup.",
        );
        return;
      }
     catch (error) {
      console.error(
        "Could not read backup file:",
        error,
      );

      setMessage(
        "The selected backup could not be read.",
      );
    }
  }

  function confirmImport() {
    if (!backupPendingImport) {
      return;
    }

    try {
      restoreAppBackup(
        backupPendingImport,
      );

      setBackupPendingImport(null);

      window.location.reload();
    } catch (error) {
      console.error(
        "Could not restore backup:",
        error,
      );

      setMessage(
        "The backup could not be restored.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Data Management
        </h2>

        <p className="mt-2 text-slate-600">
          Export your app data or restore a
          previously downloaded backup.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleExport}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Export Backup
        </button>

        <button
          type="button"
          onClick={openFilePicker}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Import Backup
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
      />

      {message && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700"
        >
          {message}
        </p>
      )}

      <ConfirmDialog
        open={
          backupPendingImport !== null
        }
        title="Import backup?"
        description="Importing this backup will replace your currently saved courses, assignments, sessions, grades, weights, and profile."
        confirmText="Import Backup"
        destructive
        onConfirm={confirmImport}
        onCancel={() =>
          setBackupPendingImport(null)
        }
      />
    </section>
  );
}