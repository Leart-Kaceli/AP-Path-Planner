import type {
  AppBackup,
} from "@/types/backup";

export function validateBackup(
  backup: AppBackup,
) {
  const errors: string[] = [];

  if (
    backup.courses.some(
      (course) =>
        !course.id ||
        !course.name,
    )
  ) {
    errors.push(
      "One or more courses are invalid.",
    );
  }

  if (
    backup.assignments.some(
      (assignment) =>
        !assignment.id ||
        !assignment.title ||
        !assignment.course,
    )
  ) {
    errors.push(
      "One or more assignments are invalid.",
    );
  }

  if (
    backup.studySessions.some(
      (session) =>
        !session.id ||
        !session.course ||
        !session.topic,
    )
  ) {
    errors.push(
      "One or more study sessions are invalid.",
    );
  }

  if (
    backup.grades.some(
      (grade) =>
        !grade.id ||
        !grade.course ||
        grade.possiblePoints <= 0,
    )
  ) {
    errors.push(
      "One or more grades are invalid.",
    );
  }

  return errors;
}