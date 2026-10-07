import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import type {Quote} from '../models/Quote';

interface QuoteCardProps {
  quote: Quote;
  animationKey?: string | number;
}

export function QuoteCard({quote, animationKey}: QuoteCardProps): React.JSX.Element {
  const {colors} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey]);

  const quoteContent = quote.content.trim();
  const authorName = quote.author?.trim() || 'Anonymous';
  const isLong = quoteContent.length > 120;

  const quoteFontFamily = Platform.select({
    android: 'serif',
    default: 'Georgia',
  });

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View
        style={[
          styles.editorialCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}>
        {/* Subtle Category or Daily Tag */}
        <View style={styles.topRow}>
          <Text style={[styles.categoryTag, {color: colors.textTertiary}]}>
            DAILY REFLECTION
          </Text>
        </View>

        {/* Hero Quote Typography */}
        <View style={styles.quoteBody}>
          <Text
            style={[
              styles.quoteText,
              {
                color: colors.textPrimary,
                fontFamily: quoteFontFamily,
                fontSize: isLong ? typography.sizes.lg : typography.sizes.xl,
                lineHeight: isLong ? 28 : 34,
              },
            ]}>
            “{quoteContent}”
          </Text>
        </View>

        {/* Minimal Hairline Accent */}
        <View style={[styles.rule, {backgroundColor: colors.border}]} />

        {/* Author Citation */}
        <View style={styles.authorRow}>
          <Text style={[styles.authorName, {color: colors.textSecondary}]}>
            — {authorName}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing[6],
  },
  editorialCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[7],
    paddingTop: spacing[7],
    paddingBottom: spacing[7],
  },
  topRow: {
    marginBottom: spacing[4],
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  quoteBody: {
    marginVertical: spacing[2],
  },
  quoteText: {
    letterSpacing: -0.2,
  },
  rule: {
    height: 1,
    width: 32,
    marginTop: spacing[6],
    marginBottom: spacing[4],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
});
