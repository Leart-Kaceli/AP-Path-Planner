"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";
import { applyTheme } from "@/utils/theme";

import {
  loadProfile,
  saveProfile,
} from "@/services/profileService";

import type {
  ReminderTiming,
  StudentProfile,
  ThemePreference,
} from "@/types/profile";

import {
  notifyAppDataChanged,
} from "@/utils/appEvents";

import {
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";

import {
  useAuth,
} from "@/hooks/useAuth";

type BrowserNotificationPermission =
  | NotificationPermission
  | "unsupported";

export default function ProfileSettings() {

  const {
  user,
  isLoading: isAuthLoading,
} = useAuth();

  const [profile, setProfile] =
    useState<StudentProfile>(
      DEFAULT_STUDENT_PROFILE,
    );

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [message, setMessage] =
    useState("");

    const [
  notificationPermission,
  setNotificationPermission,
] =
  useState<BrowserNotificationPermission>(
    "unsupported",
  );
  
  useEffect(() => {
  if (isAuthLoading) {
    return;
  }

  let isCancelled = false;

  async function loadProfileData() {
    try {
      if (
        "Notification" in window
      ) {
        setNotificationPermission(
          Notification.permission,
        );
      }

      const loadedProfile =
        await loadProfile(
          user?.uid,
        );

      if (isCancelled) {
        return;
      }

      const profileWithIdentity:
        StudentProfile = {
          ...loadedProfile,
          name:
            user?.displayName ??
            loadedProfile.name,
        };

      setProfile(
        profileWithIdentity,
      );

      applyTheme(
        profileWithIdentity.theme,
      );
    } catch (error) {
      console.error(
        "Could not load profile settings:",
        error,
      );

      if (!isCancelled) {
        setMessage(
          "Your profile could not be loaded.",
        );
      }
    } finally {
      if (!isCancelled) {
        setHasLoaded(true);
      }
    }
  }

  void loadProfileData();

  return () => {
    isCancelled = true;
  };
}, [
  isAuthLoading,
  user?.displayName,
  user?.uid,
]);

  function updateProfile<
  Key extends keyof StudentProfile,
>(
  key: Key,
  value: StudentProfile[Key],
) {
  setProfile((currentProfile) => ({
    ...currentProfile,
    [key]: value,
  }));

  setMessage("");
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    setMessage(
      "Browser notifications are not supported.",
    );
    return;
  }

  const permission =
    await Notification.requestPermission();

      setNotificationPermission(
    permission,
  );

  if (permission === "granted") {
    updateProfile(
      "browserNotificationsEnabled",
      true,
    );

    setMessage(
      "Browser notifications were enabled.",
    );
  } else {
    updateProfile(
      "browserNotificationsEnabled",
      false,
    );

    setMessage(
      "Browser notification permission was not granted.",
    );
  }
}

  async function handleSubmit(
  event: FormEvent<HTMLFormElement>,
) {
    event.preventDefault();

    const trimmedName =
      profile.name.trim();

    const trimmedSchool =
      profile.school.trim();

    if (!trimmedName) {
      setMessage(
        "Please enter your name.",
      );
      return;
    }

    if (
      profile.weeklyStudyGoalMinutes < 30 ||
      profile.weeklyStudyGoalMinutes > 3000
    ) {
      setMessage(
        "Weekly study goal must be between 30 and 3000 minutes.",
      );
      return;
    }

    const savedProfile: StudentProfile = {
      ...profile,
      name: trimmedName,
      school: trimmedSchool,
    };

    try {
      if (
  user &&
  user.displayName !==
    trimmedName
) {
  await updateFirebaseProfile(
    user,
    {
      displayName:
        trimmedName,
    },
  );
}
      await saveProfile(
  savedProfile,
  user?.uid,
);

      notifyAppDataChanged();
      setProfile(savedProfile);
      applyTheme(savedProfile.theme);
      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error(
        "Could not save profile settings:",
        error,
      );

      setMessage(
        "Your profile could not be saved.",
      );
    }
  }

  async function resetProfile() {
    const shouldReset = window.confirm(
      "Reset all profile settings to their defaults?",
    );

    if (!shouldReset) {
      return;
    }

    setProfile(DEFAULT_STUDENT_PROFILE);

    await saveProfile(
  DEFAULT_STUDENT_PROFILE,
  user?.uid,
);

    notifyAppDataChanged();
    applyTheme(
      DEFAULT_STUDENT_PROFILE.theme,
    );

    setMessage(
      "Profile reset to default settings.",
    );
  }

  if (!hasLoaded) {
    return (
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Student Profile
          </h2>

          <p className="mt-2 text-slate-600">
            Customize the information used
            throughout AP Path Planner.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          <div>
            <label
              htmlFor="profile-name"
              className="text-sm font-medium text-slate-700"
            >
              Name
            </label>

            {user && (
  <div>
    <label
      htmlFor="profile-email"
      className="text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      Account Email
    </label>

    <input
      id="profile-email"
      type="email"
      value={user.email ?? ""}
      readOnly
      className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    />

    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
      This email comes from your
      Firebase account.
    </p>
  </div>
)}

            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={(event) =>
                updateProfile(
                  "name",
                  event.target.value,
                )
              }
              placeholder="Your name"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="profile-school"
              className="text-sm font-medium text-slate-700"
            >
              School
            </label>

            <input
              id="profile-school"
              type="text"
              value={profile.school}
              onChange={(event) =>
                updateProfile(
                  "school",
                  event.target.value,
                )
              }
              placeholder="Your high school"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="graduation-year"
                className="text-sm font-medium text-slate-700"
              >
                Graduation year
              </label>

              <select
                id="graduation-year"
                value={
                  profile.graduationYear
                }
                onChange={(event) =>
                  updateProfile(
                    "graduationYear",
                    event.target.value,
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="2026">
                  2026
                </option>

                <option value="2027">
                  2027
                </option>

                <option value="2028">
                  2028
                </option>

                <option value="2029">
                  2029
                </option>

                <option value="2030">
                  2030
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="weekly-study-goal"
                className="text-sm font-medium text-slate-700"
              >
                Weekly study goal
              </label>

              <div className="relative mt-2">
                <input
                  id="weekly-study-goal"
                  type="number"
                  min="30"
                  max="3000"
                  step="15"
                  value={
                    profile.weeklyStudyGoalMinutes
                  }
                  onChange={(event) =>
                    updateProfile(
                      "weeklyStudyGoalMinutes",
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  minutes
                </span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="theme-preference"
              className="text-sm font-medium text-slate-700"
            >
              Appearance
            </label>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
  <div>
    <h3 className="font-semibold text-slate-900">
      Reminders
    </h3>

    <p className="mt-1 text-sm text-slate-600">
      Choose which reminders you would like
      AP Path Planner to display.
    </p>
  </div>

  <div className="mt-5 space-y-4">
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={
          profile.assignmentRemindersEnabled
        }
        onChange={(event) =>
          updateProfile(
            "assignmentRemindersEnabled",
            event.target.checked,
          )
        }
        className="mt-1 h-5 w-5 rounded border-slate-300 accent-blue-600"
      />

      <span>
        <span className="block font-medium text-slate-900">
          Assignment reminders
        </span>

        <span className="mt-1 block text-sm text-slate-600">
          Show reminders for approaching
          assignment deadlines.
        </span>
      </span>
    </label>

    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={
          profile.studyRemindersEnabled
        }
        onChange={(event) =>
          updateProfile(
            "studyRemindersEnabled",
            event.target.checked,
          )
        }
        className="mt-1 h-5 w-5 rounded border-slate-300 accent-blue-600"
      />

      <span>
        <span className="block font-medium text-slate-900">
          Study-session reminders
        </span>

        <span className="mt-1 block text-sm text-slate-600">
          Show reminders for scheduled study
          sessions.
        </span>
      </span>
    </label>

    <div>
      <label
        htmlFor="reminder-timing"
        className="text-sm font-medium text-slate-700"
      >
        Reminder timing
      </label>

      <div>
  <label
    htmlFor="assignment-reminder-timing"
    className="text-sm font-medium text-slate-700"
  >
    Assignment reminder timing
  </label>

  <select
    id="assignment-reminder-timing"
    value={
      profile.assignmentReminderTiming
    }
    onChange={(event) =>
      updateProfile(
        "assignmentReminderTiming",
        event.target
          .value as ReminderTiming,
      )
    }
    disabled={
      !profile
        .assignmentRemindersEnabled
    }
    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value="none">
      No reminder
    </option>

    <option value="same-day">
      Same day
    </option>

    <option value="one-day">
      One day before
    </option>

    <option value="two-days">
      Two days before
    </option>
  </select>
</div>

<div className="border-t border-slate-200 pt-5 dark:border-slate-700">
  <h4 className="font-semibold text-slate-900 dark:text-white">
    Browser notifications
  </h4>

  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
    Allow AP Path Planner to display system
    notifications while the app is open.
  </p>

  <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-950">
  <NotificationStatusRow
    label="Browser support"
    value={
      notificationPermission ===
      "unsupported"
        ? "Not supported"
        : "Supported"
    }
    positive={
      notificationPermission !==
      "unsupported"
    }
  />

  <NotificationStatusRow
    label="Permission"
    value={
      notificationPermission ===
      "granted"
        ? "Granted"
        : notificationPermission ===
            "denied"
          ? "Blocked"
          : notificationPermission ===
              "default"
            ? "Not requested"
            : "Unavailable"
    }
    positive={
      notificationPermission ===
      "granted"
    }
  />

  <NotificationStatusRow
    label="Assignment alerts"
    value={
      profile
        .browserNotificationsEnabled &&
      profile
        .browserNotificationsForAssignments
        ? "Enabled"
        : "Disabled"
    }
    positive={
      profile
        .browserNotificationsEnabled &&
      profile
        .browserNotificationsForAssignments
    }
  />

  <NotificationStatusRow
    label="Study-session alerts"
    value={
      profile
        .browserNotificationsEnabled &&
      profile
        .browserNotificationsForStudySessions
        ? "Enabled"
        : "Disabled"
    }
    positive={
      profile
        .browserNotificationsEnabled &&
      profile
        .browserNotificationsForStudySessions
    }
  />
</div>

  <label className="mt-4 flex items-start gap-3">
    <input
      type="checkbox"
      checked={
        profile
          .browserNotificationsEnabled
      }
      onChange={(event) =>
        updateProfile(
          "browserNotificationsEnabled",
          event.target.checked,
        )
      }
      className="mt-1 h-5 w-5 accent-blue-600"
    />

    <span className="font-medium text-slate-900 dark:text-white">
      Enable browser notifications
    </span>
  </label>

  <label className="mt-4 flex items-start gap-3">
    <input
      type="checkbox"
      checked={
        profile
          .browserNotificationsForAssignments
      }
      disabled={
        !profile
          .browserNotificationsEnabled
      }
      onChange={(event) =>
        updateProfile(
          "browserNotificationsForAssignments",
          event.target.checked,
        )
      }
      className="mt-1 h-5 w-5 accent-blue-600 disabled:opacity-50"
    />

    <span className="font-medium text-slate-900 dark:text-white">
      Assignment browser alerts
    </span>
  </label>

  <label className="mt-4 flex items-start gap-3">
    <input
      type="checkbox"
      checked={
        profile
          .browserNotificationsForStudySessions
      }
      disabled={
        !profile
          .browserNotificationsEnabled
      }
      onChange={(event) =>
        updateProfile(
          "browserNotificationsForStudySessions",
          event.target.checked,
        )
      }
      className="mt-1 h-5 w-5 accent-blue-600 disabled:opacity-50"
    />

    <span className="font-medium text-slate-900 dark:text-white">
      Study-session browser alerts
    </span>
  </label>
  <button
  type="button"
  onClick={
    requestNotificationPermission
  }
  className="mt-5 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
>
  Request Browser Permission
</button>
</div>



<div>
  <label
    htmlFor="study-reminder-timing"
    className="text-sm font-medium text-slate-700"
  >
    Study-session reminder timing
  </label>

  <select
    id="study-reminder-timing"
    value={
      profile.studyReminderTiming
    }
    onChange={(event) =>
      updateProfile(
        "studyReminderTiming",
        event.target
          .value as ReminderTiming,
      )
    }
    disabled={
      !profile.studyRemindersEnabled
    }
    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value="none">
      No reminder
    </option>

    <option value="same-day">
      Same day
    </option>

    <option value="one-day">
      One day before
    </option>

    <option value="two-days">
      Two days before
    </option>
  </select>
</div>
    </div>
  </div>
</section>

            <select
              id="theme-preference"
              value={profile.theme}
              onChange={(event) =>
                updateProfile(
                  "theme",
                  event.target
                    .value as ThemePreference,
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="system">
                Use system setting
              </option>

              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>
            </select>
          </div>

          {message && (
            <p
              role="status"
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                message.includes(
                  "successfully",
                ) ||
                message.includes("reset")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Profile
            </button>

            <button
              type="button"
              onClick={resetProfile}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <ProfilePreview profile={profile} />
    </div>
  );
}

type ProfilePreviewProps = {
  profile: StudentProfile;
};

function ProfilePreview({
  profile,
}: ProfilePreviewProps) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        Preview
      </p>

      <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
        {getInitials(profile.name)}
      </div>

      <h2 className="mt-5 text-2xl font-bold text-slate-900">
        {profile.name || "Student"}
      </h2>

      <p className="mt-1 text-slate-600">
        {profile.school ||
          "School not entered"}
      </p>

      <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm">
        <PreviewRow
          label="Graduation year"
          value={profile.graduationYear}
        />

        <PreviewRow
          label="Weekly study goal"
          value={formatMinutes(
            profile.weeklyStudyGoalMinutes,
          )}
        />

        <PreviewRow
          label="Appearance"
          value={capitalize(profile.theme)}
        />
      </div>
    </aside>
  );
}

type PreviewRowProps = {
  label: string;
  value: string;
};

function PreviewRow({
  label,
  value,
}: PreviewRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return "S";
  }

  return words
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatMinutes(minutes: number) {
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

function capitalize(value: string) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}
type NotificationStatusRowProps = {
  label: string;
  value: string;
  positive?: boolean;
};

function NotificationStatusRow({
  label,
  value,
  positive = false,
}: NotificationStatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-700">
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <span
        className={`text-right text-sm font-semibold ${
          positive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}


