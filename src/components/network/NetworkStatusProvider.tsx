"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type NetworkStatusContextValue = {
  isOnline: boolean;
};

const NetworkStatusContext =
  createContext<
    NetworkStatusContextValue | undefined
  >(undefined);

type NetworkStatusProviderProps = {
  children: ReactNode;
};

function subscribeToNetworkStatus(
  callback: () => void,
) {
  window.addEventListener(
    "online",
    callback,
  );

  window.addEventListener(
    "offline",
    callback,
  );

  return () => {
    window.removeEventListener(
      "online",
      callback,
    );

    window.removeEventListener(
      "offline",
      callback,
    );
  };
}

function getNetworkSnapshot() {
  return navigator.onLine;
}

function getServerNetworkSnapshot() {
  /*
   * This value is used both during
   * server rendering and during the
   * browser's first hydration render.
   *
   * After hydration, React reads the
   * real navigator.onLine value.
   */
  return true;
}

export default function NetworkStatusProvider({
  children,
}: NetworkStatusProviderProps) {
  const isOnline =
    useSyncExternalStore(
      subscribeToNetworkStatus,
      getNetworkSnapshot,
      getServerNetworkSnapshot,
    );

  return (
    <NetworkStatusContext.Provider
      value={{
        isOnline,
      }}
    >
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const context =
    useContext(
      NetworkStatusContext,
    );

  if (!context) {
    throw new Error(
      "useNetworkStatus must be used inside NetworkStatusProvider.",
    );
  }

  return context;
}