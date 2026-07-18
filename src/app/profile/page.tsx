import Link from "next/link";

import ProfileSettings from "@/components/profile/ProfileSettings";

export default function ProfilePage() {
  return (
    <main
  id="main-content"
  className="min-h-screen bg-slate-50"
>
      <header className="border-b border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Profile and Settings
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Profile
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Customize your student information
              and study preferences.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-fit rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Return to Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <ProfileSettings />
      </div>
    </main>
  );
}