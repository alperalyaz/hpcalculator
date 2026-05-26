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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CopyResultButton } from '../components/CopyResultButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResultCard, HeroRow, HeroStat, ResultSection, DetailRow } from '../components/Result';
import { CylinderDiagram } from '../components/diagrams/CylinderDiagram';
import { Colors, Typography, Spacing, Radius } from '../theme';

const BANNER = require('../../assets/banner_pneumatic.jpg');

type CylDim = 'bore' | 'rod' | 'stroke' | null;

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const PneumaticCylinderScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [pistonCap, setPistonCap] = useState('');
  const [milCap, setMilCap] = useState('');
  const [strok, setStrok] = useState('');
  const [basinc, setBasinc] = useState('');
  const [cycleRate, setCycleRate] = useState('');
  const [focusedDim, setFocusedDim] = useState<CylDim>(null);
  const [result, setResult] = useState<null | {
    geomCycle: number;
    fadCycle: number | null;
    fadPerMin: number | null;
    power: number | null;
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
    const geomCycle = (itmeHacmi + cekmeHacmi) / 1_000_000;

    let pushKg: number | null = null;
    let pullKg: number | null = null;
    let pBar: number | null = null;
    let fadCycle: number | null = null;
    let fadPerMin: number | null = null;
    let power: number | null = null;

    if (!Number.isNaN(pressure) && pressure > 0) {
      const kuvvetItmeN = pistonAlan * pressure * 0.1;
      const kuvvetCekmeN = (pistonAlan - milAlan) * pressure * 0.1;
      pushKg = kuvvetItmeN / 9.81;
      pullKg = kuvvetCekmeN / 9.81;
      pBar = pressure;
      // FAD = geometric volume × absolute pressure / atmospheric pressure
      fadCycle = geomCycle * (pressure + 1.013) / 1.013;

      const cr = parseNum(cycleRate);
      if (!Number.isNaN(cr) && cr > 0) {
        fadPerMin = fadCycle * cr;
        // P(kW) = Q_FAD(NL/min) × p_working(bar) / 600
        power = fadPerMin * pressure / 600;
      }
    }

    setResult({
      geomCycle,
      fadCycle,
      fadPerMin,
      power,
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
      `${t('pneumaticCalculator.geomPerCycle')}: ${result.geomCycle.toFixed(4)} L`,
    ];

    if (result.fadCycle !== null) {
      lines.push(
        `${t('pneumaticCalculator.fadPerCycle')}: ${result.fadCycle.toFixed(4)} NL`,
      );
    }

    if (result.fadPerMin !== null && result.power !== null) {
      lines.push(
        `${t('pneumaticCalculator.fadPerMin')}: ${result.fadPerMin.toFixed(2)} NL/min`,
        `${t('pneumaticCalculator.powerEstimate')}: ${result.power.toFixed(3)} kW`,
      );
    }

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('pneumaticCalculator.title')}
        category={t('modules.pneumaticCylinder.category')}
        bannerImage={BANNER}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <CylinderDiagram
            highlight={focusedDim}
            boreLabel={t('hydraulicCalculator.diagram.bore')}
            rodLabel={t('hydraulicCalculator.diagram.rod')}
            strokeLabel={t('hydraulicCalculator.diagram.stroke')}
          />

          <Text style={styles.label}>{t('pneumaticCalculator.pistonCap')}</Text>
          <TextInput
            style={[styles.input, focusedDim === 'bore' && styles.inputActive]}
            value={pistonCap} onChangeText={setPistonCap} keyboardType="decimal-pad"
            onFocus={() => setFocusedDim('bore')} onBlur={() => setFocusedDim(null)}
          />

          <Text style={styles.label}>{t('pneumaticCalculator.milCap')}</Text>
          <TextInput
            style={[styles.input, focusedDim === 'rod' && styles.inputActive]}
            value={milCap} onChangeText={setMilCap} keyboardType="decimal-pad"
            onFocus={() => setFocusedDim('rod')} onBlur={() => setFocusedDim(null)}
          />

          <Text style={styles.label}>{t('pneumaticCalculator.strok')}</Text>
          <TextInput
            style={[styles.input, focusedDim === 'stroke' && styles.inputActive]}
            value={strok} onChangeText={setStrok} keyboardType="decimal-pad"
            onFocus={() => setFocusedDim('stroke')} onBlur={() => setFocusedDim(null)}
          />

          <Text style={styles.label}>{t('pneumaticCalculator.basinc')}</Text>
          <TextInput style={styles.input} value={basinc} onChangeText={setBasinc} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('pneumaticCalculator.cycleRate')}</Text>
          <TextInput style={styles.input} value={cycleRate} onChangeText={setCycleRate} keyboardType="decimal-pad" />

          <TouchableOpacity style={styles.calcButton} onPress={hesapla}>
            <Text style={styles.calcButtonText}>{t('pneumaticCalculator.calculate')}</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <ResultCard title={t('pneumaticCalculator.airConsumption')}>
            <HeroRow>
              <HeroStat
                icon="cube-outline"
                value={result.geomCycle}
                decimals={4}
                unit="L"
                label={t('pneumaticCalculator.geomPerCycle')}
                primary={result.power === null}
              />
              {result.power !== null && (
                <HeroStat
                  icon="flash"
                  primary
                  value={result.power}
                  decimals={3}
                  unit="kW"
                  label={t('pneumaticCalculator.powerEstimate')}
                />
              )}
            </HeroRow>

            {(result.pushKg !== null || result.fadPerMin !== null) && (
              <HeroRow>
                {result.pushKg !== null && (
                  <HeroStat
                    icon="arrow-forward-circle"
                    primary
                    value={result.pushKg}
                    decimals={2}
                    unit="kg"
                    label={t('pneumaticCalculator.pushForce')}
                  />
                )}
                {result.fadPerMin !== null && (
                  <HeroStat
                    icon="speedometer"
                    value={result.fadPerMin}
                    decimals={2}
                    unit="NL/min"
                    label={t('pneumaticCalculator.fadPerMin')}
                  />
                )}
              </HeroRow>
            )}

            <ResultSection icon="cube-outline" title={t('pneumaticCalculator.airConsumption')}>
              <DetailRow
                label={t('pneumaticCalculator.geomPerCycle')}
                value={`${result.geomCycle.toFixed(4)} L`}
              />
              {result.fadCycle !== null && (
                <DetailRow
                  label={t('pneumaticCalculator.fadPerCycle')}
                  value={`${result.fadCycle.toFixed(4)} NL`}
                />
              )}
              {result.fadPerMin !== null && (
                <DetailRow
                  label={t('pneumaticCalculator.fadPerMin')}
                  value={`${result.fadPerMin.toFixed(2)} NL/min`}
                />
              )}
              {result.power !== null && (
                <DetailRow
                  label={t('pneumaticCalculator.powerEstimate')}
                  value={`${result.power.toFixed(3)} kW`}
                />
              )}
            </ResultSection>

            {result.pressure !== null && result.pushKg !== null && result.pullKg !== null && (
              <ResultSection
                icon="barbell-outline"
                title={t('pneumaticCalculator.forceAtPressure', { pressure: result.pressure.toFixed(0) })}
              >
                <DetailRow label={t('pneumaticCalculator.pushForce')} value={`${result.pushKg.toFixed(2)} kg`} />
                <DetailRow label={t('pneumaticCalculator.pullForce')} value={`${result.pullKg.toFixed(2)} kg`} />
              </ResultSection>
            )}

            <CopyResultButton value={copyValue} />
          </ResultCard>
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
  inputActive: {
    borderColor: Colors.accent,
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
});
