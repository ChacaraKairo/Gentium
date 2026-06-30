import { useEffect, useState } from 'react';
import { Share, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  BetaDiagnosticItem,
  getBetaDiagnostics,
} from '@/modules/settings/repositories/betaDiagnosticsRepository';
import { createLocalBackupText } from '@/modules/settings/repositories/localBackupRepository';
import { MainTabParamList } from '@/navigation/types';
import { AppText, BaseCard, Button, ListItem } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function SettingsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const theme = useThemeTokens();
  const [diagnostics, setDiagnostics] = useState<BetaDiagnosticItem[]>([]);
  const [diagnosticsError, setDiagnosticsError] = useState(false);
  const [backupError, setBackupError] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);

  useEffect(() => {
    getBetaDiagnostics()
      .then(setDiagnostics)
      .catch(() => setDiagnosticsError(true));
  }, []);

  async function exportBackup() {
    setIsExportingBackup(true);
    setBackupError(false);

    try {
      await Share.share({
        message: await createLocalBackupText(),
        title: t('settings.localBackup.shareTitle'),
      });
    } catch {
      setBackupError(true);
    } finally {
      setIsExportingBackup(false);
    }
  }

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
      <BaseCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{t('settings.localBackup.title')}</AppText>
        <AppText color="textSecondary">{t('settings.localBackup.description')}</AppText>
        {backupError ? (
          <AppText color="danger">{t('settings.localBackup.error')}</AppText>
        ) : null}
        <Button
          isLoading={isExportingBackup}
          label={t('settings.localBackup.action')}
          onPress={exportBackup}
          variant="secondary"
        />
      </BaseCard>
      <ListItem
        description={t('settings.donationsDescription')}
        icon="heart-circle-outline"
        onPress={() => navigation.navigate('Donations')}
        title={t('settings.donations')}
      />
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
