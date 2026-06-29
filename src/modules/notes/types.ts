export type PersonalCategory = {
  color?: string;
  id: string;
  name: string;
  scope: 'note' | 'highlight';
};

export type PersonalTag = {
  id: string;
  name: string;
};

export type FavoriteCollection = {
  id: string;
  name: string;
};

export type StudyNote = {
  categoryName?: string;
  content: string;
  createdAt: string;
  id: string;
  reference?: string;
  tags: string[];
  title: string;
  updatedAt: string;
  verseId?: string;
};

export type VerseHighlight = {
  categoryName?: string;
  color: string;
  createdAt: string;
  id: string;
  note?: string;
  reference: string;
  tags: string[];
  verseId: string;
};

export type CreateNoteInput = {
  categoryName?: string;
  content: string;
  tags?: string;
  title: string;
  verseId?: string;
};

export type CreateHighlightInput = {
  categoryName?: string;
  color: string;
  note?: string;
  tags?: string;
  verseId: string;
};
