import {
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  firestoreDatabase,
} from "@/lib/firebase";

import {
  DEFAULT_STUDENT_PROFILE,
} from "@/constants/profile";

import {
  normalizeAssignment,
} from "@/utils/assignments";

import {
  normalizeStudySession,
} from "@/utils/studySessions";

import type {
  Assignment,
} from "@/types/assignment";

import type {
  Course,
} from "@/types/course";

import type {
  GradeEntry,
  CourseGradeWeights,
} from "@/types/grade";

import type {
  StudentProfile,
} from "@/types/profile";

import type {
  StudySession,
} from "@/types/studySession";

import type {
  SyncSnapshot,
} from "@/types/sync";

type ErrorHandler = (
  error: Error,
) => void;

export function subscribeToAssignments(
  userId: string,
  onData: (
    snapshot: SyncSnapshot<
      Assignment[]
    >,
  ) => void,
  onError?: ErrorHandler,
) {
  return onSnapshot(
    collection(
      firestoreDatabase,
      "users",
      userId,
      "assignments",
    ),
    {
      includeMetadataChanges: true,
    },
    (snapshot) => {
      const assignments =
        snapshot.docs
          .map(
            (documentSnapshot) =>
              normalizeAssignment({
                id:
                  documentSnapshot.id,
                ...documentSnapshot.data(),
              } as Assignment),
          )
          .sort(
            (first, second) =>
              first.dueDate.localeCompare(
                second.dueDate,
              ),
          );

      onData({
        data: assignments,
        fromCache:
          snapshot.metadata
            .fromCache,
        hasPendingWrites:
          snapshot.metadata
            .hasPendingWrites,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToCourses(
  userId: string,
  onData: (
    snapshot: SyncSnapshot<Course[]>,
  ) => void,
  onError?: ErrorHandler,
) {
  return onSnapshot(
    collection(
      firestoreDatabase,
      "users",
      userId,
      "courses",
    ),
    {
      includeMetadataChanges: true,
    },
    (snapshot) => {
      const courses =
        snapshot.docs
          .map(
            (documentSnapshot) => ({
              id:
                documentSnapshot.id,
              ...documentSnapshot.data(),
            }) as Course,
          )
          .sort(
            (first, second) =>
              first.name.localeCompare(
                second.name,
              ),
          );

      onData({
        data: courses,
        fromCache:
          snapshot.metadata
            .fromCache,
        hasPendingWrites:
          snapshot.metadata
            .hasPendingWrites,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToStudySessions(
  userId: string,
  onData: (
    snapshot: SyncSnapshot<
      StudySession[]
    >,
  ) => void,
  onError?: ErrorHandler,
) {
  return onSnapshot(
    collection(
      firestoreDatabase,
      "users",
      userId,
      "studySessions",
    ),
    {
      includeMetadataChanges: true,
    },
    (snapshot) => {
      const sessions =
        snapshot.docs
          .map(
            (documentSnapshot) =>
              normalizeStudySession({
                id:
                  documentSnapshot.id,
                ...documentSnapshot.data(),
              } as StudySession),
          )
          .sort(
            (first, second) =>
              `${first.date}T${first.startTime}`.localeCompare(
                `${second.date}T${second.startTime}`,
              ),
          );

      onData({
        data: sessions,
        fromCache:
          snapshot.metadata
            .fromCache,
        hasPendingWrites:
          snapshot.metadata
            .hasPendingWrites,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToGrades(
  userId: string,
  onData: (
    snapshot: SyncSnapshot<
      GradeEntry[]
    >,
  ) => void,
  onError?: ErrorHandler,
) {
  return onSnapshot(
    collection(
      firestoreDatabase,
      "users",
      userId,
      "grades",
    ),
    {
      includeMetadataChanges: true,
    },
    (snapshot) => {
      const grades =
        snapshot.docs
          .map(
            (documentSnapshot) => ({
              id:
                documentSnapshot.id,
              ...documentSnapshot.data(),
            }) as GradeEntry,
          )
          .sort(
            (first, second) =>
              second.date.localeCompare(
                first.date,
              ),
          );

      onData({
        data: grades,
        fromCache:
          snapshot.metadata
            .fromCache,
        hasPendingWrites:
          snapshot.metadata
            .hasPendingWrites,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToProfile(
  userId: string,
  onData: (
    snapshot: SyncSnapshot<
      StudentProfile
    >,
  ) => void,
  onError?: ErrorHandler,
) {
  return onSnapshot(
    doc(
      firestoreDatabase,
      "users",
      userId,
    ),
    {
      includeMetadataChanges: true,
    },
    (snapshot) => {
      onData({
        data: snapshot.exists()
          ? {
              ...DEFAULT_STUDENT_PROFILE,
              ...snapshot.data(),
            } as StudentProfile
          : DEFAULT_STUDENT_PROFILE,

        fromCache:
          snapshot.metadata
            .fromCache,

        hasPendingWrites:
          snapshot.metadata
            .hasPendingWrites,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}

export function subscribeToGradeWeights(
  userId: string,
  onData: (
    snapshot: SyncSnapshot<
      CourseGradeWeights
    >,
  ) => void,
  onError?: ErrorHandler,
) {
  return onSnapshot(
    doc(
      firestoreDatabase,
      "users",
      userId,
      "settings",
      "gradeWeights",
    ),
    {
      includeMetadataChanges: true,
    },
    (snapshot) => {
      const data =
        snapshot.data();

      const weights =
        data?.weights &&
        typeof data.weights ===
          "object" &&
        !Array.isArray(
          data.weights,
        )
          ? data.weights as
              CourseGradeWeights
          : {};

      onData({
        data: weights,
        fromCache:
          snapshot.metadata
            .fromCache,
        hasPendingWrites:
          snapshot.metadata
            .hasPendingWrites,
      });
    },
    (error) => {
      onError?.(error);
    },
  );
}