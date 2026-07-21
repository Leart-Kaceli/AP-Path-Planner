export const APP_DATA_CHANGED_EVENT =
  "ap-path-planner-data-changed";

export function notifyAppDataChanged() {
  window.dispatchEvent(
    new CustomEvent(
      APP_DATA_CHANGED_EVENT,
    ),
  );
}