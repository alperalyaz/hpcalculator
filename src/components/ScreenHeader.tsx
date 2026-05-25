import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ImageSourcePropType } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  showMenuButton?: boolean;
  bannerImage?: ImageSourcePropType;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  category,
  showMenuButton = true,
  bannerImage,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (bannerImage) {
    return (
      <View style={{ backgroundColor: Colors.background }}>
        <View style={[styles.bannerImageWrap, { paddingTop: Math.max(insets.top, Spacing.sm) }]}>
          <Image source={bannerImage} style={styles.bannerImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.72)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.row}>
              {showMenuButton ? (
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                >
                  <Ionicons name="menu" size={24} color="#fff" />
                </TouchableOpacity>
              ) : (
                <View style={styles.menuSpacer} />
              )}
              <View style={styles.titleBlock}>
                {category ? <Text style={styles.bannerCategory}>{category}</Text> : null}
                <Text style={styles.bannerTitle} numberOfLines={2}>{title}</Text>
                {subtitle ? (
                  <Text style={styles.bannerSubtitle} numberOfLines={2}>{subtitle}</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bannerAccentBar} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing.sm) }]}>
      <View style={styles.row}>
        {showMenuButton ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons name="menu" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.menuSpacer} />
        )}

        <View style={styles.titleBlock}>
          {category ? <Text style={styles.category}>{category}</Text> : null}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  menuButton: {
    padding: Spacing.xs,
    marginBottom: 2,
  },
  menuSpacer: {
    width: 32,
  },
  titleBlock: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
  },
  category: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  // Banner variant
  bannerImageWrap: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  bannerCategory: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  bannerTitle: {
    ...Typography.h3,
    color: '#ffffff',
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 4,
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bannerAccentBar: {
    height: 3,
    backgroundColor: Colors.accent,
  },
});
