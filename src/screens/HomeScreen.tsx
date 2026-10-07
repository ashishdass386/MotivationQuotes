import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {QuoteCard} from '../components/QuoteCard';
import {PrimaryButton} from '../components/PrimaryButton';
import {BookmarkIcon, ShareIcon, RefreshIcon} from '../components/Icons';
import {useDailyQuote} from '../hooks/useDailyQuote';
import {shareQuote} from '../utils/shareUtils';
import {getGreeting} from '../utils/dateUtils';

export function HomeScreen(): React.JSX.Element {
  const {colors} = useTheme();
  const {quote, loadState, isSaved, errorMessage, refreshQuote, toggleSave} =
    useDailyQuote();

  const handleSave = async () => {
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

  const isRefreshing = loadState === 'refreshing';
  const greeting = getGreeting();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Minimal Editorial Header */}
        <View style={styles.header}>
          <View style={styles.mastheadRow}>
            <View style={styles.brandTitleContainer}>
              <Image
                source={require('../assets/icon.png')}
                style={styles.brandLogo}
                resizeMode="cover"
              />
              <Text style={[styles.brandTitle, {color: colors.textPrimary}]}>
                MOTIQO
              </Text>
            </View>
            <Text style={[styles.dateText, {color: colors.textTertiary}]}>
              {todayFormatted.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.greetingSub, {color: colors.textSecondary}]}>
            {greeting}
          </Text>
        </View>

        {/* Hero Quote Section */}
        <View style={styles.heroSection}>
          {errorMessage && !quote ? (
            <View style={[styles.errorBox, {borderColor: colors.border}]}>
              <Text style={[styles.errorText, {color: colors.textSecondary}]}>
                {errorMessage}
              </Text>
              <TouchableOpacity
                onPress={handleNewQuote}
                style={[styles.retryBtn, {borderColor: colors.border}]}>
                <Text style={[styles.retryText, {color: colors.textPrimary}]}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : quote ? (
            <QuoteCard quote={quote} animationKey={quote._id} />
          ) : (
            <View style={[styles.loadingBox, {borderColor: colors.border}]}>
              <Text style={[styles.loadingText, {color: colors.textTertiary}]}>
                Loading daily inspiration…
              </Text>
            </View>
          )}
        </View>

        {/* Supporting Controls Section */}
        {quote && (
          <View style={styles.controlsSection}>
            {/* Action Bar (Save & Share) */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.7}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSaved ? colors.textPrimary : colors.border,
                  },
                ]}
                accessible
                accessibilityRole="button"
                accessibilityLabel={isSaved ? 'Remove from saved' : 'Save quote'}>
                <BookmarkIcon
                  size={16}
                  color={isSaved ? colors.textPrimary : colors.textSecondary}
                  filled={isSaved}
                />
                <Text
                  style={[
                    styles.controlText,
                    {
                      color: isSaved ? colors.textPrimary : colors.textSecondary,
                      fontWeight: isSaved ? '600' : '500',
                    },
                  ]}>
                  {isSaved ? 'Saved' : 'Save'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.7}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Share quote">
                <ShareIcon size={16} color={colors.textSecondary} />
                <Text style={[styles.controlText, {color: colors.textSecondary}]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>

            {/* Restrained Primary Button: New Quote */}
            <View style={styles.newQuoteWrapper}>
              <PrimaryButton
                label="New Quote"
                onPress={handleNewQuote}
                loading={isRefreshing}
                variant="solid"
                icon={<RefreshIcon size={15} color="#FFFFFF" />}
                accessibilityLabel="Fetch a new quote"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing[8],
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  mastheadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  brandLogo: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
  },
  brandTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.widest,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  greetingSub: {
    fontSize: typography.sizes.base,
    marginTop: spacing[2],
    letterSpacing: typography.letterSpacing.tight,
  },
  heroSection: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  controlsSection: {
    paddingHorizontal: spacing[6],
    marginTop: spacing[2],
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  controlButton: {
    flex: 1,
    height: 40,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  controlText: {
    fontSize: typography.sizes.sm,
    letterSpacing: typography.letterSpacing.wide,
  },
  newQuoteWrapper: {
    width: '100%',
  },
  errorBox: {
    marginHorizontal: spacing[6],
    padding: spacing[6],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  retryBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  retryText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  loadingBox: {
    marginHorizontal: spacing[6],
    paddingVertical: spacing[12],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.sm,
  },
});
