export type BibleVersion = {
  abbreviation: string;
  description: string;
  id: string;
  language: string;
  name: string;
};

export type BibleBook = {
  abbreviation: string;
  id: string;
  name: string;
  position: number;
  testament: 'old' | 'new';
};

export type BibleChapter = {
  bookId: string;
  chapterNumber: number;
  id: string;
};

export type BibleVerse = {
  bookAbbreviation: string;
  bookId: string;
  bookName: string;
  chapterId: string;
  chapterNumber: number;
  highlightColor?: string;
  id: string;
  isFavorite: boolean;
  notesCount: number;
  text: string;
  verseNumber: number;
  versionId: string;
};

export type OriginalLanguageCode = 'arc' | 'grc' | 'he';

export type OriginalLanguageVerse = {
  interlinearWords: InterlinearWord[];
  language: OriginalLanguageCode;
  languageName: string;
  text: string;
  transliteration: string;
  verseNumber: number;
  versionAbbreviation: string;
  versionId: string;
};

export type StrongLexiconEntry = {
  definition: string;
  language: OriginalLanguageCode;
  morphology?: string;
  number: string;
  pronunciation?: string;
  rootWord: string;
  transliteration: string;
};

export type InterlinearWord = {
  id: string;
  original: string;
  position: number;
  strong?: StrongLexiconEntry;
  transliteration: string;
};

export type BibleVerseComparison = {
  text: string;
  verseNumber: number;
  versionAbbreviation: string;
  versionId: string;
};

export type ReadingLocation = {
  bookId: string;
  chapterId: string;
  verseId?: string;
};
