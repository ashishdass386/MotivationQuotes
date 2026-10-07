import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({
  message = 'Loading…',
}: LoadingViewProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={[styles.message, {color: colors.textSecondary}]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
  },
  message: {
    fontSize: typography.sizes.sm,
    letterSpacing: typography.letterSpacing.wide,
    marginTop: spacing[3],
  },
});
