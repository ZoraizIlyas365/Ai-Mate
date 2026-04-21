import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { NavigationContainer, Theme } from '@react-navigation/native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import ChatScreen from '../screens/ChatScreen';
import { useAppTheme } from '../theme/AppThemeProvider';

export type DrawerParamList = {
  Chat: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colors, isDark, toggleTheme, mode } = useAppTheme();
  const themeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: colors.background.panel }}>
      <View style={[styles.parentView, { backgroundColor: colors.background.inputWrapper }]}>
        <Text style={[styles.parentText, { color: colors.text.title }]}>
          Theme: {themeLabel}
        </Text>
        <Text style={[styles.parentSubText, { color: colors.text.subtitle }]}>
          Toggle to instantly switch app colors.
        </Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: colors.text.subtitle }]}>Light / Dark</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: colors.border.muted,
              true: colors.brand.successSoft,
            }}
            thumbColor={isDark ? colors.brand.success : colors.white}
          />
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const { colors, isDark } = useAppTheme();
  const appNavigationTheme: Theme = {
    dark: isDark,
    colors: {
      primary: colors.brand.success,
      background: colors.background.app,
      card: colors.background.panel,
      text: colors.text.title,
      border: colors.border.subtle,
      notification: colors.brand.successBright,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '800',
      },
    },
  };

  return (
    <NavigationContainer theme={appNavigationTheme}>
      <Drawer.Navigator
        initialRouteName="Chat"
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background.panel },
          headerTintColor: colors.text.title,
          drawerStyle: { backgroundColor: colors.background.panel },
          drawerActiveTintColor: colors.text.title,
          drawerInactiveTintColor: colors.text.subtitle,
          drawerActiveBackgroundColor: colors.background.inputWrapper,
          drawerLabelStyle: { marginLeft: -10, fontWeight: '600' },
        }}>
        <Drawer.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'AI Mate', headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  parentView: {
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 12,
    marginTop: 8,
    padding: 12,
  },
  parentText: {
    fontSize: 16,
    fontWeight: '700',
  },
  parentSubText: {
    fontSize: 13,
    marginTop: 4,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
