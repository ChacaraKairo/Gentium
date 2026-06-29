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
