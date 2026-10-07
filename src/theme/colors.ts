// Motiva - Minimal Refined Light Design System Palette
export const palette = {
  // Pure & Paper Neutrals
  white: '#FFFFFF',
  background: '#FAFAF8',
  backgroundSecondary: '#F3F3F0',
  surfaceHover: '#F7F7F5',

  // Borders & Dividers
  border: '#E5E5E0',
  borderLight: '#EDEDEA',
  divider: '#EDEDEA',

  // Typography
  textPrimary: '#171717',
  textSecondary: '#6B6B6B',
  textTertiary: '#8E8E8A',
  textInverse: '#FFFFFF',

  // Accent & Brand (Single restrained dark accent)
  accent: '#1F1F1F',
  accentHover: '#000000',
  accentSubtle: '#F0F0EC',

  // Status & Feedback (Restrained)
  error: '#DC2626',
  errorBackground: '#FEF2F2',
  success: '#16A34A',
  warning: '#D97706',
  info: '#2563EB',
} as const;

export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceVariant: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Brand / Accent
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // UI & Borders
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

  // Gradient (Subtle tonal fallback)
  gradientStart: string;
  gradientEnd: string;
}

// LIGHT THEME ONLY - Motiva is strictly a light-only editorial application
export const lightColors: ThemeColors = {
  background: palette.background,
  backgroundSecondary: palette.backgroundSecondary,
  surface: palette.white,
  surfaceElevated: palette.white,
  surfaceVariant: palette.backgroundSecondary,

  textPrimary: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textTertiary: palette.textTertiary,
  textInverse: palette.textInverse,

  primary: palette.accent,
  primaryLight: '#2E2E2E',
  primaryDark: '#000000',

  border: palette.border,
  borderLight: palette.borderLight,
  divider: palette.divider,

  buttonText: palette.white,
  iconActive: palette.textPrimary,
  iconInactive: palette.textTertiary,

  cardBackground: palette.white,
  cardBorder: palette.border,
  cardShadow: 'rgba(0, 0, 0, 0.03)',

  tabBarBackground: palette.white,
  tabBarBorder: palette.border,

  warning: palette.warning,
  saved: palette.textPrimary,
  error: palette.error,
  success: palette.success,

  gradientStart: palette.background,
  gradientEnd: palette.backgroundSecondary,
};

// Aliased to lightColors - dark theme is completely removed per design directives
export const darkColors: ThemeColors = lightColors;
