export type StudyLevel = 'advanced' | 'beginner' | 'intermediate';

export type StudyArea = {
  completedLessons: number;
  courseCount: number;
  description: string;
  id: string;
  lessonCount: number;
  progressPercent: number;
  title: string;
};

export type StudyCategory = {
  areaId: string;
  completedLessons: number;
  courseCount: number;
  description: string;
  id: string;
  lessonCount: number;
  progressPercent: number;
  title: string;
};

export type StudyCourse = {
  categoryId: string;
  completedAt?: string;
  completedLessons: number;
  description: string;
  estimatedMinutes: number;
  id: string;
  isStarted: boolean;
  lessonCount: number;
  level: StudyLevel;
  progressPercent: number;
  title: string;
};

export type StudyModule = {
  courseId: string;
  description: string;
  id: string;
  lessons: StudyLesson[];
  title: string;
};

export type StudyLesson = {
  completedAt?: string;
  content: string;
  estimatedMinutes: number;
  id: string;
  moduleId: string;
  references: string[];
  summary: string;
  title: string;
};

export type StudyCourseDetail = StudyCourse & {
  modules: StudyModule[];
};
