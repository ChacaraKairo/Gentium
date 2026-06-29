import { getDatabase } from '@/infrastructure/database/database';

type BackupTableName =
  | 'collections'
  | 'favorites'
  | 'highlight_tags'
  | 'highlights'
  | 'note_tags'
  | 'notes'
  | 'reading_history'
  | 'reading_plan_day_progress'
  | 'reading_plan_progress'
  | 'study_course_progress'
  | 'study_lesson_progress'
  | 'tags';

const backupTables: BackupTableName[] = [
  'collections',
  'favorites',
  'highlight_tags',
  'highlights',
  'note_tags',
  'notes',
  'reading_history',
  'reading_plan_day_progress',
  'reading_plan_progress',
  'study_course_progress',
  'study_lesson_progress',
  'tags',
];

export type LocalBackupSnapshot = {
  app: {
    name: string;
    schema: number;
    version: string;
  };
  createdAt: string;
  tables: Record<BackupTableName, Record<string, unknown>[]>;
};

export async function createLocalBackupSnapshot(): Promise<LocalBackupSnapshot> {
  const database = await getDatabase();
  const tables = {} as Record<BackupTableName, Record<string, unknown>[]>;

  for (const tableName of backupTables) {
    tables[tableName] = await database.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${tableName};`,
    );
  }

  return {
    app: {
      name: 'Gentium',
      schema: 1,
      version: '1.0.0',
    },
    createdAt: new Date().toISOString(),
    tables,
  };
}

export async function createLocalBackupText() {
  return JSON.stringify(await createLocalBackupSnapshot(), null, 2);
}
