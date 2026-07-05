import './startup/i18n';

import { useEffect } from 'react';
import { ActivityIndicator, InteractionManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppProviders } from './providers/AppProviders';
import { initializeAppDatabase, seedAppContentInBackground } from '@/infrastructure/database/database';
import { applySavedLanguage } from '@/modules/settings/repositories/languageRepository';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useStartupStore } from '@/app/startup/startupStore';
import { AppText, BaseCard, Button } from '@/shared/components';
import { useThemeTokens } from '@/theme/useThemeTokens';

function AppBootstrap() {
  const { t } = useTranslation();
  const { isReady, error, initialize } = useStartupStore();
  const theme = useThemeTokens();

  useEffect(() => {
    initialize(async () => {
      await initializeAppDatabase();
      await applySavedLanguage();
    });
  }, [initialize]);

  useEffect(() => {
    if (!isReady || error) {
      return undefined;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      seedAppContentInBackground();
    });

    return () => {
      task.cancel();
    };
  }, [error, isReady]);

  if (!isReady) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: theme.colors.background,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          justifyContent: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <BaseCard style={{ gap: theme.spacing.md }}>
          <AppText color="danger" variant="heading">
            Gentium
          </AppText>
          <AppText color="textSecondary">{error}</AppText>
          <Button
            label={t('common.retry')}
            onPress={() =>
              initialize(async () => {
                await initializeAppDatabase();
                await applySavedLanguage();
              })
            }
          />
        </BaseCard>
      </View>
    );
  }

  return <RootNavigator />;
}

export function GentiumApp() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}
