import AuthPanel from "@/components/auth/AuthPanel";

export default function AccountPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 px-6 py-8 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your AP Path Planner Account
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Manage sign-in, email verification,
            password recovery, and account status.
          </p>
        </div>

        <div className="mt-8">
          <AuthPanel />
        </div>
      </div>
    </main>
  );
}