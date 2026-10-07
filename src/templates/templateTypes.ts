export type TemplateType = 'widget' | 'lockscreen';

export type TemplateLayoutType =
  | 'center'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'split'
  | 'card'
  | 'overlay'
  | 'minimal'
  | 'editorial'
  | 'poster'
  | 'magazine';

export type TemplateBackground =
  | {
      type: 'solid';
      value: string;
    }
  | {
      type: 'gradient';
      colors: string[];
      angle?: number;
    }
  | {
      type: 'transparent';
      opacity: number;
    }
  | {
      type: 'glass';
      opacity: number;
      blur: number;
      borderColor?: string;
      borderWidth?: number;
    }
  | {
      type: 'image';
      source: string;
      overlay?: string;
      overlayOpacity?: number;
    };

export type FontFamilyType =
  | 'sans'
  | 'serif'
  | 'mono'
  | 'display'
  | 'rounded'
  | 'condensed'
  | 'handwritten';

export type FontWeightType =
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'black';

export interface TemplateTypography {
  fontFamily: FontFamilyType;
  fontWeight: FontWeightType;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  italic?: boolean;
  uppercase?: boolean;
}

export interface TemplateQuoteConfig {
  showQuoteMarks: boolean;
  quoteMarkStyle?: 'double' | 'single' | 'minimal' | 'none';
  alignment: 'left' | 'center' | 'right';
  maxLines?: number;
  textColor?: string;
}

export interface TemplateAuthorConfig {
  visible: boolean;
  position:
    | 'below'
    | 'above'
    | 'bottom-left'
    | 'bottom-right'
    | 'inline';
  style:
    | 'minimal'
    | 'uppercase'
    | 'italic'
    | 'small'
    | 'bold';
  prefix?: string;
  suffix?: string;
  textColor?: string;
}

export interface TemplateBorderConfig {
  enabled: boolean;
  width: number;
  radius: number;
  color: string;
  opacity: number;
}

export interface TemplateShadowConfig {
  enabled: boolean;
  opacity: number;
  blur: number;
}

export interface TemplateAccentConfig {
  enabled: boolean;
  type: 'line' | 'dot' | 'corner' | 'bar' | 'quote-mark';
  color: string;
}

export interface TemplateSpacingConfig {
  padding: number;
  quoteSpacing: number;
  authorSpacing: number;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  type: TemplateType;
  category: string;
  isPremium: boolean;
  layout: TemplateLayoutType;
  background: TemplateBackground;
  typography: TemplateTypography;
  quote: TemplateQuoteConfig;
  author: TemplateAuthorConfig;
  border?: TemplateBorderConfig;
  shadow?: TemplateShadowConfig;
  accent?: TemplateAccentConfig;
  spacing: TemplateSpacingConfig;
  decorativeElements?: string[];
  tagline?: string;
  badge?: string;

  // Compatibility helpers (optional)
  textColor?: string;
  accentColor?: string;
  authorColor?: string;
  fontStyle?: 'regular' | 'medium' | 'bold' | 'serif' | 'italic';
  alignment?: 'left' | 'center' | 'right';
  showAuthor?: boolean;
  showCategory?: boolean;
  cardStyle?: {
    borderRadius?: number;
    letterSpacing?: number;
    textTransform?: 'none' | 'uppercase' | 'capitalize';
  };
}

export type TemplateFilter = 'All' | 'Free' | 'Premium' | 'Favorites';

export const WIDGET_CATEGORIES = [
  'All',
  'Minimal',
  'Typography',
  'Glass',
  'Transparent',
  'Editorial',
  'Dark',
  'Light',
  'Gradient',
  'Image',
  'Bold',
  'Nature',
  'Aesthetic',
  'Productivity',
  'Developer',
] as const;

export const LOCKSCREEN_CATEGORIES = [
  'All',
  'Minimal',
  'Dark',
  'Typography',
  'Nature',
  'Aesthetic',
  'Editorial',
  'Bold',
  'Glass',
  'Productivity',
] as const;
