export type AdvancedLibrarySection =
  | 'commentaries'
  | 'crossReferences'
  | 'dictionary'
  | 'genealogies'
  | 'maps'
  | 'parallels'
  | 'timelines';

export type AdvancedLibrarySectionSummary = {
  count: number;
  id: AdvancedLibrarySection;
  titleKey: string;
};

export type Commentary = {
  author: string;
  content: string;
  id: string;
  reference: string;
  title: string;
};

export type DictionaryEntry = {
  category: string;
  definition: string;
  id: string;
  references: string[];
  term: string;
};

export type CrossReference = {
  id: string;
  note: string;
  sourceReference: string;
  targetReference: string;
  title: string;
};

export type GospelParallel = {
  id: string;
  references: string[];
  summary: string;
  title: string;
};

export type BibleMap = {
  description: string;
  id: string;
  places: string[];
  references: string[];
  region: string;
  title: string;
};

export type BibleTimeline = {
  events: string[];
  id: string;
  period: string;
  references: string[];
  summary: string;
  title: string;
};

export type BibleGenealogy = {
  id: string;
  people: string[];
  references: string[];
  summary: string;
  title: string;
};

export type AdvancedLibraryItems = {
  commentaries: Commentary[];
  crossReferences: CrossReference[];
  dictionary: DictionaryEntry[];
  genealogies: BibleGenealogy[];
  maps: BibleMap[];
  parallels: GospelParallel[];
  timelines: BibleTimeline[];
};
