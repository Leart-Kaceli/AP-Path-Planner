import {
  COURSE_STORAGE_KEY,
} from "@/constants/storage";

import {
  loadStoredArray,
  saveStoredArray,
} from "@/services/localStorageService";

import {
  deleteFirestoreCourse,
  firestoreCourseService,
  saveFirestoreCourse,
} from "@/services/firestoreCourseService";

import type {
  Course,
} from "@/types/course";

import type {
  DataService,
} from "@/services/dataService";

export const localCourseService:
  DataService<Course> = {
    async loadAll() {
      return loadStoredArray<Course>(
        COURSE_STORAGE_KEY,
      );
    },

    async saveAll(courses) {
      saveStoredArray(
        COURSE_STORAGE_KEY,
        courses,
      );
    },
  };

function getCourseService(
  userId?: string | null,
) {
  return userId
    ? firestoreCourseService
    : localCourseService;
}

export async function loadCourses(
  userId?: string | null,
) {
  const service =
    getCourseService(userId);

  const courses =
    await service.loadAll(userId);

  if (
    userId &&
    courses.length === 0
  ) {
    const localCourses =
      await localCourseService.loadAll();

    if (localCourses.length > 0) {
      await firestoreCourseService.saveAll(
        localCourses,
        userId,
      );

      return localCourses;
    }
  }

  return courses;
}

export async function saveCourses(
  courses: Course[],
  userId?: string | null,
) {
  const service =
    getCourseService(userId);

  await service.saveAll(
    courses,
    userId,
  );
}

export async function saveOneCourse(
  course: Course,
  userId?: string | null,
) {
  if (!userId) {
    return;
  }

  await saveFirestoreCourse(
    userId,
    course,
  );
}

export async function deleteOneCourse(
  courseId: string,
  userId?: string | null,
) {
  if (!userId) {
    return;
  }

  await deleteFirestoreCourse(
    userId,
    courseId,
  );
}