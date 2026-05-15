import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  showMenuButton?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  category,
  showMenuButton = true,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  menuButton: {
    padding: Spacing.xs,
    marginTop: 2,
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
});
