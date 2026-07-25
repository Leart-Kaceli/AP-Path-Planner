type SyncStatusProps = {
  isSaving: boolean;
  error?: string | null;
};

export default function SyncStatus({
  isSaving,
  error,
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

  if (isSaving) {
    return (
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Saving...
      </p>
    );
  }

  return null;
}