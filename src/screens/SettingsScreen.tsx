import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import type {ThemeMode} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius, shadow} from '../theme/spacing';

const APP_VERSION = '1.0.0';

function SettingsRow({
  label,
  value,
  onPress,
  isLast = false,
  description,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  description?: string;
}): React.JSX.Element {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: colors.divider,
    },
    labelGroup: {flex: 1},
    label: {
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.medium,
      color: colors.textPrimary,
    },
    description: {
      fontSize: typography.sizes.sm,
      color: colors.textTertiary,
      marginTop: 2,
    },
    value: {
      fontSize: typography.sizes.sm,
      color: colors.textSecondary,
      fontWeight: typography.weights.medium,
    },
    chevron: {
      fontSize: typography.sizes.base,
      color: colors.textTertiary,
      marginLeft: spacing[2],
    },
  });

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      accessible
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}>
      <View style={styles.labelGroup}>
        <Text style={styles.label}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </TouchableOpacity>
  );
}

function ThemePicker(): React.JSX.Element {
  const {colors, themeMode, setThemeMode} = useTheme();
  const options: {label: string; mode: ThemeMode; emoji: string}[] = [
    {label: 'System Default', mode: 'system', emoji: '🌗'},
    {label: 'Light', mode: 'light', emoji: '☀️'},
    {label: 'Dark', mode: 'dark', emoji: '🌙'},
  ];

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      gap: spacing[3],
    },
    option: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing[4],
      borderRadius: borderRadius.xl,
      borderWidth: 1.5,
    },
    emoji: {
      fontSize: 22,
      marginBottom: spacing[1],
    },
    optLabel: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.semibold,
      letterSpacing: typography.letterSpacing.wide,
    },
  });

  return (
    <View style={styles.row}>
      {options.map(opt => {
        const isSelected = themeMode === opt.mode;
        return (
          <TouchableOpacity
            key={opt.mode}
            style={[
              styles.option,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected
                  ? colors.primary + '18'
                  : colors.surface,
              },
            ]}
            onPress={() => setThemeMode(opt.mode)}
            accessible
            accessibilityRole="radio"
            accessibilityState={{selected: isSelected}}
            accessibilityLabel={`Set theme to ${opt.label}`}>
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <Text
              style={[
                styles.optLabel,
                {color: isSelected ? colors.primary : colors.textSecondary},
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    section: {
      marginBottom: spacing[6],
    },
    sectionTitle: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.bold,
      color: colors.primary,
      letterSpacing: typography.letterSpacing.widest,
      textTransform: 'uppercase',
      paddingHorizontal: spacing[5],
      marginBottom: spacing[2],
      marginTop: spacing[5],
    },
    card: {
      marginHorizontal: spacing[4],
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      ...shadow.sm,
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function SettingsScreen(): React.JSX.Element {
  const {colors, isDark} = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[6],
      paddingBottom: spacing[5],
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    title: {
      fontSize: typography.sizes['2xl'],
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
    },
    scrollContent: {
      paddingBottom: spacing[16],
    },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <SettingsSection title="Appearance">
          <ThemePicker />
        </SettingsSection>

        {/* Widget */}
        <SettingsSection title="Home Screen Widget">
          <SettingsRow
            label="Daily Quote Widget"
            description="Add the Motiva widget to your home screen to see your daily quote without opening the app."
            isLast
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsRow label="App Name" value="Motiva" />
          <SettingsRow label="Tagline" value="Daily Motivation" />
          <SettingsRow label="Version" value={APP_VERSION} />
          <SettingsRow
            label="Data Source"
            value="Quotable API"
            onPress={() => Linking.openURL('https://quotable.io')}
            isLast
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
