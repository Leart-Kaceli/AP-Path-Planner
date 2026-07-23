import {
  ASSIGNMENT_STORAGE_KEY,
} from "@/constants/storage";

import {
  loadStoredArray,
  saveStoredArray,
} from "@/services/localStorageService";

import {
  normalizeAssignment,
} from "@/utils/assignments";

import type {
  Assignment,
} from "@/types/assignment";

export function loadAssignments() {
  return loadStoredArray<Assignment>(
    ASSIGNMENT_STORAGE_KEY,
  ).map(normalizeAssignment);
}

export function saveAssignments(
  assignments: Assignment[],
) {
  saveStoredArray(
    ASSIGNMENT_STORAGE_KEY,
    assignments,
  );
}