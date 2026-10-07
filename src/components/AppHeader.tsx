import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showDivider?: boolean;
}

export function AppHeader({
  title = 'MOTIVA',
  subtitle,
  rightElement,
  showDivider = true,
}: AppHeaderProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: showDivider ? 1 : 0,
        },
      ]}>
      <View style={styles.titleColumn}>
        <Text style={[styles.title, {color: colors.textPrimary}]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleColumn: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
    letterSpacing: typography.letterSpacing.normal,
  },
  right: {
    marginLeft: spacing[3],
  },
});
