import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider';

export function useThemeTokens() {
  return useContext(ThemeContext);
}
