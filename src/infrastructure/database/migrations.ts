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
