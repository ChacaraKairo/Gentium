import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  createFavoriteCollection,
  createStudyNote,
  exportPersonalData,
  getFavoriteCollections,
  getStudyNotes,
  getVerseHighlights,
} from '@/modules/notes/repositories/personalRepository';
import { FavoriteCollection, StudyNote, VerseHighlight } from '@/modules/notes/types';
import { AppText, BaseCard, Button, ListItem, TextInput } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function NotesScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [collections, setCollections] = useState<FavoriteCollection[]>([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tags, setTags] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPersonalData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [noteRows, highlightRows, collectionRows] = await Promise.all([
        getStudyNotes(search),
        getVerseHighlights(),
        getFavoriteCollections(),
      ]);
      setNotes(noteRows);
      setHighlights(highlightRows);
      setCollections(collectionRows);
    } catch {
      setError(t('notes.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [search, t]);

  useEffect(() => {
    loadPersonalData();
  }, [loadPersonalData]);

  const saveFreeNote = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      setError(t('notes.errors.required'));
      return;
    }

    await createStudyNote({
      categoryName: categoryName || t('notes.defaultCategory'),
      content,
      tags,
      title,
    });
    setTitle('');
    setContent('');
    setCategoryName('');
    setTags('');
    await loadPersonalData();
  }, [categoryName, content, loadPersonalData, tags, t, title]);

  const saveCollection = useCallback(async () => {
    await createFavoriteCollection(collectionName);
    setCollectionName('');
    await loadPersonalData();
  }, [collectionName, loadPersonalData]);

  return (
    <Screen subtitle={t('notes.subtitleV03')} title={t('notes.title')}>
      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('notes.newNote')}</AppText>
        <TextInput
          accessibilityLabel={t('notes.titleLabel')}
          onChangeText={setTitle}
          placeholder={t('notes.titlePlaceholder')}
          value={title}
        />
        <TextInput
          accessibilityLabel={t('notes.content')}
          multiline
          onChangeText={setContent}
          placeholder={t('notes.contentPlaceholder')}
          value={content}
        />
        <TextInput
          accessibilityLabel={t('notes.category')}
          onChangeText={setCategoryName}
          placeholder={t('notes.categoryPlaceholder')}
          value={categoryName}
        />
        <TextInput
          accessibilityLabel={t('notes.tags')}
          onChangeText={setTags}
          placeholder={t('notes.tagsPlaceholder')}
          value={tags}
        />
        <Button label={t('notes.save')} onPress={saveFreeNote} />
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('notes.collections')}</AppText>
        <TextInput
          accessibilityLabel={t('notes.collectionName')}
          onChangeText={setCollectionName}
          placeholder={t('notes.collectionPlaceholder')}
          value={collectionName}
        />
        <Button label={t('notes.createCollection')} onPress={saveCollection} variant="secondary" />
        {collections.map((collection) => (
          <AppText color="textSecondary" key={collection.id} variant="caption">
            {collection.name}
          </AppText>
        ))}
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('notes.search')}</AppText>
        <TextInput
          accessibilityLabel={t('notes.search')}
          onChangeText={setSearch}
          placeholder={t('notes.searchPlaceholder')}
          value={search}
        />
        <Button label={t('notes.export')} onPress={exportPersonalData} variant="secondary" />
      </BaseCard>

      {error ? (
        <BaseCard>
          <AppText color="danger">{error}</AppText>
        </BaseCard>
      ) : null}

      {isLoading ? (
        <BaseCard>
          <AppText color="textSecondary">{t('common.loading')}</AppText>
        </BaseCard>
      ) : null}

      <View style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('notes.savedNotes')}</AppText>
        {!notes.length && !isLoading ? (
          <BaseCard>
            <AppText color="textSecondary">{t('notes.emptyDescriptionV03')}</AppText>
          </BaseCard>
        ) : null}
        {notes.map((note) => (
          <ListItem
            description={[note.reference, note.categoryName, note.tags.join(', '), note.content]
              .filter(Boolean)
              .join(' • ')}
            icon="document-text-outline"
            key={note.id}
            title={note.title}
          />
        ))}
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('notes.highlights')}</AppText>
        {!highlights.length && !isLoading ? (
          <BaseCard>
            <AppText color="textSecondary">{t('notes.emptyHighlights')}</AppText>
          </BaseCard>
        ) : null}
        {highlights.map((highlight) => (
          <BaseCard key={highlight.id} style={{ gap: theme.spacing.sm }}>
            <View
              style={{
                backgroundColor: highlight.color,
                borderRadius: theme.radius.pill,
                height: theme.spacing.xs,
                width: theme.spacing.xxl,
              }}
            />
            <AppText>{highlight.reference}</AppText>
            {highlight.categoryName ? (
              <AppText color="textSecondary" variant="caption">
                {highlight.categoryName}
              </AppText>
            ) : null}
          </BaseCard>
        ))}
      </View>
    </Screen>
  );
}
