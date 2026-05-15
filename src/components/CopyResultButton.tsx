import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { Colors, Radius, Spacing, Typography } from '../theme';

interface CopyResultButtonProps {
  value: string;
}

export const CopyResultButton: React.FC<CopyResultButtonProps> = ({ value }) => {
  const { t } = useTranslation();

  const onCopy = async () => {
    if (!value.trim()) {
      return;
    }

    await Clipboard.setStringAsync(value);
    Alert.alert(t('common.copy'), t('common.copied'));
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onCopy} activeOpacity={0.8}>
      <Ionicons name="copy-outline" size={16} color={Colors.accent} />
      <Text style={styles.label}>{t('common.copy')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: Colors.inputBackground,
  },
  label: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '700',
  },
});
