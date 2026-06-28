import { useTranslation } from 'react-i18next';

import { AppText, BaseCard } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function NotesScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();

  return (
    <Screen subtitle={t('notes.subtitle')} title={t('notes.title')}>
      <BaseCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{t('notes.emptyTitle')}</AppText>
        <AppText color="textSecondary">{t('notes.emptyDescription')}</AppText>
      </BaseCard>
    </Screen>
  );
}
