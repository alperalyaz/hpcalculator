import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from '../types/navigation';
import { Colors } from '../theme';
import { CustomDrawerContent } from './CustomDrawerContent';

import { HomeScreen } from '../screens/HomeScreen';
import { HydraulicSystemScreen } from '../screens/HydraulicSystemScreen';
import { BucklingShaftScreen } from '../screens/BucklingShaftScreen';
import { GearPumpScreen } from '../screens/GearPumpScreen';
import { PipeRodWeightScreen } from '../screens/PipeRodWeightScreen';
import { PneumaticCylinderScreen } from '../screens/PneumaticCylinderScreen';
import { HydraulicMotorScreen } from '../screens/HydraulicMotorScreen';
import { ThreadPitchScreen } from '../screens/ThreadPitchScreen';
import { PipeConverterScreen } from '../screens/PipeConverterScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { ContactScreen } from '../screens/ContactScreen';
import { ReportBugScreen } from '../screens/ReportBugScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.surface,
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.7)',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="HydraulicSystem" component={HydraulicSystemScreen} />
      <Drawer.Screen name="BucklingShaft" component={BucklingShaftScreen} />
      <Drawer.Screen name="GearPump" component={GearPumpScreen} />
      <Drawer.Screen name="PipeRodWeight" component={PipeRodWeightScreen} />
      <Drawer.Screen name="PneumaticCylinder" component={PneumaticCylinderScreen} />
      <Drawer.Screen name="HydraulicMotor" component={HydraulicMotorScreen} />
      <Drawer.Screen name="ThreadPitch" component={ThreadPitchScreen} />
      <Drawer.Screen name="PipeConverter" component={PipeConverterScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Privacy" component={PrivacyScreen} />
      <Drawer.Screen name="Terms" component={TermsScreen} />
      <Drawer.Screen name="Contact" component={ContactScreen} />
      <Drawer.Screen name="ReportBug" component={ReportBugScreen} />
    </Drawer.Navigator>
  );
};
