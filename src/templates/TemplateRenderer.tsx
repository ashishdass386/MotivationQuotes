import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
  Platform,
} from 'react-native';
import type {QuoteTemplate} from './templateTypes';
import type {Quote} from '../models/Quote';

interface TemplateRendererProps {
  template: QuoteTemplate;
  quote?: Quote | null;
  compact?: boolean;
  containerStyle?: ViewStyle;
}

const FALLBACK_QUOTE: Quote = {
  _id: 'default-fallback',
  content: 'The future belongs to those who believe in the beauty of their dreams.',
  author: 'Eleanor Roosevelt',
};

export function TemplateRenderer({
  template,
  quote,
  compact = false,
  containerStyle,
}: TemplateRendererProps): React.JSX.Element {
  const currentQuote = quote || FALLBACK_QUOTE;
  const quoteContent = currentQuote.content.trim();
  const authorName = currentQuote.author.trim();
  const quoteLength = quoteContent.length;

  // Scaling factor for thumbnail compact mode
  const scale = compact ? 0.62 : 1.0;

  // 1. TYPOGRAPHY RESOLUTION
  const getFontFamily = (): string | undefined => {
    switch (template.typography.fontFamily) {
      case 'serif':
        return Platform.select({android: 'serif', ios: 'Georgia'});
      case 'mono':
        return Platform.select({android: 'monospace', ios: 'Courier'});
      case 'display':
        return Platform.select({android: 'sans-serif-condensed', ios: 'System'});
      case 'condensed':
        return Platform.select({android: 'sans-serif-condensed', ios: 'System'});
      case 'rounded':
        return Platform.select({android: 'sans-serif-medium', ios: 'System'});
      case 'handwritten':
        return Platform.select({android: 'serif', ios: 'Georgia'});
      default:
        return Platform.select({android: 'sans-serif', ios: 'System'});
    }
  };

  const getFontWeight = (): TextStyle['fontWeight'] => {
    switch (template.typography.fontWeight) {
      case 'black':
        return '900';
      case 'bold':
        return '700';
      case 'semibold':
        return '600';
      case 'medium':
        return '500';
      default:
        return '400';
    }
  };

  // Dynamic font size adaptation based on length
  let baseFontSize = template.typography.fontSize;
  let baseLineHeight = template.typography.lineHeight;

  if (quoteLength > 115) {
    baseFontSize = Math.max(13, baseFontSize * 0.86);
    baseLineHeight = Math.max(18, baseLineHeight * 0.88);
  } else if (quoteLength < 40 && template.layout === 'poster') {
    baseFontSize = baseFontSize * 1.15;
    baseLineHeight = baseLineHeight * 1.12;
  }

  const quoteFontSize = Math.round(baseFontSize * scale);
  const quoteLineHeight = Math.round(baseLineHeight * scale);
  const letterSpacing = template.typography.letterSpacing
    ? Math.round(template.typography.letterSpacing * scale)
    : undefined;

  // Quote text formatting
  let formattedQuote = quoteContent;
  if (template.typography.uppercase) {
    formattedQuote = formattedQuote.toUpperCase();
  }

  const quoteMarkStyle = template.quote.quoteMarkStyle ?? 'double';
  const showQuoteMarks = template.quote.showQuoteMarks;

  let quoteDisplayText = formattedQuote;
  if (showQuoteMarks && quoteMarkStyle === 'double') {
    quoteDisplayText = `“${formattedQuote}”`;
  } else if (showQuoteMarks && quoteMarkStyle === 'single') {
    quoteDisplayText = `‘${formattedQuote}’`;
  }

  // Quote color
  const quoteTextColor =
    template.quote.textColor ||
    template.textColor ||
    (template.background.type === 'solid' && template.background.value === '#FFFFFF'
      ? '#0F172A'
      : '#FFFFFF');

  // Author color
  const authorTextColor =
    template.author.textColor ||
    template.authorColor ||
    template.accentColor ||
    (quoteTextColor === '#0F172A' ? '#64748B' : 'rgba(255, 255, 255, 0.7)');

  // 2. BACKGROUND RESOLUTION
  const getBackgroundStyles = (): ViewStyle => {
    const bg = template.background;
    switch (bg.type) {
      case 'solid':
        return {backgroundColor: bg.value};
      case 'gradient':
        return {backgroundColor: bg.colors[0]};
      case 'transparent':
        return {
          backgroundColor:
            bg.opacity === 0
              ? 'transparent'
              : `rgba(15, 23, 42, ${bg.opacity})`,
        };
      case 'glass':
        return {
          backgroundColor:
            bg.borderColor?.includes('0, 0, 0')
              ? `rgba(255, 255, 255, ${bg.opacity})`
              : `rgba(24, 24, 27, ${bg.opacity})`,
          borderColor: bg.borderColor || 'rgba(255, 255, 255, 0.18)',
          borderWidth: bg.borderWidth ?? (compact ? 0.75 : 1),
        };
      case 'image':
        return {
          backgroundColor: '#0F172A',
        };
      default:
        return {backgroundColor: '#18181B'};
    }
  };

  // 3. BORDER & RADIUS
  const borderRadius = Math.round(
    (template.border?.radius ?? 16) * (compact ? 0.7 : 1),
  );
  const borderWidth = template.border?.enabled
    ? template.border.width * (compact ? 0.8 : 1)
    : undefined;
  const borderColor = template.border?.enabled
    ? template.border.color
    : undefined;

  // 4. SPACING & PADDING
  const padding = Math.round(template.spacing.padding * scale);
  const quoteSpacing = Math.round(template.spacing.quoteSpacing * scale);
  const authorSpacing = Math.round(template.spacing.authorSpacing * scale);

  // 5. ALIGNMENT
  const getAlignItems = (): ViewStyle['alignItems'] => {
    switch (template.quote.alignment) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  };

  const getJustifyContent = (): ViewStyle['justifyContent'] => {
    switch (template.layout) {
      case 'top':
        return 'flex-start';
      case 'bottom':
        return 'flex-end';
      case 'split':
      case 'editorial':
      case 'magazine':
        return 'space-between';
      default:
        return 'center';
    }
  };

  // 6. AUTHOR FORMATTING
  const renderAuthor = () => {
    if (!template.author.visible) {
      return null;
    }

    const prefix = template.author.prefix ?? '— ';
    const suffix = template.author.suffix ?? '';
    let authorDisplay = `${prefix}${authorName}${suffix}`;

    if (template.author.style === 'uppercase') {
      authorDisplay = authorDisplay.toUpperCase();
    }

    const authorFontWeight: TextStyle['fontWeight'] =
      template.author.style === 'bold'
        ? '700'
        : template.author.style === 'small'
        ? '400'
        : '500';

    const authorFontSize = Math.round(
      (template.author.style === 'small' ? 9.5 : 11.5) * scale,
    );

    return (
      <View
        style={[
          styles.authorContainer,
          {
            marginTop: template.author.position === 'above' ? 0 : authorSpacing,
            marginBottom: template.author.position === 'above' ? authorSpacing : 0,
            alignSelf:
              template.author.position === 'bottom-left'
                ? 'flex-start'
                : template.author.position === 'bottom-right'
                ? 'flex-end'
                : template.quote.alignment === 'left'
                ? 'flex-start'
                : template.quote.alignment === 'right'
                ? 'flex-end'
                : 'center',
          },
        ]}>
        <Text
          numberOfLines={1}
          style={[
            styles.authorText,
            {
              color: authorTextColor,
              fontSize: authorFontSize,
              fontWeight: authorFontWeight,
              fontStyle:
                template.author.style === 'italic' ? 'italic' : 'normal',
              letterSpacing:
                template.author.style === 'uppercase' ? 1.2 * scale : undefined,
              fontFamily: getFontFamily(),
            },
          ]}>
          {authorDisplay}
        </Text>
      </View>
    );
  };

  // 7. ACCENTS
  const renderAccent = () => {
    if (!template.accent?.enabled) {
      return null;
    }

    if (template.accent.type === 'line') {
      return (
        <View
          style={[
            styles.accentLine,
            {
              backgroundColor: template.accent.color,
              height: Math.max(1, Math.round(1 * scale)),
              width: compact ? 28 : 44,
              marginVertical: quoteSpacing / 2,
              alignSelf:
                template.quote.alignment === 'left'
                  ? 'flex-start'
                  : template.quote.alignment === 'right'
                  ? 'flex-end'
                  : 'center',
            },
          ]}
        />
      );
    }

    if (template.accent.type === 'dot') {
      return (
        <View
          style={[
            styles.accentDot,
            {
              backgroundColor: template.accent.color,
              width: compact ? 4 : 6,
              height: compact ? 4 : 6,
              borderRadius: 3,
              marginVertical: quoteSpacing / 2,
              alignSelf:
                template.quote.alignment === 'left'
                  ? 'flex-start'
                  : template.quote.alignment === 'right'
                  ? 'flex-end'
                  : 'center',
            },
          ]}
        />
      );
    }

    return null;
  };

  // Decorative giant quote mark
  const renderMinimalQuoteMark = () => {
    if (showQuoteMarks && quoteMarkStyle === 'minimal') {
      return (
        <Text
          style={[
            styles.minimalQuoteMark,
            {
              color: template.accent?.color || authorTextColor,
              fontSize: Math.round(28 * scale),
              lineHeight: Math.round(24 * scale),
              alignSelf:
                template.quote.alignment === 'right'
                  ? 'flex-end'
                  : template.quote.alignment === 'center'
                  ? 'center'
                  : 'flex-start',
            },
          ]}>
          “
        </Text>
      );
    }
    return null;
  };

  // Header tag/masthead for editorial/magazine/split templates
  const renderHeaderTag = () => {
    if (
      template.layout === 'editorial' ||
      template.layout === 'magazine' ||
      template.layout === 'split'
    ) {
      return (
        <View
          style={[
            styles.mastheadRow,
            {
              marginBottom: quoteSpacing,
              borderBottomColor:
                template.accent?.color || 'rgba(255, 255, 255, 0.12)',
              borderBottomWidth: template.layout === 'editorial' ? 0.75 : 0,
              paddingBottom: template.layout === 'editorial' ? 4 * scale : 0,
            },
          ]}>
          <Text
            numberOfLines={1}
            style={[
              styles.mastheadText,
              {
                color: template.accent?.color || authorTextColor,
                fontSize: Math.round(8.5 * scale),
                letterSpacing: 1.5 * scale,
              },
            ]}>
            {template.tagline?.toUpperCase() ||
              template.category.toUpperCase() ||
              'MOTIQO'}
          </Text>
          <Text
            style={[
              styles.mastheadSub,
              {
                color: authorTextColor,
                fontSize: Math.round(7.5 * scale),
                opacity: 0.7,
              },
            ]}>
            DAILY REFLECTION
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.rootContainer,
        getBackgroundStyles(),
        {
          padding,
          borderRadius,
          borderWidth,
          borderColor,
          justifyContent: getJustifyContent(),
          alignItems: getAlignItems(),
        },
        containerStyle,
      ]}>
      {/* Background Image / Scenic Overlay Simulation */}
      {template.background.type === 'image' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: `rgba(0, 0, 0, ${
                template.background.overlayOpacity ?? 0.45
              })`,
              borderRadius,
            },
          ]}
        />
      )}

      {/* Vertical Accent Bar (e.g. Focus, Productivity) */}
      {template.accent?.enabled && template.accent.type === 'bar' && (
        <View
          style={[
            styles.verticalAccentBar,
            {
              backgroundColor: template.accent.color,
              width: Math.max(2, Math.round(3 * scale)),
              borderTopLeftRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
            },
          ]}
        />
      )}

      {/* Corner Bracket Decorations */}
      {template.accent?.enabled && template.accent.type === 'corner' && (
        <>
          <View
            style={[
              styles.cornerBracketTopLeft,
              {
                borderColor: template.accent.color,
                width: 12 * scale,
                height: 12 * scale,
              },
            ]}
          />
          <View
            style={[
              styles.cornerBracketBottomRight,
              {
                borderColor: template.accent.color,
                width: 12 * scale,
                height: 12 * scale,
              },
            ]}
          />
        </>
      )}

      {/* Optional Editorial Header */}
      {renderHeaderTag()}

      {/* Author Above Position */}
      {template.author.visible &&
        template.author.position === 'above' &&
        renderAuthor()}

      {/* Minimal Standalone Quote Mark */}
      {renderMinimalQuoteMark()}

      {/* Main Quote Text */}
      <View
        style={[
          styles.quoteWrapper,
          {
            alignItems: getAlignItems(),
          },
        ]}>
        <Text
          numberOfLines={compact ? 4 : template.quote.maxLines || 6}
          style={[
            styles.quoteText,
            {
              color: quoteTextColor,
              fontSize: quoteFontSize,
              lineHeight: quoteLineHeight,
              fontFamily: getFontFamily(),
              fontWeight: getFontWeight(),
              fontStyle: template.typography.italic ? 'italic' : 'normal',
              letterSpacing,
              textAlign: template.quote.alignment,
            },
          ]}>
          {quoteDisplayText}
        </Text>
      </View>

      {/* Accent Line or Dot */}
      {renderAccent()}

      {/* Author Below / Bottom Positions */}
      {template.author.visible &&
        template.author.position !== 'above' &&
        renderAuthor()}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  quoteWrapper: {
    width: '100%',
  },
  quoteText: {
    includeFontPadding: false,
  },
  authorContainer: {
    maxWidth: '100%',
  },
  authorText: {
    includeFontPadding: false,
  },
  accentLine: {
    borderRadius: 1,
  },
  accentDot: {},
  minimalQuoteMark: {
    fontWeight: '700',
    marginBottom: 2,
    includeFontPadding: false,
  },
  verticalAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  cornerBracketTopLeft: {
    position: 'absolute',
    top: 6,
    left: 6,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  cornerBracketBottomRight: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
  },
  mastheadRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mastheadText: {
    fontWeight: '700',
  },
  mastheadSub: {
    fontWeight: '600',
  },
});
