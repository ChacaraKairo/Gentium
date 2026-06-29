import { useCallback, useEffect, useState } from 'react';
import { Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  findReference,
  getBibleBooks,
  getBibleChapters,
  getChapterComparisonVerses,
  getChapterOriginalVerses,
  getChapterVerses,
  getFavoriteVerses,
  getLastReading,
  saveLastReading,
  searchStrongLexicon,
  toggleFavorite,
} from '@/modules/bible/repositories/bibleRepository';
import {
  BibleBook,
  BibleChapter,
  BibleVerse,
  BibleVerseComparison,
  InterlinearWord,
  OriginalLanguageVerse,
  StrongLexiconEntry,
} from '@/modules/bible/types';
import {
  createStudyNote,
  createVerseHighlight,
  highlightColors,
} from '@/modules/notes/repositories/personalRepository';
import { AppText, BaseCard, Button, IconButton, ListItem, TextInput } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function BibleScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [originalVerses, setOriginalVerses] = useState<OriginalLanguageVerse[]>([]);
  const [comparisonVerses, setComparisonVerses] = useState<BibleVerseComparison[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<BibleVerse[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [hasLastReading, setHasLastReading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState('');
  const [strongQuery, setStrongQuery] = useState('');
  const [strongResults, setStrongResults] = useState<StrongLexiconEntry[]>([]);
  const [activeNoteVerseId, setActiveNoteVerseId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [selectedAcademicWord, setSelectedAcademicWord] = useState<InterlinearWord | null>(null);
  const [readingMode, setReadingMode] = useState<'comparison' | 'original' | 'translation'>(
    'translation',
  );

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [bookRows, favoriteRows, lastReading] = await Promise.all([
        getBibleBooks(),
        getFavoriteVerses(),
        getLastReading(),
      ]);
      setBooks(bookRows);
      setFavoriteVerses(favoriteRows);
      setHasLastReading(Boolean(lastReading));
    } catch {
      setError(t('bible.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const openBook = useCallback(
    async (book: BibleBook) => {
      setIsLoading(true);
      setError(null);

      try {
        const chapterRows = await getBibleChapters(book.id);
        setSelectedBook(book);
        setSelectedChapter(null);
        setVerses([]);
        setOriginalVerses([]);
        setComparisonVerses([]);
        setSelectedAcademicWord(null);
        setChapters(chapterRows);
      } catch {
        setError(t('bible.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const openChapter = useCallback(
    async (book: BibleBook, chapter: BibleChapter) => {
      setIsLoading(true);
      setError(null);

      try {
        const [verseRows, originalRows, comparisonRows] = await Promise.all([
          getChapterVerses(chapter.id),
          getChapterOriginalVerses(book.id, chapter.chapterNumber),
          getChapterComparisonVerses(chapter.id),
        ]);
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setVerses(verseRows);
        setOriginalVerses(originalRows);
        setComparisonVerses(comparisonRows);
        setSelectedAcademicWord(null);
        await saveLastReading({ bookId: book.id, chapterId: chapter.id });
        setHasLastReading(true);
      } catch {
        setError(t('bible.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const continueReading = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const lastReading = await getLastReading();

      if (!lastReading) {
        setIsLoading(false);
        return;
      }

      const book = books.find((item) => item.id === lastReading.bookId);

      if (!book) {
        setIsLoading(false);
        return;
      }

      const chapterRows = await getBibleChapters(book.id);
      const chapter = chapterRows.find((item) => item.id === lastReading.chapterId);

      if (!chapter) {
        setIsLoading(false);
        return;
      }

      setChapters(chapterRows);
      await openChapter(book, chapter);
    } catch {
      setError(t('bible.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [books, openChapter, t]);

  const searchReference = useCallback(async () => {
    if (!reference.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verse = await findReference(reference);

      if (!verse) {
        setError(t('bible.errors.referenceNotFound'));
        return;
      }

      const book = books.find((item) => item.id === verse.bookId);

      if (!book) {
        setError(t('bible.errors.referenceNotFound'));
        return;
      }

      const chapterRows = await getBibleChapters(book.id);
      const chapter = chapterRows.find((item) => item.id === verse.chapterId);

      if (!chapter) {
        setError(t('bible.errors.referenceNotFound'));
        return;
      }

      setChapters(chapterRows);
      await openChapter(book, chapter);
    } catch {
      setError(t('bible.errors.referenceNotFound'));
    } finally {
      setIsLoading(false);
    }
  }, [books, openChapter, reference, t]);

  const toggleVerseFavorite = useCallback(
    async (verse: BibleVerse) => {
      const isFavorite = await toggleFavorite(verse.id);
      setVerses((current) =>
        current.map((item) => (item.id === verse.id ? { ...item, isFavorite } : item)),
      );
      setFavoriteVerses(await getFavoriteVerses());
    },
    [],
  );

  const saveVerseNote = useCallback(
    async (verse: BibleVerse) => {
      if (!noteContent.trim()) {
        return;
      }

      await createStudyNote({
        categoryName: t('notes.defaultCategory'),
        content: noteContent,
        tags: noteTags,
        title: formatReference(verse),
        verseId: verse.id,
      });
      setVerses((current) =>
        current.map((item) =>
          item.id === verse.id ? { ...item, notesCount: item.notesCount + 1 } : item,
        ),
      );
      setActiveNoteVerseId(null);
      setNoteContent('');
      setNoteTags('');
    },
    [noteContent, noteTags, t],
  );

  const markVerse = useCallback(async (verse: BibleVerse, color: string) => {
    await createVerseHighlight({
      categoryName: t('notes.highlightCategory'),
      color,
      verseId: verse.id,
    });
    setVerses((current) =>
      current.map((item) => (item.id === verse.id ? { ...item, highlightColor: color } : item)),
    );
  }, [t]);

  const shareVerse = useCallback(async (verse: BibleVerse) => {
    await Share.share({
      message: `${formatReference(verse)}\n${verse.text}`,
    });
  }, []);

  const searchStrong = useCallback(async () => {
    if (!strongQuery.trim()) {
      setStrongResults([]);
      return;
    }

    setStrongResults(await searchStrongLexicon(strongQuery));
  }, [strongQuery]);

  const goBack = useCallback(() => {
    if (selectedChapter) {
      setSelectedChapter(null);
      setVerses([]);
      setOriginalVerses([]);
      setComparisonVerses([]);
      setSelectedAcademicWord(null);
      return;
    }

    if (selectedBook) {
      setSelectedBook(null);
      setChapters([]);
    }
  }, [selectedBook, selectedChapter]);

  return (
    <Screen subtitle={t('bible.subtitle')} title={t('bible.title')}>
      <BaseCard style={{ gap: theme.spacing.md }}>
        <TextInput
          accessibilityLabel={t('bible.search.referenceLabel')}
          autoCapitalize="words"
          onChangeText={setReference}
          onSubmitEditing={searchReference}
          placeholder={t('bible.search.placeholder')}
          returnKeyType="search"
          value={reference}
        />
        <Button
          isLoading={isLoading && Boolean(reference.trim())}
          label={t('bible.search.action')}
          onPress={searchReference}
          variant="secondary"
        />
      </BaseCard>

      {error ? (
        <BaseCard>
          <AppText color="danger">{error}</AppText>
        </BaseCard>
      ) : null}

      {!selectedBook && hasLastReading ? (
        <Button label={t('bible.continueReading')} onPress={continueReading} />
      ) : null}

      {!selectedBook && favoriteVerses.length ? (
        <BaseCard style={{ gap: theme.spacing.md }}>
          <AppText variant="heading">{t('bible.favoritesTitle')}</AppText>
          {favoriteVerses.map((verse) => (
            <ListItem
              description={verse.text}
              icon="heart-outline"
              key={verse.id}
              onPress={async () => {
                const book = books.find((item) => item.id === verse.bookId);

                if (!book) {
                  return;
                }

                const chapterRows = await getBibleChapters(book.id);
                const chapter = chapterRows.find((item) => item.id === verse.chapterId);

                if (chapter) {
                  setChapters(chapterRows);
                  await openChapter(book, chapter);
                }
              }}
              title={formatReference(verse)}
            />
          ))}
        </BaseCard>
      ) : null}

      {selectedBook ? (
        <Button label={t('common.back')} onPress={goBack} variant="ghost" />
      ) : null}

      {isLoading && !verses.length ? (
        <BaseCard>
          <AppText color="textSecondary">{t('common.loading')}</AppText>
        </BaseCard>
      ) : null}

      {!isLoading && !selectedBook
        ? books.map((book) => (
            <ListItem
              description={book.testament === 'old' ? t('bible.oldTestament') : t('bible.newTestament')}
              icon="book-outline"
              key={book.id}
              onPress={() => openBook(book)}
              title={book.name}
            />
          ))
        : null}

      {selectedBook && !selectedChapter
        ? chapters.map((chapter) => (
            <ListItem
              description={selectedBook.name}
              icon="reader-outline"
              key={chapter.id}
              onPress={() => openChapter(selectedBook, chapter)}
              title={t('bible.chapter', { chapter: chapter.chapterNumber })}
            />
          ))
        : null}

      {selectedBook && selectedChapter && verses.length ? (
        <View style={{ gap: theme.spacing.md }}>
          <View style={{ gap: theme.spacing.xs }}>
            <AppText variant="heading">
              {selectedBook.name} {selectedChapter.chapterNumber}
            </AppText>
            <AppText color="textSecondary" variant="caption">
              {t('bible.versionNotice')}
            </AppText>
          </View>

          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText variant="heading">{t('bible.originalLanguages.title')}</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              <Button
                label={t('bible.readingModes.translation')}
                onPress={() => setReadingMode('translation')}
                variant={readingMode === 'translation' ? 'primary' : 'secondary'}
              />
              <Button
                label={t('bible.readingModes.original')}
                onPress={() => setReadingMode('original')}
                variant={readingMode === 'original' ? 'primary' : 'secondary'}
              />
              <Button
                label={t('bible.readingModes.comparison')}
                onPress={() => setReadingMode('comparison')}
                variant={readingMode === 'comparison' ? 'primary' : 'secondary'}
              />
            </View>
            <AppText color="textSecondary" variant="caption">
              {t('bible.originalLanguages.description')}
            </AppText>
          </BaseCard>

          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText variant="heading">{t('bible.academicTools.title')}</AppText>
            <TextInput
              accessibilityLabel={t('bible.academicTools.searchLabel')}
              autoCapitalize="characters"
              onChangeText={setStrongQuery}
              onSubmitEditing={searchStrong}
              placeholder={t('bible.academicTools.searchPlaceholder')}
              returnKeyType="search"
              value={strongQuery}
            />
            <Button label={t('bible.academicTools.searchAction')} onPress={searchStrong} variant="secondary" />
            {strongResults.length ? (
              <View style={{ gap: theme.spacing.sm }}>
                {strongResults.map((entry) => (
                  <StrongEntryPanel entry={entry} key={entry.number} />
                ))}
              </View>
            ) : null}
          </BaseCard>

          {selectedAcademicWord ? (
            <BaseCard style={{ gap: theme.spacing.sm }}>
              <AppText variant="heading">{t('bible.academicTools.wordPanelTitle')}</AppText>
              <SelectedWordPanel word={selectedAcademicWord} />
            </BaseCard>
          ) : null}

          {verses.map((verse) => (
            <BaseCard key={verse.id} style={{ gap: theme.spacing.md }}>
              <AppText color="primary" variant="caption">
                {formatReference(verse)}
              </AppText>
              {verse.highlightColor ? (
                <View
                  accessibilityLabel={t('bible.highlighted')}
                  style={{
                    backgroundColor: verse.highlightColor,
                    borderRadius: theme.radius.pill,
                    height: theme.spacing.xs,
                    width: theme.spacing.xxl,
                  }}
                />
              ) : null}
              <AppText>{verse.text}</AppText>
              {readingMode !== 'translation' ? (
                <OriginalVersePanel
                  originalVerse={originalVerses.find((item) => item.verseNumber === verse.verseNumber)}
                  onSelectWord={setSelectedAcademicWord}
                />
              ) : null}
              {readingMode === 'comparison' ? (
                <ComparisonVersePanel
                  comparisonVerse={comparisonVerses.find(
                    (item) => item.verseNumber === verse.verseNumber,
                  )}
                />
              ) : null}
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <IconButton
                  icon={verse.isFavorite ? 'heart' : 'heart-outline'}
                  label={t('bible.favorite')}
                  onPress={() => toggleVerseFavorite(verse)}
                />
                <IconButton
                  icon="document-text-outline"
                  label={t('bible.note')}
                  onPress={() => setActiveNoteVerseId(activeNoteVerseId === verse.id ? null : verse.id)}
                />
                <IconButton
                  icon="share-social-outline"
                  label={t('bible.share')}
                  onPress={() => shareVerse(verse)}
                />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {highlightColors.map((color) => (
                  <IconButton
                    icon="color-wand-outline"
                    key={color}
                    label={t('bible.highlightWithColor')}
                    onPress={() => markVerse(verse, color)}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
              {verse.notesCount ? (
                <AppText color="textSecondary" variant="caption">
                  {t('bible.notesCount', { count: verse.notesCount })}
                </AppText>
              ) : null}
              {activeNoteVerseId === verse.id ? (
                <View style={{ gap: theme.spacing.sm }}>
                  <TextInput
                    accessibilityLabel={t('notes.content')}
                    multiline
                    onChangeText={setNoteContent}
                    placeholder={t('notes.contentPlaceholder')}
                    value={noteContent}
                  />
                  <TextInput
                    accessibilityLabel={t('notes.tags')}
                    onChangeText={setNoteTags}
                    placeholder={t('notes.tagsPlaceholder')}
                    value={noteTags}
                  />
                  <Button label={t('notes.save')} onPress={() => saveVerseNote(verse)} />
                </View>
              ) : null}
            </BaseCard>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

function formatReference(verse: BibleVerse) {
  return `${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`;
}

function OriginalVersePanel({
  onSelectWord,
  originalVerse,
}: {
  onSelectWord: (word: InterlinearWord) => void;
  originalVerse?: OriginalLanguageVerse;
}) {
  const { t } = useTranslation();
  const theme = useThemeTokens();

  if (!originalVerse) {
    return (
      <View style={{ gap: theme.spacing.xs }}>
        <AppText color="textSecondary" variant="caption">
          {t('bible.originalLanguages.unavailable')}
        </AppText>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText color="primary" variant="caption">
        {t('bible.originalLanguages.originalLabel', {
          language: originalVerse.languageName,
          version: originalVerse.versionAbbreviation,
        })}
      </AppText>
      <AppText>{originalVerse.text}</AppText>
      <AppText color="textSecondary" variant="caption">
        {originalVerse.transliteration}
      </AppText>
      {originalVerse.interlinearWords.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {originalVerse.interlinearWords.map((word) => (
            <Button
              key={word.id}
              label={word.strong ? `${word.original} · ${word.strong.number}` : word.original}
              onPress={() => onSelectWord(word)}
              variant={word.strong ? 'secondary' : 'ghost'}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SelectedWordPanel({ word }: { word: InterlinearWord }) {
  const { t } = useTranslation();

  return (
    <View>
      <AppText color="primary" variant="caption">
        {word.original} · {word.transliteration}
      </AppText>
      {word.strong ? (
        <StrongEntryPanel entry={word.strong} />
      ) : (
        <AppText color="textSecondary" variant="caption">
          {t('bible.academicTools.noStrongMatch')}
        </AppText>
      )}
    </View>
  );
}

function StrongEntryPanel({ entry }: { entry: StrongLexiconEntry }) {
  const { t } = useTranslation();
  const theme = useThemeTokens();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText color="primary" variant="caption">
        {entry.number} · {entry.rootWord} · {entry.transliteration}
      </AppText>
      {entry.pronunciation ? (
        <AppText color="textSecondary" variant="caption">
          {t('bible.academicTools.pronunciation', { pronunciation: entry.pronunciation })}
        </AppText>
      ) : null}
      {entry.morphology ? (
        <AppText color="textSecondary" variant="caption">
          {t('bible.academicTools.morphology', { morphology: entry.morphology })}
        </AppText>
      ) : null}
      <AppText color="textSecondary">{entry.definition}</AppText>
    </View>
  );
}

function ComparisonVersePanel({ comparisonVerse }: { comparisonVerse?: BibleVerseComparison }) {
  const { t } = useTranslation();
  const theme = useThemeTokens();

  if (!comparisonVerse) {
    return null;
  }

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText color="primary" variant="caption">
        {t('bible.comparison.versionLabel', { version: comparisonVerse.versionAbbreviation })}
      </AppText>
      <AppText color="textSecondary">{comparisonVerse.text}</AppText>
    </View>
  );
}
