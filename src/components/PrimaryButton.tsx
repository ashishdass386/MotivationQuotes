import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  accessibilityLabel?: string;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'solid',
  icon,
  accessibilityLabel,
}: PrimaryButtonProps): React.JSX.Element {
  const {colors} = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const isDisabled = disabled || loading;

  const containerStyle = (() => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isDisabled ? colors.textTertiary : colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: isDisabled ? colors.textTertiary : colors.primary,
          borderWidth: 0,
        };
    }
  })();

  const textColor = (() => {
    if (isDisabled) {
      return variant === 'solid' ? colors.textInverse : colors.textTertiary;
    }
    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.buttonText;
    }
  })();

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{disabled: isDisabled, busy: loading}}
        style={[styles.button, containerStyle]}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'solid' ? colors.buttonText : colors.primary}
          />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <Text style={[styles.label, {color: textColor}]}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing[2],
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
});
