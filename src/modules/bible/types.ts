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
  id: string;
  isFavorite: boolean;
  text: string;
  verseNumber: number;
  versionId: string;
};

export type ReadingLocation = {
  bookId: string;
  chapterId: string;
  verseId?: string;
};
