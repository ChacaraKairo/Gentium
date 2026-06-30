import { useCallback, useEffect, useState } from 'react';
import { Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  findReference,
  getBibleBooks,
  getBibleChapters,
  getBibleVersions,
  getChapterComparisonVerses,
  getChapterOriginalVerses,
  getChapterVerses,
  getFavoriteVerses,
  getLastReading,
  saveLastReading,
  searchBible,
  searchOriginalLanguageOccurrences,
  searchStrongLexicon,
  toggleFavorite,
} from '@/modules/bible/repositories/bibleRepository';
import {
  BibleBook,
  BibleChapter,
  BibleSearchResult,
  BibleSearchScope,
  BibleVerse,
  BibleVerseComparison,
  BibleVersion,
  InterlinearWord,
  OriginalLanguageSearchResult,
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
  const [versions, setVersions] = useState<BibleVersion[]>([]);
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
  const [searchResults, setSearchResults] = useState<BibleSearchResult[]>([]);
  const [searchScope, setSearchScope] = useState<BibleSearchScope>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [strongQuery, setStrongQuery] = useState('');
  const [strongResults, setStrongResults] = useState<StrongLexiconEntry[]>([]);
  const [originalSearchResults, setOriginalSearchResults] = useState<OriginalLanguageSearchResult[]>(
    [],
  );
  const [isAcademicSearching, setIsAcademicSearching] = useState(false);
  const [activeNoteVerseId, setActiveNoteVerseId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [selectedAcademicWord, setSelectedAcademicWord] = useState<InterlinearWord | null>(null);
  const [readingMode, setReadingMode] = useState<'comparison' | 'original' | 'translation'>(
    'translation',
  );
  const [selectedVersionId, setSelectedVersionId] = useState('por-blivre');

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [bookRows, versionRows, favoriteRows, lastReading] = await Promise.all([
        getBibleBooks(),
        getBibleVersions(),
        getFavoriteVerses(),
        getLastReading(),
      ]);
      setBooks(bookRows);
      setVersions(versionRows);
      if (lastReading?.versionId) {
        setSelectedVersionId(lastReading.versionId);
      }
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

  useEffect(() => {
    const query = reference.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isActive = true;
    setIsSearching(true);

    const timeout = setTimeout(() => {
      searchBible(query, {
        chapterId: selectedChapter?.id,
        limit: 18,
        scope: searchScope,
        versionId: selectedVersionId,
      })
        .then((results) => {
          if (isActive) {
            setSearchResults(results);
          }
        })
        .catch(() => {
          if (isActive) {
            setSearchResults([]);
          }
        })
        .finally(() => {
          if (isActive) {
            setIsSearching(false);
          }
        });
    }, 220);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [reference, searchScope, selectedChapter?.id, selectedVersionId]);

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
    async (book: BibleBook, chapter: BibleChapter, versionId = selectedVersionId) => {
      setIsLoading(true);
      setError(null);

      try {
        const [verseRows, originalRows, comparisonRows] = await Promise.all([
          getChapterVerses(chapter.id, versionId),
          getChapterOriginalVerses(book.id, chapter.chapterNumber),
          getChapterComparisonVerses(chapter.id, versionId),
        ]);
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setVerses(verseRows);
        setOriginalVerses(originalRows);
        setComparisonVerses(comparisonRows);
        setSelectedAcademicWord(null);
        await saveLastReading({ bookId: book.id, chapterId: chapter.id, versionId });
        setHasLastReading(true);
      } catch {
        setError(t('bible.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [selectedVersionId, t],
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
      if (lastReading.versionId) {
        setSelectedVersionId(lastReading.versionId);
      }

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
      await openChapter(book, chapter, lastReading.versionId ?? selectedVersionId);
    } catch {
      setError(t('bible.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [books, openChapter, selectedVersionId, t]);

  const openSearchResult = useCallback(
    async (verse: BibleSearchResult) => {
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

      setReference(formatReference(verse));
      setSearchResults([]);
      setChapters(chapterRows);
      await openChapter(book, chapter);
    },
    [books, openChapter, t],
  );

  const searchReference = useCallback(async () => {
    if (!reference.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verse = await findReference(reference, selectedVersionId);

      if (!verse) {
        const [firstResult] = searchResults;

        if (firstResult) {
          await openSearchResult(firstResult);
          return;
        }

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
  }, [books, openChapter, openSearchResult, reference, searchResults, selectedVersionId, t]);

  const changeVersion = useCallback(
    async (versionId: string) => {
      setSelectedVersionId(versionId);

      if (selectedBook && selectedChapter) {
        setIsLoading(true);
        setError(null);

        try {
          const [verseRows, originalRows, comparisonRows] = await Promise.all([
            getChapterVerses(selectedChapter.id, versionId),
            getChapterOriginalVerses(selectedBook.id, selectedChapter.chapterNumber),
            getChapterComparisonVerses(selectedChapter.id, versionId),
          ]);
          setVerses(verseRows);
          setOriginalVerses(originalRows);
          setComparisonVerses(comparisonRows);
          await saveLastReading({
            bookId: selectedBook.id,
            chapterId: selectedChapter.id,
            versionId,
          });
        } catch {
          setError(t('bible.errors.load'));
        } finally {
          setIsLoading(false);
        }
      }
    },
    [selectedBook, selectedChapter, t],
  );

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

  const searchAcademic = useCallback(async () => {
    if (!strongQuery.trim()) {
      setStrongResults([]);
      setOriginalSearchResults([]);
      return;
    }

    setIsAcademicSearching(true);

    try {
      const [strongRows, originalRows] = await Promise.all([
        searchStrongLexicon(strongQuery),
        searchOriginalLanguageOccurrences(strongQuery),
      ]);
      setStrongResults(strongRows);
      setOriginalSearchResults(originalRows);
    } catch {
      setStrongResults([]);
      setOriginalSearchResults([]);
    } finally {
      setIsAcademicSearching(false);
    }
  }, [strongQuery]);

  useEffect(() => {
    const query = strongQuery.trim();

    if (query.length < 2) {
      setStrongResults([]);
      setOriginalSearchResults([]);
      setIsAcademicSearching(false);
      return;
    }

    let isActive = true;
    setIsAcademicSearching(true);

    const timeout = setTimeout(() => {
      Promise.all([searchStrongLexicon(query), searchOriginalLanguageOccurrences(query)])
        .then(([strongRows, originalRows]) => {
          if (isActive) {
            setStrongResults(strongRows);
            setOriginalSearchResults(originalRows);
          }
        })
        .catch(() => {
          if (isActive) {
            setStrongResults([]);
            setOriginalSearchResults([]);
          }
        })
        .finally(() => {
          if (isActive) {
            setIsAcademicSearching(false);
          }
        });
    }, 220);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [strongQuery]);

  const openOriginalOccurrence = useCallback(
    async (occurrence: OriginalLanguageSearchResult) => {
      const book = books.find((item) => item.id === occurrence.bookId);

      if (!book) {
        setError(t('bible.errors.referenceNotFound'));
        return;
      }

      const chapterRows = await getBibleChapters(book.id);
      const chapter = chapterRows.find(
        (item) => item.chapterNumber === occurrence.chapterNumber,
      );

      if (!chapter) {
        setError(t('bible.errors.referenceNotFound'));
        return;
      }

      setChapters(chapterRows);
      setReadingMode('original');
      await openChapter(book, chapter);
    },
    [books, openChapter, t],
  );

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

  const selectedVersion = versions.find((version) => version.id === selectedVersionId);

  return (
    <Screen subtitle={t('bible.subtitle')} title={t('bible.title')}>
      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('bible.search.title')}</AppText>
        <TextInput
          accessibilityLabel={t('bible.search.referenceLabel')}
          autoCapitalize="words"
          onChangeText={setReference}
          onSubmitEditing={searchReference}
          placeholder={t('bible.search.placeholder')}
          returnKeyType="search"
          value={reference}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          <Button
            label={t('bible.search.scopes.all')}
            onPress={() => setSearchScope('all')}
            variant={searchScope === 'all' ? 'primary' : 'secondary'}
          />
          <Button
            label={t('bible.search.scopes.currentChapter')}
            onPress={() => setSearchScope('currentChapter')}
            variant={searchScope === 'currentChapter' ? 'primary' : 'secondary'}
          />
        </View>
        <Button
          isLoading={isLoading && Boolean(reference.trim())}
          label={t('bible.search.action')}
          onPress={searchReference}
          variant="secondary"
        />
        {isSearching ? (
          <AppText color="textSecondary" variant="caption">
            {t('bible.search.searching')}
          </AppText>
        ) : null}
        {reference.trim().length >= 2 && searchResults.length ? (
          <View style={{ gap: theme.spacing.sm }}>
            <AppText color="textSecondary" variant="caption">
              {t('bible.search.resultsCount', { count: searchResults.length })}
            </AppText>
            {searchResults.map((verse) => (
              <ListItem
                description={verse.text}
                icon={getSearchResultIcon(verse.matchType)}
                key={verse.id}
                onPress={() => openSearchResult(verse)}
                title={`${formatReference(verse)} · ${t(`bible.search.matchTypes.${verse.matchType}`)}`}
              />
            ))}
          </View>
        ) : null}
        {reference.trim().length >= 2 && !isSearching && !searchResults.length ? (
          <AppText color="textSecondary" variant="caption">
            {t('bible.search.noResults')}
          </AppText>
        ) : null}
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
              {t('bible.versionNotice', {
                version: selectedVersion?.abbreviation ?? selectedVersionId,
              })}
            </AppText>
          </View>

          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText variant="heading">{t('bible.versions.title')}</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {versions.map((version) => (
                <Button
                  key={version.id}
                  label={version.abbreviation}
                  onPress={() => changeVersion(version.id)}
                  variant={selectedVersionId === version.id ? 'primary' : 'secondary'}
                />
              ))}
            </View>
            {selectedVersion ? (
              <AppText color="textSecondary" variant="caption">
                {selectedVersion.name}
              </AppText>
            ) : null}
          </BaseCard>

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
              onSubmitEditing={searchAcademic}
              placeholder={t('bible.academicTools.searchPlaceholder')}
              returnKeyType="search"
              value={strongQuery}
            />
            <Button
              isLoading={isAcademicSearching}
              label={t('bible.academicTools.searchAction')}
              onPress={searchAcademic}
              variant="secondary"
            />
            {isAcademicSearching ? (
              <AppText color="textSecondary" variant="caption">
                {t('bible.academicTools.searching')}
              </AppText>
            ) : null}
            {strongResults.length ? (
              <View style={{ gap: theme.spacing.sm }}>
                <AppText color="textSecondary" variant="caption">
                  {t('bible.academicTools.strongTitle')}
                </AppText>
                {strongResults.map((entry) => (
                  <StrongEntryPanel entry={entry} key={entry.number} />
                ))}
              </View>
            ) : null}
            {originalSearchResults.length ? (
              <View style={{ gap: theme.spacing.sm }}>
                <AppText color="textSecondary" variant="caption">
                  {t('bible.academicTools.occurrencesTitle', {
                    count: originalSearchResults.length,
                  })}
                </AppText>
                {originalSearchResults.map((occurrence) => (
                  <ListItem
                    description={occurrence.transliteration || occurrence.text}
                    icon="language-outline"
                    key={`${occurrence.bookId}-${occurrence.chapterNumber}-${occurrence.verseNumber}-${occurrence.versionAbbreviation}`}
                    onPress={() => openOriginalOccurrence(occurrence)}
                    title={t('bible.academicTools.occurrenceLabel', {
                      language: occurrence.languageName,
                      reference: `${occurrence.bookName} ${occurrence.chapterNumber}:${occurrence.verseNumber}`,
                    })}
                  />
                ))}
              </View>
            ) : null}
            {strongQuery.trim().length >= 2 &&
            !isAcademicSearching &&
            !strongResults.length &&
            !originalSearchResults.length ? (
              <AppText color="textSecondary" variant="caption">
                {t('bible.academicTools.noResults')}
              </AppText>
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

function getSearchResultIcon(matchType: BibleSearchResult['matchType']) {
  if (matchType === 'book') {
    return 'book-outline';
  }

  if (matchType === 'reference') {
    return 'locate-outline';
  }

  return 'search-outline';
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
