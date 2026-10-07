import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {spacing} from '../theme/spacing';

interface DividerProps {
  inset?: boolean;
  marginVertical?: number;
}

export function Divider({
  inset = false,
  marginVertical = 0,
}: DividerProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.divider,
          marginHorizontal: inset ? spacing[6] : 0,
          marginVertical,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
