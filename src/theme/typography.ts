import {Platform} from 'react-native';

const fontFamily = Platform.select({
  android: {
    sans: 'sans-serif',
    sansMedium: 'sans-serif-medium',
    sansLight: 'sans-serif-light',
    sansBold: 'sans-serif-medium',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    sansMedium: 'System',
    sansLight: 'System',
    sansBold: 'System',
    serif: 'Georgia',
    mono: 'Courier',
  },
});

export const typography = {
  fontFamily,
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    '2xl': 26,
    '3xl': 30,
    '4xl': 36,
    '5xl': 42,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '700' as const,
  },
  lineHeights: {
    tight: 1.25,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },
  letterSpacing: {
    tighter: -0.6,
    tight: -0.3,
    normal: 0,
    wide: 0.6,
    wider: 1.2,
    widest: 2.0,
  },
};
