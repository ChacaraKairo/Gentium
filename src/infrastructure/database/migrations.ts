import { SQLiteDatabase } from 'expo-sqlite';

type Migration = {
  id: number;
  name: string;
  up: (database: SQLiteDatabase) => Promise<void>;
};

const migrations: Migration[] = [
  {
    id: 1,
    name: 'create_app_metadata',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS app_metadata (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    },
  },
  {
    id: 2,
    name: 'create_bible_offline_schema',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS bible_versions (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          abbreviation TEXT NOT NULL,
          language TEXT NOT NULL,
          description TEXT NOT NULL,
          copyright TEXT NOT NULL,
          is_offline_available INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bible_books (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          abbreviation TEXT NOT NULL,
          testament TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bible_chapters (
          id TEXT PRIMARY KEY NOT NULL,
          book_id TEXT NOT NULL,
          chapter_number INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (book_id) REFERENCES bible_books(id) ON DELETE CASCADE,
          UNIQUE (book_id, chapter_number)
        );

        CREATE TABLE IF NOT EXISTS bible_verses (
          id TEXT PRIMARY KEY NOT NULL,
          version_id TEXT NOT NULL,
          book_id TEXT NOT NULL,
          chapter_id TEXT NOT NULL,
          verse_number INTEGER NOT NULL,
          text TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (version_id) REFERENCES bible_versions(id) ON DELETE CASCADE,
          FOREIGN KEY (book_id) REFERENCES bible_books(id) ON DELETE CASCADE,
          FOREIGN KEY (chapter_id) REFERENCES bible_chapters(id) ON DELETE CASCADE,
          UNIQUE (version_id, chapter_id, verse_number)
        );

        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY NOT NULL,
          verse_id TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT,
          FOREIGN KEY (verse_id) REFERENCES bible_verses(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS reading_history (
          id TEXT PRIMARY KEY NOT NULL,
          version_id TEXT NOT NULL,
          book_id TEXT NOT NULL,
          chapter_id TEXT NOT NULL,
          verse_id TEXT,
          last_read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (version_id) REFERENCES bible_versions(id) ON DELETE CASCADE,
          FOREIGN KEY (book_id) REFERENCES bible_books(id) ON DELETE CASCADE,
          FOREIGN KEY (chapter_id) REFERENCES bible_chapters(id) ON DELETE CASCADE,
          FOREIGN KEY (verse_id) REFERENCES bible_verses(id) ON DELETE SET NULL
        );

        CREATE INDEX IF NOT EXISTS idx_bible_books_position ON bible_books(position);
        CREATE INDEX IF NOT EXISTS idx_bible_chapters_book ON bible_chapters(book_id);
        CREATE INDEX IF NOT EXISTS idx_bible_verses_chapter ON bible_verses(chapter_id, verse_number);
        CREATE INDEX IF NOT EXISTS idx_favorites_verse ON favorites(verse_id);
      `);
    },
  },
  {
    id: 3,
    name: 'legacy_seed_initial_sample_removed',
    up: async () => {},
  },
  {
    id: 4,
    name: 'create_personal_organization_schema',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          scope TEXT NOT NULL,
          color TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS tags (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL UNIQUE,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS collections (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT
        );

        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY NOT NULL,
          verse_id TEXT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category_id TEXT,
          color TEXT,
          is_favorite INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT,
          sync_status TEXT NOT NULL DEFAULT 'local',
          FOREIGN KEY (verse_id) REFERENCES bible_verses(id) ON DELETE SET NULL,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS note_tags (
          note_id TEXT NOT NULL,
          tag_id TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (note_id, tag_id),
          FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS highlights (
          id TEXT PRIMARY KEY NOT NULL,
          verse_id TEXT NOT NULL,
          color TEXT NOT NULL,
          category_id TEXT,
          note TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT,
          sync_status TEXT NOT NULL DEFAULT 'local',
          FOREIGN KEY (verse_id) REFERENCES bible_verses(id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS highlight_tags (
          highlight_id TEXT NOT NULL,
          tag_id TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (highlight_id, tag_id),
          FOREIGN KEY (highlight_id) REFERENCES highlights(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_notes_verse ON notes(verse_id);
        CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category_id);
        CREATE INDEX IF NOT EXISTS idx_highlights_verse ON highlights(verse_id);
        CREATE INDEX IF NOT EXISTS idx_highlights_category ON highlights(category_id);

        INSERT OR IGNORE INTO collections (id, name) VALUES ('default-favorites', 'Favoritos');
        INSERT OR IGNORE INTO categories (id, name, scope, color) VALUES
          ('note-general', 'Geral', 'note', '#B88A44'),
          ('highlight-study', 'Estudo', 'highlight', '#B88A44');
      `);

      const favoriteColumns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(favorites);');
      const hasCollectionColumn = favoriteColumns.some((column) => column.name === 'collection_id');

      if (!hasCollectionColumn) {
        await database.execAsync('ALTER TABLE favorites ADD COLUMN collection_id TEXT;');
        await database.runAsync(
          'UPDATE favorites SET collection_id = ? WHERE collection_id IS NULL;',
          ['default-favorites'],
        );
      }
    },
  },
  {
    id: 5,
    name: 'create_original_language_schema',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS original_language_versions (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          abbreviation TEXT NOT NULL,
          language TEXT NOT NULL,
          description TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS original_language_verses (
          id TEXT PRIMARY KEY NOT NULL,
          version_id TEXT NOT NULL,
          language TEXT NOT NULL,
          book_id TEXT NOT NULL,
          chapter_number INTEGER NOT NULL,
          verse_number INTEGER NOT NULL,
          text TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (version_id) REFERENCES original_language_versions(id) ON DELETE CASCADE,
          FOREIGN KEY (book_id) REFERENCES bible_books(id) ON DELETE CASCADE,
          UNIQUE (version_id, book_id, chapter_number, verse_number)
        );

        CREATE INDEX IF NOT EXISTS idx_original_language_verses_reference
          ON original_language_verses(book_id, chapter_number, verse_number);
      `);
    },
  },
  {
    id: 6,
    name: 'create_academic_tools_schema',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS strong_lexicon (
          number TEXT PRIMARY KEY NOT NULL,
          language TEXT NOT NULL,
          root_word TEXT NOT NULL,
          normalized_root_word TEXT NOT NULL,
          transliteration TEXT NOT NULL,
          pronunciation TEXT,
          morphology TEXT,
          definition TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_strong_lexicon_language_root
          ON strong_lexicon(language, normalized_root_word);

        CREATE INDEX IF NOT EXISTS idx_strong_lexicon_transliteration
          ON strong_lexicon(transliteration);
      `);
    },
  },
  {
    id: 7,
    name: 'create_studies_schema',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS study_areas (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS study_categories (
          id TEXT PRIMARY KEY NOT NULL,
          area_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (area_id) REFERENCES study_areas(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_courses (
          id TEXT PRIMARY KEY NOT NULL,
          category_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          level TEXT NOT NULL,
          estimated_minutes INTEGER NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES study_categories(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_modules (
          id TEXT PRIMARY KEY NOT NULL,
          course_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES study_courses(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_lessons (
          id TEXT PRIMARY KEY NOT NULL,
          module_id TEXT NOT NULL,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          content TEXT NOT NULL,
          estimated_minutes INTEGER NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (module_id) REFERENCES study_modules(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_lesson_references (
          id TEXT PRIMARY KEY NOT NULL,
          lesson_id TEXT NOT NULL,
          reference TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (lesson_id) REFERENCES study_lessons(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_course_progress (
          course_id TEXT PRIMARY KEY NOT NULL,
          started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          completed_at TEXT,
          last_activity_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES study_courses(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_lesson_progress (
          lesson_id TEXT PRIMARY KEY NOT NULL,
          course_id TEXT NOT NULL,
          completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (lesson_id) REFERENCES study_lessons(id) ON DELETE CASCADE,
          FOREIGN KEY (course_id) REFERENCES study_courses(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_study_categories_area ON study_categories(area_id, position);
        CREATE INDEX IF NOT EXISTS idx_study_courses_category ON study_courses(category_id, position);
        CREATE INDEX IF NOT EXISTS idx_study_modules_course ON study_modules(course_id, position);
        CREATE INDEX IF NOT EXISTS idx_study_lessons_module ON study_lessons(module_id, position);
        CREATE INDEX IF NOT EXISTS idx_study_lesson_references_lesson
          ON study_lesson_references(lesson_id, position);
        CREATE INDEX IF NOT EXISTS idx_study_lesson_progress_course
          ON study_lesson_progress(course_id);
      `);
    },
  },
  {
    id: 8,
    name: 'create_reading_plans_schema',
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS reading_plans (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          objective TEXT NOT NULL,
          author TEXT NOT NULL,
          category TEXT NOT NULL,
          level TEXT NOT NULL,
          duration_days INTEGER NOT NULL,
          daily_minutes INTEGER NOT NULL,
          language TEXT NOT NULL,
          version TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reading_plan_days (
          id TEXT PRIMARY KEY NOT NULL,
          plan_id TEXT NOT NULL,
          day_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          objective TEXT NOT NULL,
          reflection TEXT NOT NULL,
          prayer TEXT NOT NULL,
          questions_json TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plan_id) REFERENCES reading_plans(id) ON DELETE CASCADE,
          UNIQUE (plan_id, day_number)
        );

        CREATE TABLE IF NOT EXISTS reading_plan_readings (
          id TEXT PRIMARY KEY NOT NULL,
          day_id TEXT NOT NULL,
          reference TEXT NOT NULL,
          position INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (day_id) REFERENCES reading_plan_days(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS reading_plan_progress (
          plan_id TEXT PRIMARY KEY NOT NULL,
          started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          completed_at TEXT,
          last_activity_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plan_id) REFERENCES reading_plans(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS reading_plan_day_progress (
          day_id TEXT PRIMARY KEY NOT NULL,
          plan_id TEXT NOT NULL,
          day_number INTEGER NOT NULL,
          completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (day_id) REFERENCES reading_plan_days(id) ON DELETE CASCADE,
          FOREIGN KEY (plan_id) REFERENCES reading_plans(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_reading_plan_days_plan
          ON reading_plan_days(plan_id, day_number);
        CREATE INDEX IF NOT EXISTS idx_reading_plan_readings_day
          ON reading_plan_readings(day_id, position);
        CREATE INDEX IF NOT EXISTS idx_reading_plan_day_progress_plan
          ON reading_plan_day_progress(plan_id, day_number);
      `);
    },
  },
];

async function ensureMigrationTable(database: SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function runMigrations(database: SQLiteDatabase) {
  await ensureMigrationTable(database);

  for (const migration of migrations) {
    const applied = await database.getFirstAsync<{ id: number }>(
      'SELECT id FROM schema_migrations WHERE id = ? LIMIT 1;',
      [migration.id],
    );

    if (!applied) {
      await migration.up(database);
      await database.runAsync(
        'INSERT INTO schema_migrations (id, name) VALUES (?, ?);',
        [migration.id, migration.name],
      );
    }
  }
}
