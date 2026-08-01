import type {
  Metadata,
} from "next";

import Link from "next/link";

export const metadata:
  Metadata = {
  title:
    "Privacy | AP Path Planner",

  description:
    "Learn how AP Path Planner stores, uses, exports, and deletes account data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          ← Return home
        </Link>

        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Privacy
        </h1>

        <p className="mt-4 text-slate-300">
          AP Path Planner helps students organize AP courses,
          assignments, study sessions, grades, goals, and profile
          settings.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Information stored
          </h2>

          <p className="mt-3 text-slate-300">
            When you create an account, the application may store
            your authentication information, profile settings,
            courses, assignments, study sessions, grade entries,
            and grade-category weights.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            How information is used
          </h2>

          <p className="mt-3 text-slate-300">
            Your information is used to provide planning,
            progress-tracking, grade-estimation, calendar, and
            study-management features. AP Path Planner does not
            sell student information.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Storage and authentication
          </h2>

          <p className="mt-3 text-slate-300">
            Authentication is provided through Firebase
            Authentication. Application data is stored in Cloud
            Firestore and is associated with the authenticated
            account.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Exporting your data
          </h2>

          <p className="mt-3 text-slate-300">
            The account settings page provides an option to export
            your AP Path Planner information as a backup file.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Deleting your information
          </h2>

          <p className="mt-3 text-slate-300">
            The account settings page provides options to clear
            application data or permanently delete the account.
            Account deletion cannot be undone.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Error and performance information
          </h2>

          <p className="mt-3 text-slate-300">
            The application may collect technical performance and
            error information, such as the page where an error
            occurred. Error reports should not include course
            contents, assignment contents, grades, or form values.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Contact
          </h2>

          <p className="mt-3 text-slate-300">
            Questions about the application or its data practices
            may be submitted through the project repository.
          </p>
        </section>

        <p className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-400">
          Last updated: August 1, 2026
        </p>
      </article>
    </main>
  );
}