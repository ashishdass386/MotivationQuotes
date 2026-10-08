import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {ChevronRightIcon} from './Icons';

interface SettingRowProps {
  label: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showDivider?: boolean;
}

function SettingRowBase({
  label,
  description,
  value,
  onPress,
  rightElement,
  showDivider = true,
}: SettingRowProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.divider,
          borderBottomWidth: showDivider ? 1 : 0,
        },
      ]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={onPress ? 0.65 : 1}
      accessible
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}>
      <View style={styles.textContainer}>
        <Text style={[styles.label, {color: colors.textPrimary}]}>
          {label}
        </Text>
        {description ? (
          <Text style={[styles.description, {color: colors.textSecondary}]}>
            {description}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        {rightElement ? (
          rightElement
        ) : (
          <>
            {value ? (
              <Text style={[styles.value, {color: colors.textSecondary}]}>
                {value}
              </Text>
            ) : null}
            {onPress ? <ChevronRightIcon size={14} color={colors.textTertiary} /> : null}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export const SettingRow = React.memo(SettingRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  textContainer: {
    flex: 1,
    marginRight: spacing[4],
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  description: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  value: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
  },
});
