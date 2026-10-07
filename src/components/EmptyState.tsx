import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export function EmptyState({
  title,
  subtitle,
  actionText,
  onActionPress,
}: EmptyStateProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: colors.textPrimary}]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          {subtitle}
        </Text>
      ) : null}
      {actionText && onActionPress ? (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          style={styles.actionBtn}>
          <Text style={[styles.actionText, {color: colors.primary}]}>
            {actionText} →
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[12],
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: spacing[5],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  actionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
});
