import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

import { ThemeMode, themes } from './index';

export function createNavigationTheme(mode: ThemeMode): Theme {
  const baseTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  const tokens = themes[mode];

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: tokens.colors.background,
      border: tokens.colors.border,
      card: tokens.colors.surface,
      primary: tokens.colors.primary,
      text: tokens.colors.text,
    },
  };
}
