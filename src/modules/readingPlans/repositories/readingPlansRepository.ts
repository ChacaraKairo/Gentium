import { getDatabase } from '@/infrastructure/database/database';
import {
  ReadingPlan,
  ReadingPlanDay,
  ReadingPlanDetail,
  ReadingPlanLevel,
  ReadingPlanStats,
} from '@/modules/readingPlans/types';

type ReadingPlanRow = {
  author: string;
  category: string;
  completed_at: string | null;
  completed_days: number;
  daily_minutes: number;
  description: string;
  duration_days: number;
  id: string;
  is_started: number;
  language: string;
  level: ReadingPlanLevel;
  objective: string;
  title: string;
  version: string;
};

type ReadingPlanDayRow = {
  completed_at: string | null;
  day_number: number;
  id: string;
  objective: string;
  plan_id: string;
  prayer: string;
  questions_json: string;
  readings_text: string | null;
  reflection: string;
  title: string;
};

export async function getReadingPlans(): Promise<ReadingPlan[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<ReadingPlanRow>(`
    SELECT
      plans.id,
      plans.title,
      plans.description,
      plans.objective,
      plans.author,
      plans.category,
      plans.level,
      plans.duration_days,
      plans.daily_minutes,
      plans.language,
      plans.version,
      CASE WHEN progress.plan_id IS NULL THEN 0 ELSE 1 END AS is_started,
      progress.completed_at,
      COUNT(DISTINCT day_progress.day_id) AS completed_days
    FROM reading_plans plans
    LEFT JOIN reading_plan_progress progress ON progress.plan_id = plans.id
    LEFT JOIN reading_plan_day_progress day_progress ON day_progress.plan_id = plans.id
    GROUP BY plans.id
    ORDER BY plans.position ASC;
  `);

  return rows.map(mapReadingPlanRow);
}

export async function getReadingPlanDetail(planId: string): Promise<ReadingPlanDetail | null> {
  const database = await getDatabase();
  const planRow = await database.getFirstAsync<ReadingPlanRow>(
    `
      SELECT
        plans.id,
        plans.title,
        plans.description,
        plans.objective,
        plans.author,
        plans.category,
        plans.level,
        plans.duration_days,
        plans.daily_minutes,
        plans.language,
        plans.version,
        CASE WHEN progress.plan_id IS NULL THEN 0 ELSE 1 END AS is_started,
        progress.completed_at,
        COUNT(DISTINCT day_progress.day_id) AS completed_days
      FROM reading_plans plans
      LEFT JOIN reading_plan_progress progress ON progress.plan_id = plans.id
      LEFT JOIN reading_plan_day_progress day_progress ON day_progress.plan_id = plans.id
      WHERE plans.id = ?
      GROUP BY plans.id
      LIMIT 1;
    `,
    [planId],
  );

  if (!planRow) {
    return null;
  }

  const days = await getReadingPlanDays(planId);
  const plan = mapReadingPlanRow(planRow);
  const currentDay = days.find((day) => !day.completedAt) ?? days[days.length - 1];

  return {
    ...plan,
    currentDay,
    days,
    stats: getReadingPlanStats(plan, days),
  };
}

export async function startReadingPlan(planId: string) {
  const database = await getDatabase();
  await database.runAsync(
    `
      INSERT INTO reading_plan_progress (plan_id)
      VALUES (?)
      ON CONFLICT(plan_id) DO UPDATE SET
        last_activity_at = CURRENT_TIMESTAMP;
    `,
    [planId],
  );
}

export async function completeReadingPlanDay(planId: string, dayId: string, dayNumber: number) {
  const database = await getDatabase();
  await database.withTransactionAsync(async () => {
    await database.runAsync(
      `
        INSERT INTO reading_plan_progress (plan_id)
        VALUES (?)
        ON CONFLICT(plan_id) DO UPDATE SET
          last_activity_at = CURRENT_TIMESTAMP;
      `,
      [planId],
    );
    await database.runAsync(
      `
        INSERT INTO reading_plan_day_progress (day_id, plan_id, day_number)
        VALUES (?, ?, ?)
        ON CONFLICT(day_id) DO UPDATE SET
          completed_at = CURRENT_TIMESTAMP;
      `,
      [dayId, planId, dayNumber],
    );

    const counts = await database.getFirstAsync<{ completed_days: number; duration_days: number }>(
      `
        SELECT
          plans.duration_days,
          COUNT(DISTINCT day_progress.day_id) AS completed_days
        FROM reading_plans plans
        LEFT JOIN reading_plan_day_progress day_progress ON day_progress.plan_id = plans.id
        WHERE plans.id = ?
        GROUP BY plans.id;
      `,
      [planId],
    );

    await database.runAsync(
      `
        UPDATE reading_plan_progress
        SET
          completed_at = CASE WHEN ? > 0 AND ? = ? THEN CURRENT_TIMESTAMP ELSE completed_at END,
          last_activity_at = CURRENT_TIMESTAMP
        WHERE plan_id = ?;
      `,
      [
        counts?.duration_days ?? 0,
        counts?.completed_days ?? 0,
        counts?.duration_days ?? 0,
        planId,
      ],
    );
  });
}

async function getReadingPlanDays(planId: string): Promise<ReadingPlanDay[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<ReadingPlanDayRow>(
    `
      SELECT
        days.id,
        days.plan_id,
        days.day_number,
        days.title,
        days.objective,
        days.reflection,
        days.prayer,
        days.questions_json,
        day_progress.completed_at,
        GROUP_CONCAT(readings.reference, '||') AS readings_text
      FROM reading_plan_days days
      LEFT JOIN reading_plan_day_progress day_progress ON day_progress.day_id = days.id
      LEFT JOIN reading_plan_readings readings ON readings.day_id = days.id
      WHERE days.plan_id = ?
      GROUP BY days.id
      ORDER BY days.day_number ASC, readings.position ASC;
    `,
    [planId],
  );

  return rows.map(mapReadingPlanDayRow);
}

function mapReadingPlanRow(row: ReadingPlanRow): ReadingPlan {
  return {
    author: row.author,
    category: row.category,
    completedAt: row.completed_at ?? undefined,
    completedDays: row.completed_days,
    dailyMinutes: row.daily_minutes,
    description: row.description,
    durationDays: row.duration_days,
    id: row.id,
    isStarted: row.is_started === 1,
    language: row.language,
    level: row.level,
    objective: row.objective,
    progressPercent: getProgressPercent(row.completed_days, row.duration_days),
    title: row.title,
    version: row.version,
  };
}

function mapReadingPlanDayRow(row: ReadingPlanDayRow): ReadingPlanDay {
  return {
    completedAt: row.completed_at ?? undefined,
    dayNumber: row.day_number,
    id: row.id,
    objective: row.objective,
    planId: row.plan_id,
    prayer: row.prayer,
    questions: parseJsonArray(row.questions_json),
    readings: row.readings_text ? row.readings_text.split('||') : [],
    reflection: row.reflection,
    title: row.title,
  };
}

function getReadingPlanStats(plan: ReadingPlan, days: ReadingPlanDay[]): ReadingPlanStats {
  const completedDayNumbers = new Set(
    days.filter((day) => day.completedAt).map((day) => day.dayNumber),
  );
  let currentStreak = 0;

  for (let dayNumber = 1; dayNumber <= plan.durationDays; dayNumber += 1) {
    if (!completedDayNumbers.has(dayNumber)) {
      break;
    }

    currentStreak += 1;
  }

  return {
    completedDays: plan.completedDays,
    currentStreak,
    remainingDays: Math.max(plan.durationDays - plan.completedDays, 0),
  };
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function getProgressPercent(completed: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}
