"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type {
  AppNotification,
} from "@/types/notification";

type SnoozeDialogProps = {
  notification: AppNotification | null;
  onClose: () => void;
  onConfirm: (
    notificationId: string,
    snoozedUntil: Date,
  ) => void;
};

function getDefaultSnoozeDate() {
  const defaultDate = new Date();

  defaultDate.setHours(
    defaultDate.getHours() + 1,
  );

  const year =
    defaultDate.getFullYear();

  const month = String(
    defaultDate.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    defaultDate.getDate(),
  ).padStart(2, "0");

  const hours = String(
    defaultDate.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    defaultDate.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function SnoozeDialog({
  notification,
  onClose,
  onConfirm,
}: SnoozeDialogProps) {
  const [dateTime, setDateTime] =
    useState(getDefaultSnoozeDate);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    if (!notification) {
      return;
    }


    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateTime(getDefaultSnoozeDate());

    setErrorMessage("");
  }, [notification]);

  if (!notification) {
    return null;
  }

  const notificationId = notification.id;

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const snoozedUntil =
      new Date(dateTime);

    if (
      Number.isNaN(
        snoozedUntil.getTime(),
      )
    ) {
      setErrorMessage(
        "Choose a valid date and time.",
      );

      return;
    }

    if (
      snoozedUntil.getTime() <=
      Date.now()
    ) {
      setErrorMessage(
        "The snooze time must be in the future.",
      );

      return;
    }

    onConfirm(
  notificationId,
  snoozedUntil,
);

    onClose();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close custom snooze dialog"
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-slate-950/50"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="snooze-dialog-title"
        className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="snooze-dialog-title"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              Snooze reminder
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Choose when “
              {notification.title}” should
              appear again.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close snooze dialog"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span aria-hidden="true">
              ×
            </span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <label
            htmlFor="custom-snooze-time"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Return this reminder at
          </label>

          <input
            id="custom-snooze-time"
            type="datetime-local"
            value={dateTime}
            onChange={(event) => {
              setDateTime(
                event.target.value,
              );

              setErrorMessage("");
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
          />

          {errorMessage && (
            <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Snooze reminder
            </button>
          </div>
        </form>
      </div>
    </>
  );
}