import AuthPanel from "@/components/auth/AuthPanel";

export default function SignInPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 px-6 py-10 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-lg">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          AP Path Planner
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
          Sign in to your account
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Sync your planning data across
          your signed-in sessions.
        </p>

        <div className="mt-8">
          <AuthPanel />
        </div>
      </div>
    </main>
  );
}