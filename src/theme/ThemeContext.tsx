import React, {createContext, useContext} from 'react';
import {lightColors, type ThemeColors} from './colors';

export type ThemeMode = 'light';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  themeMode: 'light',
});

/**
 * ThemeProvider enforces a strict LIGHT THEME ONLY across the application.
 * System dark mode and dynamic theme switching are disabled per design directives.
 */
export function ThemeProvider({children}: {children: React.ReactNode}) {
  return (
    <ThemeContext.Provider
      value={{
        colors: lightColors,
        isDark: false,
        themeMode: 'light',
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
