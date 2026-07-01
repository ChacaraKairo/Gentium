import { useCallback, useEffect, useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  findReference,
  getBibleBooks,
  getBibleChapters,
  getBibleVersions,
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
  BibleVersion,
  InterlinearWord,
  OriginalLanguageSearchResult,
  OriginalLanguageVerse,
  StrongLexiconEntry,
} from '@/modules/bible/types';
import { MainTabParamList } from '@/navigation/types';
import {
  createStudyNote,
  createVerseHighlight,
  highlightColors,
} from '@/modules/notes/repositories/personalRepository';
import { AppText, BaseCard, Button, ListItem, TextInput } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function BibleScreen() {
  const { i18n, t } = useTranslation();
  const route = useRoute<RouteProp<MainTabParamList, 'Bible'>>();
  const theme = useThemeTokens();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [originalVerses, setOriginalVerses] = useState<OriginalLanguageVerse[]>([]);
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
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [selectedVerseIds, setSelectedVerseIds] = useState<string[]>([]);
  const [isVerseActionMenuOpen, setIsVerseActionMenuOpen] = useState(false);
  const [isSelectionNoteOpen, setIsSelectionNoteOpen] = useState(false);
  const [selectedAcademicWord, setSelectedAcademicWord] = useState<InterlinearWord | null>(null);
  const [readingMode, setReadingMode] = useState<'original' | 'translation'>('translation');
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
      } else {
        const preferredVersion = getPreferredTranslationVersion(versionRows, i18n.language);

        if (preferredVersion) {
          setSelectedVersionId(preferredVersion.id);
        }
      }
      setFavoriteVerses(favoriteRows);
      setHasLastReading(Boolean(lastReading));
    } catch {
      setError(t('bible.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [i18n.language, t]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    const initialReference = route.params?.initialReference;

    if (initialReference) {
      setReference(initialReference);
    }
  }, [route.params?.initialReference]);

  useEffect(() => {
    const initialReadingMode = route.params?.initialReadingMode;

    if (initialReadingMode) {
      setReadingMode(initialReadingMode);
    }
  }, [route.params?.initialReadingMode]);

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
        setSelectedAcademicWord(null);
        setSelectedVerseIds([]);
        setIsVerseActionMenuOpen(false);
        setIsSelectionNoteOpen(false);
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
        const [verseRows, originalRows] = await Promise.all([
          getChapterVerses(chapter.id, versionId),
          getChapterOriginalVerses(book.id, chapter.chapterNumber),
        ]);
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setVerses(verseRows);
        setOriginalVerses(originalRows);
        setSelectedAcademicWord(null);
        setSelectedVerseIds([]);
        setIsVerseActionMenuOpen(false);
        setIsSelectionNoteOpen(false);
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
          const [verseRows, originalRows] = await Promise.all([
            getChapterVerses(selectedChapter.id, versionId),
            getChapterOriginalVerses(selectedBook.id, selectedChapter.chapterNumber),
          ]);
          setVerses(verseRows);
          setOriginalVerses(originalRows);
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

  const selectTranslationMode = useCallback(async () => {
    const preferredVersion = getPreferredTranslationVersion(versions, i18n.language);
    setReadingMode('translation');

    if (preferredVersion && preferredVersion.id !== selectedVersionId) {
      await changeVersion(preferredVersion.id);
    }
  }, [changeVersion, i18n.language, selectedVersionId, versions]);

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

  const saveSelectionNote = useCallback(
    async () => {
      if (!noteContent.trim()) {
        return;
      }

      const selectedVerses = verses.filter((verse) => selectedVerseIds.includes(verse.id));
      const title = selectedVerses.map(formatReference).join(', ');
      const [firstVerse] = selectedVerses;

      await createStudyNote({
        categoryName: t('notes.defaultCategory'),
        content: noteContent,
        tags: noteTags,
        title,
        verseId: selectedVerses.length === 1 ? firstVerse?.id : undefined,
      });
      if (selectedVerses.length === 1 && firstVerse) {
        setVerses((current) =>
          current.map((item) =>
            item.id === firstVerse.id ? { ...item, notesCount: item.notesCount + 1 } : item,
          ),
        );
      }
      setIsSelectionNoteOpen(false);
      setNoteContent('');
      setNoteTags('');
    },
    [noteContent, noteTags, selectedVerseIds, t, verses],
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

  const selectedVerses = verses.filter((verse) => selectedVerseIds.includes(verse.id));

  const toggleVerseSelection = useCallback((verseId: string) => {
    setSelectedVerseIds((current) =>
      current.includes(verseId)
        ? current.filter((selectedVerseId) => selectedVerseId !== verseId)
        : [...current, verseId],
    );
  }, []);

  const favoriteSelectedVerses = useCallback(async () => {
    for (const verse of selectedVerses) {
      await toggleVerseFavorite(verse);
    }
  }, [selectedVerses, toggleVerseFavorite]);

  const markSelectedVerses = useCallback(
    async (color: string) => {
      for (const verse of selectedVerses) {
        await markVerse(verse, color);
      }
    },
    [markVerse, selectedVerses],
  );

  const shareSelectedVerses = useCallback(async () => {
    if (!selectedVerses.length) {
      return;
    }

    await Share.share({
      message: selectedVerses.map((verse) => `${formatReference(verse)}\n${verse.text}`).join('\n\n'),
    });
  }, [selectedVerses]);

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
      setSelectedAcademicWord(null);
      setSelectedVerseIds([]);
      setIsVerseActionMenuOpen(false);
      setIsSelectionNoteOpen(false);
      return;
    }

    if (selectedBook) {
      setSelectedBook(null);
      setChapters([]);
    }
  }, [selectedBook, selectedChapter]);

  const selectedVersion = versions.find((version) => version.id === selectedVersionId);
  const portugueseVersion = versions.find((version) => version.language === 'pt-BR');
  const englishVersion = versions.find((version) => version.language === 'en-US');
  const isPortugueseSelected =
    readingMode === 'translation' && selectedVersionId === portugueseVersion?.id;
  const isEnglishSelected = readingMode === 'translation' && selectedVersionId === englishVersion?.id;
  const isOriginalSelected = readingMode === 'original';

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

      {!selectedBook ? (
        <BaseCard style={{ gap: theme.spacing.md }}>
          <View style={{ gap: theme.spacing.xs }}>
            <AppText variant="heading">{t('bible.versionPicker.title')}</AppText>
            <AppText color="textSecondary">{t('bible.versionPicker.description')}</AppText>
          </View>
          <View style={{ gap: theme.spacing.sm }}>
            <ListItem
              description={t('bible.versionPicker.portugueseDescription', {
                version: portugueseVersion?.abbreviation ?? 'PorBLivre',
              })}
              icon="book-outline"
              onPress={() => {
                if (portugueseVersion) {
                  setSelectedVersionId(portugueseVersion.id);
                }
                setReadingMode('translation');
              }}
              style={getVersionPickerStyle(isPortugueseSelected, theme)}
              title={
                isPortugueseSelected
                  ? t('bible.versionPicker.selectedOption', {
                      option: t('bible.versionPicker.portuguese'),
                    })
                  : t('bible.versionPicker.portuguese')
              }
            />
            <ListItem
              description={t('bible.versionPicker.englishDescription', {
                version: englishVersion?.abbreviation ?? 'WEB',
              })}
              icon="language-outline"
              onPress={() => {
                if (englishVersion) {
                  setSelectedVersionId(englishVersion.id);
                }
                setReadingMode('translation');
              }}
              style={getVersionPickerStyle(isEnglishSelected, theme)}
              title={
                isEnglishSelected
                  ? t('bible.versionPicker.selectedOption', {
                      option: t('bible.versionPicker.english'),
                    })
                  : t('bible.versionPicker.english')
              }
            />
            <ListItem
              description={t('bible.versionPicker.spanishDescription')}
              disabled
              icon="language-outline"
              title={t('bible.versionPicker.spanish')}
            />
            <ListItem
              description={t('bible.versionPicker.originalDescription')}
              icon="school-outline"
              onPress={() => setReadingMode('original')}
              style={getVersionPickerStyle(isOriginalSelected, theme)}
              title={
                isOriginalSelected
                  ? t('bible.versionPicker.selectedOption', {
                      option: t('bible.versionPicker.original'),
                    })
                  : t('bible.versionPicker.original')
              }
            />
          </View>
          <AppText color="textSecondary" variant="caption">
            {t('bible.versionPicker.selected', {
              mode:
                readingMode === 'original'
                  ? t('bible.versionPicker.original')
                  : selectedVersion?.name ?? selectedVersionId,
            })}
          </AppText>
        </BaseCard>
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
                onPress={selectTranslationMode}
                variant={readingMode === 'translation' ? 'primary' : 'secondary'}
              />
              <Button
                label={t('bible.readingModes.original')}
                onPress={() => setReadingMode('original')}
                variant={readingMode === 'original' ? 'primary' : 'secondary'}
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

          {selectedVerses.length ? (
            <BaseCard style={{ gap: theme.spacing.sm }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: theme.spacing.sm,
                  justifyContent: 'space-between',
                }}
              >
                <AppText color="textSecondary" variant="caption">
                  {t('bible.selection.count', { count: selectedVerses.length })}
                </AppText>
                <Button
                  label={t('bible.selection.menu')}
                  onPress={() => setIsVerseActionMenuOpen((current) => !current)}
                  variant="secondary"
                />
              </View>
              {isVerseActionMenuOpen ? (
                <View style={{ gap: theme.spacing.sm }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                    <Button
                      label={t('bible.favorite')}
                      onPress={favoriteSelectedVerses}
                      variant="secondary"
                    />
                    <Button
                      label={t('bible.note')}
                      onPress={() => setIsSelectionNoteOpen((current) => !current)}
                      variant="secondary"
                    />
                    <Button
                      label={t('bible.share')}
                      onPress={shareSelectedVerses}
                      variant="secondary"
                    />
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                    {highlightColors.map((color) => (
                      <Pressable
                        accessibilityLabel={t('bible.highlightWithColor')}
                        accessibilityRole="button"
                        key={color}
                        onPress={() => markSelectedVerses(color)}
                        style={({ pressed }) => ({
                          backgroundColor: color,
                          borderColor: theme.colors.border,
                          borderRadius: theme.radius.pill,
                          borderWidth: 1,
                          height: 36,
                          opacity: pressed ? 0.72 : 1,
                          width: 36,
                        })}
                      />
                    ))}
                  </View>
                  {isSelectionNoteOpen ? (
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
                      <Button label={t('notes.save')} onPress={saveSelectionNote} />
                    </View>
                  ) : null}
                </View>
              ) : null}
            </BaseCard>
          ) : null}

          {verses.map((verse) => (
            <Pressable
              accessibilityLabel={t('bible.selection.toggleVerse', { reference: formatReference(verse) })}
              accessibilityRole="button"
              key={verse.id}
              onPress={() => toggleVerseSelection(verse.id)}
              style={({ pressed }) => {
                const isSelected = selectedVerseIds.includes(verse.id);

                return {
                  backgroundColor: isSelected ? theme.colors.muted : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                  borderWidth: 1,
                  gap: theme.spacing.md,
                  opacity: pressed ? 0.82 : 1,
                  padding: theme.spacing.md,
                };
              }}
            >
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
              {readingMode === 'translation' ? <AppText>{verse.text}</AppText> : null}
              {readingMode === 'original' ? (
                <OriginalVersePanel
                  originalVerse={originalVerses.find((item) => item.verseNumber === verse.verseNumber)}
                  onSelectWord={setSelectedAcademicWord}
                />
              ) : null}
              {verse.notesCount ? (
                <AppText color="textSecondary" variant="caption">
                  {t('bible.notesCount', { count: verse.notesCount })}
                </AppText>
              ) : null}
            </Pressable>
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

function getVersionPickerStyle(isSelected: boolean, theme: ReturnType<typeof useThemeTokens>) {
  return ({ pressed }: { pressed: boolean }) => ({
    backgroundColor: isSelected ? theme.colors.muted : theme.colors.surface,
    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    opacity: pressed ? 0.72 : 1,
  });
}

function getPreferredTranslationVersion(versions: BibleVersion[], language: string) {
  const preferredLanguage = language === 'en-US' ? 'en-US' : 'pt-BR';

  return (
    versions.find((version) => version.language === preferredLanguage) ??
    versions.find((version) => version.language === 'pt-BR') ??
    versions[0]
  );
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
    <View style={{ gap: theme.spacing.sm }}>
      <AppText color="primary" variant="caption">
        {t('bible.originalLanguages.originalLabel', {
          language: originalVerse.languageName,
          version: originalVerse.versionAbbreviation,
        })}
      </AppText>
      <View
        style={{
          borderColor: theme.colors.border,
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          gap: theme.spacing.xs,
          padding: theme.spacing.sm,
        }}
      >
        <AppText color="textSecondary" variant="caption">
          {t('bible.originalLanguages.scriptLabel')}
        </AppText>
        <AppText>{originalVerse.text}</AppText>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.muted,
          borderRadius: theme.radius.sm,
          gap: theme.spacing.xs,
          padding: theme.spacing.sm,
        }}
      >
        <AppText color="textSecondary" variant="caption">
          {t('bible.originalLanguages.pronunciationLabel')}
        </AppText>
        <AppText>{originalVerse.transliteration}</AppText>
      </View>
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
