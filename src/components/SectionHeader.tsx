import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: object;
}

function SectionHeaderBase({
  title,
  actionText,
  onActionPress,
  style,
}: SectionHeaderProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, {color: colors.textTertiary}]}>
        {title.toUpperCase()}
      </Text>
      {actionText ? (
        <Text
          onPress={onActionPress}
          style={[styles.action, {color: colors.textSecondary}]}>
          {actionText}
        </Text>
      ) : null}
    </View>
  );
}

export const SectionHeader = React.memo(SectionHeaderBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  title: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.widest,
  },
  action: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});
