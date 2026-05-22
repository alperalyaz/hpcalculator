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
import { Colors, Typography, Spacing, Radius } from '../theme';

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const BucklingShaftScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [mass, setMass] = useState('1000');
  const [safetyFactor, setSafetyFactor] = useState('8');
  const [length, setLength] = useState('2500');
  const [coefficient, setCoefficient] = useState(0.5);
  const [elasticity, setElasticity] = useState(210000);
  const [diameter, setDiameter] = useState<number | null>(null);

  const coefficientOptions = useMemo(
    () => [
      { value: 0.5, label: t('bucklingCalculator.coefficients.fixedFree') },
      { value: 1.0, label: t('bucklingCalculator.coefficients.pinnedPinned') },
      { value: 2.0, label: t('bucklingCalculator.coefficients.fixedPinned') },
      { value: 0.7, label: t('bucklingCalculator.coefficients.fixedFixed') },
    ],
    [t]
  );

  const materialOptions = useMemo(
    () => [
      { value: 210000, label: t('bucklingCalculator.materials.steel') },
      { value: 110000, label: t('bucklingCalculator.materials.titanium') },
      { value: 100000, label: t('bucklingCalculator.materials.brass') },
      { value: 69000, label: t('bucklingCalculator.materials.aluminum') },
      { value: 12000, label: t('bucklingCalculator.materials.wood') },
    ],
    [t]
  );

  const calculate = () => {
    const m = parseNum(mass);
    const sbk = parseNum(safetyFactor);
    const l = parseNum(length);

    if (Number.isNaN(m) || Number.isNaN(sbk) || Number.isNaN(l) || m <= 0 || sbk <= 0 || l <= 0) {
      setDiameter(null);
      return;
    }

    const force = m * 9.81;
    const criticalLength = l * coefficient;
    const inertiaMoment = (force * sbk * Math.pow(criticalLength, 2)) / (Math.pow(Math.PI, 2) * elasticity);
    const d = Math.pow((inertiaMoment * 64) / Math.PI, 0.25);
    setDiameter(d);
  };

  const copyValue = useMemo(() => {
    if (diameter === null) {
      return '';
    }

    return `${t('bucklingCalculator.result')} ${diameter.toFixed(2)} mm\n${t('bucklingCalculator.note')}`;
  }, [diameter, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('bucklingCalculator.title')}
        subtitle={t('modules.bucklingShaft.description')}
        category={t('modules.bucklingShaft.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.label}>{t('bucklingCalculator.mass')}</Text>
          <TextInput style={styles.input} value={mass} onChangeText={setMass} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('bucklingCalculator.safetyFactor')}</Text>
          <TextInput style={styles.input} value={safetyFactor} onChangeText={setSafetyFactor} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('bucklingCalculator.length')}</Text>
          <TextInput style={styles.input} value={length} onChangeText={setLength} keyboardType="decimal-pad" />

          <Text style={styles.label}>{t('bucklingCalculator.coefficient')}</Text>
          <View style={styles.optionWrap}>
            {coefficientOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionChip, coefficient === opt.value && styles.optionChipActive]}
                onPress={() => setCoefficient(opt.value)}
              >
                <Text style={[styles.optionText, coefficient === opt.value && styles.optionTextActive]}>
                  {opt.value} - {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>{t('bucklingCalculator.material')}</Text>
          <View style={styles.optionWrap}>
            {materialOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionChip, elasticity === opt.value && styles.optionChipActive]}
                onPress={() => setElasticity(opt.value)}
              >
                <Text style={[styles.optionText, elasticity === opt.value && styles.optionTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.calcButton} onPress={calculate}>
            <Text style={styles.calcButtonText}>{t('bucklingCalculator.calculate')}</Text>
          </TouchableOpacity>
        </View>

        {diameter !== null ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>
              {t('bucklingCalculator.result')} <Text style={styles.resultValue}>{diameter.toFixed(2)} mm</Text>
            </Text>
            <Text style={styles.note}>{t('bucklingCalculator.note')}</Text>
            <CopyResultButton value={copyValue} />
          </View>
        ) : null}
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
  },
  label: {
    ...Typography.label,
    marginBottom: 6,
    marginTop: Spacing.sm,
    color: Colors.textPrimary,
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
  optionWrap: {
    gap: Spacing.xs,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.inputBackground,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
  },
  optionChipActive: {
    borderColor: Colors.borderAccent,
    backgroundColor: '#F5C40022',
  },
  optionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  calcButton: {
    marginTop: Spacing.md,
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
    backgroundColor: '#7A1E1E',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#B33636',
  },
  resultText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  note: {
    ...Typography.caption,
    color: '#F5D9D9',
    marginTop: Spacing.sm,
    lineHeight: 18,
  },
});
