import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title:
    "Privacy | AP Path Planner",

  description:
    "Learn how AP Path Planner stores and manages application data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Privacy
      </h1>

      <p className="mt-4 text-slate-700 dark:text-slate-300">
        AP Path Planner stores the information
        needed to provide your planning tools,
        including courses, assignments, study
        sessions, grades, and profile settings.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Account information
        </h2>

        <p className="text-slate-700 dark:text-slate-300">
          Firebase Authentication manages your
          account identity and sign-in information.
        </p>
      </section>

      <section className="mt-10 space-y-4">
         <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
    Information stored
  </h2>

        <p className="text-slate-700 dark:text-slate-300">
          Your planning records are associated
          with your account and protected by
          Firestore Security Rules.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Data controls
        </h2>

        <p className="text-slate-700 dark:text-slate-300">
          The profile page provides controls for
          clearing application data and permanently
          deleting your account.
        </p>
      </section>

      <section className="mt-10 space-y-4">
  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
    Deleting your information
  </h2>

  <p className="text-slate-700 dark:text-slate-300">
    You can clear your application data from the
    profile page while keeping your login account
    active. You can also permanently delete your
    account and its associated application data.
  </p>
</section>
    </main>
  );
}