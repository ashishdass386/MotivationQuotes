import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, Easing} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({
  message = 'Finding your inspiration…',
}: LoadingViewProps): React.JSX.Element {
  const {colors} = useTheme();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -8,
            duration: 350,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 350,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ]),
      );

    const a1 = animateDot(dot1, 0);
    const a2 = animateDot(dot2, 150);
    const a3 = animateDot(dot3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[8],
    },
    dotsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[6],
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      marginHorizontal: spacing[1],
    },
    message: {
      fontSize: typography.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
      fontWeight: typography.weights.medium,
    },
  });

  return (
    <View style={styles.container} accessible accessibilityLabel={message}>
      <View style={styles.dotsRow}>
        {[dot1, dot2, dot3].map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, {transform: [{translateY: anim}]}]}
          />
        ))}
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
