import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {WidgetPreviewCard} from './WidgetPreviewCard';
import {LockScreenPreviewCard} from './LockScreenPreviewCard';
import {HeartIcon} from './Icons';
import type {QuoteTemplate} from '../templates/templateTypes';
import type {Quote} from '../models/Quote';

interface TemplateCardProps {
  template: QuoteTemplate;
  quote?: Quote | null;
  isActive?: boolean;
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

function TemplateCardBase({
  template,
  quote,
  isActive = false,
  isFavorite = false,
  onPress,
  onToggleFavorite,
}: TemplateCardProps): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.surface,
          borderColor: isActive ? colors.textPrimary : colors.border,
          borderWidth: isActive ? 1.5 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${template.name} template`}>
      {/* Visual Preview Container */}
      <View style={styles.previewContainer}>
        {template.type === 'widget' ? (
          <WidgetPreviewCard template={template} quote={quote} compact />
        ) : (
          <LockScreenPreviewCard template={template} quote={quote} compact />
        )}

        {/* Subtle PRO Indicator */}
        {template.isPremium && (
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        )}

        {/* Active Indicator */}
        {isActive && (
          <View style={[styles.activeBadge, {backgroundColor: colors.primary}]}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        )}
      </View>

      {/* Footer Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.textColumn}>
          <Text
            numberOfLines={1}
            style={[styles.templateName, {color: colors.textPrimary}]}>
            {template.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.categoryName, {color: colors.textTertiary}]}>
            {template.category}
          </Text>
        </View>

        {/* Favorite Heart Button (Clean vector stroke, zero emojis) */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Unfavorite template' : 'Favorite template'}>
          <HeartIcon
            size={16}
            color={isFavorite ? '#DC2626' : colors.textTertiary}
            filled={isFavorite}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    padding: spacing[2],
    marginBottom: spacing[3],
  },
  previewContainer: {
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  proBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: '#171717',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  activeBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[1],
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  textColumn: {
    flex: 1,
    marginRight: spacing[2],
  },
  templateName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  categoryName: {
    fontSize: typography.sizes.xs,
    marginTop: 1,
  },
  favoriteButton: {
    padding: spacing[1],
  },
});

export const TemplateCard = React.memo(TemplateCardBase);
