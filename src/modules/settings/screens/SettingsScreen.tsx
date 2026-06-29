import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  BetaDiagnosticItem,
  getBetaDiagnostics,
} from '@/modules/settings/repositories/betaDiagnosticsRepository';
import { AppText, BaseCard, ListItem } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [diagnostics, setDiagnostics] = useState<BetaDiagnosticItem[]>([]);
  const [diagnosticsError, setDiagnosticsError] = useState(false);

  useEffect(() => {
    getBetaDiagnostics()
      .then(setDiagnostics)
      .catch(() => setDiagnosticsError(true));
  }, []);

  return (
    <Screen subtitle={t('settings.subtitle')} title={t('settings.title')}>
      <BaseCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{t('settings.betaDiagnostics.title')}</AppText>
        <AppText color="textSecondary">{t('settings.betaDiagnostics.description')}</AppText>
        {diagnosticsError ? (
          <AppText color="danger">{t('settings.betaDiagnostics.error')}</AppText>
        ) : (
          <View style={{ gap: theme.spacing.xs }}>
            {diagnostics.map((item) => (
              <AppText color="textSecondary" key={item.id} variant="caption">
                {t(item.labelKey, { count: item.count })}
              </AppText>
            ))}
          </View>
        )}
      </BaseCard>
      <ListItem
        description={t('settings.appearanceDescription')}
        icon="contrast-outline"
        title={t('settings.appearance')}
      />
      <ListItem
        description={t('settings.languageDescription')}
        icon="language-outline"
        title={t('settings.language')}
      />
      <ListItem
        description={t('settings.aboutDescription')}
        icon="information-circle-outline"
        title={t('settings.about')}
      />
      <ListItem
        description={t('settings.bibleLicenseDescription')}
        icon="document-text-outline"
        title={t('settings.bibleLicense')}
      />
    </Screen>
  );
}
