import {
  ASSIGNMENT_STORAGE_KEY,
} from "@/constants/storage";

import {
  loadStoredArray,
  saveStoredArray,
} from "@/services/localStorageService";

import {
  firestoreAssignmentService,
} from "@/services/firestoreAssignmentService";

import {
  normalizeAssignment,
} from "@/utils/assignments";

import type {
  Assignment,
} from "@/types/assignment";

import type {
  DataService,
} from "@/services/dataService";

export const localAssignmentService:
  DataService<Assignment> = {
    async loadAll() {
      return loadStoredArray<Assignment>(
        ASSIGNMENT_STORAGE_KEY,
      ).map(normalizeAssignment);
    },

    async saveAll(assignments) {
      saveStoredArray(
        ASSIGNMENT_STORAGE_KEY,
        assignments,
      );
    },
  };

function getAssignmentService(
  userId?: string | null,
) {
  return userId
    ? firestoreAssignmentService
    : localAssignmentService;
}

export async function loadAssignments(
  userId?: string | null,
) {
  const service =
    getAssignmentService(userId);

  const assignments =
    await service.loadAll(userId);

  if (
    userId &&
    assignments.length === 0
  ) {
    const localAssignments =
      await localAssignmentService.loadAll();

    if (
      localAssignments.length > 0
    ) {
      await firestoreAssignmentService.saveAll(
        localAssignments,
        userId,
      );

      return localAssignments;
    }
  }

  return assignments;
}

export async function saveAssignments(
  assignments: Assignment[],
  userId?: string | null,
) {
  const service =
    getAssignmentService(userId);

  await service.saveAll(
    assignments,
    userId,
  );
}