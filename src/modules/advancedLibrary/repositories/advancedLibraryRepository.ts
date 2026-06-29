import { getDatabase } from '@/infrastructure/database/database';
import {
  AdvancedLibraryItems,
  AdvancedLibrarySection,
  AdvancedLibrarySectionSummary,
  BibleGenealogy,
  BibleMap,
  BibleTimeline,
  Commentary,
  CrossReference,
  DictionaryEntry,
  GospelParallel,
} from '@/modules/advancedLibrary/types';

type CountRow = { count: number };

type CommentaryRow = {
  author: string;
  content: string;
  id: string;
  reference: string;
  title: string;
};

type DictionaryRow = {
  category: string;
  definition: string;
  id: string;
  references_json: string;
  term: string;
};

type CrossReferenceRow = {
  id: string;
  note: string;
  source_reference: string;
  target_reference: string;
  title: string;
};

type JsonReferenceRow = {
  id: string;
  references_json: string;
  summary: string;
  title: string;
};

type MapRow = JsonReferenceRow & {
  description: string;
  places_json: string;
  region: string;
};

type TimelineRow = JsonReferenceRow & {
  events_json: string;
  period: string;
};

type GenealogyRow = JsonReferenceRow & {
  people_json: string;
};

export async function getAdvancedLibrarySections(): Promise<AdvancedLibrarySectionSummary[]> {
  const database = await getDatabase();
  const [
    commentaries,
    dictionary,
    crossReferences,
    parallels,
    maps,
    timelines,
    genealogies,
  ] = await Promise.all([
    countRows('bible_commentaries'),
    countRows('bible_dictionary_entries'),
    countRows('bible_cross_references'),
    countRows('gospel_parallels'),
    countRows('bible_maps'),
    countRows('bible_timelines'),
    countRows('bible_genealogies'),
  ]);

  await database.execAsync('SELECT 1;');

  return [
    { count: commentaries, id: 'commentaries', titleKey: 'advancedLibrary.sections.commentaries' },
    { count: dictionary, id: 'dictionary', titleKey: 'advancedLibrary.sections.dictionary' },
    { count: crossReferences, id: 'crossReferences', titleKey: 'advancedLibrary.sections.crossReferences' },
    { count: parallels, id: 'parallels', titleKey: 'advancedLibrary.sections.parallels' },
    { count: maps, id: 'maps', titleKey: 'advancedLibrary.sections.maps' },
    { count: timelines, id: 'timelines', titleKey: 'advancedLibrary.sections.timelines' },
    { count: genealogies, id: 'genealogies', titleKey: 'advancedLibrary.sections.genealogies' },
  ];
}

export async function getAdvancedLibraryItems(section: AdvancedLibrarySection): Promise<AdvancedLibraryItems[typeof section]> {
  if (section === 'commentaries') {
    return getCommentaries() as Promise<AdvancedLibraryItems[typeof section]>;
  }

  if (section === 'dictionary') {
    return getDictionaryEntries() as Promise<AdvancedLibraryItems[typeof section]>;
  }

  if (section === 'crossReferences') {
    return getCrossReferences() as Promise<AdvancedLibraryItems[typeof section]>;
  }

  if (section === 'parallels') {
    return getGospelParallels() as Promise<AdvancedLibraryItems[typeof section]>;
  }

  if (section === 'maps') {
    return getBibleMaps() as Promise<AdvancedLibraryItems[typeof section]>;
  }

  if (section === 'timelines') {
    return getBibleTimelines() as Promise<AdvancedLibraryItems[typeof section]>;
  }

  return getBibleGenealogies() as Promise<AdvancedLibraryItems[typeof section]>;
}

export async function findAdvancedLibraryByReference(reference: string): Promise<AdvancedLibraryItems> {
  const query = `%${reference.trim()}%`;

  if (!reference.trim()) {
    return emptyItems();
  }

  const database = await getDatabase();
  const [
    commentaries,
    crossReferences,
    dictionary,
    parallels,
    maps,
    timelines,
    genealogies,
  ] = await Promise.all([
    database.getAllAsync<CommentaryRow>(
      'SELECT id, reference, title, author, content FROM bible_commentaries WHERE reference LIKE ? ORDER BY position ASC;',
      [query],
    ),
    database.getAllAsync<CrossReferenceRow>(
      `
        SELECT id, source_reference, target_reference, title, note
        FROM bible_cross_references
        WHERE source_reference LIKE ? OR target_reference LIKE ?
        ORDER BY position ASC;
      `,
      [query, query],
    ),
    database.getAllAsync<DictionaryRow>(
      `
        SELECT id, term, category, definition, references_json
        FROM bible_dictionary_entries
        WHERE references_json LIKE ?
        ORDER BY position ASC;
      `,
      [query],
    ),
    database.getAllAsync<JsonReferenceRow>(
      'SELECT id, title, summary, references_json FROM gospel_parallels WHERE references_json LIKE ? ORDER BY position ASC;',
      [query],
    ),
    database.getAllAsync<MapRow>(
      `
        SELECT id, title, region, description, places_json, references_json, description AS summary
        FROM bible_maps
        WHERE references_json LIKE ?
        ORDER BY position ASC;
      `,
      [query],
    ),
    database.getAllAsync<TimelineRow>(
      `
        SELECT id, title, period, summary, events_json, references_json
        FROM bible_timelines
        WHERE references_json LIKE ?
        ORDER BY position ASC;
      `,
      [query],
    ),
    database.getAllAsync<GenealogyRow>(
      `
        SELECT id, title, summary, people_json, references_json
        FROM bible_genealogies
        WHERE references_json LIKE ?
        ORDER BY position ASC;
      `,
      [query],
    ),
  ]);

  return {
    commentaries: commentaries.map(mapCommentary),
    crossReferences: crossReferences.map(mapCrossReference),
    dictionary: dictionary.map(mapDictionaryEntry),
    genealogies: genealogies.map(mapGenealogy),
    maps: maps.map(mapMap),
    parallels: parallels.map(mapParallel),
    timelines: timelines.map(mapTimeline),
  };
}

async function countRows(tableName: string) {
  const database = await getDatabase();
  const row = await database.getFirstAsync<CountRow>(`SELECT COUNT(*) AS count FROM ${tableName};`);
  return row?.count ?? 0;
}

async function getCommentaries(): Promise<Commentary[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<CommentaryRow>(
    'SELECT id, reference, title, author, content FROM bible_commentaries ORDER BY position ASC;',
  );
  return rows.map(mapCommentary);
}

async function getDictionaryEntries(): Promise<DictionaryEntry[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<DictionaryRow>(
    'SELECT id, term, category, definition, references_json FROM bible_dictionary_entries ORDER BY position ASC;',
  );
  return rows.map(mapDictionaryEntry);
}

async function getCrossReferences(): Promise<CrossReference[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<CrossReferenceRow>(
    'SELECT id, source_reference, target_reference, title, note FROM bible_cross_references ORDER BY position ASC;',
  );
  return rows.map(mapCrossReference);
}

async function getGospelParallels(): Promise<GospelParallel[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<JsonReferenceRow>(
    'SELECT id, title, summary, references_json FROM gospel_parallels ORDER BY position ASC;',
  );
  return rows.map(mapParallel);
}

async function getBibleMaps(): Promise<BibleMap[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<MapRow>(
    `
      SELECT id, title, region, description, places_json, references_json, description AS summary
      FROM bible_maps
      ORDER BY position ASC;
    `,
  );
  return rows.map(mapMap);
}

async function getBibleTimelines(): Promise<BibleTimeline[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<TimelineRow>(
    'SELECT id, title, period, summary, events_json, references_json FROM bible_timelines ORDER BY position ASC;',
  );
  return rows.map(mapTimeline);
}

async function getBibleGenealogies(): Promise<BibleGenealogy[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<GenealogyRow>(
    'SELECT id, title, summary, people_json, references_json FROM bible_genealogies ORDER BY position ASC;',
  );
  return rows.map(mapGenealogy);
}

function emptyItems(): AdvancedLibraryItems {
  return {
    commentaries: [],
    crossReferences: [],
    dictionary: [],
    genealogies: [],
    maps: [],
    parallels: [],
    timelines: [],
  };
}

function mapCommentary(row: CommentaryRow): Commentary {
  return {
    author: row.author,
    content: row.content,
    id: row.id,
    reference: row.reference,
    title: row.title,
  };
}

function mapDictionaryEntry(row: DictionaryRow): DictionaryEntry {
  return {
    category: row.category,
    definition: row.definition,
    id: row.id,
    references: parseJsonArray(row.references_json),
    term: row.term,
  };
}

function mapCrossReference(row: CrossReferenceRow): CrossReference {
  return {
    id: row.id,
    note: row.note,
    sourceReference: row.source_reference,
    targetReference: row.target_reference,
    title: row.title,
  };
}

function mapParallel(row: JsonReferenceRow): GospelParallel {
  return {
    id: row.id,
    references: parseJsonArray(row.references_json),
    summary: row.summary,
    title: row.title,
  };
}

function mapMap(row: MapRow): BibleMap {
  return {
    description: row.description,
    id: row.id,
    places: parseJsonArray(row.places_json),
    references: parseJsonArray(row.references_json),
    region: row.region,
    title: row.title,
  };
}

function mapTimeline(row: TimelineRow): BibleTimeline {
  return {
    events: parseJsonArray(row.events_json),
    id: row.id,
    period: row.period,
    references: parseJsonArray(row.references_json),
    summary: row.summary,
    title: row.title,
  };
}

function mapGenealogy(row: GenealogyRow): BibleGenealogy {
  return {
    id: row.id,
    people: parseJsonArray(row.people_json),
    references: parseJsonArray(row.references_json),
    summary: row.summary,
    title: row.title,
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
