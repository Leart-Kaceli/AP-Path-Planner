import {
  useState,
} from "react";

export default function useSyncMetadata() {
  const [
    fromCache,
    setFromCache,
  ] = useState(false);

  const [
    hasPendingWrites,
    setHasPendingWrites,
  ] = useState(false);

  return {
    fromCache,
    hasPendingWrites,
    setFromCache,
    setHasPendingWrites,
  };
}