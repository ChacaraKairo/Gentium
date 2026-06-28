import './startup/i18n';

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AppProviders } from './providers/AppProviders';
import { initializeAppDatabase } from '@/infrastructure/database/database';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useStartupStore } from '@/app/startup/startupStore';
import { useThemeTokens } from '@/theme/useThemeTokens';

function AppBootstrap() {
  const { isReady, error, initialize } = useStartupStore();
  const theme = useThemeTokens();

  useEffect(() => {
    initialize(initializeAppDatabase);
  }, [initialize]);

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
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }} />
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
