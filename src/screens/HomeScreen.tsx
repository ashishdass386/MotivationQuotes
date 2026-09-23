import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {QuoteCard} from '../components/QuoteCard';
import {PrimaryButton} from '../components/PrimaryButton';
import {LoadingView} from '../components/LoadingView';
import {useDailyQuote} from '../hooks/useDailyQuote';
import {shareQuote} from '../utils/shareUtils';
import {getGreeting} from '../utils/dateUtils';

export function HomeScreen(): React.JSX.Element {
  const {colors, isDark} = useTheme();
  const {quote, loadState, isSaved, errorMessage, refreshQuote, toggleSave} =
    useDailyQuote();
  const heartScale = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [headerFade]);

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.4,
        tension: 300,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSave = async () => {
    animateHeart();
    await toggleSave();
  };

  const handleShare = async () => {
    if (!quote) {
      return;
    }
    try {
      await shareQuote(quote);
    } catch {
      Alert.alert('Share failed', 'Could not open the share sheet.');
    }
  };

  const handleNewQuote = async () => {
    await refreshQuote();
  };

  const isLoading = loadState === 'loading';
  const isRefreshing = loadState === 'refreshing';

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing[10],
    },
    header: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[6],
      paddingBottom: spacing[4],
    },
    appName: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.extrabold,
      color: colors.primary,
      letterSpacing: typography.letterSpacing.widest,
      textTransform: 'uppercase',
      marginBottom: spacing[1],
    },
    greeting: {
      fontSize: typography.sizes['3xl'],
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      letterSpacing: typography.letterSpacing.tight,
    },
    greetingAccent: {
      color: colors.primary,
    },
    dailyLabel: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.semibold,
      color: colors.textTertiary,
      letterSpacing: typography.letterSpacing.widest,
      textTransform: 'uppercase',
      textAlign: 'center',
      marginTop: spacing[6],
      marginBottom: spacing[4],
    },
    cardSection: {
      flex: 1,
    },
    errorBox: {
      marginHorizontal: spacing[5],
      padding: spacing[4],
      backgroundColor: colors.error + '15',
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.error + '40',
    },
    errorText: {
      fontSize: typography.sizes.sm,
      color: colors.error,
      textAlign: 'center',
      fontWeight: typography.weights.medium,
    },
    actionsSection: {
      paddingHorizontal: spacing[5],
      marginTop: spacing[8],
    },
    newQuoteButton: {
      marginBottom: spacing[4],
    },
    secondaryActions: {
      flexDirection: 'row',
      gap: spacing[3],
    },
    actionButton: {
      flex: 1,
    },
    heartContainer: {
      alignItems: 'center',
    },
    heartEmoji: {
      fontSize: 18,
    },
    offlineBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: spacing[3],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      backgroundColor: '#F59E0B20',
      borderRadius: borderRadius.full,
    },
    offlineText: {
      fontSize: typography.sizes.xs,
      color: '#F59E0B',
      fontWeight: typography.weights.medium,
      marginLeft: spacing[1],
    },
  });

  const greeting = getGreeting();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, {opacity: headerFade}]}>
          <Text style={styles.appName}>Motiva</Text>
          <Text style={styles.greeting}>
            {greeting.split(' ')[0]}{' '}
            <Text style={styles.greetingAccent}>
              {greeting.split(' ').slice(1).join(' ')}
            </Text>
          </Text>
        </Animated.View>

        {/* Section label */}
        <Text style={styles.dailyLabel}>Daily Motivation</Text>

        {/* Quote area */}
        <View style={styles.cardSection}>
          {isLoading ? (
            <LoadingView message="Finding your daily quote…" />
          ) : errorMessage && !quote ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : quote ? (
            <QuoteCard quote={quote} animationKey={quote._id} />
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.newQuoteButton}>
            <PrimaryButton
              label="New Quote"
              onPress={handleNewQuote}
              loading={isRefreshing}
              disabled={isLoading || isRefreshing}
              accessibilityLabel="Fetch a new motivational quote"
            />
          </View>

          <View style={styles.secondaryActions}>
            {/* Save button */}
            <View style={styles.actionButton}>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!quote || isLoading}
                accessible
                accessibilityRole="button"
                accessibilityLabel={isSaved ? 'Unsave quote' : 'Save quote'}
                accessibilityState={{selected: isSaved}}
                style={[
                  styles.actionButton,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: spacing[3],
                    borderRadius: borderRadius['3xl'],
                    borderWidth: 1.5,
                    borderColor: isSaved ? colors.saved : colors.border,
                    backgroundColor: isSaved
                      ? colors.saved + '15'
                      : 'transparent',
                    minHeight: 48,
                  },
                ]}>
                <Animated.Text
                  style={[
                    styles.heartEmoji,
                    {
                      transform: [{scale: heartScale}],
                      marginRight: spacing[2],
                    },
                  ]}>
                  {isSaved ? '♥' : '♡'}
                </Animated.Text>
                <Text
                  style={{
                    fontSize: typography.sizes.base,
                    fontWeight: typography.weights.semibold,
                    color: isSaved ? colors.saved : colors.textSecondary,
                    letterSpacing: typography.letterSpacing.wide,
                  }}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Share button */}
            <View style={styles.actionButton}>
              <PrimaryButton
                label="Share"
                onPress={handleShare}
                disabled={!quote || isLoading}
                variant="outline"
                accessibilityLabel="Share this quote"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
