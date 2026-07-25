"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type NetworkStatusContextValue = {
  isOnline: boolean;
};

const NetworkStatusContext =
  createContext<
    NetworkStatusContextValue | undefined
  >(undefined);

export default function NetworkStatusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    isOnline,
    setIsOnline,
  ] = useState(() => {
    if (
      typeof navigator ===
      "undefined"
    ) {
      return true;
    }

    return navigator.onLine;
  });

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener(
      "online",
      handleOnline,
    );

    window.addEventListener(
      "offline",
      handleOffline,
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline,
      );

      window.removeEventListener(
        "offline",
        handleOffline,
      );
    };
  }, []);

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