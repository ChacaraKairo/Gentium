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
