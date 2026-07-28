"use client";

import {
  useEffect,
} from "react";

import {
  initializeFirebasePerformance,
} from "@/lib/firebasePerformance";

export default function FirebasePerformanceInitializer() {
  useEffect(() => {
    void initializeFirebasePerformance();
  }, []);

  return null;
}