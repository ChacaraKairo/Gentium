import { SQLiteDatabase } from 'expo-sqlite';

import studiesLibrarySeed from './seeds/studiesLibrary.json';
import { StudiesLibrarySeed } from './seeds/types';

const studiesLibrary = studiesLibrarySeed as StudiesLibrarySeed;
const studiesPackageMetadataKey = 'studies_seed_package';
const studiesPackageVersion = 'Gentium-studies-v0.6.0-2026-06-29';

export async function seedStudiesLibrary(database: SQLiteDatabase) {
  const metadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [studiesPackageMetadataKey],
  );

  if (metadata?.value === studiesPackageVersion) {
    return;
  }

  await database.withTransactionAsync(async () => {
    for (const area of studiesLibrary.areas) {
      await database.runAsync(
        `
          INSERT INTO study_areas (id, title, description, position)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [area.id, area.title, area.description, area.position],
      );

      for (const category of area.categories) {
        await database.runAsync(
          `
            INSERT INTO study_categories (id, area_id, title, description, position)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              area_id = excluded.area_id,
              title = excluded.title,
              description = excluded.description,
              position = excluded.position,
              updated_at = CURRENT_TIMESTAMP;
          `,
          [category.id, area.id, category.title, category.description, category.position],
        );

        for (const course of category.courses) {
          await database.runAsync(
            `
              INSERT INTO study_courses
                (id, category_id, title, description, level, estimated_minutes, position)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                category_id = excluded.category_id,
                title = excluded.title,
                description = excluded.description,
                level = excluded.level,
                estimated_minutes = excluded.estimated_minutes,
                position = excluded.position,
                updated_at = CURRENT_TIMESTAMP;
            `,
            [
              course.id,
              category.id,
              course.title,
              course.description,
              course.level,
              course.estimatedMinutes,
              course.position,
            ],
          );

          for (const module of course.modules) {
            await database.runAsync(
              `
                INSERT INTO study_modules (id, course_id, title, description, position)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  course_id = excluded.course_id,
                  title = excluded.title,
                  description = excluded.description,
                  position = excluded.position,
                  updated_at = CURRENT_TIMESTAMP;
              `,
              [module.id, course.id, module.title, module.description, module.position],
            );

            for (const lesson of module.lessons) {
              await database.runAsync(
                `
                  INSERT INTO study_lessons
                    (id, module_id, title, summary, content, estimated_minutes, position)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                  ON CONFLICT(id) DO UPDATE SET
                    module_id = excluded.module_id,
                    title = excluded.title,
                    summary = excluded.summary,
                    content = excluded.content,
                    estimated_minutes = excluded.estimated_minutes,
                    position = excluded.position,
                    updated_at = CURRENT_TIMESTAMP;
                `,
                [
                  lesson.id,
                  module.id,
                  lesson.title,
                  lesson.summary,
                  lesson.content,
                  lesson.estimatedMinutes,
                  lesson.position,
                ],
              );

              for (const [index, reference] of lesson.references.entries()) {
                await database.runAsync(
                  `
                    INSERT INTO study_lesson_references (id, lesson_id, reference, position)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                      lesson_id = excluded.lesson_id,
                      reference = excluded.reference,
                      position = excluded.position;
                  `,
                  [`${lesson.id}-reference-${index + 1}`, lesson.id, reference, index + 1],
                );
              }
            }
          }
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
      [studiesPackageMetadataKey, studiesPackageVersion],
    );
  });
}
