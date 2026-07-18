import type { ThemePreference } from "@/types/profile";

export function shouldUseDarkTheme(
  theme: ThemePreference,
) {
  if (theme === "dark") {
    return true;
  }

  if (theme === "light") {
    return false;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
}

export function applyTheme(
  theme: ThemePreference,
) {
  const shouldUseDark =
    shouldUseDarkTheme(theme);

  document.documentElement.classList.toggle(
    "dark",
    shouldUseDark,
  );

  document.documentElement.style.colorScheme =
    shouldUseDark ? "dark" : "light";
}