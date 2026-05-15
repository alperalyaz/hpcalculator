import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../components/ScreenHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';

export const AboutScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('nav.about')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('legal.about.title')}</Text>
          <Text style={styles.text}>{t('legal.about.body')}</Text>
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
});
