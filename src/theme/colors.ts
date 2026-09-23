// Light and dark palette tokens
export const palette = {
  // Brand
  violet: '#7C3AED',
  violetLight: '#9F7AEA',
  violetDark: '#5B21B6',
  indigo: '#4F46E5',
  indigoDark: '#3730A3',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8F7FF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',

  // Dark mode backgrounds
  dark900: '#0D0D1A',
  dark800: '#13131F',
  dark700: '#1A1A2E',
  dark600: '#22223B',
  dark500: '#2D2D44',

  // Semantic
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Accent
  rose: '#F43F5E',
  roseLight: '#FDA4AF',
  amber: '#F59E0B',
  emerald: '#10B981',
} as const;

export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // UI
  border: string;
  borderLight: string;
  divider: string;

  // Interactive
  buttonText: string;
  iconActive: string;
  iconInactive: string;

  // Card
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;

  // Tab bar
  tabBarBackground: string;
  tabBarBorder: string;

  // Status
  warning: string;
  saved: string;
  error: string;
  success: string;

  // Gradient start/end
  gradientStart: string;
  gradientEnd: string;
}

export const lightColors: ThemeColors = {
  background: palette.offWhite,
  backgroundSecondary: palette.gray100,
  surface: palette.white,
  surfaceElevated: palette.white,

  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,

  primary: palette.violet,
  primaryLight: palette.violetLight,
  primaryDark: palette.violetDark,

  border: palette.gray200,
  borderLight: palette.gray100,
  divider: palette.gray200,

  buttonText: palette.white,
  iconActive: palette.violet,
  iconInactive: palette.gray400,

  cardBackground: palette.white,
  cardBorder: palette.gray200,
  cardShadow: 'rgba(124,58,237,0.10)',

  tabBarBackground: palette.white,
  tabBarBorder: palette.gray200,

  warning: palette.amber,
  saved: palette.rose,
  error: palette.error,
  success: palette.success,

  gradientStart: '#EDE9FE',
  gradientEnd: '#DDD6FE',
};

export const darkColors: ThemeColors = {
  background: palette.dark900,
  backgroundSecondary: palette.dark800,
  surface: palette.dark700,
  surfaceElevated: palette.dark600,

  textPrimary: palette.white,
  textSecondary: palette.gray300,
  textTertiary: palette.gray500,
  textInverse: palette.gray900,

  primary: palette.violetLight,
  primaryLight: '#C4B5FD',
  primaryDark: palette.violet,

  border: palette.dark500,
  borderLight: palette.dark600,
  divider: palette.dark500,

  buttonText: palette.white,
  iconActive: palette.violetLight,
  iconInactive: palette.gray600,

  cardBackground: palette.dark700,
  cardBorder: palette.dark500,
  cardShadow: 'rgba(0,0,0,0.40)',

  tabBarBackground: palette.dark800,
  tabBarBorder: palette.dark600,

  warning: '#FCD34D',
  saved: palette.roseLight,
  error: '#FCA5A5',
  success: '#6EE7B7',

  gradientStart: '#1E1B4B',
  gradientEnd: '#2D2D44',
};
