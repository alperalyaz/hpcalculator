import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme';
import { APP_VERSION_LABEL } from '../constants/appVersion';
import { DrawerParamList } from '../types/navigation';

type HomeNavProp = DrawerNavigationProp<DrawerParamList, 'Home'>;

interface ModuleCard {
  key: ModuleRoute;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const MODULES: ModuleCard[] = [
  { key: 'HydraulicSystem',    icon: 'hydraulic-oil-level' },
  { key: 'AdvancedHydraulic',  icon: 'pipe-valve' },
  { key: 'BucklingShaft',      icon: 'axis-arrow' },
  { key: 'GearPump',           icon: 'cog-transfer-outline' },
  { key: 'PipeRodWeight',      icon: 'pipe' },
  { key: 'PneumaticCylinder',  icon: 'air-filter' },
  { key: 'HydraulicMotor',     icon: 'engine-outline' },
  { key: 'ThreadPitch',        icon: 'screw-machine-flat-top' },
  { key: 'PipeConverter',      icon: 'pipe-disconnected' },
  { key: 'PressureConverter',  icon: 'gauge' },
  { key: 'FlowVelocity',       icon: 'waves-arrow-right' },
  { key: 'Accumulator',        icon: 'car-turbocharger' },
];

type ModuleRoute =
  | 'HydraulicSystem'
  | 'AdvancedHydraulic'
  | 'BucklingShaft'
  | 'GearPump'
  | 'PipeRodWeight'
  | 'PneumaticCylinder'
  | 'HydraulicMotor'
  | 'ThreadPitch'
  | 'PipeConverter'
  | 'PressureConverter'
  | 'FlowVelocity'
  | 'Accumulator';

const NAV_KEY_MAP: Record<ModuleRoute, string> = {
  HydraulicSystem: 'hydraulicSystem',
  AdvancedHydraulic: 'advancedHydraulic',
  BucklingShaft: 'bucklingShaft',
  GearPump: 'gearPump',
  PipeRodWeight: 'pipeRodWeight',
  PneumaticCylinder: 'pneumaticCylinder',
  HydraulicMotor: 'hydraulicMotor',
  ThreadPitch: 'threadPitch',
  PipeConverter: 'pipeConverter',
  PressureConverter: 'pressureConverter',
  FlowVelocity: 'flowVelocity',
  Accumulator: 'accumulator',
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.menuBtn}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <Ionicons name="menu" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={2}>
              {t('app.name')}
            </Text>
            <View style={styles.headerRightSpacer} />
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionLabel}>{t('home.modules').toUpperCase()}</Text>

        {/* Module Cards Grid */}
        <View style={styles.grid}>
          {MODULES.map((mod) => {
            const i18nKey = NAV_KEY_MAP[mod.key];
            const title =
              mod.key === 'PipeRodWeight'
                ? t('home.shortTitles.pipeRodWeight')
                : t(`modules.${i18nKey}.title`);
            const description = t(`modules.${i18nKey}.description`);
            return (
              <TouchableOpacity
                key={mod.key}
                style={styles.card}
                onPress={() => navigation.navigate(mod.key)}
                activeOpacity={0.75}
              >
                <View style={styles.cardBody}>
                  <View style={styles.cardIconBox}>
                    <MaterialCommunityIcons name={mod.icon} size={24} color={Colors.accent} />
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {title}
                  </Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Hidroteknik A.S.</Text>
          <Text style={styles.footerSub}>Hydraulic & Pneumatic Calculator • {APP_VERSION_LABEL}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  menuBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  headerWrap: {
    marginHorizontal: -Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerBar: {
    minHeight: 72,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    marginHorizontal: Spacing.sm,
  },
  headerRightSpacer: {
    width: 32,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    marginBottom: 10,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: Colors.borderAccent,
    borderWidth: 1,
    borderColor: '#3a320f',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 19,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: 2,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  footerSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
