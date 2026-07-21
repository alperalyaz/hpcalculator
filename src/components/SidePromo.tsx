import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Spacing, Radius, Typography } from '../theme';

const SITE_URL = 'https://www.hidroteknik.com.tr';

interface SidePromoProps {
  variant: 'brand' | 'factory';
}

/**
 * Web-only promotional rail shown in the empty desktop margins beside the
 * centered app frame. Promotes Hidroteknik and links to the corporate site.
 */
export const SidePromo: React.FC<SidePromoProps> = ({ variant }) => {
  const { t } = useTranslation();

  const openSite = () => {
    Linking.openURL(SITE_URL);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {variant === 'brand' ? (
          <>
            <View style={styles.logoChip}>
              <Image source={require('../../assets/ht_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.tagline}>{t('promo.tagline')}</Text>
            <Text style={styles.fields}>{t('promo.fields')}</Text>
            <Text style={styles.desc}>{t('promo.desc')}</Text>
          </>
        ) : (
          <>
            <Image source={require('../../assets/ht_fabrika.jpg')} style={styles.hero} resizeMode="cover" />
            <View style={styles.logoChipSmall}>
              <Image source={require('../../assets/ht_logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.fields}>{t('promo.factory')}</Text>
            <Text style={styles.desc}>{t('promo.tagline')}</Text>
          </>
        )}

        <TouchableOpacity style={styles.cta} onPress={openSite} activeOpacity={0.85}>
          <Text style={styles.ctaText}>{t('promo.cta')}</Text>
          <Ionicons name="arrow-forward" size={15} color={Colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 240,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  logoChip: {
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoChipSmall: {
    backgroundColor: '#fff',
    borderRadius: Radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  logo: {
    width: 150,
    height: 30,
  },
  hero: {
    width: '100%',
    height: 120,
    borderRadius: Radius.md,
  },
  tagline: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 4,
  },
  fields: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  desc: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 10,
    marginTop: 4,
  },
  ctaText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 13,
  },
});
