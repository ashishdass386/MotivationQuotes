import React, {createContext, useContext} from 'react';
import {lightColors, type ThemeColors} from './colors';

export type ThemeMode = 'light';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
}

const STATIC_THEME_VALUE: ThemeContextValue = Object.freeze({
  colors: lightColors,
  isDark: false,
  themeMode: 'light',
});

const ThemeContext = createContext<ThemeContextValue>(STATIC_THEME_VALUE);

/**
 * ThemeProvider enforces a strict LIGHT THEME ONLY across the application.
 * System dark mode and dynamic theme switching are disabled per design directives.
 */
export function ThemeProvider({children}: {children: React.ReactNode}) {
  return (
    <ThemeContext.Provider value={STATIC_THEME_VALUE}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
