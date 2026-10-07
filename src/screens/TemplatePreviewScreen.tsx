import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {PrimaryButton} from '../components/PrimaryButton';
import {WidgetPreviewCard} from '../components/WidgetPreviewCard';
import {LockScreenPreviewCard} from '../components/LockScreenPreviewCard';
import {ChevronLeftIcon, HeartIcon} from '../components/Icons';
import {getTemplateById} from '../templates/templateRegistry';
import {
  getSelectedWidgetTemplateId,
  setSelectedWidgetTemplateId,
  getSelectedLockScreenTemplateId,
  setSelectedLockScreenTemplateId,
  getFavoriteTemplateIds,
  toggleFavoriteTemplate,
} from '../storage/templateStorage';
import {
  pinWidgetToHomeScreen,
  getInstalledWidgetsCount,
} from '../native/QuoteWidget';
import {useDailyQuote} from '../hooks/useDailyQuote';

export function TemplatePreviewScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}): React.JSX.Element {
  const {templateId} = route.params;
  const {colors} = useTheme();
  const {quote} = useDailyQuote();

  const template = getTemplateById(templateId);

  const [isActive, setIsActive] = useState(false);
  const [isFavorite, setIsFav] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    async function checkState() {
      if (!template) {
        return;
      }
      try {
        if (template.type === 'widget') {
          const currentId = await getSelectedWidgetTemplateId();
          setIsActive(currentId === template.id);
        } else {
          const currentLockId = await getSelectedLockScreenTemplateId();
          setIsActive(currentLockId === template.id);
        }

        const favs = await getFavoriteTemplateIds();
        setIsFav(favs.includes(template.id));
      } catch {
        // ignore
      }
    }
    checkState();
  }, [template]);

  if (!template) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: colors.textPrimary}]}>
            Template not found
          </Text>
          <PrimaryButton
            label="Back to templates"
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = async () => {
    const nextFav = await toggleFavoriteTemplate(template.id);
    setIsFav(nextFav);
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      if (template.type === 'widget') {
        await setSelectedWidgetTemplateId(template.id);
        setIsActive(true);

        const count = await getInstalledWidgetsCount();
        if (count > 0) {
          Alert.alert(
            'Template Applied',
            `"${template.name}" is now active on your home screen widget.`,
          );
        } else {
          Alert.alert(
            'Template Activated',
            `"${template.name}" is selected.\n\nAdd the widget to your Home Screen now?`,
            [
              {
                text: 'Add to Home Screen',
                onPress: async () => {
                  await pinWidgetToHomeScreen();
                },
              },
              {
                text: 'Later',
                style: 'cancel',
              },
            ],
          );
        }
      } else {
        await setSelectedLockScreenTemplateId(template.id);
        setIsActive(true);
        Alert.alert(
          'Template Applied',
          `"${template.name}" is now active for your morning quotes.`,
        );
      }
    } catch {
      Alert.alert('Error', 'Could not apply template.');
    } finally {
      setIsApplying(false);
    }
  };

  const handlePinWidget = async () => {
    try {
      await setSelectedWidgetTemplateId(template.id);
      setIsActive(true);
      const success = await pinWidgetToHomeScreen();
      if (!success) {
        Alert.alert(
          'Add Widget Manually',
          '1. Go to your phone\'s Home Screen.\n2. Long press any empty space.\n3. Tap "Widgets".\n4. Choose "Motiqo" to place this widget.',
        );
      }
    } catch {
      Alert.alert('Error', 'Could not pin widget.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}
      edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Navigation Header */}
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Back to templates"
          style={styles.backButton}>
          <ChevronLeftIcon size={18} color={colors.textPrimary} />
          <Text style={[styles.backText, {color: colors.textPrimary}]}>
            Back
          </Text>
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={[styles.headerTitle, {color: colors.textPrimary}]}>
          {template.name}
        </Text>

        <TouchableOpacity
          onPress={handleToggleFavorite}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Unfavorite' : 'Favorite'}
          style={styles.heartButton}>
          <HeartIcon
            size={18}
            color={isFavorite ? '#DC2626' : colors.textTertiary}
            filled={isFavorite}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Large Realistic Mockup Canvas */}
        <View style={styles.canvasContainer}>
          <Text style={[styles.canvasLabel, {color: colors.textTertiary}]}>
            {template.type === 'widget'
              ? 'HOME SCREEN PREVIEW'
              : 'LOCK SCREEN PREVIEW'}
          </Text>

          {template.type === 'widget' ? (
            <View style={styles.widgetWrapper}>
              <WidgetPreviewCard template={template} quote={quote} />
            </View>
          ) : (
            <View style={styles.lockScreenWrapper}>
              <LockScreenPreviewCard template={template} quote={quote} />
            </View>
          )}
        </View>

        {/* Info & Specifications Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.titleRow}>
            <View style={{flex: 1}}>
              <Text style={[styles.name, {color: colors.textPrimary}]}>
                {template.name}
              </Text>
              <Text style={[styles.meta, {color: colors.textTertiary}]}>
                {template.type === 'widget' ? 'Widget Design' : 'Lock Screen'}{' '}
                • {template.category}
              </Text>
            </View>

            {isActive && (
              <View style={[styles.activeTag, {backgroundColor: colors.primary}]}>
                <Text style={styles.activeTagText}>CURRENT ACTIVE</Text>
              </View>
            )}
          </View>

          {template.tagline && (
            <Text style={[styles.description, {color: colors.textSecondary}]}>
              {template.tagline}. Designed for daily reflection with real-time
              quote synchronization.
            </Text>
          )}

          {/* Design Specifications Bar */}
          <View style={styles.specBadgesRow}>
            <View
              style={[
                styles.specBadge,
                {backgroundColor: colors.surfaceVariant, borderColor: colors.border},
              ]}>
              <Text style={[styles.specBadgeLabel, {color: colors.textTertiary}]}>
                LAYOUT
              </Text>
              <Text style={[styles.specBadgeVal, {color: colors.textPrimary}]}>
                {template.layout.toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.specBadge,
                {backgroundColor: colors.surfaceVariant, borderColor: colors.border},
              ]}>
              <Text style={[styles.specBadgeLabel, {color: colors.textTertiary}]}>
                TYPOGRAPHY
              </Text>
              <Text style={[styles.specBadgeVal, {color: colors.textPrimary}]}>
                {template.typography.fontFamily.toUpperCase()}
              </Text>
            </View>
            <View
              style={[
                styles.specBadge,
                {backgroundColor: colors.surfaceVariant, borderColor: colors.border},
              ]}>
              <Text style={[styles.specBadgeLabel, {color: colors.textTertiary}]}>
                AUTHOR
              </Text>
              <Text style={[styles.specBadgeVal, {color: colors.textPrimary}]}>
                {template.author.visible
                  ? template.author.position.toUpperCase()
                  : 'HIDDEN'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionWrapper}>
            <PrimaryButton
              label={isActive ? 'Currently Active' : 'Use This Template'}
              onPress={handleApply}
              loading={isApplying}
              disabled={isActive}
              variant={isActive ? 'outline' : 'solid'}
            />

            {template.type === 'widget' && (
              <View style={{marginTop: spacing[3]}}>
                <PrimaryButton
                  label="Add to Phone Home Screen"
                  onPress={handlePinWidget}
                  variant="outline"
                  accessibilityLabel="Add widget to phone home screen"
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  headerTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.tight,
    maxWidth: 200,
  },
  heartButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: spacing[12],
  },
  canvasContainer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    alignItems: 'center',
  },
  canvasLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing[3],
  },
  widgetWrapper: {
    width: '100%',
    maxWidth: 380,
  },
  lockScreenWrapper: {
    width: '100%',
    maxWidth: 320,
  },
  infoCard: {
    marginHorizontal: spacing[6],
    marginTop: spacing[6],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[6],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  meta: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  activeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  description: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: spacing[3],
  },
  specBadgesRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  specBadge: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  specBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  specBadgeVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionWrapper: {
    marginTop: spacing[5],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  errorText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing[4],
  },
});
