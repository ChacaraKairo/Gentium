import { getDatabase } from '@/infrastructure/database/database';

export type BetaDiagnosticItem = {
  count: number;
  id: string;
  labelKey: string;
};

type CountRow = {
  count: number;
};

const diagnostics: { id: string; labelKey: string; tableName: string }[] = [
  { id: 'bible-books', labelKey: 'settings.betaDiagnostics.items.bibleBooks', tableName: 'bible_books' },
  { id: 'bible-verses', labelKey: 'settings.betaDiagnostics.items.bibleVerses', tableName: 'bible_verses' },
  {
    id: 'original-verses',
    labelKey: 'settings.betaDiagnostics.items.originalVerses',
    tableName: 'original_language_verses',
  },
  { id: 'strong-lexicon', labelKey: 'settings.betaDiagnostics.items.strongLexicon', tableName: 'strong_lexicon' },
  { id: 'studies', labelKey: 'settings.betaDiagnostics.items.studyLessons', tableName: 'study_lessons' },
  { id: 'reading-plans', labelKey: 'settings.betaDiagnostics.items.readingPlanDays', tableName: 'reading_plan_days' },
  { id: 'advanced-library', labelKey: 'settings.betaDiagnostics.items.advancedResources', tableName: 'bible_commentaries' },
];

export async function getBetaDiagnostics(): Promise<BetaDiagnosticItem[]> {
  return Promise.all(
    diagnostics.map(async (item) => ({
      count: await countRows(item.tableName),
      id: item.id,
      labelKey: item.labelKey,
    })),
  );
}

async function countRows(tableName: string) {
  const database = await getDatabase();
  const row = await database.getFirstAsync<CountRow>(`SELECT COUNT(*) AS count FROM ${tableName};`);
  return row?.count ?? 0;
}
