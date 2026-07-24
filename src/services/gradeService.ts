import {
  GRADE_STORAGE_KEY,
} from "@/constants/storage";

import {
  loadStoredArray,
  saveStoredArray,
} from "@/services/localStorageService";

import {
  deleteFirestoreGrade,
  firestoreGradeService,
  saveFirestoreGrade,
} from "@/services/firestoreGradeService";

import type {
  GradeEntry,
} from "@/types/grade";

import type {
  DataService,
} from "@/services/dataService";

export const localGradeService:
  DataService<GradeEntry> = {
    async loadAll() {
      return loadStoredArray<GradeEntry>(
        GRADE_STORAGE_KEY,
      );
    },

    async saveAll(grades) {
      saveStoredArray(
        GRADE_STORAGE_KEY,
        grades,
      );
    },
  };

function getGradeService(
  userId?: string | null,
) {
  return userId
    ? firestoreGradeService
    : localGradeService;
}

export async function loadGrades(
  userId?: string | null,
) {
  const service =
    getGradeService(userId);

  const grades =
    await service.loadAll(userId);

  if (
    userId &&
    grades.length === 0
  ) {
    const localGrades =
      await localGradeService.loadAll();

    if (localGrades.length > 0) {
      await firestoreGradeService.saveAll(
        localGrades,
        userId,
      );

      return localGrades;
    }
  }

  return grades;
}

export async function saveGrades(
  grades: GradeEntry[],
  userId?: string | null,
) {
  const service =
    getGradeService(userId);

  await service.saveAll(
    grades,
    userId,
  );
}

export async function saveOneGrade(
  grade: GradeEntry,
  userId?: string | null,
) {
  if (!userId) {
    return;
  }

  await saveFirestoreGrade(
    userId,
    grade,
  );
}

export async function deleteOneGrade(
  gradeId: string,
  userId?: string | null,
) {
  if (!userId) {
    return;
  }

  await deleteFirestoreGrade(
    userId,
    gradeId,
  );
}