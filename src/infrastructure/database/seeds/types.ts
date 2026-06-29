export type BibleSeedVerse = {
  text: string;
  verse: number;
};

export type BibleSeedChapter = {
  chapter: number;
  verses: BibleSeedVerse[];
};

export type BibleSeedBook = {
  chapters: BibleSeedChapter[];
  name: string;
};

export type BibleSeed = {
  books: BibleSeedBook[];
  translation: string;
};

export type BibleVersionSeed = {
  abbreviation: string;
  description: string;
  id: string;
  language: string;
  name: string;
};

export type BibleVerseSeed = {
  bookId: string;
  chapter: number;
  text: string;
  verse: number;
  versionId: string;
};

export type BibleVersionPackageSeed = {
  verses: BibleVerseSeed[];
  versions: BibleVersionSeed[];
};

export type OriginalLanguageVerseSeed = BibleVerseSeed & {
  language: 'arc' | 'grc' | 'he';
};

export type OriginalLanguagePackageSeed = {
  verses: OriginalLanguageVerseSeed[];
  versions: BibleVersionSeed[];
};

export type StrongLexiconEntrySeed = {
  definition: string;
  language: 'grc' | 'he';
  morphology: string;
  number: string;
  pronunciation: string;
  rootWord: string;
  transliteration: string;
};

export type StrongLexiconPackageSeed = {
  entries: StrongLexiconEntrySeed[];
};

export type StudyLessonSeed = {
  content: string;
  estimatedMinutes: number;
  id: string;
  position: number;
  references: string[];
  summary: string;
  title: string;
};

export type StudyModuleSeed = {
  description: string;
  id: string;
  lessons: StudyLessonSeed[];
  position: number;
  title: string;
};

export type StudyCourseSeed = {
  description: string;
  estimatedMinutes: number;
  id: string;
  level: 'advanced' | 'beginner' | 'intermediate';
  modules: StudyModuleSeed[];
  position: number;
  title: string;
};

export type StudyCategorySeed = {
  courses: StudyCourseSeed[];
  description: string;
  id: string;
  position: number;
  title: string;
};

export type StudyAreaSeed = {
  categories: StudyCategorySeed[];
  description: string;
  id: string;
  position: number;
  title: string;
};

export type StudiesLibrarySeed = {
  areas: StudyAreaSeed[];
};

export type ReadingPlanDaySeed = {
  dayNumber: number;
  objective: string;
  prayer: string;
  questions: string[];
  readings: string[];
  reflection: string;
  title: string;
};

export type ReadingPlanSeed = {
  author: string;
  category: string;
  dailyMinutes: number;
  days: ReadingPlanDaySeed[];
  description: string;
  durationDays: number;
  id: string;
  language: string;
  level: 'advanced' | 'beginner' | 'intermediate';
  objective: string;
  position: number;
  title: string;
  version: string;
};

export type ReadingPlansSeed = {
  plans: ReadingPlanSeed[];
};

export type CommentarySeed = {
  author: string;
  content: string;
  id: string;
  position: number;
  reference: string;
  title: string;
};

export type DictionaryEntrySeed = {
  category: string;
  definition: string;
  id: string;
  position: number;
  references: string[];
  term: string;
};

export type CrossReferenceSeed = {
  id: string;
  note: string;
  position: number;
  sourceReference: string;
  targetReference: string;
  title: string;
};

export type GospelParallelSeed = {
  id: string;
  position: number;
  references: string[];
  summary: string;
  title: string;
};

export type BibleMapSeed = {
  description: string;
  id: string;
  places: string[];
  position: number;
  references: string[];
  region: string;
  title: string;
};

export type BibleTimelineSeed = {
  events: string[];
  id: string;
  period: string;
  position: number;
  references: string[];
  summary: string;
  title: string;
};

export type BibleGenealogySeed = {
  id: string;
  people: string[];
  position: number;
  references: string[];
  summary: string;
  title: string;
};

export type AdvancedLibrarySeed = {
  commentaries: CommentarySeed[];
  crossReferences: CrossReferenceSeed[];
  dictionaryEntries: DictionaryEntrySeed[];
  genealogies: BibleGenealogySeed[];
  gospelParallels: GospelParallelSeed[];
  maps: BibleMapSeed[];
  timelines: BibleTimelineSeed[];
};
