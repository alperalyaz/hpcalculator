import 'react-native-gesture-handler';
import './src/i18n';

import React from 'react';
import { Platform, View, StyleSheet, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SidePromo } from './src/components/SidePromo';
import { Colors } from './src/theme';

// Below this viewport width the promo rails are hidden and the app frame
// takes the full width (tablets / mobile web).
const WIDE_BREAKPOINT = 1024;

export default function App() {
  const { width } = useWindowDimensions();

  const app = (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#111111" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );

  // On the web, constrain the app to a centered, phone-width column so it
  // doesn't stretch across the full desktop viewport. Native is untouched.
  if (Platform.OS === 'web') {
    const showRails = width >= WIDE_BREAKPOINT;
    return (
      <View style={styles.webBackdrop}>
        {showRails ? <SidePromo variant="brand" /> : null}
        <View style={styles.webFrame}>{app}</View>
        {showRails ? <SidePromo variant="factory" /> : null}
      </View>
    );
  }

  return app;
}

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 640,
    backgroundColor: Colors.background,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});
