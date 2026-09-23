import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({
  emoji = '✨',
  title,
  subtitle,
}: EmptyStateProps): React.JSX.Element {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[8],
    },
    emojiText: {
      fontSize: 56,
      marginBottom: spacing[5],
    },
    title: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing[3],
    },
    subtitle: {
      fontSize: typography.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emojiText} importantForAccessibility="no">
        {emoji}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
