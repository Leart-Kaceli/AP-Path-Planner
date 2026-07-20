import type { Assignment } from "@/types/assignment";

export function normalizeAssignment(
  assignment: Assignment,
): Assignment {
  const hasCompletedAt =
    typeof assignment.completedAt === "string";

  const estimatedCompletedAt =
    assignment.completed
      ? `${assignment.dueDate}T12:00:00`
      : null;

  return {
    ...assignment,
    completedAt: hasCompletedAt
      ? assignment.completedAt
      : estimatedCompletedAt,
  };
}