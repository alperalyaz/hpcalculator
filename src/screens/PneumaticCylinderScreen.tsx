import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { CopyResultButton } from '../components/CopyResultButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const PneumaticCylinderScreen: React.FC = () => {
  const { t } = useTranslation();
  const [pistonCap, setPistonCap] = useState('');
  const [milCap, setMilCap] = useState('');
  const [strok, setStrok] = useState('');
  const [basinc, setBasinc] = useState('');
  const [result, setResult] = useState<null | {
    cycle1: number;
    cycle50: number;
    cycle100: number;
    pushKg: number | null;
    pullKg: number | null;
    pressure: number | null;
  }>(null);

  const hesapla = () => {
    const piston = parseNum(pistonCap);
    const rod = parseNum(milCap);
    const stroke = parseNum(strok);
    const pressure = parseNum(basinc);

    if (Number.isNaN(piston) || Number.isNaN(rod) || Number.isNaN(stroke) || piston <= 0 || rod < 0 || stroke <= 0 || rod >= piston) {
      setResult(null);
      return;
    }

    const pistonAlan = (Math.pow(piston, 2) * Math.PI) / 4;
    const milAlan = (Math.pow(rod, 2) * Math.PI) / 4;
    const itmeHacmi = pistonAlan * stroke;
    const cekmeHacmi = (pistonAlan - milAlan) * stroke;
    const toplamHacimLitre = (itmeHacmi + cekmeHacmi) / 1_000_000;

    let pushKg: number | null = null;
    let pullKg: number | null = null;
    let pBar: number | null = null;

    if (!Number.isNaN(pressure) && pressure > 0) {
      const kuvvetItmeN = pistonAlan * pressure * 0.1;
      const kuvvetCekmeN = (pistonAlan - milAlan) * pressure * 0.1;
      pushKg = kuvvetItmeN / 9.81;
      pullKg = kuvvetCekmeN / 9.81;
      pBar = pressure;
    }

    setResult({
      cycle1: toplamHacimLitre,
      cycle50: toplamHacimLitre * 50,
      cycle100: toplamHacimLitre * 100,
      pushKg,
      pullKg,
      pressure: pBar,
    });
  };

  const copyValue = useMemo(() => {
    if (!result) {
      return '';
    }

    const lines = [
      `${t('pneumaticCalculator.airConsumption')}`,
      `1 Cycle: ${result.cycle1.toFixed(4)} litre`,
      `50 Cycle: ${result.cycle50.toFixed(2)} litre`,
      `100 Cycle: ${result.cycle100.toFixed(2)} litre`,
    ];

    if (result.pressure !== null && result.pushKg !== null && result.pullKg !== null) {
      lines.push(
        t('pneumaticCalculator.forceAtPressure', { pressure: result.pressure.toFixed(0) }),
        `${t('pneumaticCalculator.pushForce')}: ${result.pushKg.toFixed(2)} kg`,
        `${t('pneumaticCalculator.pullForce')}: ${result.pullKg.toFixed(2)} kg`,
      );
    }

    return lines.join('\n');
  }, [result, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title={t('pneumaticCalculator.title')}
        subtitle={t('modules.pneumaticCylinder.description')}
        category={t('modules.pneumaticCylinder.category')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.label}>{t('pneumaticCalculator.pistonCap')}</Text>
          <TextInput style={styles.input} value={pistonCap} onChangeText={setPistonCap} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('pneumaticCalculator.milCap')}</Text>
          <TextInput style={styles.input} value={milCap} onChangeText={setMilCap} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('pneumaticCalculator.strok')}</Text>
          <TextInput style={styles.input} value={strok} onChangeText={setStrok} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('pneumaticCalculator.basinc')}</Text>
          <TextInput style={styles.input} value={basinc} onChangeText={setBasinc} keyboardType="decimal-pad" />

          <TouchableOpacity style={styles.calcButton} onPress={hesapla}>
            <Text style={styles.calcButtonText}>{t('pneumaticCalculator.calculate')}</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t('pneumaticCalculator.airConsumption')}</Text>
            <Text style={styles.resultLine}>
              <Text style={styles.resultLabel}>1 Cycle: </Text>
              {result.cycle1.toFixed(4)} litre
            </Text>
            <Text style={styles.resultLine}>
              <Text style={styles.resultLabel}>50 Cycle: </Text>
              {result.cycle50.toFixed(2)} litre
            </Text>
            <Text style={styles.resultLine}>
              <Text style={styles.resultLabel}>100 Cycle: </Text>
              {result.cycle100.toFixed(2)} litre
            </Text>

            {result.pressure !== null && result.pushKg !== null && result.pullKg !== null && (
              <View style={styles.forceWrap}>
                <Text style={styles.resultTitle}>
                  {t('pneumaticCalculator.forceAtPressure', { pressure: result.pressure.toFixed(0) })}
                </Text>
                <Text style={styles.resultLine}>
                  <Text style={styles.resultLabel}>{t('pneumaticCalculator.pushForce')}: </Text>
                  {result.pushKg.toFixed(2)} kg
                </Text>
                <Text style={styles.resultLine}>
                  <Text style={styles.resultLabel}>{t('pneumaticCalculator.pullForce')}: </Text>
                  {result.pullKg.toFixed(2)} kg
                </Text>
              </View>
            )}
            <CopyResultButton value={copyValue} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  pageTitle: {
    ...Typography.h3,
    marginBottom: 2,
    paddingHorizontal: Spacing.xs,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    fontSize: 14,
  },
  calcButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  calcButtonText: {
    ...Typography.bodyBold,
    color: '#111111',
  },
  resultCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 6,
  },
  resultTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  resultLine: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  resultLabel: {
    color: Colors.accent,
    fontWeight: '700',
  },
  forceWrap: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: 6,
  },
});
