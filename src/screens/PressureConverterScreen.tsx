import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CopyResultButton } from '../components/CopyResultButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResultCard, ResultSection, DetailRow } from '../components/Result';
import { Colors, Typography, Spacing, Radius } from '../theme';

type PressureUnit = 'bar' | 'psi' | 'mpa' | 'kpa' | 'atm' | 'mmhg';

const TO_BAR: Record<PressureUnit, number> = {
  bar: 1,
  psi: 0.0689476,
  mpa: 10,
  kpa: 0.01,
  atm: 1.01325,
  mmhg: 0.00133322,
};

const UNITS: Array<{ key: PressureUnit; label: string }> = [
  { key: 'bar', label: 'bar' },
  { key: 'psi', label: 'psi' },
  { key: 'mpa', label: 'MPa' },
  { key: 'kpa', label: 'kPa' },
  { key: 'atm', label: 'atm' },
  { key: 'mmhg', label: 'mmHg' },
];

const parseNum = (v: string) => {
  const n = parseFloat(v.trim().replace(',', '.'));
  return Number.isNaN(n) ? null : n;
};

export const PressureConverterScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<PressureUnit>('bar');

  const conversions = useMemo(() => {
    const num = parseNum(inputValue);
    if (num === null) return null;
    const inBar = num * TO_BAR[fromUnit];
    return UNITS.map(({ key, label }) => ({
      key,
      label,
      value: inBar / TO_BAR[key],
    }));
  }, [inputValue, fromUnit]);

  const copyValue = useMemo(() => {
    if (!conversions) return '';
    const fromLabel = UNITS.find(u => u.key === fromUnit)?.label ?? fromUnit;
    return [
      `${parseNum(inputValue)} ${fromLabel} =`,
      ...conversions
        .filter(c => c.key !== fromUnit)
        .map(c => `  ${c.value.toPrecision(6)} ${c.label}`),
    ].join('\n');
  }, [conversions, fromUnit, inputValue]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('pressureConverter.title')}
        subtitle={t('modules.pressureConverter.description')}
        category={t('modules.pressureConverter.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.label}>{t('pressureConverter.inputLabel')}</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>{t('pressureConverter.fromUnit')}</Text>
          <View style={styles.chipWrap}>
            {UNITS.map(u => (
              <TouchableOpacity
                key={u.key}
                style={[styles.chip, fromUnit === u.key && styles.chipActive]}
                onPress={() => setFromUnit(u.key)}
              >
                <Text style={[styles.chipText, fromUnit === u.key && styles.chipTextActive]}>
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {conversions && (
          <ResultCard title={t('pressureConverter.resultTitle')}>
            <ResultSection icon="swap-horizontal" title={t('pressureConverter.resultTitle')}>
              {conversions.map(c => (
                <DetailRow
                  key={c.key}
                  label={c.label}
                  highlight={c.key === fromUnit}
                  value={
                    c.value < 0.001 || c.value >= 1e7
                      ? c.value.toExponential(4)
                      : c.value.toPrecision(6)
                  }
                />
              ))}
            </ResultSection>
            <CopyResultButton value={copyValue} />
          </ResultCard>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.borderAccent,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: Colors.accent,
  },
});
