import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';

export const ContactScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('nav.contact')} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Spacing.md + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('legal.contact.title')}</Text>
          <Text style={styles.text}>{t('legal.contact.company')}</Text>

          <Text style={styles.sectionLabel}>{t('legal.contact.addressLabel')}</Text>
          <Text style={styles.text}>{t('legal.contact.address')}</Text>

          <Text style={styles.sectionLabel}>{t('legal.contact.phoneLabel')}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+902582514060')}>
            <Text style={styles.linkText}>{t('legal.contact.phone')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/902582514060')}>
            <Text style={styles.linkText}>{t('legal.contact.whatsapp')}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>{t('legal.contact.emailLabel')}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:info@hidroteknik.com.tr')}>
            <Text style={styles.linkText}>{t('legal.contact.email')}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>{t('legal.contact.hoursLabel')}</Text>
          <Text style={styles.text}>{t('legal.contact.weekday')}</Text>
          <Text style={styles.text}>{t('legal.contact.saturday')}</Text>
          <Text style={styles.note}>{t('legal.contact.holidayNote')}</Text>

          <Text style={styles.sectionLabel}>{t('legal.contact.gpsLabel')}</Text>
          <Text style={styles.text}>{t('legal.contact.gps')}</Text>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => Linking.openURL('https://maps.google.com/?q=37.793376,29.098947')}
          >
            <Text style={styles.mapButtonText}>{t('legal.contact.openMap')}</Text>
          </TouchableOpacity>
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
  content: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  text: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    letterSpacing: 0.4,
  },
  linkText: {
    ...Typography.body,
    color: Colors.accent,
    marginTop: 2,
  },
  note: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 6,
    lineHeight: 18,
  },
  mapButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  mapButtonText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
});
