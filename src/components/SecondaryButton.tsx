import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  style,
}: SecondaryButtonProps): React.JSX.Element {
  const {colors} = useTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{disabled: isDisabled, busy: loading}}
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: isDisabled ? colors.borderLight : colors.border,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.textPrimary} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text
            style={[
              styles.label,
              {
                color: isDisabled ? colors.textTertiary : colors.textPrimary,
              },
            ]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing[2],
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    letterSpacing: typography.letterSpacing.wide,
  },
});
