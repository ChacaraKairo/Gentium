import { SQLiteDatabase } from 'expo-sqlite';

import readingPlansSeed from './seeds/readingPlans.json';
import { ReadingPlansSeed } from './seeds/types';

const readingPlans = readingPlansSeed as ReadingPlansSeed;
const readingPlansPackageMetadataKey = 'reading_plans_seed_package';
const readingPlansPackageVersion = 'Gentium-reading-plans-v0.7.0-2026-06-29';

export async function seedReadingPlans(database: SQLiteDatabase) {
  const metadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [readingPlansPackageMetadataKey],
  );

  if (metadata?.value === readingPlansPackageVersion) {
    return;
  }

  await database.withTransactionAsync(async () => {
    for (const plan of readingPlans.plans) {
      await database.runAsync(
        `
          INSERT INTO reading_plans
            (
              id,
              title,
              description,
              objective,
              author,
              category,
              level,
              duration_days,
              daily_minutes,
              language,
              version,
              position
            )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            objective = excluded.objective,
            author = excluded.author,
            category = excluded.category,
            level = excluded.level,
            duration_days = excluded.duration_days,
            daily_minutes = excluded.daily_minutes,
            language = excluded.language,
            version = excluded.version,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          plan.id,
          plan.title,
          plan.description,
          plan.objective,
          plan.author,
          plan.category,
          plan.level,
          plan.durationDays,
          plan.dailyMinutes,
          plan.language,
          plan.version,
          plan.position,
        ],
      );

      for (const day of plan.days) {
        const dayId = `${plan.id}-day-${day.dayNumber}`;
        await database.runAsync(
          `
            INSERT INTO reading_plan_days
              (id, plan_id, day_number, title, objective, reflection, prayer, questions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              plan_id = excluded.plan_id,
              day_number = excluded.day_number,
              title = excluded.title,
              objective = excluded.objective,
              reflection = excluded.reflection,
              prayer = excluded.prayer,
              questions_json = excluded.questions_json,
              updated_at = CURRENT_TIMESTAMP;
          `,
          [
            dayId,
            plan.id,
            day.dayNumber,
            day.title,
            day.objective,
            day.reflection,
            day.prayer,
            JSON.stringify(day.questions),
          ],
        );

        for (const [index, reference] of day.readings.entries()) {
          await database.runAsync(
            `
              INSERT INTO reading_plan_readings (id, day_id, reference, position)
              VALUES (?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                day_id = excluded.day_id,
                reference = excluded.reference,
                position = excluded.position;
            `,
            [`${dayId}-reading-${index + 1}`, dayId, reference, index + 1],
          );
        }
      }
    }

    await database.runAsync(
      `
        INSERT INTO app_metadata (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP;
      `,
      [readingPlansPackageMetadataKey, readingPlansPackageVersion],
    );
  });
}
