import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Linking,
  Switch,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {SectionHeader} from '../components/SectionHeader';
import {SettingRow} from '../components/SettingRow';
import {
  getNotificationSettings,
  setNotificationEnabled,
  sendTestNotification,
} from '../native/DailyNotification';

const APP_VERSION = '1.0.2';

export function SettingsScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const {colors} = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    getNotificationSettings()
      .then(settings => setNotificationsEnabled(settings.enabled))
      .catch(() => {});
  }, []);

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    try {
      await setNotificationEnabled(val);
    } catch {
      Alert.alert('Settings Error', 'Could not update notification schedule.');
    }
  };

  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert(
        'Notification Sent',
        'Check your notification shade to preview the daily morning quote.',
      );
    } catch {
      Alert.alert('Error', 'Could not trigger notification.');
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Link Error', 'Could not open URL.');
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}
      edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header */}
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <Text style={[styles.title, {color: colors.textPrimary}]}>
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Appearance Group */}
        <SectionHeader title="Appearance" />
        <View style={[styles.groupContainer, {borderColor: colors.border}]}>
          <SettingRow
            label="Theme"
            description="Minimal Light System"
            value="Light"
            showDivider={false}
          />
        </View>

        {/* Widget Group */}
        <SectionHeader title="Widget" />
        <View style={[styles.groupContainer, {borderColor: colors.border}]}>
          <SettingRow
            label="Widget Templates"
            description="Customize style, layout and colors"
            onPress={() => navigation.navigate('Templates')}
          />
          <SettingRow
            label="Update Frequency"
            value="Every Morning"
            showDivider={false}
          />
        </View>

        {/* Notifications Group */}
        <SectionHeader title="Notifications" />
        <View style={[styles.groupContainer, {borderColor: colors.border}]}>
          <SettingRow
            label="Daily Morning Quote"
            description="Triggers daily at 8:30 AM"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                thumbColor="#FFFFFF"
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
              />
            }
          />
          <SettingRow
            label="Try Notification"
            description="Preview notification appearance"
            onPress={handleSendTestNotification}
            showDivider={false}
          />
        </View>

        {/* About Group */}
        <SectionHeader title="About" />
        <View style={[styles.groupContainer, {borderColor: colors.border}]}>
          <View style={[styles.aboutBrandHeader, {borderBottomColor: colors.border}]}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.aboutBrandLogo}
              resizeMode="cover"
            />
            <View style={styles.aboutBrandTextCol}>
              <Text style={[styles.aboutBrandName, {color: colors.textPrimary}]}>
                Motiqo
              </Text>
              <Text style={[styles.aboutBrandTagline, {color: colors.textSecondary}]}>
                Daily Motivation &amp; Widgets
              </Text>
            </View>
          </View>
          <SettingRow
            label="Version"
            value={APP_VERSION}
          />
          <SettingRow
            label="Privacy Policy"
            onPress={() => handleOpenLink('https://motiqo.app/privacy')}
          />
          <SettingRow
            label="Terms of Service"
            onPress={() => handleOpenLink('https://motiqo.app/terms')}
            showDivider={false}
          />
        </View>

        <View style={styles.footerNote}>
          <Text style={[styles.footerText, {color: colors.textTertiary}]}>
            MOTIQO · DAILY MOTIVATION & WIDGETS
          </Text>
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
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  scrollContent: {
    paddingBottom: 64,
  },
  groupContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  aboutBrandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    gap: spacing[4],
  },
  aboutBrandLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  aboutBrandTextCol: {
    flex: 1,
  },
  aboutBrandName: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  aboutBrandTagline: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});
