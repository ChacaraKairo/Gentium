import { useCallback, useEffect, useState } from 'react';
import { Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  findReference,
  getBibleBooks,
  getBibleChapters,
  getChapterVerses,
  getFavoriteVerses,
  getLastReading,
  saveLastReading,
  toggleFavorite,
} from '@/modules/bible/repositories/bibleRepository';
import { BibleBook, BibleChapter, BibleVerse } from '@/modules/bible/types';
import { AppText, BaseCard, Button, IconButton, ListItem, TextInput } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function BibleScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<BibleVerse[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [hasLastReading, setHasLastReading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState('');

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
        const verseRows = await getChapterVerses(chapter.id);
        setSelectedBook(book);
        setSelectedChapter(chapter);
        setVerses(verseRows);
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

  const shareVerse = useCallback(async (verse: BibleVerse) => {
    await Share.share({
      message: `${formatReference(verse)}\n${verse.text}`,
    });
  }, []);

  const goBack = useCallback(() => {
    if (selectedChapter) {
      setSelectedChapter(null);
      setVerses([]);
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

          {verses.map((verse) => (
            <BaseCard key={verse.id} style={{ gap: theme.spacing.md }}>
              <AppText color="primary" variant="caption">
                {formatReference(verse)}
              </AppText>
              <AppText>{verse.text}</AppText>
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <IconButton
                  icon={verse.isFavorite ? 'heart' : 'heart-outline'}
                  label={t('bible.favorite')}
                  onPress={() => toggleVerseFavorite(verse)}
                />
                <IconButton
                  icon="share-social-outline"
                  label={t('bible.share')}
                  onPress={() => shareVerse(verse)}
                />
              </View>
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
