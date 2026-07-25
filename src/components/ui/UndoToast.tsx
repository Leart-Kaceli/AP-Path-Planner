type UndoToastProps = {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
};

export default function UndoToast({
  message,
  onUndo,
  onDismiss,
}: UndoToastProps) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm text-white shadow-xl">
      <span>
        {message}
      </span>

      <button
        type="button"
        onClick={onUndo}
        className="font-bold text-blue-300 hover:text-blue-200"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss undo message"
        className="text-slate-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}