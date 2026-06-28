import { useTranslation } from 'react-i18next';

import { AppText, BaseCard } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function StudiesScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();

  return (
    <Screen subtitle={t('studies.subtitle')} title={t('studies.title')}>
      <BaseCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{t('studies.emptyTitle')}</AppText>
        <AppText color="textSecondary">{t('studies.emptyDescription')}</AppText>
      </BaseCard>
    </Screen>
  );
}
