import {
  DEVICE_ID_STORAGE_KEY,
} from "@/constants/storage";

export function getDeviceId() {
  const existing =
    localStorage.getItem(
      DEVICE_ID_STORAGE_KEY,
    );

  if (existing) {
    return existing;
  }

  const deviceId =
    crypto.randomUUID();

  localStorage.setItem(
    DEVICE_ID_STORAGE_KEY,
    deviceId,
  );

  return deviceId;
}