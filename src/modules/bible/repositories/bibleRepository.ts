import { getDatabase } from '@/infrastructure/database/database';
import {
  BibleBook,
  BibleChapter,
  BibleSearchResult,
  BibleSearchScope,
  BibleVerse,
  BibleVerseComparison,
  BibleVersion,
  InterlinearWord,
  OriginalLanguageCode,
  OriginalLanguageSearchResult,
  OriginalLanguageVerse,
  ReadingLocation,
  StrongLexiconEntry,
} from '@/modules/bible/types';

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
  highlight_color: string | null;
  id: string;
  is_favorite: number;
  notes_count: number;
  text: string;
  verse_number: number;
  version_id: string;
};

type ReadingHistoryRow = {
  book_id: string;
  chapter_id: string;
  verse_id: string | null;
  version_id: string;
};

type OriginalVerseRow = {
  language: OriginalLanguageCode;
  text: string;
  verse_number: number;
  version_abbreviation: string;
  version_id: string;
};

type OriginalSearchRow = {
  book_id: string;
  book_name: string;
  chapter_number: number;
  language: OriginalLanguageCode;
  text: string;
  verse_number: number;
  version_abbreviation: string;
};

type ComparisonVerseRow = {
  text: string;
  verse_number: number;
  version_abbreviation: string;
  version_id: string;
};

type StrongLexiconRow = {
  definition: string;
  language: OriginalLanguageCode;
  morphology: string | null;
  number: string;
  pronunciation: string | null;
  root_word: string;
  transliteration: string;
};

type SearchVerseRow = VerseRow & {
  match_type: 'book' | 'reference' | 'text';
};

const defaultVersionId = 'por-blivre';
const comparisonVersionId = 'web';
const lastReadingId = 'last-reading';
const defaultCollectionId = 'default-favorites';

export async function getBibleVersions(): Promise<BibleVersion[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    abbreviation: string;
    description: string;
    id: string;
    language: string;
    name: string;
  }>(
    `
      SELECT id, name, abbreviation, language, description
      FROM bible_versions
      WHERE is_offline_available = 1
      ORDER BY CASE WHEN id = ? THEN 0 ELSE 1 END ASC, language ASC, name ASC;
    `,
    [defaultVersionId],
  );

  return rows.map((row) => ({
    abbreviation: row.abbreviation,
    description: row.description,
    id: row.id,
    language: row.language,
    name: row.name,
  }));
}

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

export async function getChapterVerses(
  chapterId: string,
  versionId = defaultVersionId,
): Promise<BibleVerse[]> {
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
        CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
        (
          SELECT highlights.color
          FROM highlights
          WHERE highlights.verse_id = verses.id AND highlights.deleted_at IS NULL
          ORDER BY highlights.updated_at DESC
          LIMIT 1
        ) AS highlight_color,
        (
          SELECT COUNT(*)
          FROM notes
          WHERE notes.verse_id = verses.id AND notes.deleted_at IS NULL
        ) AS notes_count
      FROM bible_verses verses
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      LEFT JOIN favorites ON favorites.verse_id = verses.id AND favorites.deleted_at IS NULL
      WHERE verses.chapter_id = ? AND verses.version_id = ?
      ORDER BY verses.verse_number ASC;
    `,
    [chapterId, versionId],
  );

  return rows.map(mapVerseRow);
}

export async function getChapterOriginalVerses(
  bookId: string,
  chapterNumber: number,
): Promise<OriginalLanguageVerse[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<OriginalVerseRow>(
    `
      SELECT
        verses.version_id,
        versions.abbreviation AS version_abbreviation,
        verses.language,
        verses.verse_number,
        verses.text
      FROM original_language_verses verses
      INNER JOIN original_language_versions versions ON versions.id = verses.version_id
      WHERE verses.book_id = ? AND verses.chapter_number = ?
      ORDER BY verses.verse_number ASC;
    `,
    [bookId, chapterNumber],
  );
  const lexiconByWord = await getLexiconByOriginalWords(
    rows.flatMap((row) => tokenizeOriginalText(row.text).map((word) => ({
      language: getLexiconLanguage(row.language),
      normalized: normalizeOriginalWord(word, row.language),
    }))),
  );

  return rows.map((row) => ({
    interlinearWords: createInterlinearWords(row.text, row.language, lexiconByWord),
    language: row.language,
    languageName: getOriginalLanguageName(row.language),
    text: row.text,
    transliteration: transliterateOriginalText(row.text, row.language),
    verseNumber: row.verse_number,
    versionAbbreviation: row.version_abbreviation,
    versionId: row.version_id,
  }));
}

export async function searchStrongLexicon(query: string): Promise<StrongLexiconEntry[]> {
  const database = await getDatabase();
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const strongNumber = normalizedQuery.toLocaleUpperCase();
  const normalizedWord = normalizeOriginalWord(normalizedQuery, getLanguageFromStrongNumber(strongNumber));
  const rows = await database.getAllAsync<StrongLexiconRow>(
    `
      SELECT
        number,
        language,
        root_word,
        transliteration,
        pronunciation,
        morphology,
        definition
      FROM strong_lexicon
      WHERE number = ?
        OR normalized_root_word = ?
        OR LOWER(transliteration) LIKE ?
      ORDER BY number ASC
      LIMIT 24;
    `,
    [strongNumber, normalizedWord, `%${normalizedQuery.toLocaleLowerCase()}%`],
  );

  return rows.map(mapStrongLexiconRow);
}

export async function searchOriginalLanguageOccurrences(
  query: string,
): Promise<OriginalLanguageSearchResult[]> {
  const database = await getDatabase();
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return [];
  }

  const rows = await database.getAllAsync<OriginalSearchRow>(
    `
      SELECT
        verses.book_id,
        books.name AS book_name,
        verses.chapter_number,
        verses.verse_number,
        verses.language,
        versions.abbreviation AS version_abbreviation,
        verses.text
      FROM original_language_verses verses
      INNER JOIN original_language_versions versions ON versions.id = verses.version_id
      INNER JOIN bible_books books ON books.id = verses.book_id
      WHERE LOWER(verses.text) LIKE ?
      ORDER BY books.position ASC, verses.chapter_number ASC, verses.verse_number ASC
      LIMIT 24;
    `,
    [`%${normalizedQuery.toLocaleLowerCase()}%`],
  );

  return rows.map((row) => ({
    bookId: row.book_id,
    bookName: row.book_name,
    chapterNumber: row.chapter_number,
    language: row.language,
    languageName: getOriginalLanguageName(row.language),
    text: row.text,
    transliteration: transliterateOriginalText(row.text, row.language),
    verseNumber: row.verse_number,
    versionAbbreviation: row.version_abbreviation,
  }));
}

export async function getChapterComparisonVerses(
  chapterId: string,
  selectedVersionId = defaultVersionId,
): Promise<BibleVerseComparison[]> {
  const database = await getDatabase();
  const versionId = selectedVersionId === comparisonVersionId ? defaultVersionId : comparisonVersionId;
  const rows = await database.getAllAsync<ComparisonVerseRow>(
    `
      SELECT
        verses.version_id,
        versions.abbreviation AS version_abbreviation,
        verses.verse_number,
        verses.text
      FROM bible_verses verses
      INNER JOIN bible_versions versions ON versions.id = verses.version_id
      WHERE verses.chapter_id = ? AND verses.version_id = ?
      ORDER BY verses.verse_number ASC;
    `,
    [chapterId, versionId],
  );

  return rows.map((row) => ({
    text: row.text,
    verseNumber: row.verse_number,
    versionAbbreviation: row.version_abbreviation,
    versionId: row.version_id,
  }));
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
        1 AS is_favorite,
        (
          SELECT highlights.color
          FROM highlights
          WHERE highlights.verse_id = verses.id AND highlights.deleted_at IS NULL
          ORDER BY highlights.updated_at DESC
          LIMIT 1
        ) AS highlight_color,
        (
          SELECT COUNT(*)
          FROM notes
          WHERE notes.verse_id = verses.id AND notes.deleted_at IS NULL
        ) AS notes_count
      FROM favorites
      INNER JOIN bible_verses verses ON verses.id = favorites.verse_id
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      WHERE favorites.deleted_at IS NULL AND verses.version_id = ?
      ORDER BY favorites.updated_at DESC, favorites.created_at DESC;
    `,
    [defaultVersionId],
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
    await database.runAsync('INSERT INTO favorites (id, verse_id, collection_id) VALUES (?, ?, ?);', [
      `favorite-${verseId}`,
      verseId,
      defaultCollectionId,
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
    [
      lastReadingId,
      location.versionId ?? defaultVersionId,
      location.bookId,
      location.chapterId,
      location.verseId ?? null,
    ],
  );
}

export async function getLastReading(): Promise<ReadingLocation | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<ReadingHistoryRow>(
    'SELECT version_id, book_id, chapter_id, verse_id FROM reading_history WHERE id = ? LIMIT 1;',
    [lastReadingId],
  );

  if (!row) {
    return null;
  }

  return {
    bookId: row.book_id,
    chapterId: row.chapter_id,
    verseId: row.verse_id ?? undefined,
    versionId: row.version_id,
  };
}

export async function findReference(query: string, versionId = defaultVersionId): Promise<BibleVerse | null> {
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
        CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
        (
          SELECT highlights.color
          FROM highlights
          WHERE highlights.verse_id = verses.id AND highlights.deleted_at IS NULL
          ORDER BY highlights.updated_at DESC
          LIMIT 1
        ) AS highlight_color,
        (
          SELECT COUNT(*)
          FROM notes
          WHERE notes.verse_id = verses.id AND notes.deleted_at IS NULL
        ) AS notes_count
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
      versionId,
      parsed.chapterNumber,
      parsed.verseNumber,
      parsed.book,
      parsed.book,
    ],
  );

  return row ? mapVerseRow(row) : null;
}

export async function searchBible(
  query: string,
  options: { chapterId?: string; limit?: number; scope?: BibleSearchScope; versionId?: string } = {},
): Promise<BibleSearchResult[]> {
  const normalizedQuery = query.trim().replace(/\s+/g, ' ');

  if (normalizedQuery.length < 2) {
    return [];
  }

  const database = await getDatabase();
  const parsed = parseFlexibleReference(normalizedQuery);
  const normalizedText = normalizeSearchText(normalizedQuery);
  const searchText = `%${normalizedText}%`;
  const rawText = `%${normalizedQuery.toLocaleLowerCase()}%`;
  const bookText = `${normalizeSearchText(normalizeBookName(normalizedQuery.toLocaleLowerCase()))}%`;
  const limit = options.limit ?? 24;
  const versionId = options.versionId ?? defaultVersionId;
  const chapterFilter =
    options.scope === 'currentChapter' && options.chapterId ? 'AND verses.chapter_id = ?' : '';
  const chapterParams =
    options.scope === 'currentChapter' && options.chapterId ? [options.chapterId] : [];
  const normalizedBookName = normalizeSql('books.name');
  const normalizedBookAbbreviation = normalizeSql('books.abbreviation');
  const normalizedVerseText = normalizeSql('verses.text');
  const normalizedReferenceText = normalizeSql(
    "books.name || ' ' || chapters.chapter_number || ':' || verses.verse_number",
  );

  if (parsed) {
    const rows = await database.getAllAsync<SearchVerseRow>(
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
          CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
          (
            SELECT highlights.color
            FROM highlights
            WHERE highlights.verse_id = verses.id AND highlights.deleted_at IS NULL
            ORDER BY highlights.updated_at DESC
            LIMIT 1
          ) AS highlight_color,
          (
            SELECT COUNT(*)
            FROM notes
            WHERE notes.verse_id = verses.id AND notes.deleted_at IS NULL
          ) AS notes_count,
          'reference' AS match_type
        FROM bible_verses verses
        INNER JOIN bible_books books ON books.id = verses.book_id
        INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
        LEFT JOIN favorites ON favorites.verse_id = verses.id AND favorites.deleted_at IS NULL
        WHERE verses.version_id = ?
          ${chapterFilter}
          AND chapters.chapter_number = ?
          AND (? IS NULL OR verses.verse_number = ?)
          AND (
            ${normalizedBookName} LIKE ?
            OR ${normalizedBookAbbreviation} LIKE ?
          )
        ORDER BY books.position ASC, chapters.chapter_number ASC, verses.verse_number ASC
        LIMIT ?;
      `,
      [
        versionId,
        ...chapterParams,
        parsed.chapterNumber,
        parsed.verseNumber ?? null,
        parsed.verseNumber ?? null,
        `${normalizeSearchText(parsed.book)}%`,
        `${normalizeSearchText(parsed.book)}%`,
        limit,
      ],
    );

    return rows.map(mapSearchVerseRow);
  }

  const rows = await database.getAllAsync<SearchVerseRow>(
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
        CASE WHEN favorites.id IS NULL THEN 0 ELSE 1 END AS is_favorite,
        (
          SELECT highlights.color
          FROM highlights
          WHERE highlights.verse_id = verses.id AND highlights.deleted_at IS NULL
          ORDER BY highlights.updated_at DESC
          LIMIT 1
        ) AS highlight_color,
        (
          SELECT COUNT(*)
          FROM notes
          WHERE notes.verse_id = verses.id AND notes.deleted_at IS NULL
        ) AS notes_count,
        CASE
          WHEN ${normalizedBookName} LIKE ? OR ${normalizedBookAbbreviation} LIKE ? THEN 'book'
          WHEN ${normalizedReferenceText} LIKE ? THEN 'reference'
          ELSE 'text'
        END AS match_type
      FROM bible_verses verses
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      LEFT JOIN favorites ON favorites.verse_id = verses.id AND favorites.deleted_at IS NULL
      WHERE verses.version_id = ?
        ${chapterFilter}
        AND (
          ${normalizedBookName} LIKE ?
          OR ${normalizedBookAbbreviation} LIKE ?
          OR ${normalizedReferenceText} LIKE ?
          OR ${normalizedVerseText} LIKE ?
          OR LOWER(verses.text) LIKE ?
        )
      ORDER BY
        CASE
          WHEN ${normalizedBookName} LIKE ? OR ${normalizedBookAbbreviation} LIKE ? THEN 0
          WHEN ${normalizedReferenceText} LIKE ? THEN 1
          ELSE 2
        END ASC,
        books.position ASC,
        chapters.chapter_number ASC,
        verses.verse_number ASC
      LIMIT ?;
    `,
    [
      bookText,
      bookText,
      rawText,
      versionId,
      ...chapterParams,
      bookText,
      bookText,
      rawText,
      searchText,
      rawText,
      bookText,
      bookText,
      rawText,
      limit,
    ],
  );

  return rows.map(mapSearchVerseRow);
}

function mapVerseRow(row: VerseRow): BibleVerse {
  return {
    bookAbbreviation: row.book_abbreviation,
    bookId: row.book_id,
    bookName: row.book_name,
    chapterId: row.chapter_id,
    chapterNumber: row.chapter_number,
    highlightColor: row.highlight_color ?? undefined,
    id: row.id,
    isFavorite: row.is_favorite === 1,
    notesCount: row.notes_count,
    text: row.text,
    verseNumber: row.verse_number,
    versionId: row.version_id,
  };
}

function mapSearchVerseRow(row: SearchVerseRow): BibleSearchResult {
  return {
    ...mapVerseRow(row),
    matchType: row.match_type,
  };
}

function getOriginalLanguageName(language: OriginalLanguageCode) {
  if (language === 'grc') {
    return 'Grego koiné';
  }

  if (language === 'arc') {
    return 'Aramaico bíblico';
  }

  return 'Hebraico bíblico';
}

function transliterateOriginalText(text: string, language: OriginalLanguageCode) {
  if (language === 'grc') {
    return transliterateGreek(text);
  }

  return transliterateHebrew(text);
}

async function getLexiconByOriginalWords(
  words: { language: 'grc' | 'he'; normalized: string }[],
): Promise<Map<string, StrongLexiconEntry>> {
  const uniqueWords = Array.from(
    new Map(
      words
        .filter((word) => word.normalized)
        .map((word) => [`${word.language}:${word.normalized}`, word]),
    ).values(),
  );

  if (!uniqueWords.length) {
    return new Map();
  }

  const database = await getDatabase();
  const conditions = uniqueWords.map(() => '(language = ? AND normalized_root_word = ?)').join(' OR ');
  const parameters = uniqueWords.flatMap((word) => [word.language, word.normalized]);
  const rows = await database.getAllAsync<StrongLexiconRow>(
    `
      SELECT
        number,
        language,
        root_word,
        transliteration,
        pronunciation,
        morphology,
        definition
      FROM strong_lexicon
      WHERE ${conditions}
      ORDER BY number ASC;
    `,
    parameters,
  );

  const entries = new Map<string, StrongLexiconEntry>();

  for (const row of rows) {
    const entry = mapStrongLexiconRow(row);
    const key = `${getLexiconLanguage(entry.language)}:${normalizeOriginalWord(entry.rootWord, entry.language)}`;

    if (!entries.has(key)) {
      entries.set(key, entry);
    }
  }

  return entries;
}

function createInterlinearWords(
  text: string,
  language: OriginalLanguageCode,
  lexiconByWord: Map<string, StrongLexiconEntry>,
): InterlinearWord[] {
  return tokenizeOriginalText(text).map((word, index) => {
    const normalized = normalizeOriginalWord(word, language);
    const strong = lexiconByWord.get(`${getLexiconLanguage(language)}:${normalized}`);

    return {
      id: `${index}-${word}`,
      original: word,
      position: index + 1,
      strong,
      transliteration: strong?.transliteration || transliterateOriginalText(word, language),
    };
  });
}

function tokenizeOriginalText(text: string) {
  return text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function normalizeOriginalWord(value: string, language: OriginalLanguageCode) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0591-\u05BD\u05BF\u05C1-\u05C7]/g, '')
    .replace(/[׃׀־.,;:!?()[\]{}"']/g, '')
    .trim()
    .toLocaleLowerCase();

  if (language === 'grc') {
    return normalized.replace(/[᾽ʼ’]/g, '');
  }

  return normalized;
}

function getLexiconLanguage(language: OriginalLanguageCode): 'grc' | 'he' {
  return language === 'grc' ? 'grc' : 'he';
}

function getLanguageFromStrongNumber(value: string): OriginalLanguageCode {
  return value.startsWith('G') ? 'grc' : 'he';
}

function mapStrongLexiconRow(row: StrongLexiconRow): StrongLexiconEntry {
  return {
    definition: row.definition,
    language: row.language,
    morphology: row.morphology ?? undefined,
    number: row.number,
    pronunciation: row.pronunciation ?? undefined,
    rootWord: row.root_word,
    transliteration: row.transliteration,
  };
}

function transliterateHebrew(text: string) {
  const normalized = text.normalize('NFD');
  let output = '';

  for (const character of normalized) {
    if (isHebrewMark(character)) {
      continue;
    }

    output += hebrewTransliteration[character] ?? character;
  }

  return cleanTransliteration(output);
}

function transliterateGreek(text: string) {
  const normalized = text.normalize('NFD');
  let output = '';

  for (const character of normalized) {
    if (isCombiningMark(character)) {
      continue;
    }

    output += greekTransliteration[character] ?? character;
  }

  return cleanTransliteration(output);
}

function isHebrewMark(character: string) {
  const code = character.charCodeAt(0);
  return (code >= 0x0591 && code <= 0x05bd) || code === 0x05bf || (code >= 0x05c1 && code <= 0x05c7);
}

function isCombiningMark(character: string) {
  const code = character.charCodeAt(0);
  return code >= 0x0300 && code <= 0x036f;
}

function cleanTransliteration(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

const hebrewTransliteration: Record<string, string> = {
  'א': "'",
  'ב': 'b',
  'ג': 'g',
  'ד': 'd',
  'ה': 'h',
  'ו': 'w',
  'ז': 'z',
  'ח': 'ch',
  'ט': 't',
  'י': 'y',
  'ך': 'k',
  'כ': 'k',
  'ל': 'l',
  'ם': 'm',
  'מ': 'm',
  'ן': 'n',
  'נ': 'n',
  'ס': 's',
  'ע': "'",
  'ף': 'p',
  'פ': 'p',
  'ץ': 'ts',
  'צ': 'ts',
  'ק': 'q',
  'ר': 'r',
  'ש': 'sh',
  'ת': 't',
  '׃': '',
  '׀': '',
  '־': '-',
};

const greekTransliteration: Record<string, string> = {
  'Α': 'A',
  'α': 'a',
  'Β': 'B',
  'β': 'b',
  'Γ': 'G',
  'γ': 'g',
  'Δ': 'D',
  'δ': 'd',
  'Ε': 'E',
  'ε': 'e',
  'Ζ': 'Z',
  'ζ': 'z',
  'Η': 'E',
  'η': 'e',
  'Θ': 'Th',
  'θ': 'th',
  'Ι': 'I',
  'ι': 'i',
  'Κ': 'K',
  'κ': 'k',
  'Λ': 'L',
  'λ': 'l',
  'Μ': 'M',
  'μ': 'm',
  'Ν': 'N',
  'ν': 'n',
  'Ξ': 'X',
  'ξ': 'x',
  'Ο': 'O',
  'ο': 'o',
  'Π': 'P',
  'π': 'p',
  'Ρ': 'R',
  'ρ': 'r',
  'Σ': 'S',
  'σ': 's',
  'ς': 's',
  'Τ': 'T',
  'τ': 't',
  'Υ': 'Y',
  'υ': 'y',
  'Φ': 'Ph',
  'φ': 'ph',
  'Χ': 'Ch',
  'χ': 'ch',
  'Ψ': 'Ps',
  'ψ': 'ps',
  'Ω': 'O',
  'ω': 'o',
};

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

function parseFlexibleReference(query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ');
  const match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

  if (!match) {
    return null;
  }

  const [, book, chapterNumber, verseNumber] = match;

  if (!book || !chapterNumber) {
    return null;
  }

  return {
    book: normalizeBookName(book),
    chapterNumber: Number(chapterNumber),
    verseNumber: verseNumber ? Number(verseNumber) : undefined,
  };
}

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
}

function normalizeSql(expression: string) {
  return [
    ['á', 'a'],
    ['à', 'a'],
    ['â', 'a'],
    ['ã', 'a'],
    ['é', 'e'],
    ['ê', 'e'],
    ['í', 'i'],
    ['ó', 'o'],
    ['ô', 'o'],
    ['õ', 'o'],
    ['ú', 'u'],
    ['ü', 'u'],
    ['ç', 'c'],
  ].reduce(
    (current, [accented, plain]) => `REPLACE(${current}, '${accented}', '${plain}')`,
    `LOWER(${expression})`,
  );
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
