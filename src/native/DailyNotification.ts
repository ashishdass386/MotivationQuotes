import {NativeModules, Platform, PermissionsAndroid} from 'react-native';

export interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface NotificationQuote {
  id: string;
  content: string;
  author: string;
  date: string;
}

interface DailyNotificationModuleType {
  scheduleDailyNotification(hour: number, minute: number): Promise<boolean>;
  cancelDailyNotification(): Promise<boolean>;
  isNotificationScheduled(): Promise<boolean>;
  sendTestNotification(): Promise<boolean>;
  getNotificationSettings(): Promise<NotificationSettings>;
  setNotificationEnabled(enabled: boolean): Promise<boolean>;
  getTodaysNotificationQuote(): Promise<NotificationQuote | null>;
  areNotificationsEnabled(): Promise<boolean>;
}

const {DailyNotificationModule} = NativeModules as {
  DailyNotificationModule: DailyNotificationModuleType | undefined;
};

/**
 * Requests POST_NOTIFICATIONS permission on Android 13+ (API 33+).
 * Returns true if granted or not required.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // Android 13 (API 33) and above requires runtime permission
    if (Platform.Version >= 33) {
      const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return true;
      }
      const status = await PermissionsAndroid.request(permission, {
        title: 'Motiqo Notifications',
        message:
          'Allow Motiqo to send you a fresh inspirational quote every morning at 8:30 AM.',
        buttonPositive: 'Allow',
        buttonNegative: 'Not now',
      });
      return status === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.warn('[DailyNotification] Failed to request permission:', err);
    return false;
  }
}

/**
 * Check if notifications are enabled in system settings.
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  if (!DailyNotificationModule) {
    return false;
  }
  try {
    return await DailyNotificationModule.areNotificationsEnabled();
  } catch {
    return false;
  }
}

/**
 * Schedule daily notification for a specific time (default 8:30 AM).
 */
export async function scheduleDailyNotification(
  hour: number = 8,
  minute: number = 30,
): Promise<boolean> {
  if (!DailyNotificationModule) {
    return false;
  }
  try {
    return await DailyNotificationModule.scheduleDailyNotification(hour, minute);
  } catch (err) {
    console.warn('[DailyNotification] Failed to schedule daily notification:', err);
    return false;
  }
}

/**
 * Cancel daily notification.
 */
export async function cancelDailyNotification(): Promise<boolean> {
  if (!DailyNotificationModule) {
    return false;
  }
  try {
    return await DailyNotificationModule.cancelDailyNotification();
  } catch (err) {
    console.warn('[DailyNotification] Failed to cancel daily notification:', err);
    return false;
  }
}

/**
 * Check if the daily notification is currently scheduled.
 */
export async function isNotificationScheduled(): Promise<boolean> {
  if (!DailyNotificationModule) {
    return false;
  }
  try {
    return await DailyNotificationModule.isNotificationScheduled();
  } catch {
    return false;
  }
}

/**
 * Sends an immediate test notification with a fresh inspirational quote.
 */
export async function sendTestNotification(): Promise<boolean> {
  if (!DailyNotificationModule) {
    return false;
  }
  try {
    await requestNotificationPermission();
    return await DailyNotificationModule.sendTestNotification();
  } catch (err) {
    console.warn('[DailyNotification] Failed to send test notification:', err);
    return false;
  }
}

/**
 * Retrieve current notification settings (enabled, hour, minute).
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  if (!DailyNotificationModule) {
    return {enabled: true, hour: 8, minute: 30};
  }
  try {
    return await DailyNotificationModule.getNotificationSettings();
  } catch {
    return {enabled: true, hour: 8, minute: 30};
  }
}

/**
 * Toggle notification enabled/disabled state.
 */
export async function setNotificationEnabled(enabled: boolean): Promise<boolean> {
  if (!DailyNotificationModule) {
    return false;
  }
  try {
    if (enabled) {
      await requestNotificationPermission();
    }
    return await DailyNotificationModule.setNotificationEnabled(enabled);
  } catch (err) {
    console.warn('[DailyNotification] Failed to update notification state:', err);
    return false;
  }
}

/**
 * Get the quote delivered by notification today (if any).
 */
export async function getTodaysNotificationQuote(): Promise<NotificationQuote | null> {
  if (!DailyNotificationModule) {
    return null;
  }
  try {
    return await DailyNotificationModule.getTodaysNotificationQuote();
  } catch {
    return null;
  }
}
