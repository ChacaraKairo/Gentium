import { Share } from 'react-native';

import { getDatabase } from '@/infrastructure/database/database';
import {
  CreateHighlightInput,
  CreateNoteInput,
  FavoriteCollection,
  StudyNote,
  VerseHighlight,
} from '@/modules/notes/types';

type NoteRow = {
  category_name: string | null;
  content: string;
  created_at: string;
  id: string;
  reference: string | null;
  tags: string | null;
  title: string;
  updated_at: string;
  verse_id: string | null;
};

type HighlightRow = {
  category_name: string | null;
  color: string;
  created_at: string;
  id: string;
  note: string | null;
  reference: string;
  tags: string | null;
  verse_id: string;
};

type CollectionRow = {
  id: string;
  name: string;
};

export const highlightColors = ['#FACC15', '#22C55E', '#3B82F6', '#EF4444', '#B88A44'] as const;

export async function createStudyNote(input: CreateNoteInput) {
  const database = await getDatabase();
  const now = Date.now();
  const noteId = `note-${now}`;
  const categoryId = input.categoryName
    ? await ensureCategory(input.categoryName, 'note', '#B88A44')
    : 'note-general';
  const tags = parseTags(input.tags);

  await database.withTransactionAsync(async () => {
    await database.runAsync(
      `
        INSERT INTO notes (id, verse_id, title, content, category_id)
        VALUES (?, ?, ?, ?, ?);
      `,
      [noteId, input.verseId ?? null, input.title.trim(), input.content.trim(), categoryId],
    );

    for (const tag of tags) {
      const tagId = await ensureTag(tag);
      await database.runAsync('INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?);', [
        noteId,
        tagId,
      ]);
    }
  });
}

export async function createVerseHighlight(input: CreateHighlightInput) {
  const database = await getDatabase();
  const highlightId = `highlight-${Date.now()}-${input.verseId}`;
  const categoryId = input.categoryName
    ? await ensureCategory(input.categoryName, 'highlight', input.color)
    : 'highlight-study';
  const tags = parseTags(input.tags);

  await database.withTransactionAsync(async () => {
    await database.runAsync(
      `
        INSERT INTO highlights (id, verse_id, color, category_id, note)
        VALUES (?, ?, ?, ?, ?);
      `,
      [highlightId, input.verseId, input.color, categoryId, input.note?.trim() || null],
    );

    for (const tag of tags) {
      const tagId = await ensureTag(tag);
      await database.runAsync(
        'INSERT OR IGNORE INTO highlight_tags (highlight_id, tag_id) VALUES (?, ?);',
        [highlightId, tagId],
      );
    }
  });
}

export async function getStudyNotes(search = ''): Promise<StudyNote[]> {
  const database = await getDatabase();
  const term = `%${search.trim().toLowerCase()}%`;
  const rows = await database.getAllAsync<NoteRow>(
    `
      SELECT
        notes.id,
        notes.verse_id,
        notes.title,
        notes.content,
        notes.created_at,
        notes.updated_at,
        categories.name AS category_name,
        CASE
          WHEN verses.id IS NULL THEN NULL
          ELSE books.name || ' ' || chapters.chapter_number || ':' || verses.verse_number
        END AS reference,
        GROUP_CONCAT(tags.name, ', ') AS tags
      FROM notes
      LEFT JOIN categories ON categories.id = notes.category_id
      LEFT JOIN bible_verses verses ON verses.id = notes.verse_id
      LEFT JOIN bible_books books ON books.id = verses.book_id
      LEFT JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      LEFT JOIN note_tags ON note_tags.note_id = notes.id
      LEFT JOIN tags ON tags.id = note_tags.tag_id AND tags.deleted_at IS NULL
      WHERE notes.deleted_at IS NULL
        AND (
          ? = '%%'
          OR LOWER(notes.title) LIKE ?
          OR LOWER(notes.content) LIKE ?
          OR LOWER(COALESCE(categories.name, '')) LIKE ?
          OR LOWER(COALESCE(tags.name, '')) LIKE ?
        )
      GROUP BY notes.id
      ORDER BY notes.updated_at DESC;
    `,
    [term, term, term, term, term],
  );

  return rows.map(mapNote);
}

export async function getVerseHighlights(): Promise<VerseHighlight[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<HighlightRow>(
    `
      SELECT
        highlights.id,
        highlights.verse_id,
        highlights.color,
        highlights.note,
        highlights.created_at,
        categories.name AS category_name,
        books.name || ' ' || chapters.chapter_number || ':' || verses.verse_number AS reference,
        GROUP_CONCAT(tags.name, ', ') AS tags
      FROM highlights
      INNER JOIN bible_verses verses ON verses.id = highlights.verse_id
      INNER JOIN bible_books books ON books.id = verses.book_id
      INNER JOIN bible_chapters chapters ON chapters.id = verses.chapter_id
      LEFT JOIN categories ON categories.id = highlights.category_id
      LEFT JOIN highlight_tags ON highlight_tags.highlight_id = highlights.id
      LEFT JOIN tags ON tags.id = highlight_tags.tag_id AND tags.deleted_at IS NULL
      WHERE highlights.deleted_at IS NULL
      GROUP BY highlights.id
      ORDER BY highlights.updated_at DESC;
    `,
  );

  return rows.map(mapHighlight);
}

export async function getFavoriteCollections(): Promise<FavoriteCollection[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<CollectionRow>(
    'SELECT id, name FROM collections WHERE deleted_at IS NULL ORDER BY created_at ASC;',
  );

  return rows.map((row) => ({ id: row.id, name: row.name }));
}

export async function createFavoriteCollection(name: string) {
  const normalized = name.trim();

  if (!normalized) {
    return;
  }

  const database = await getDatabase();
  await database.runAsync('INSERT INTO collections (id, name) VALUES (?, ?);', [
    `collection-${Date.now()}`,
    normalized,
  ]);
}

export async function exportPersonalData() {
  const [notes, highlights, collections] = await Promise.all([
    getStudyNotes(),
    getVerseHighlights(),
    getFavoriteCollections(),
  ]);

  await Share.share({
    message: JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        highlights,
        collections,
        notes,
      },
      null,
      2,
    ),
  });
}

async function ensureCategory(name: string, scope: 'note' | 'highlight', color: string) {
  const database = await getDatabase();
  const normalized = name.trim() || (scope === 'note' ? 'Geral' : 'Estudo');
  const existing = await database.getFirstAsync<{ id: string }>(
    'SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND scope = ? AND deleted_at IS NULL LIMIT 1;',
    [normalized, scope],
  );

  if (existing) {
    return existing.id;
  }

  const id = `${scope}-category-${Date.now()}-${normalized.toLowerCase().replace(/\s+/g, '-')}`;
  await database.runAsync('INSERT INTO categories (id, name, scope, color) VALUES (?, ?, ?, ?);', [
    id,
    normalized,
    scope,
    color,
  ]);
  return id;
}

async function ensureTag(name: string) {
  const database = await getDatabase();
  const normalized = name.trim();
  const existing = await database.getFirstAsync<{ id: string }>(
    'SELECT id FROM tags WHERE LOWER(name) = LOWER(?) AND deleted_at IS NULL LIMIT 1;',
    [normalized],
  );

  if (existing) {
    return existing.id;
  }

  const id = `tag-${Date.now()}-${normalized.toLowerCase().replace(/\s+/g, '-')}`;
  await database.runAsync('INSERT INTO tags (id, name) VALUES (?, ?);', [id, normalized]);
  return id;
}

function parseTags(value = '') {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapNote(row: NoteRow): StudyNote {
  return {
    categoryName: row.category_name ?? undefined,
    content: row.content,
    createdAt: row.created_at,
    id: row.id,
    reference: row.reference ?? undefined,
    tags: row.tags ? row.tags.split(', ').filter(Boolean) : [],
    title: row.title,
    updatedAt: row.updated_at,
    verseId: row.verse_id ?? undefined,
  };
}

function mapHighlight(row: HighlightRow): VerseHighlight {
  return {
    categoryName: row.category_name ?? undefined,
    color: row.color,
    createdAt: row.created_at,
    id: row.id,
    note: row.note ?? undefined,
    reference: row.reference,
    tags: row.tags ? row.tags.split(', ').filter(Boolean) : [],
    verseId: row.verse_id,
  };
}
