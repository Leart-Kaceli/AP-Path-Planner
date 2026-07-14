export type GoalScore = 3 | 4 | 5;

export type Course = {
  id: string;
  name: string;
  teacher: string;
  goalScore: GoalScore;
  progress: number;
};