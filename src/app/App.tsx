import './startup/i18n';

import { useEffect } from 'react';
import { ActivityIndicator, InteractionManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppProviders } from './providers/AppProviders';
import { initializeAppDatabase, seedAppContentInBackground } from '@/infrastructure/database/database';
import { useContentSeedStore } from '@/app/startup/contentSeedStore';
import { applySavedLanguage } from '@/modules/settings/repositories/languageRepository';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useStartupStore } from '@/app/startup/startupStore';
import { AppText, BaseCard, Button } from '@/shared/components';
import { useThemeTokens } from '@/theme/useThemeTokens';

function AppBootstrap() {
  const { t } = useTranslation();
  const { isReady, error, initialize } = useStartupStore();
  const { fail, finish, setProgress, start } = useContentSeedStore();
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
      start();
      seedAppContentInBackground({ onProgress: setProgress }).then(finish).catch(fail);
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

  return (
    <>
      <RootNavigator />
      <ContentSeedProgressBar />
    </>
  );
}

function ContentSeedProgressBar() {
  const { t } = useTranslation();
  const { completed, error, phase, status, total } = useContentSeedStore();
  const theme = useThemeTokens();
  const shouldShow = status === 'running' || status === 'error';
  const percent = total > 0 ? Math.min(100, Math.max(0, Math.round((completed / total) * 100))) : 0;

  if (!shouldShow) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={{
        bottom: 84,
        left: theme.spacing.md,
        position: 'absolute',
        right: theme.spacing.md,
      }}
    >
      <BaseCard
        accessibilityLiveRegion="polite"
        style={{
          gap: theme.spacing.sm,
          shadowColor: '#000000',
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        }}
      >
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, justifyContent: 'space-between' }}>
          <AppText variant="caption">
            {status === 'error' ? t('contentSeed.errorTitle') : t('contentSeed.title')}
          </AppText>
          <AppText color={status === 'error' ? 'danger' : 'textSecondary'} variant="caption">
            {status === 'error' ? t('contentSeed.errorStatus') : t('contentSeed.percent', { percent })}
          </AppText>
        </View>
        <View
          accessibilityLabel={t('contentSeed.progressLabel', { percent })}
          accessibilityRole="progressbar"
          style={{
            backgroundColor: theme.colors.muted,
            borderRadius: theme.radius.pill,
            height: 8,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              backgroundColor: status === 'error' ? theme.colors.danger : theme.colors.primary,
              borderRadius: theme.radius.pill,
              height: '100%',
              width: `${status === 'error' ? 100 : percent}%`,
            }}
          />
        </View>
        <AppText color={status === 'error' ? 'danger' : 'textSecondary'} variant="caption">
          {status === 'error'
            ? error ?? t('contentSeed.errorDescription')
            : t(`contentSeed.phases.${phase}`)}
        </AppText>
      </BaseCard>
    </View>
  );
}

export function GentiumApp() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}
