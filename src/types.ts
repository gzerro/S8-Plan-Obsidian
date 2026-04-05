export type PlannerLanguage = 'en' | 'ru';

export interface Task {
  id: string;
  title: string;
  weekdays: number[];
  order: number;
  createdAt?: string;
  archived?: boolean;
}

export interface PlannerData {
  tasks: Task[];
  completionsByDate: Record<string, string[]>;
  language: PlannerLanguage;
}

export interface TaskMonthlyProgress {
  taskId: string;
  planned: number;
  completed: number;
  remaining: number;
  percent: number;
}

export interface MonthProgress {
  planned: number;
  completed: number;
  percent: number;
}
