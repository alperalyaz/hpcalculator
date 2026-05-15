import 'react-native-gesture-handler';
import './src/i18n';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#111111" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
