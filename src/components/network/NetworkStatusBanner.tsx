"use client";

import {
  useNetworkStatus,
} from "@/components/network/NetworkStatusProvider";

export default function NetworkStatusBanner() {
  const {
    isOnline,
  } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      You are offline. Some cloud
      changes may wait until your
      connection returns.
    </div>
  );
}