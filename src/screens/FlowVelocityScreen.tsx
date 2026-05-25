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
import { ResultCard, HeroRow, HeroStat } from '../components/Result';
import { Callouts, Colors, Typography, Spacing, Radius } from '../theme';

type CalcMode = 'diameterFromFlow' | 'velocityFromDiameter';

const parseNum = (v: string) => {
  const n = parseFloat(v.trim().replace(',', '.'));
  return Number.isNaN(n) || n <= 0 ? null : n;
};

// Recommended velocity ranges (m/s) for hydraulic lines
const VELOCITY_RECOMMENDATIONS = [
  { key: 'suction', min: 0.5, max: 1.5, recommended: 1.0 },
  { key: 'return', min: 2.0, max: 4.0, recommended: 3.0 },
  { key: 'pressure', min: 3.0, max: 6.0, recommended: 4.0 },
];

export const FlowVelocityScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<CalcMode>('diameterFromFlow');
  const [flowRate, setFlowRate] = useState('');
  const [velocity, setVelocity] = useState('');
  const [diameter, setDiameter] = useState('');

  const result = useMemo(() => {
    const q = parseNum(flowRate);

    if (mode === 'diameterFromFlow') {
      const v = parseNum(velocity);
      if (!q || !v) return null;
      // Q (L/min) = v (m/s) × A (m²) × 60,000
      // A = Q / (v × 60,000) m²
      // D = sqrt(4A/π) × 1000 mm
      const areaMsq = q / (v * 60000);
      const diamMm = Math.sqrt((4 * areaMsq) / Math.PI) * 1000;
      return { type: 'diameter' as const, diamMm, flow: q, vel: v };
    } else {
      const d = parseNum(diameter);
      if (!q || !d) return null;
      // A = π × (D/1000)² / 4  m²
      const areaMsq = Math.PI * Math.pow(d / 1000, 2) / 4;
      // v = Q / (A × 60,000)
      const velMs = q / (areaMsq * 60000);
      return { type: 'velocity' as const, velMs, flow: q, diam: d };
    }
  }, [mode, flowRate, velocity, diameter]);

  const velocityStatus = useMemo(() => {
    if (!result || result.type !== 'velocity') return null;
    const v = result.velMs;
    if (v < 0.5) return 'low';
    if (v <= 1.5) return 'suction';
    if (v <= 4.0) return 'pressure';
    if (v <= 6.0) return 'high-pressure';
    return 'too-high';
  }, [result]);

  const copyValue = useMemo(() => {
    if (!result) return '';
    if (result.type === 'diameter') {
      return `${t('flowVelocity.flow')}: ${result.flow} L/min\n${t('flowVelocity.targetVelocity')}: ${result.vel} m/s\n${t('flowVelocity.requiredDiameter')}: ${result.diamMm.toFixed(1)} mm`;
    }
    return `${t('flowVelocity.flow')}: ${result.flow} L/min\n${t('flowVelocity.pipeDiameter')}: ${result.diam} mm\n${t('flowVelocity.calculatedVelocity')}: ${result.velMs.toFixed(2)} m/s`;
  }, [result, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('flowVelocity.title')}
        subtitle={t('modules.flowVelocity.description')}
        category={t('modules.flowVelocity.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Mode selector */}
          <Text style={styles.label}>{t('flowVelocity.modeLabel')}</Text>
          <View style={styles.modeWrap}>
            <TouchableOpacity
              style={[styles.modeChip, mode === 'diameterFromFlow' && styles.modeChipActive]}
              onPress={() => setMode('diameterFromFlow')}
            >
              <Text style={[styles.modeText, mode === 'diameterFromFlow' && styles.modeTextActive]}>
                {t('flowVelocity.modeDiameter')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeChip, mode === 'velocityFromDiameter' && styles.modeChipActive]}
              onPress={() => setMode('velocityFromDiameter')}
            >
              <Text style={[styles.modeText, mode === 'velocityFromDiameter' && styles.modeTextActive]}>
                {t('flowVelocity.modeVelocity')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>{t('flowVelocity.flow')} (L/min)</Text>
          <TextInput
            style={styles.input}
            value={flowRate}
            onChangeText={setFlowRate}
            keyboardType="decimal-pad"
            placeholder="e.g. 30"
            placeholderTextColor={Colors.textMuted}
          />

          {mode === 'diameterFromFlow' ? (
            <>
              <Text style={styles.label}>{t('flowVelocity.targetVelocity')} (m/s)</Text>
              <TextInput
                style={styles.input}
                value={velocity}
                onChangeText={setVelocity}
                keyboardType="decimal-pad"
                placeholder="e.g. 4"
                placeholderTextColor={Colors.textMuted}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>{t('flowVelocity.pipeDiameter')} (mm)</Text>
              <TextInput
                style={styles.input}
                value={diameter}
                onChangeText={setDiameter}
                keyboardType="decimal-pad"
                placeholder="e.g. 16"
                placeholderTextColor={Colors.textMuted}
              />
            </>
          )}
        </View>

        {result && (
          <ResultCard
            title={
              result.type === 'diameter'
                ? t('flowVelocity.requiredDiameter')
                : t('flowVelocity.calculatedVelocity')
            }
            footerNote={
              result.type === 'diameter'
                ? t('flowVelocity.roundUpNote')
                : velocityStatus === 'too-high'
                  ? t('flowVelocity.velocityTooHigh')
                  : undefined
            }
          >
            {result.type === 'diameter' ? (
              <HeroRow>
                <HeroStat
                  icon="resize"
                  primary
                  value={result.diamMm}
                  decimals={1}
                  unit="mm"
                  label={t('flowVelocity.requiredDiameter')}
                />
              </HeroRow>
            ) : (
              <HeroRow>
                <HeroStat
                  icon="speedometer"
                  primary
                  value={result.velMs}
                  decimals={2}
                  unit="m/s"
                  label={t('flowVelocity.calculatedVelocity')}
                />
              </HeroRow>
            )}
            <CopyResultButton value={copyValue} />
          </ResultCard>
        )}

        {/* Recommendation table */}
        <Text style={styles.tableTitle}>{t('flowVelocity.recommendations')}</Text>
        <View style={styles.tableWrap}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colLine]}>{t('flowVelocity.lineType')}</Text>
            <Text style={[styles.th, styles.colRange]}>{t('flowVelocity.range')}</Text>
            <Text style={[styles.th, styles.colRec]}>{t('flowVelocity.recommended')}</Text>
          </View>
          {VELOCITY_RECOMMENDATIONS.map((row, idx) => (
            <View key={row.key} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
              <Text style={[styles.td, styles.colLine]}>{t(`flowVelocity.lines.${row.key}`)}</Text>
              <Text style={[styles.td, styles.colRange]}>{row.min}–{row.max} m/s</Text>
              <Text style={[styles.td, styles.colRec, styles.tdAccent]}>{row.recommended} m/s</Text>
            </View>
          ))}
        </View>

        <View style={Callouts.warning.container}>
          <Text style={Callouts.warning.text}>{t('flowVelocity.note')}</Text>
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
  modeWrap: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  modeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modeChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.borderAccent,
  },
  modeText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  modeTextActive: { color: Colors.accent },
  tableTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  tableWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: Colors.background },
  tableRow: { flexDirection: 'row', backgroundColor: Colors.surface },
  tableRowAlt: { backgroundColor: Colors.inputBackground },
  th: { color: '#fff', fontWeight: '800', paddingVertical: 10, paddingHorizontal: 8, fontSize: 12 },
  td: { color: Colors.textSecondary, paddingVertical: 10, paddingHorizontal: 8, fontSize: 13, borderTopWidth: 1, borderTopColor: Colors.border },
  tdAccent: { color: Colors.accent, fontWeight: '700' },
  colLine: { flex: 1.4 },
  colRange: { flex: 1.2 },
  colRec: { flex: 1.0 },
});
