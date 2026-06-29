import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  findAdvancedLibraryByReference,
  getAdvancedLibraryItems,
  getAdvancedLibrarySections,
} from '@/modules/advancedLibrary/repositories/advancedLibraryRepository';
import {
  AdvancedLibraryItems,
  AdvancedLibrarySection,
  AdvancedLibrarySectionSummary,
  BibleGenealogy,
  BibleMap,
  BibleTimeline,
  Commentary,
  CrossReference,
  DictionaryEntry,
  GospelParallel,
} from '@/modules/advancedLibrary/types';
import { AppText, BaseCard, Button, ListItem, TextInput } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function AdvancedLibraryScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [sections, setSections] = useState<AdvancedLibrarySectionSummary[]>([]);
  const [selectedSection, setSelectedSection] = useState<AdvancedLibrarySection | null>(null);
  const [sectionItems, setSectionItems] = useState<AdvancedLibraryItems[AdvancedLibrarySection]>([]);
  const [reference, setReference] = useState('');
  const [referenceItems, setReferenceItems] = useState<AdvancedLibraryItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setSections(await getAdvancedLibrarySections());
    } catch {
      setError(t('advancedLibrary.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const openSection = useCallback(
    async (section: AdvancedLibrarySection) => {
      setIsLoading(true);
      setError(null);

      try {
        setSelectedSection(section);
        setReferenceItems(null);
        setSectionItems(await getAdvancedLibraryItems(section));
      } catch {
        setError(t('advancedLibrary.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const searchReference = useCallback(async () => {
    if (!reference.trim()) {
      setReferenceItems(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setSelectedSection(null);
      setReferenceItems(await findAdvancedLibraryByReference(reference));
    } catch {
      setError(t('advancedLibrary.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [reference, t]);

  const goBack = useCallback(() => {
    setSelectedSection(null);
    setSectionItems([]);
    setReferenceItems(null);
  }, []);

  return (
    <Screen
      subtitle={t('advancedLibrary.subtitle')}
      title={selectedSection ? t(`advancedLibrary.sections.${selectedSection}`) : t('advancedLibrary.title')}
    >
      {selectedSection || referenceItems ? (
        <Button label={t('common.back')} onPress={goBack} variant="ghost" />
      ) : null}

      <BaseCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{t('advancedLibrary.referenceSearchTitle')}</AppText>
        <TextInput
          accessibilityLabel={t('advancedLibrary.searchLabel')}
          autoCapitalize="words"
          onChangeText={setReference}
          onSubmitEditing={searchReference}
          placeholder={t('advancedLibrary.searchPlaceholder')}
          returnKeyType="search"
          value={reference}
        />
        <Button label={t('advancedLibrary.searchAction')} onPress={searchReference} variant="secondary" />
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

      {!isLoading && !selectedSection && !referenceItems ? (
        <View style={{ gap: theme.spacing.md }}>
          {sections.map((section) => (
            <ListItem
              description={t('advancedLibrary.sectionCount', { count: section.count })}
              icon={getSectionIcon(section.id)}
              key={section.id}
              onPress={() => openSection(section.id)}
              title={t(section.titleKey)}
            />
          ))}
        </View>
      ) : null}

      {!isLoading && selectedSection ? (
        <View style={{ gap: theme.spacing.md }}>
          {renderSectionItems(selectedSection, sectionItems, t)}
        </View>
      ) : null}

      {!isLoading && referenceItems ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard>
            <AppText color="textSecondary">
              {t('advancedLibrary.referenceResults', { reference })}
            </AppText>
          </BaseCard>
          {renderReferenceItems(referenceItems, t)}
        </View>
      ) : null}
    </Screen>
  );
}

function renderSectionItems(
  section: AdvancedLibrarySection,
  items: AdvancedLibraryItems[AdvancedLibrarySection],
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (section === 'commentaries') {
    return (items as Commentary[]).map((item) => <CommentaryCard item={item} key={item.id} />);
  }

  if (section === 'dictionary') {
    return (items as DictionaryEntry[]).map((item) => <DictionaryCard item={item} key={item.id} />);
  }

  if (section === 'crossReferences') {
    return (items as CrossReference[]).map((item) => <CrossReferenceCard item={item} key={item.id} />);
  }

  if (section === 'parallels') {
    return (items as GospelParallel[]).map((item) => <ParallelCard item={item} key={item.id} />);
  }

  if (section === 'maps') {
    return (items as BibleMap[]).map((item) => <MapCard item={item} key={item.id} />);
  }

  if (section === 'timelines') {
    return (items as BibleTimeline[]).map((item) => <TimelineCard item={item} key={item.id} />);
  }

  if (!items.length) {
    return (
      <BaseCard>
        <AppText color="textSecondary">{t('advancedLibrary.emptySection')}</AppText>
      </BaseCard>
    );
  }

  return (items as BibleGenealogy[]).map((item) => <GenealogyCard item={item} key={item.id} />);
}

function renderReferenceItems(
  items: AdvancedLibraryItems,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  const hasResults = Object.values(items).some((value) => value.length);

  if (!hasResults) {
    return (
      <BaseCard>
        <AppText color="textSecondary">{t('advancedLibrary.noReferenceResults')}</AppText>
      </BaseCard>
    );
  }

  return (
    <>
      {items.commentaries.map((item) => <CommentaryCard item={item} key={item.id} />)}
      {items.crossReferences.map((item) => <CrossReferenceCard item={item} key={item.id} />)}
      {items.dictionary.map((item) => <DictionaryCard item={item} key={item.id} />)}
      {items.parallels.map((item) => <ParallelCard item={item} key={item.id} />)}
      {items.maps.map((item) => <MapCard item={item} key={item.id} />)}
      {items.timelines.map((item) => <TimelineCard item={item} key={item.id} />)}
      {items.genealogies.map((item) => <GenealogyCard item={item} key={item.id} />)}
    </>
  );
}

function CommentaryCard({ item }: { item: Commentary }) {
  return (
    <BaseCard>
      <AppText color="primary" variant="caption">
        {item.reference} · {item.author}
      </AppText>
      <AppText variant="heading">{item.title}</AppText>
      <AppText color="textSecondary">{item.content}</AppText>
    </BaseCard>
  );
}

function DictionaryCard({ item }: { item: DictionaryEntry }) {
  return (
    <BaseCard>
      <AppText color="primary" variant="caption">
        {item.category}
      </AppText>
      <AppText variant="heading">{item.term}</AppText>
      <AppText color="textSecondary">{item.definition}</AppText>
      <AppText color="textSecondary" variant="caption">
        {item.references.join(' · ')}
      </AppText>
    </BaseCard>
  );
}

function CrossReferenceCard({ item }: { item: CrossReference }) {
  return (
    <BaseCard>
      <AppText color="primary" variant="caption">
        {item.sourceReference} → {item.targetReference}
      </AppText>
      <AppText variant="heading">{item.title}</AppText>
      <AppText color="textSecondary">{item.note}</AppText>
    </BaseCard>
  );
}

function ParallelCard({ item }: { item: GospelParallel }) {
  return (
    <BaseCard>
      <AppText variant="heading">{item.title}</AppText>
      <AppText color="textSecondary">{item.summary}</AppText>
      <AppText color="textSecondary" variant="caption">
        {item.references.join(' · ')}
      </AppText>
    </BaseCard>
  );
}

function MapCard({ item }: { item: BibleMap }) {
  return (
    <BaseCard>
      <AppText color="primary" variant="caption">
        {item.region}
      </AppText>
      <AppText variant="heading">{item.title}</AppText>
      <AppText color="textSecondary">{item.description}</AppText>
      <AppText color="textSecondary" variant="caption">
        {item.places.join(' · ')}
      </AppText>
      <AppText color="textSecondary" variant="caption">
        {item.references.join(' · ')}
      </AppText>
    </BaseCard>
  );
}

function TimelineCard({ item }: { item: BibleTimeline }) {
  return (
    <BaseCard>
      <AppText color="primary" variant="caption">
        {item.period}
      </AppText>
      <AppText variant="heading">{item.title}</AppText>
      <AppText color="textSecondary">{item.summary}</AppText>
      <AppText color="textSecondary" variant="caption">
        {item.events.join(' · ')}
      </AppText>
    </BaseCard>
  );
}

function GenealogyCard({ item }: { item: BibleGenealogy }) {
  return (
    <BaseCard>
      <AppText variant="heading">{item.title}</AppText>
      <AppText color="textSecondary">{item.summary}</AppText>
      <AppText color="textSecondary" variant="caption">
        {item.people.join(' → ')}
      </AppText>
      <AppText color="textSecondary" variant="caption">
        {item.references.join(' · ')}
      </AppText>
    </BaseCard>
  );
}

function getSectionIcon(section: AdvancedLibrarySection) {
  const icons = {
    commentaries: 'chatbox-ellipses-outline',
    crossReferences: 'git-compare-outline',
    dictionary: 'bookmarks-outline',
    genealogies: 'people-outline',
    maps: 'map-outline',
    parallels: 'albums-outline',
    timelines: 'time-outline',
  } as const;

  return icons[section];
}
