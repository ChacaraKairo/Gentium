import { NavigationContainer } from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '@/theme/ThemeProvider';
import { createNavigationTheme } from '@/theme/navigationTheme';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <SafeAreaProvider>
      <ThemeProvider mode={mode}>
        <NavigationContainer theme={createNavigationTheme(mode)}>
          {children}
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
