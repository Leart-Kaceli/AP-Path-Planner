export function hasObjectChanged<T>(
  original: T,
  latest: T,
) {
  return (
    JSON.stringify(original) !==
    JSON.stringify(latest)
  );
}