"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  useAuth,
} from "@/hooks/useAuth";

type AuthMode =
  | "sign-in"
  | "create-account";

export default function AuthPanel() {
  const {
    user,
    isLoading,
    error,
    createAccount,
    signIn,
    signOutUser,
    clearAuthError,
    sendPasswordReset,
    sendVerificationEmail,
    refreshUser,
  } = useAuth();

  const [mode, setMode] =
    useState<AuthMode>("sign-in");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  function changeMode(
    nextMode: AuthMode,
  ) {
    setMode(nextMode);
    setMessage("");
    clearAuthError();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    if (
      mode === "create-account" &&
      !trimmedName
    ) {
      setMessage(
        "Enter your name.",
      );

      return;
    }

    if (!trimmedEmail) {
      setMessage(
        "Enter your email address.",
      );

      return;
    }

    if (password.length < 6) {
      setMessage(
        "Your password must contain at least six characters.",
      );

      return;
    }

    setIsSubmitting(true);
    setMessage("");
    clearAuthError();

    try {
      if (
        mode === "create-account"
      ) {
        await createAccount(
          trimmedName,
          trimmedEmail,
          password,
        );

        setMessage(
          "Your account was created successfully.",
        );
      } else {
        await signIn(
          trimmedEmail,
          password,
        );

        setMessage(
          "You signed in successfully.",
        );
      }

      setPassword("");
    } catch {
      // AuthProvider displays the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    setMessage("");
    clearAuthError();

    try {
      await signOutUser();

      setMessage(
        "You signed out successfully.",
      );
    } catch {
      // AuthProvider displays the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {
      setMessage(
        "Enter your email address first.",
      );

      return;
    }

    setIsSubmitting(true);
    setMessage("");
    clearAuthError();

    try {
      await sendPasswordReset(
        trimmedEmail,
      );

      setMessage(
        "Password reset email sent. Check your inbox.",
      );
    } catch {
      // AuthProvider supplies the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerificationEmail() {
    setIsSubmitting(true);
    setMessage("");
    clearAuthError();

    try {
      await sendVerificationEmail();

      setMessage(
        "Verification email sent. Open the email, verify your account, then click Check Verification.",
      );
    } catch {
      // AuthProvider supplies the error.
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCheckVerification() {
    setIsSubmitting(true);
    setMessage("");
    clearAuthError();

    try {
      await refreshUser();

      setMessage(
        "Account status refreshed.",
      );
    } catch {
      setMessage(
        "Verification status could not be refreshed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    );
  }

  if (user) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          Firebase Account
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          You are signed in
        </h2>

        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="font-semibold text-slate-900 dark:text-white">
            {user.displayName ??
              "AP Path Planner Student"}
          </p>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {user.email}
          </p>
        </div>

        {/* Email verification status */}
        <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Email Verification
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {user.emailVerified
                  ? "Your email is verified."
                  : "Your email has not been verified yet."}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                user.emailVerified
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {user.emailVerified
                ? "Verified"
                : "Unverified"}
            </span>
          </div>

          {!user.emailVerified && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  handleVerificationEmail
                }
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Please wait..."
                  : "Send Verification Email"}
              </button>

              <button
                type="button"
                onClick={
                  handleCheckVerification
                }
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Check Verification
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Signed-in assignments are stored
          in your Firebase account.
        </p>

        {(message || error) && (
          <p
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              error
                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            }`}
          >
            {error ?? message}
          </p>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="mt-5 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {isSubmitting
            ? "Signing out..."
            : "Sign Out"}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        Firebase Account
      </p>

      <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
        {mode === "sign-in"
          ? "Sign in"
          : "Create an account"}
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Sign in to save assignments to
        Firestore across devices.
      </p>

      <div className="mt-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        <button
          type="button"
          onClick={() =>
            changeMode("sign-in")
          }
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            mode === "sign-in"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() =>
            changeMode(
              "create-account",
            )
          }
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            mode ===
            "create-account"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          Create Account
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid gap-4"
      >
        {mode ===
          "create-account" && (
          <div>
            <label
              htmlFor="account-name"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Name
            </label>

            <input
              id="account-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-900"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="account-email"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Email
          </label>

          <input
            id="account-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-900"
          />
        </div>

        <div>
          <label
            htmlFor="account-password"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Password
          </label>

          <input
            id="account-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            autoComplete={
              mode === "sign-in"
                ? "current-password"
                : "new-password"
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-900"
          />

          {mode === "sign-in" && (
            <button
              type="button"
              onClick={
                handlePasswordReset
              }
              disabled={isSubmitting}
              className="mt-2 w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-60 dark:text-blue-400"
            >
              Forgot password?
            </button>
          )}
        </div>

        {(message || error) && (
          <p
            className={`rounded-lg px-4 py-3 text-sm ${
              error
                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            }`}
          >
            {error ?? message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>
    </section>
  );
}