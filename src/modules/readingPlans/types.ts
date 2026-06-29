export type ReadingPlanLevel = 'advanced' | 'beginner' | 'intermediate';

export type ReadingPlan = {
  author: string;
  category: string;
  completedAt?: string;
  completedDays: number;
  dailyMinutes: number;
  description: string;
  durationDays: number;
  id: string;
  isStarted: boolean;
  language: string;
  level: ReadingPlanLevel;
  objective: string;
  progressPercent: number;
  title: string;
  version: string;
};

export type ReadingPlanDay = {
  completedAt?: string;
  dayNumber: number;
  id: string;
  objective: string;
  planId: string;
  prayer: string;
  questions: string[];
  readings: string[];
  reflection: string;
  title: string;
};

export type ReadingPlanDetail = ReadingPlan & {
  currentDay?: ReadingPlanDay;
  days: ReadingPlanDay[];
  stats: ReadingPlanStats;
};

export type ReadingPlanStats = {
  completedDays: number;
  currentStreak: number;
  remainingDays: number;
};
