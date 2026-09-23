import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius, shadow} from '../theme/spacing';
import type {Quote} from '../models/Quote';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface QuoteCardProps {
  quote: Quote;
  animationKey?: string | number;
}

export function QuoteCard({quote, animationKey}: QuoteCardProps): React.JSX.Element {
  const {colors} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius['2xl'],
      padding: spacing[7],
      marginHorizontal: spacing[4],
      borderWidth: 1,
      borderColor: colors.cardBorder,
      ...shadow.lg,
      shadowColor: colors.primary,
    },
    quoteMarkTop: {
      fontSize: 80,
      lineHeight: 80,
      color: colors.primary,
      opacity: 0.2,
      fontFamily: typography.fontFamily?.bold ?? 'sans-serif',
      marginBottom: -16,
      marginTop: -8,
    },
    quoteText: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.medium,
      color: colors.textPrimary,
      lineHeight: typography.sizes.lg * typography.lineHeights.relaxed,
      fontStyle: 'italic',
      letterSpacing: typography.letterSpacing.tight,
    },
    divider: {
      height: 2,
      backgroundColor: colors.primary,
      opacity: 0.2,
      marginVertical: spacing[5],
      borderRadius: borderRadius.full,
      width: 48,
    },
    authorRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorDash: {
      fontSize: typography.sizes.base,
      color: colors.primary,
      marginRight: spacing[2],
      fontWeight: typography.weights.bold,
    },
    authorName: {
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.semibold,
      color: colors.textSecondary,
      letterSpacing: typography.letterSpacing.wide,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing[4],
      gap: spacing[2],
    },
    tag: {
      backgroundColor: colors.primary + '18',
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
    },
    tagText: {
      fontSize: typography.sizes.xs,
      color: colors.primary,
      fontWeight: typography.weights.semibold,
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wider,
    },
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Quote by ${quote.author}: ${quote.content}`}>
      <Text style={styles.quoteMarkTop} importantForAccessibility="no">
        "
      </Text>
      <Text style={styles.quoteText} numberOfLines={12}>
        {quote.content}
      </Text>
      <View style={styles.divider} />
      <View style={styles.authorRow}>
        <Text style={styles.authorDash}>—</Text>
        <Text style={styles.authorName} numberOfLines={2}>
          {quote.author}
        </Text>
      </View>
      {quote.tags && quote.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {quote.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

export const QUOTE_CARD_MIN_WIDTH = SCREEN_WIDTH - spacing[8];
