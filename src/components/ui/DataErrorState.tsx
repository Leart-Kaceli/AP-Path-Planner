type DataErrorStateProps = {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
};

export default function DataErrorState({
  message,
  onRetry,
  isRetrying = false,
}: DataErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40"
    >
      <p className="text-sm text-red-700 dark:text-red-300">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRetrying
          ? "Retrying..."
          : "Try Again"}
      </button>
    </div>
  );
}