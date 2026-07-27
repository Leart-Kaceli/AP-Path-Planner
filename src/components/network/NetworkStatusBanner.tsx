"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useNetworkStatus,
} from "@/components/network/NetworkStatusProvider";

export default function NetworkStatusBanner() {
  const {
    isOnline,
  } = useNetworkStatus();

  const [
    hasMounted,
    setHasMounted,
  ] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  /*
   * Server render and first client render
   * must match.
   */
  if (!hasMounted) {
    return null;
  }

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      className="border-b border-amber-300 bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
    >
      You are offline. Cached data may still
      be available, and supported Firestore
      changes will sync when you reconnect.
    </div>
  );
}