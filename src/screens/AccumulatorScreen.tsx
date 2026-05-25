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
import { Callouts, Colors, Typography, Spacing, Radius } from '../theme';

const parseNum = (v: string) => {
  const n = parseFloat(v.trim().replace(',', '.'));
  return Number.isNaN(n) || n <= 0 ? null : n;
};

export const AccumulatorScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [usableVolume, setUsableVolume] = useState('');
  const [minPressure, setMinPressure] = useState('');
  const [maxPressure, setMaxPressure] = useState('');
  const [prechargeRatio, setPrechargeRatio] = useState(0.9);

  const prechargeOptions = [
    { value: 0.9, label: '90% p_min' },
    { value: 0.8, label: '80% p_min' },
    { value: 0.7, label: '70% p_min' },
  ];

  const result = useMemo(() => {
    const dV = parseNum(usableVolume);
    const p1 = parseNum(minPressure);
    const p2 = parseNum(maxPressure);

    if (!dV || !p1 || !p2) return null;
    if (p2 <= p1) return null;

    // N2 pre-charge pressure (absolute bar)
    const p0 = p1 * prechargeRatio;
    const p1Abs = p1 + 1.013;
    const p2Abs = p2 + 1.013;
    const p0Abs = p0 + 1.013;

    // Boyle's law (isothermal):
    // ΔV = V_total × p0_abs × (1/p1_abs - 1/p2_abs)
    // V_total = ΔV / (p0_abs × (1/p1_abs - 1/p2_abs))
    const totalVolume = dV / (p0Abs * (1 / p1Abs - 1 / p2Abs));
    const prechargeAbs = p0Abs;
    const usefulRatio = (dV / totalVolume) * 100;

    return { totalVolume, prechargeAbs, p0, p1, p2, dV, usefulRatio };
  }, [usableVolume, minPressure, maxPressure, prechargeRatio]);

  const copyValue = useMemo(() => {
    if (!result) return '';
    return [
      `${t('accumulator.resultVolume')}: ${result.totalVolume.toFixed(2)} L`,
      `${t('accumulator.precharge')}: ${result.p0.toFixed(2)} bar (${result.prechargeAbs.toFixed(3)} bar abs)`,
      `${t('accumulator.usefulRatio')}: ${result.usefulRatio.toFixed(1)}%`,
    ].join('\n');
  }, [result, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('accumulator.title')}
        subtitle={t('modules.accumulator.description')}
        category={t('modules.accumulator.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.label}>{t('accumulator.usableVolume')} (L)</Text>
          <TextInput
            style={styles.input}
            value={usableVolume}
            onChangeText={setUsableVolume}
            keyboardType="decimal-pad"
            placeholder="e.g. 2.0"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('accumulator.minPressure')} (bar gauge)</Text>
          <TextInput
            style={styles.input}
            value={minPressure}
            onChangeText={setMinPressure}
            keyboardType="decimal-pad"
            placeholder="e.g. 100"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('accumulator.maxPressure')} (bar gauge)</Text>
          <TextInput
            style={styles.input}
            value={maxPressure}
            onChangeText={setMaxPressure}
            keyboardType="decimal-pad"
            placeholder="e.g. 160"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('accumulator.prechargeRatio')}</Text>
          <View style={styles.chipWrap}>
            {prechargeOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, prechargeRatio === opt.value && styles.chipActive]}
                onPress={() => setPrechargeRatio(opt.value)}
              >
                <Text style={[styles.chipText, prechargeRatio === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t('accumulator.resultTitle')}</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>{t('accumulator.resultVolume')}</Text>
              <Text style={styles.bigValue}>{result.totalVolume.toFixed(2)} L</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>{t('accumulator.precharge')}</Text>
              <Text style={styles.resultValue}>
                {result.p0.toFixed(2)} bar
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>{t('accumulator.usefulRatio')}</Text>
              <Text style={styles.resultValue}>{result.usefulRatio.toFixed(1)}%</Text>
            </View>

            <CopyResultButton value={copyValue} />
          </View>
        )}

        <View style={Callouts.warning.container}>
          <Text style={Callouts.warning.text}>{t('accumulator.note')}</Text>
        </View>
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
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
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
  chipText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: Colors.accent },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    padding: Spacing.md,
    gap: 8,
  },
  resultTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  resultLabel: { ...Typography.body, color: Colors.textSecondary, flex: 1 },
  bigValue: { fontSize: 26, fontWeight: '800', color: Colors.accent },
  resultValue: { ...Typography.bodyBold, color: Colors.textPrimary },
});
