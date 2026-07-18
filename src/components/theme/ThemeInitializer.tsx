"use client";

import { useEffect } from "react";

import { DEFAULT_STUDENT_PROFILE } from "@/constants/profile";
import { PROFILE_STORAGE_KEY } from "@/constants/storage";

import type {
  StudentProfile,
  ThemePreference,
} from "@/types/profile";

import { applyTheme } from "@/utils/theme";

function loadThemePreference(): ThemePreference {
  try {
    const storedProfile =
      localStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (!storedProfile) {
      return DEFAULT_STUDENT_PROFILE.theme;
    }

    const parsedProfile = JSON.parse(
      storedProfile,
    ) as Partial<StudentProfile>;

    if (
      parsedProfile.theme === "light" ||
      parsedProfile.theme === "dark" ||
      parsedProfile.theme === "system"
    ) {
      return parsedProfile.theme;
    }

    return DEFAULT_STUDENT_PROFILE.theme;
  } catch (error) {
    console.error(
      "Could not load theme preference:",
      error,
    );

    return DEFAULT_STUDENT_PROFILE.theme;
  }
}

export default function ThemeInitializer() {
  useEffect(() => {
    const theme = loadThemePreference();

    applyTheme(theme);

    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    function handleSystemThemeChange() {
      applyTheme("system");
    }

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange,
      );
    };
  }, []);

  return null;
}