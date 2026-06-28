import { createContext, PropsWithChildren, useMemo } from 'react';

import { ThemeMode, ThemeTokens, themes } from './index';

export const ThemeContext = createContext<ThemeTokens>(themes.light);

type ThemeProviderProps = PropsWithChildren<{
  mode: ThemeMode;
}>;

export function ThemeProvider({ children, mode }: ThemeProviderProps) {
  const value = useMemo(() => themes[mode], [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
