import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerNavigator from './navigation/DrawerNavigator';
import { AppThemeProvider, useAppTheme } from './theme/AppThemeProvider';

function AppRoot() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.panel}
        translucent={false}
      />
      <DrawerNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <AppRoot />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
