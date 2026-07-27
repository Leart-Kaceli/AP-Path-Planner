"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ToastKind =
  | "success"
  | "error"
  | "info";

type Toast = {
  id: string;
  message: string;
  kind: ToastKind;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastContextValue = {
  showToast: (
    message: string,
    kind?: ToastKind,
  ) => void;
};

const ToastContext =
  createContext<
    ToastContextValue | undefined
  >(undefined);

export default function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    toasts,
    setToasts,
  ] = useState<Toast[]>([]);

  function showToast(
    message: string,
    kind: ToastKind = "info",
  ) {
    const id =
      crypto.randomUUID();

    setToasts(
      (current) => [
        ...current,
        {
          id,
          message,
          kind,
        },
      ],
    );

    window.setTimeout(() => {
      setToasts(
        (current) =>
          current.filter(
            (toast) =>
              toast.id !== id,
          ),
      );
    }, 4000);
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] grid max-w-sm gap-3"
      >
        {toasts.map(
          (toast) => (
            <div
              key={toast.id}
              role={
                toast.kind ===
                "error"
                  ? "alert"
                  : "status"
              }
              className={`rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
                toast.kind ===
                "error"
                  ? "border-red-800 bg-red-950 text-red-100"
                  : toast.kind ===
                      "success"
                    ? "border-emerald-800 bg-emerald-950 text-emerald-100"
                    : "border-slate-700 bg-slate-900 text-white"
              }`}
            >
              {toast.message}
            </div>
          ),
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider.",
    );
  }

  return context;
}