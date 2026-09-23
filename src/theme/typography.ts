import {Platform} from 'react-native';

const fontFamily = Platform.select({
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    light: 'sans-serif-light',
    thin: 'sans-serif-thin',
    bold: 'sans-serif',
    condensed: 'sans-serif-condensed',
  },
  default: {
    regular: 'System',
    medium: 'System',
    light: 'System',
    thin: 'System',
    bold: 'System',
    condensed: 'System',
  },
});

export const typography = {
  fontFamily,
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 38,
    '5xl': 46,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.8,
    wider: 1.6,
    widest: 3.2,
  },
};
