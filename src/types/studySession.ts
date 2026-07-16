export type StudySession = {
  id: string;
  course: string;
  topic: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  completed: boolean;
  notes: string;
};