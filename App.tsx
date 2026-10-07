/**
 * Motiva – Daily Quotes
 * React Native CLI App
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/theme/ThemeContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {
  requestNotificationPermission,
  scheduleDailyNotification,
} from './src/native/DailyNotification';

function AppContent(): React.JSX.Element {
  useEffect(() => {
    // Request permission on Android 13+ and ensure 8:30 AM notification is scheduled
    requestNotificationPermission().then(() => {
      scheduleDailyNotification(8, 30);
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
