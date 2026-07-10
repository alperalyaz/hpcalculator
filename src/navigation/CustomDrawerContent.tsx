import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { ModuleIcon, ModuleIconName } from '../components/ModuleIcon';
import { APP_VERSION_LABEL } from '../constants/appVersion';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.hidroteknik.hydrauliccalculator';

interface DrawerItem {
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
  moduleIcon?: ModuleIconName;
  i18nKey: string;
}

const PRIMARY_ITEMS: DrawerItem[] = [
  {
    route: 'Home',
    icon: 'home-outline',
    i18nKey: 'nav.home',
  },
  {
    route: 'HydraulicSystem',
    icon: 'water-outline',
    moduleIcon: 'hydraulicSystem',
    i18nKey: 'nav.hydraulicSystem',
  },
  {
    route: 'AdvancedHydraulic',
    icon: 'layers-outline',
    moduleIcon: 'advancedHydraulic',
    i18nKey: 'nav.advancedHydraulic',
  },
  {
    route: 'BucklingShaft',
    icon: 'git-branch-outline',
    moduleIcon: 'bucklingShaft',
    i18nKey: 'nav.bucklingShaft',
  },
  {
    route: 'GearPump',
    icon: 'settings-outline',
    moduleIcon: 'gearPump',
    i18nKey: 'nav.gearPump',
  },
  {
    route: 'PipeRodWeight',
    icon: 'reorder-four-outline',
    moduleIcon: 'pipeRodWeight',
    i18nKey: 'nav.pipeRodWeight',
  },
  {
    route: 'PneumaticCylinder',
    icon: 'speedometer-outline',
    moduleIcon: 'pneumaticCylinder',
    i18nKey: 'nav.pneumaticCylinder',
  },
  {
    route: 'HydraulicMotor',
    icon: 'sync-outline',
    moduleIcon: 'hydraulicMotor',
    i18nKey: 'nav.hydraulicMotor',
  },
  {
    route: 'ThreadPitch',
    icon: 'list-outline',
    moduleIcon: 'threadPitch',
    i18nKey: 'nav.threadPitch',
  },
  {
    route: 'PipeConverter',
    icon: 'swap-horizontal-outline',
    moduleIcon: 'pipeConverter',
    i18nKey: 'nav.pipeConverter',
  },
  {
    route: 'PressureConverter',
    icon: 'thermometer-outline',
    moduleIcon: 'pressureConverter',
    i18nKey: 'nav.pressureConverter',
  },
  {
    route: 'FlowVelocity',
    icon: 'pulse-outline',
    moduleIcon: 'flowVelocity',
    i18nKey: 'nav.flowVelocity',
  },
  {
    route: 'Accumulator',
    icon: 'battery-half-outline',
    moduleIcon: 'accumulator',
    i18nKey: 'nav.accumulator',
  },
];

const INFO_ITEMS: DrawerItem[] = [
  {
    route: 'About',
    icon: 'information-circle-outline',
    i18nKey: 'nav.about',
  },
  {
    route: 'Privacy',
    icon: 'shield-checkmark-outline',
    i18nKey: 'nav.privacy',
  },
  {
    route: 'Terms',
    icon: 'document-text-outline',
    i18nKey: 'nav.terms',
  },
  {
    route: 'Contact',
    icon: 'mail-outline',
    i18nKey: 'nav.contact',
  },
  {
    route: 'ReportBug',
    icon: 'bug-outline',
    i18nKey: 'nav.reportBug',
  },
];

export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const currentRoute = props.state.routes[props.state.index]?.name;

  const toggleLanguage = () => {
    const next = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(next);
  };

  return (
    <View style={styles.container}>
      {/* Drawer Header */}
      <TouchableOpacity
        style={[styles.drawerHeader, { paddingTop: Math.max(insets.top, Spacing.md) + Spacing.sm }]}
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('Home')}
      >
        <View style={styles.logoBox}>
          <Image
            source={require('../../resim/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.appName} numberOfLines={2}>
            {t('app.name')}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Nav Items */}
      <DrawerContentScrollView
        {...props}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PRIMARY_ITEMS.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => props.navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                {item.moduleIcon ? (
                  <ModuleIcon
                    name={item.moduleIcon}
                    size={20}
                    color={isActive ? Colors.background : Colors.textSecondary}
                  />
                ) : (
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isActive ? Colors.background : Colors.textSecondary}
                  />
                )}
              </View>
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
                numberOfLines={1}
              >
                {t(item.i18nKey)}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.sectionDivider} />
        <Text style={styles.sectionTitle}>{t('drawer.infoSection').toUpperCase()}</Text>

        {INFO_ITEMS.map((item) => {
          const isActive = currentRoute === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, styles.navItemCompact, isActive && styles.navItemActive]}
              onPress={() => props.navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, styles.iconWrapCompact, isActive && styles.iconWrapActive]}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={isActive ? Colors.background : Colors.textSecondary}
                />
              </View>
              <Text
                style={[styles.navLabel, styles.navLabelCompact, isActive && styles.navLabelActive]}
                numberOfLines={1}
              >
                {t(item.i18nKey)}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* Footer: Language Toggle */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        <View style={styles.divider} />
        {Platform.OS === 'web' && (
          <TouchableOpacity
            style={styles.androidCta}
            onPress={() => Linking.openURL(PLAY_STORE_URL)}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google-playstore" size={18} color={Colors.background} />
            <Text style={styles.androidCtaText}>{t('drawer.getAndroidApp')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
          <Ionicons name="globe-outline" size={18} color={Colors.textMuted} />
          <Text style={styles.langText}>
            {i18n.language === 'tr' ? t('drawer.switchToEnglish') : t('drawer.switchToTurkish')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.version}>{APP_VERSION_LABEL}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoImage: {
    width: 30,
    height: 30,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  scrollContent: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontSize: 10,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingVertical: 11,
    paddingHorizontal: Spacing.sm,
    marginBottom: 2,
    gap: Spacing.sm,
    position: 'relative',
  },
  navItemCompact: {
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  iconWrapCompact: {
    width: 30,
    height: 30,
  },
  iconWrapActive: {
    backgroundColor: Colors.accent,
  },
  navLabel: {
    ...Typography.body,
    fontSize: 14,
    flex: 1,
  },
  navLabelCompact: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  navLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    position: 'absolute',
    right: 8,
  },
  footer: {
    paddingBottom: 0,
  },
  androidCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 11,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  androidCtaText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 13,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  langText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  version: {
    fontSize: 10,
    color: Colors.border,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
});
