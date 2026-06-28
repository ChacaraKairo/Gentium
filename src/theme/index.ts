import { darkColors, lightColors } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import { typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: {
    colors: lightColors,
    radius,
    spacing,
    typography,
  },
  dark: {
    colors: darkColors,
    radius,
    spacing,
    typography,
  },
} as const;

export type ThemeTokens = (typeof themes)[ThemeMode];
