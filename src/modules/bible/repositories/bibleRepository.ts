import { getDatabase } from '@/infrastructure/database/database';
import { BibleBook, BibleChapter, BibleVerse, ReadingLocation } from '@/modules/bible/types';

type BookRow = {
  abbreviation: string;
  id: string;
  name: string;
  position: number;
  testament: 'old' | 'new';
};

type ChapterRow = {
  book_id: string;
  chapter_number: number;
  id: string;
};

type VerseRow = {
  book_abbreviation: string;
  book_id: string;
  book_name: string;
  chapter_id: string;
  chapter_number: number;
  id: string;
  is_favorite: number;
  text: string;
  verse_number: number;
  version_id: string;
};

type ReadingHistoryRow = {
  book_id: string;
  chapter_id: string;
  verse_id: string | null;
};

const defaultVersionId = 'por-blivre';
const lastReadingId = 'last-reading';

export async function getBibleBooks(): Promise<BibleBook[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<BookRow>(
    'SELECT id, name, abbreviation, testament, position FROM bible_books ORDER BY position ASC;',
  );

  return rows.map((row) => ({
    abbreviation: row.abbreviation,
    id: row.id,
    name: row.name,
    position: row.position,
    testament: row.testament,
  }));
}

export async function getBibleChapters(bookId: string): Promise<BibleChapter[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<ChapterRow>(
    'SELECT id, book_id, chapter_number FROM bible_chapters WHERE book_id = ? ORDER BY chapter_number ASC;',
    [bookId],
  );

  return rows.map((row) => ({
    bookId: row.book_id,
    chapterNumber: row.chapter_number,
    id: row.id,
  }));
}

export async function getChapterVerses(chapterId: string): Promise<BibleVerse[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<VerseRow>(
    `
      SELECT
        verses.id,
        verses.version_id,
        verses.book_id,
        books.name AS book_name,
        books.abbreviation AS book_abbreviation,
        verses.chapter_id,
        chapters.chapter_number,
        verses.verse_number,
        verses.text,
        CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite
      FROM bible_verses verses
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      LEFT JOIN favorites ON favorites.verse_id = verses.id AND favorites.deleted_at IS NULL
      WHERE verses.chapter_id = ? AND verses.version_id = ?
      ORDER BY verses.verse_number ASC;
    `,
    [chapterId, defaultVersionId],
  );

  return rows.map(mapVerseRow);
}

export async function getFavoriteVerses(): Promise<BibleVerse[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<VerseRow>(
    `
      SELECT
        verses.id,
        verses.version_id,
        verses.book_id,
        books.name AS book_name,
        books.abbreviation AS book_abbreviation,
        verses.chapter_id,
        chapters.chapter_number,
        verses.verse_number,
        verses.text,
        1 AS is_favorite
      FROM favorites
      INNER JOIN bible_verses verses ON verses.id = favorites.verse_id
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      WHERE favorites.deleted_at IS NULL
      ORDER BY favorites.updated_at DESC, favorites.created_at DESC;
    `,
  );

  return rows.map(mapVerseRow);
}

export async function toggleFavorite(verseId: string): Promise<boolean> {
  const database = await getDatabase();
  const favorite = await database.getFirstAsync<{ id: string; deleted_at: string | null }>(
    'SELECT id, deleted_at FROM favorites WHERE verse_id = ? LIMIT 1;',
    [verseId],
  );

  if (!favorite) {
    await database.runAsync('INSERT INTO favorites (id, verse_id) VALUES (?, ?);', [
      `favorite-${verseId}`,
      verseId,
    ]);
    return true;
  }

  if (favorite.deleted_at) {
    await database.runAsync(
      'UPDATE favorites SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
      [favorite.id],
    );
    return true;
  }

  await database.runAsync(
    'UPDATE favorites SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
    [favorite.id],
  );
  return false;
}

export async function saveLastReading(location: ReadingLocation) {
  const database = await getDatabase();

  await database.runAsync(
    `
      INSERT INTO reading_history (id, version_id, book_id, chapter_id, verse_id, last_read_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        version_id = excluded.version_id,
        book_id = excluded.book_id,
        chapter_id = excluded.chapter_id,
        verse_id = excluded.verse_id,
        last_read_at = CURRENT_TIMESTAMP;
    `,
    [lastReadingId, defaultVersionId, location.bookId, location.chapterId, location.verseId ?? null],
  );
}

export async function getLastReading(): Promise<ReadingLocation | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<ReadingHistoryRow>(
    'SELECT book_id, chapter_id, verse_id FROM reading_history WHERE id = ? LIMIT 1;',
    [lastReadingId],
  );

  if (!row) {
    return null;
  }

  return {
    bookId: row.book_id,
    chapterId: row.chapter_id,
    verseId: row.verse_id ?? undefined,
  };
}

export async function findReference(query: string): Promise<BibleVerse | null> {
  const parsed = parseReference(query);

  if (!parsed) {
    return null;
  }

  const database = await getDatabase();
  const row = await database.getFirstAsync<VerseRow>(
    `
      SELECT
        verses.id,
        verses.version_id,
        verses.book_id,
        books.name AS book_name,
        books.abbreviation AS book_abbreviation,
        verses.chapter_id,
        chapters.chapter_number,
        verses.verse_number,
        verses.text,
        CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite
      FROM bible_verses verses
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      LEFT JOIN favorites ON favorites.verse_id = verses.id AND favorites.deleted_at IS NULL
      WHERE verses.version_id = ?
        AND chapters.chapter_number = ?
        AND verses.verse_number = ?
        AND (
          LOWER(books.name) = ?
          OR LOWER(books.abbreviation) = ?
        )
      LIMIT 1;
    `,
    [
      defaultVersionId,
      parsed.chapterNumber,
      parsed.verseNumber,
      parsed.book,
      parsed.book,
    ],
  );

  return row ? mapVerseRow(row) : null;
}

function mapVerseRow(row: VerseRow): BibleVerse {
  return {
    bookAbbreviation: row.book_abbreviation,
    bookId: row.book_id,
    bookName: row.book_name,
    chapterId: row.chapter_id,
    chapterNumber: row.chapter_number,
    id: row.id,
    isFavorite: row.is_favorite === 1,
    text: row.text,
    verseNumber: row.verse_number,
    versionId: row.version_id,
  };
}

function parseReference(query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ');
  const match = normalized.match(/^(.+?)\s+(\d+):(\d+)$/);

  if (!match) {
    return null;
  }

  const [, book, chapterNumber, verseNumber] = match;

  if (!book || !chapterNumber || !verseNumber) {
    return null;
  }

  return {
    book: normalizeBookName(book),
    chapterNumber: Number(chapterNumber),
    verseNumber: Number(verseNumber),
  };
}

function normalizeBookName(book: string) {
  const aliases: Record<string, string> = {
    genesis: 'gênesis',
    gen: 'gênesis',
    gn: 'gênesis',
    gênesis: 'gênesis',
    john: 'joão',
    jn: 'joão',
    jo: 'joão',
    joao: 'joão',
    'joão': 'joão',
    ps: 'salmos',
    psa: 'salmos',
    psalm: 'salmos',
    psalms: 'salmos',
    salmo: 'salmos',
    salmos: 'salmos',
  };

  return aliases[book] ?? book;
}
