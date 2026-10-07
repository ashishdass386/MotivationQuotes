import React from 'react';
import {Text, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import {HomeScreen} from '../screens/HomeScreen';
import {TemplatesScreen} from '../screens/TemplatesScreen';
import {TemplatePreviewScreen} from '../screens/TemplatePreviewScreen';
import {SavedQuotesScreen} from '../screens/SavedQuotesScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {
  HomeIcon,
  TemplatesIcon,
  BookmarkIcon,
  SettingsIcon,
} from '../components/Icons';

export type RootTabParamList = {
  Home: undefined;
  Templates: undefined;
  Saved: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TemplatePreview: {templateId: string};
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabNavigator(): React.JSX.Element {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom > 0 ? insets.bottom : spacing[2];
  const barHeight = (Platform.OS === 'android' ? 56 : 50) + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: barHeight,
          paddingBottom: bottomPadding,
          paddingTop: spacing[2],
          elevation: 0, // No drop shadow
        },
        tabBarIcon: ({focused}) => {
          const tint = focused ? colors.iconActive : colors.iconInactive;
          switch (route.name) {
            case 'Home':
              return <HomeIcon size={19} color={tint} strokeWidth={focused ? 1.8 : 1.4} />;
            case 'Templates':
              return <TemplatesIcon size={18} color={tint} />;
            case 'Saved':
              return <BookmarkIcon size={19} color={tint} filled={focused} strokeWidth={focused ? 1.8 : 1.4} />;
            case 'Settings':
              return <SettingsIcon size={19} color={tint} strokeWidth={focused ? 1.8 : 1.4} />;
            default:
              return null;
          }
        },
        tabBarLabel: ({focused}) => (
          <Text
            style={[
              styles.tabLabel,
              {
                color: focused ? colors.iconActive : colors.iconInactive,
                fontWeight: focused ? '600' : '400',
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
        name="Templates"
        component={TemplatesScreen}
        options={{tabBarAccessibilityLabel: 'Templates tab'}}
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
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
    marginTop: 2,
  },
});

export function AppNavigator(): React.JSX.Element {
  const {colors} = useTheme();

  const navigationTheme = {
    dark: false,
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
      bold: {fontFamily: 'sans-serif-medium', fontWeight: '700' as const},
      heavy: {fontFamily: 'sans-serif-medium', fontWeight: '700' as const},
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen
          name="TemplatePreview"
          component={TemplatePreviewScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
