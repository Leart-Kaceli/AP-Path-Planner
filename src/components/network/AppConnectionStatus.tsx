"use client";

import {
  useNetworkStatus,
} from "@/components/network/NetworkStatusProvider";

export default function AppConnectionStatus() {
  const {
    isOnline,
  } = useNetworkStatus();

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        isOnline
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline
            ? "bg-emerald-500"
            : "bg-amber-500"
        }`}
      />

      {isOnline
        ? "Online"
        : "Offline"}
    </span>
  );
}