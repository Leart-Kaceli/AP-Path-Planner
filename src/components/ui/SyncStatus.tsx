type SyncStatusProps = {
  isSaving?: boolean;
  error?: string | null;
  fromCache?: boolean;
  hasPendingWrites?: boolean;
  realtime?: boolean;
};

export default function SyncStatus({
  isSaving = false,
  error = null,
  fromCache = false,
  hasPendingWrites = false,
  realtime = false,
}: SyncStatusProps) {
  if (error) {
    return (
      <p
        role="alert"
        className="text-sm font-medium text-red-600 dark:text-red-300"
      >
        {error}
      </p>
    );
  }

  if (
    isSaving ||
    hasPendingWrites
  ) {
    return (
      <p
        role="status"
        className="text-sm font-medium text-amber-600 dark:text-amber-300"
      >
        Syncing changes...
      </p>
    );
  }

  if (fromCache) {
    return (
      <p
        role="status"
        className="text-sm font-medium text-slate-500 dark:text-slate-400"
      >
        Showing cached data
      </p>
    );
  }

  if (realtime) {
    return (
      <p
        role="status"
        className="text-sm font-medium text-emerald-600 dark:text-emerald-300"
      >
        Cloud sync active
      </p>
    );
  }

  return null;
}