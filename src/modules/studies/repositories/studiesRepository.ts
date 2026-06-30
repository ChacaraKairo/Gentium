import { getDatabase } from '@/infrastructure/database/database';
import {
  StudyArea,
  StudyCategory,
  StudyCourse,
  StudyCourseDetail,
  StudyDashboardStats,
  StudyLesson,
  StudyLevel,
  StudyModule,
  StudyResume,
} from '@/modules/studies/types';

type StudyAreaRow = {
  completed_lessons: number;
  course_count: number;
  description: string;
  id: string;
  lesson_count: number;
  title: string;
};

type StudyCategoryRow = StudyAreaRow & {
  area_id: string;
};

type StudyCourseRow = {
  category_id: string;
  completed_at: string | null;
  completed_lessons: number;
  description: string;
  estimated_minutes: number;
  id: string;
  is_started: number;
  lesson_count: number;
  level: StudyLevel;
  title: string;
};

type StudyModuleRow = {
  course_id: string;
  description: string;
  id: string;
  title: string;
};

type StudyLessonRow = {
  completed_at: string | null;
  content: string;
  estimated_minutes: number;
  id: string;
  module_id: string;
  references_text: string | null;
  summary: string;
  title: string;
};

type StudyStatsRow = {
  active_courses: number;
  completed_courses: number;
  completed_lessons: number;
  total_courses: number;
  total_lessons: number;
};

type StudyResumeRow = {
  completed_lessons: number;
  course_id: string;
  course_title: string;
  lesson_count: number;
  lesson_id: string;
  lesson_title: string;
};

export async function getStudyDashboardStats(): Promise<StudyDashboardStats> {
  const database = await getDatabase();
  const stats = await database.getFirstAsync<StudyStatsRow>(`
    SELECT
      COUNT(DISTINCT courses.id) AS total_courses,
      COUNT(DISTINCT lessons.id) AS total_lessons,
      COUNT(DISTINCT lesson_progress.lesson_id) AS completed_lessons,
      COUNT(DISTINCT course_progress.course_id) AS active_courses,
      COUNT(DISTINCT CASE WHEN course_progress.completed_at IS NOT NULL THEN courses.id END)
        AS completed_courses
    FROM study_courses courses
    LEFT JOIN study_modules modules ON modules.course_id = courses.id
    LEFT JOIN study_lessons lessons ON lessons.module_id = modules.id
    LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
    LEFT JOIN study_course_progress course_progress ON course_progress.course_id = courses.id;
  `);
  const nextLesson = await getNextStudyLesson();
  const totalLessons = stats?.total_lessons ?? 0;
  const completedLessons = stats?.completed_lessons ?? 0;

  return {
    activeCourses: stats?.active_courses ?? 0,
    completedCourses: stats?.completed_courses ?? 0,
    completedLessons,
    nextLesson,
    progressPercent: getProgressPercent(completedLessons, totalLessons),
    totalCourses: stats?.total_courses ?? 0,
    totalLessons,
  };
}

export async function getNextStudyLesson(): Promise<StudyResume | undefined> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<StudyResumeRow>(`
    SELECT
      courses.id AS course_id,
      courses.title AS course_title,
      lessons.id AS lesson_id,
      lessons.title AS lesson_title,
      COUNT(DISTINCT all_lessons.id) AS lesson_count,
      COUNT(DISTINCT completed.lesson_id) AS completed_lessons
    FROM study_courses courses
    LEFT JOIN study_course_progress course_progress ON course_progress.course_id = courses.id
    INNER JOIN study_modules modules ON modules.course_id = courses.id
    INNER JOIN study_lessons lessons ON lessons.module_id = modules.id
    LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
    LEFT JOIN study_modules all_modules ON all_modules.course_id = courses.id
    LEFT JOIN study_lessons all_lessons ON all_lessons.module_id = all_modules.id
    LEFT JOIN study_lesson_progress completed ON completed.lesson_id = all_lessons.id
    WHERE lesson_progress.lesson_id IS NULL
    GROUP BY courses.id, lessons.id
    ORDER BY
      CASE WHEN course_progress.course_id IS NULL THEN 1 ELSE 0 END ASC,
      course_progress.last_activity_at DESC,
      courses.position ASC,
      modules.position ASC,
      lessons.position ASC
    LIMIT 1;
  `);

  if (!row) {
    return undefined;
  }

  return {
    courseId: row.course_id,
    courseTitle: row.course_title,
    lessonId: row.lesson_id,
    lessonTitle: row.lesson_title,
    progressPercent: getProgressPercent(row.completed_lessons, row.lesson_count),
  };
}

export async function getStudyLesson(courseId: string, lessonId: string): Promise<StudyLesson | null> {
  const detail = await getStudyCourseDetail(courseId);

  return (
    detail?.modules.flatMap((module) => module.lessons).find((lesson) => lesson.id === lessonId) ??
    null
  );
}

export async function getStudyAreas(): Promise<StudyArea[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<StudyAreaRow>(`
    SELECT
      areas.id,
      areas.title,
      areas.description,
      COUNT(DISTINCT courses.id) AS course_count,
      COUNT(DISTINCT lessons.id) AS lesson_count,
      COUNT(DISTINCT lesson_progress.lesson_id) AS completed_lessons
    FROM study_areas areas
    LEFT JOIN study_categories categories ON categories.area_id = areas.id
    LEFT JOIN study_courses courses ON courses.category_id = categories.id
    LEFT JOIN study_modules modules ON modules.course_id = courses.id
    LEFT JOIN study_lessons lessons ON lessons.module_id = modules.id
    LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
    GROUP BY areas.id
    ORDER BY areas.position ASC;
  `);

  return rows.map(mapStudyAreaRow);
}

export async function getStudyCategories(areaId: string): Promise<StudyCategory[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<StudyCategoryRow>(
    `
      SELECT
        categories.id,
        categories.area_id,
        categories.title,
        categories.description,
        COUNT(DISTINCT courses.id) AS course_count,
        COUNT(DISTINCT lessons.id) AS lesson_count,
        COUNT(DISTINCT lesson_progress.lesson_id) AS completed_lessons
      FROM study_categories categories
      LEFT JOIN study_courses courses ON courses.category_id = categories.id
      LEFT JOIN study_modules modules ON modules.course_id = courses.id
      LEFT JOIN study_lessons lessons ON lessons.module_id = modules.id
      LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
      WHERE categories.area_id = ?
      GROUP BY categories.id
      ORDER BY categories.position ASC;
    `,
    [areaId],
  );

  return rows.map(mapStudyCategoryRow);
}

export async function getStudyCourses(categoryId: string): Promise<StudyCourse[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<StudyCourseRow>(
    `
      SELECT
        courses.id,
        courses.category_id,
        courses.title,
        courses.description,
        courses.level,
        courses.estimated_minutes,
        CASE WHEN course_progress.course_id IS NULL THEN 0 ELSE 1 END AS is_started,
        course_progress.completed_at,
        COUNT(DISTINCT lessons.id) AS lesson_count,
        COUNT(DISTINCT lesson_progress.lesson_id) AS completed_lessons
      FROM study_courses courses
      LEFT JOIN study_course_progress course_progress ON course_progress.course_id = courses.id
      LEFT JOIN study_modules modules ON modules.course_id = courses.id
      LEFT JOIN study_lessons lessons ON lessons.module_id = modules.id
      LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
      WHERE courses.category_id = ?
      GROUP BY courses.id
      ORDER BY courses.position ASC;
    `,
    [categoryId],
  );

  return rows.map(mapStudyCourseRow);
}

export async function getStudyCourseDetail(courseId: string): Promise<StudyCourseDetail | null> {
  const database = await getDatabase();
  const courseRow = await database.getFirstAsync<StudyCourseRow>(
    `
      SELECT
        courses.id,
        courses.category_id,
        courses.title,
        courses.description,
        courses.level,
        courses.estimated_minutes,
        CASE WHEN course_progress.course_id IS NULL THEN 0 ELSE 1 END AS is_started,
        course_progress.completed_at,
        COUNT(DISTINCT lessons.id) AS lesson_count,
        COUNT(DISTINCT lesson_progress.lesson_id) AS completed_lessons
      FROM study_courses courses
      LEFT JOIN study_course_progress course_progress ON course_progress.course_id = courses.id
      LEFT JOIN study_modules modules ON modules.course_id = courses.id
      LEFT JOIN study_lessons lessons ON lessons.module_id = modules.id
      LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
      WHERE courses.id = ?
      GROUP BY courses.id
      LIMIT 1;
    `,
    [courseId],
  );

  if (!courseRow) {
    return null;
  }

  const moduleRows = await database.getAllAsync<StudyModuleRow>(
    `
      SELECT id, course_id, title, description
      FROM study_modules
      WHERE course_id = ?
      ORDER BY position ASC;
    `,
    [courseId],
  );

  const modules = await Promise.all(moduleRows.map((moduleRow) => getStudyModule(moduleRow)));

  return {
    ...mapStudyCourseRow(courseRow),
    modules,
  };
}

export async function startStudyCourse(courseId: string) {
  const database = await getDatabase();
  await database.runAsync(
    `
      INSERT INTO study_course_progress (course_id)
      VALUES (?)
      ON CONFLICT(course_id) DO UPDATE SET
        last_activity_at = CURRENT_TIMESTAMP;
    `,
    [courseId],
  );
}

export async function completeStudyLesson(courseId: string, lessonId: string) {
  const database = await getDatabase();
  await database.withTransactionAsync(async () => {
    await startStudyCourse(courseId);
    await database.runAsync(
      `
        INSERT INTO study_lesson_progress (lesson_id, course_id)
        VALUES (?, ?)
        ON CONFLICT(lesson_id) DO UPDATE SET
          course_id = excluded.course_id,
          completed_at = CURRENT_TIMESTAMP;
      `,
      [lessonId, courseId],
    );

    const counts = await database.getFirstAsync<{ completed_lessons: number; lesson_count: number }>(
      `
        SELECT
          COUNT(DISTINCT lessons.id) AS lesson_count,
          COUNT(DISTINCT lesson_progress.lesson_id) AS completed_lessons
        FROM study_courses courses
        LEFT JOIN study_modules modules ON modules.course_id = courses.id
        LEFT JOIN study_lessons lessons ON lessons.module_id = modules.id
        LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
        WHERE courses.id = ?
        GROUP BY courses.id;
      `,
      [courseId],
    );

    await database.runAsync(
      `
        UPDATE study_course_progress
        SET
          completed_at = CASE WHEN ? > 0 AND ? = ? THEN CURRENT_TIMESTAMP ELSE completed_at END,
          last_activity_at = CURRENT_TIMESTAMP
        WHERE course_id = ?;
      `,
      [
        counts?.lesson_count ?? 0,
        counts?.completed_lessons ?? 0,
        counts?.lesson_count ?? 0,
        courseId,
      ],
    );
  });
}

async function getStudyModule(row: StudyModuleRow): Promise<StudyModule> {
  const database = await getDatabase();
  const lessons = await database.getAllAsync<StudyLessonRow>(
    `
      SELECT
        lessons.id,
        lessons.module_id,
        lessons.title,
        lessons.summary,
        lessons.content,
        lessons.estimated_minutes,
        lesson_progress.completed_at,
        GROUP_CONCAT(references.reference, '||') AS references_text
      FROM study_lessons lessons
      LEFT JOIN study_lesson_progress lesson_progress ON lesson_progress.lesson_id = lessons.id
      LEFT JOIN study_lesson_references references ON references.lesson_id = lessons.id
      WHERE lessons.module_id = ?
      GROUP BY lessons.id
      ORDER BY lessons.position ASC, references.position ASC;
    `,
    [row.id],
  );

  return {
    courseId: row.course_id,
    description: row.description,
    id: row.id,
    lessons: lessons.map(mapStudyLessonRow),
    title: row.title,
  };
}

function mapStudyAreaRow(row: StudyAreaRow): StudyArea {
  return {
    completedLessons: row.completed_lessons,
    courseCount: row.course_count,
    description: row.description,
    id: row.id,
    lessonCount: row.lesson_count,
    progressPercent: getProgressPercent(row.completed_lessons, row.lesson_count),
    title: row.title,
  };
}

function mapStudyCategoryRow(row: StudyCategoryRow): StudyCategory {
  return {
    areaId: row.area_id,
    completedLessons: row.completed_lessons,
    courseCount: row.course_count,
    description: row.description,
    id: row.id,
    lessonCount: row.lesson_count,
    progressPercent: getProgressPercent(row.completed_lessons, row.lesson_count),
    title: row.title,
  };
}

function mapStudyCourseRow(row: StudyCourseRow): StudyCourse {
  return {
    categoryId: row.category_id,
    completedAt: row.completed_at ?? undefined,
    completedLessons: row.completed_lessons,
    description: row.description,
    estimatedMinutes: row.estimated_minutes,
    id: row.id,
    isStarted: row.is_started === 1,
    lessonCount: row.lesson_count,
    level: row.level,
    progressPercent: getProgressPercent(row.completed_lessons, row.lesson_count),
    title: row.title,
  };
}

function mapStudyLessonRow(row: StudyLessonRow): StudyLesson {
  return {
    completedAt: row.completed_at ?? undefined,
    content: row.content,
    estimatedMinutes: row.estimated_minutes,
    id: row.id,
    moduleId: row.module_id,
    references: row.references_text ? row.references_text.split('||') : [],
    summary: row.summary,
    title: row.title,
  };
}

function getProgressPercent(completedLessons: number, lessonCount: number) {
  if (!lessonCount) {
    return 0;
  }

  return Math.round((completedLessons / lessonCount) * 100);
}
