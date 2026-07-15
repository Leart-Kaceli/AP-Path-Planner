export type AssignmentPriority = "Low" | "Medium" | "High";

export type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: AssignmentPriority;
  completed: boolean;
  notes: string;
};