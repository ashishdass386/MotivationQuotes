import React from 'react';
import {TouchableOpacity, StyleSheet, type ViewStyle} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {spacing, borderRadius} from '../theme/spacing';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  bordered?: boolean;
  accessibilityLabel: string;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = 40,
  bordered = false,
  accessibilityLabel,
  style,
}: IconButtonProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: borderRadius.base,
          borderWidth: bordered ? 1 : 0,
          borderColor: bordered ? colors.border : 'transparent',
          backgroundColor: bordered ? colors.surface : 'transparent',
        },
        style,
      ]}>
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
