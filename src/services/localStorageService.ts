export function loadStoredArray<T>(
  storageKey: string,
): T[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const storedValue =
      localStorage.getItem(
        storageKey,
      );

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as T[])
      : [];
  } catch (error) {
    console.error(
      `Could not load ${storageKey}:`,
      error,
    );

    return [];
  }
}

export function saveStoredArray<T>(
  storageKey: string,
  values: T[],
) {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(values),
    );
  } catch (error) {
    console.error(
      `Could not save ${storageKey}:`,
      error,
    );
  }
}