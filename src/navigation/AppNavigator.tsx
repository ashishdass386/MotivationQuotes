import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../theme/ThemeContext';
import {HomeScreen} from '../screens/HomeScreen';
import {SavedQuotesScreen} from '../screens/SavedQuotesScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {spacing, borderRadius} from '../theme/spacing';
import {typography} from '../theme/typography';

export type RootTabParamList = {
  Home: undefined;
  Saved: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<string, {active: string; inactive: string}> = {
  Home: {active: '✦', inactive: '✧'},
  Saved: {active: '♥', inactive: '♡'},
  Settings: {active: '⚙', inactive: '⚙'},
};

function TabIcon({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}): React.JSX.Element {
  const {colors} = useTheme();
  const icons = TAB_ICONS[name];
  return (
    <Text
      style={{
        fontSize: focused ? 20 : 18,
        color: focused ? colors.iconActive : colors.iconInactive,
      }}>
      {focused ? icons.active : icons.inactive}
    </Text>
  );
}

export function AppNavigator(): React.JSX.Element {
  const {colors, isDark} = useTheme();

  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.tabBarBackground,
      text: colors.textPrimary,
      border: colors.tabBarBorder,
      notification: colors.primary,
    },
    fonts: {
      regular: {fontFamily: 'sans-serif', fontWeight: '400' as const},
      medium: {fontFamily: 'sans-serif-medium', fontWeight: '500' as const},
      bold: {fontFamily: 'sans-serif', fontWeight: '700' as const},
      heavy: {fontFamily: 'sans-serif', fontWeight: '900' as const},
    },
  };

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: colors.tabBarBackground,
      borderTopWidth: 1,
      borderTopColor: colors.tabBarBorder,
      height: Platform.OS === 'android' ? 60 : 80,
      paddingBottom: Platform.OS === 'android' ? spacing[2] : spacing[5],
      paddingTop: spacing[2],
      elevation: 8,
    },
    tabLabel: {
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.semibold,
      letterSpacing: typography.letterSpacing.wide,
      marginTop: 2,
    },
    indicator: {
      width: 4,
      height: 4,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
      alignSelf: 'center',
      marginTop: 2,
    },
  });

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              <TabIcon name={route.name} focused={focused} />
              {focused && <View style={styles.indicator} />}
            </View>
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.tabLabel,
                {
                  color: focused ? colors.iconActive : colors.iconInactive,
                },
              ]}>
              {route.name}
            </Text>
          ),
          tabBarHideOnKeyboard: true,
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{tabBarAccessibilityLabel: 'Home tab'}}
        />
        <Tab.Screen
          name="Saved"
          component={SavedQuotesScreen}
          options={{tabBarAccessibilityLabel: 'Saved quotes tab'}}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{tabBarAccessibilityLabel: 'Settings tab'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
