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

type CalcType = 'pipe' | 'rod';
type PipeInputMode = 'inner-outer' | 'inner-thickness' | 'outer-thickness';
type LengthUnit = 'mm' | 'cm' | 'm';
type MaterialKey = 'steel' | 'aluminum' | 'copper' | 'brass' | 'custom';

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const PipeRodWeightScreen: React.FC = () => {
  const { t } = useTranslation();
  const [calcType, setCalcType] = useState<CalcType>('pipe');
  const [inputMode, setInputMode] = useState<PipeInputMode>('inner-outer');
  const [outerDiameter, setOuterDiameter] = useState('90');
  const [innerDiameter, setInnerDiameter] = useState('80');
  const [thickness, setThickness] = useState('5');
  const [length, setLength] = useState('1000');
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('mm');
  const [materialKey, setMaterialKey] = useState<MaterialKey>('steel');
  const [customDensity, setCustomDensity] = useState('7.85');

  const [result, setResult] = useState<null | {
    weightKg: number;
    outerMm: number;
    innerMm: number;
    thicknessMm: number | null;
    lengthMm: number;
    density: number;
    areaCm2: number;
    volumeCm3: number;
  }>(null);

  const materialDensityMap: Record<Exclude<MaterialKey, 'custom'>, number> = useMemo(
    () => ({ steel: 7.85, aluminum: 2.7, copper: 8.96, brass: 7.2 }),
    []
  );

  const calculate = () => {
    const odInput = parseNum(outerDiameter);
    const idInput = parseNum(innerDiameter);
    const thInput = parseNum(thickness);
    let len = parseNum(length);

    if (Number.isNaN(len) || len <= 0) {
      setResult(null);
      return;
    }

    if (lengthUnit === 'm') len *= 1000;
    else if (lengthUnit === 'cm') len *= 10;

    let od = odInput;
    let id = calcType === 'rod' ? 0 : idInput;
    let thicknessMm: number | null = null;

    if (calcType === 'rod') {
      if (Number.isNaN(od) || od <= 0) {
        setResult(null);
        return;
      }
    } else if (inputMode === 'inner-outer') {
      if (Number.isNaN(od) || Number.isNaN(id) || od <= 0 || id < 0 || id >= od) {
        setResult(null);
        return;
      }
      thicknessMm = (od - id) / 2;
    } else if (inputMode === 'inner-thickness') {
      if (Number.isNaN(id) || Number.isNaN(thInput) || id < 0 || thInput <= 0) {
        setResult(null);
        return;
      }
      od = id + thInput * 2;
      thicknessMm = thInput;
    } else {
      if (Number.isNaN(od) || Number.isNaN(thInput) || od <= 0 || thInput <= 0 || od <= thInput * 2) {
        setResult(null);
        return;
      }
      id = od - thInput * 2;
      thicknessMm = thInput;
    }

    const density = materialKey === 'custom' ? parseNum(customDensity) : materialDensityMap[materialKey];
    if (Number.isNaN(density) || density <= 0) {
      setResult(null);
      return;
    }

    const outerRadiusCm = od / 20;
    const innerRadiusCm = id / 20;
    const outerArea = Math.PI * outerRadiusCm * outerRadiusCm;
    const innerArea = Math.PI * innerRadiusCm * innerRadiusCm;
    const areaCm2 = outerArea - innerArea;
    const volumeCm3 = areaCm2 * (len / 10);
    const weightKg = (volumeCm3 * density) / 1000;

    setResult({
      weightKg,
      outerMm: od,
      innerMm: id,
      thicknessMm,
      lengthMm: len,
      density,
      areaCm2,
      volumeCm3,
    });
  };

  const copyValue = useMemo(() => {
    if (!result) {
      return '';
    }

    const lines = [
      `${t('pipeWeightCalculator.result')}: ${t('pipeWeightCalculator.weight')}: ${result.weightKg.toFixed(2)} kg`,
      `- ${t('pipeWeightCalculator.outerDiameter')}: ${result.outerMm.toFixed(2)} mm`,
      `- ${t('pipeWeightCalculator.innerDiameter')}: ${result.innerMm.toFixed(2)} mm`,
    ];

    if (result.thicknessMm !== null) {
      lines.push(`- ${t('pipeWeightCalculator.thickness')}: ${result.thicknessMm.toFixed(2)} mm`);
    }

    lines.push(
      `- ${t('pipeWeightCalculator.length')}: ${result.lengthMm.toFixed(0)} mm (${(result.lengthMm / 1000).toFixed(2)} m)`,
      `- ${t('pipeWeightCalculator.density')}: ${result.density.toFixed(2)} g/cm3`,
      `- ${t('pipeWeightCalculator.crossSectionArea')}: ${result.areaCm2.toFixed(2)} cm2`,
      `- ${t('pipeWeightCalculator.volume')}: ${result.volumeCm3.toFixed(2)} cm3`,
    );

    return lines.join('\n');
  }, [result, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title={t('pipeWeightCalculator.title')}
        subtitle={t('modules.pipeRodWeight.description')}
        category={t('modules.pipeRodWeight.category')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentBtn, calcType === 'pipe' && styles.segmentBtnActive]}
              onPress={() => setCalcType('pipe')}
            >
              <Text style={[styles.segmentText, calcType === 'pipe' && styles.segmentTextActive]}>{t('pipeWeightCalculator.typePipe')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, calcType === 'rod' && styles.segmentBtnActive]}
              onPress={() => setCalcType('rod')}
            >
              <Text style={[styles.segmentText, calcType === 'rod' && styles.segmentTextActive]}>{t('pipeWeightCalculator.typeRod')}</Text>
            </TouchableOpacity>
          </View>

          {calcType === 'pipe' && (
            <View style={styles.modeWrap}>
              {(['inner-outer', 'inner-thickness', 'outer-thickness'] as PipeInputMode[]).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[styles.modeBtn, inputMode === mode && styles.modeBtnActive]}
                  onPress={() => setInputMode(mode)}
                >
                  <Text style={[styles.modeText, inputMode === mode && styles.modeTextActive]}>
                    {t(`pipeWeightCalculator.modes.${mode}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(calcType === 'rod' || inputMode !== 'inner-thickness') && (
            <>
              <Text style={styles.label}>{t('pipeWeightCalculator.outerDiameter')}</Text>
              <TextInput style={styles.input} value={outerDiameter} onChangeText={setOuterDiameter} keyboardType="decimal-pad" />
            </>
          )}

          {(calcType === 'pipe' && inputMode !== 'outer-thickness') && (
            <>
              <Text style={styles.label}>{t('pipeWeightCalculator.innerDiameter')}</Text>
              <TextInput style={styles.input} value={innerDiameter} onChangeText={setInnerDiameter} keyboardType="decimal-pad" />
            </>
          )}

          {calcType === 'pipe' && inputMode !== 'inner-outer' && (
            <>
              <Text style={styles.label}>{t('pipeWeightCalculator.thickness')}</Text>
              <TextInput style={styles.input} value={thickness} onChangeText={setThickness} keyboardType="decimal-pad" />
            </>
          )}

          <Text style={styles.label}>{t('pipeWeightCalculator.length')}</Text>
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.flex]} value={length} onChangeText={setLength} keyboardType="decimal-pad" />
            <View style={styles.unitWrap}>
              {(['mm', 'cm', 'm'] as LengthUnit[]).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.unitBtn, lengthUnit === u && styles.unitBtnActive]}
                  onPress={() => setLengthUnit(u)}
                >
                  <Text style={[styles.unitText, lengthUnit === u && styles.unitTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.label}>{t('pipeWeightCalculator.material')}</Text>
          <View style={styles.modeWrap}>
            {(['steel', 'aluminum', 'copper', 'brass', 'custom'] as MaterialKey[]).map((mk) => (
              <TouchableOpacity
                key={mk}
                style={[styles.modeBtn, materialKey === mk && styles.modeBtnActive]}
                onPress={() => setMaterialKey(mk)}
              >
                <Text style={[styles.modeText, materialKey === mk && styles.modeTextActive]}>
                  {t(`pipeWeightCalculator.materials.${mk}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {materialKey === 'custom' && (
            <>
              <Text style={styles.label}>{t('pipeWeightCalculator.customDensity')}</Text>
              <TextInput style={styles.input} value={customDensity} onChangeText={setCustomDensity} keyboardType="decimal-pad" />
            </>
          )}

          <TouchableOpacity style={styles.calcButton} onPress={calculate}>
            <Text style={styles.calcButtonText}>{t('pipeWeightCalculator.calculate')}</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{t('pipeWeightCalculator.result')}</Text>
            <Text style={styles.resultWeight}>{t('pipeWeightCalculator.weight')}: {result.weightKg.toFixed(2)} kg</Text>
            <Text style={styles.resultDetail}>- {t('pipeWeightCalculator.outerDiameter')}: {result.outerMm.toFixed(2)} mm</Text>
            <Text style={styles.resultDetail}>- {t('pipeWeightCalculator.innerDiameter')}: {result.innerMm.toFixed(2)} mm</Text>
            {result.thicknessMm !== null && (
              <Text style={styles.resultDetail}>- {t('pipeWeightCalculator.thickness')}: {result.thicknessMm.toFixed(2)} mm</Text>
            )}
            <Text style={styles.resultDetail}>
              - {t('pipeWeightCalculator.length')}: {result.lengthMm.toFixed(0)} mm ({(result.lengthMm / 1000).toFixed(2)} m)
            </Text>
            <Text style={styles.resultDetail}>- {t('pipeWeightCalculator.density')}: {result.density.toFixed(2)} g/cm3</Text>
            <Text style={styles.resultDetail}>- {t('pipeWeightCalculator.crossSectionArea')}: {result.areaCm2.toFixed(2)} cm2</Text>
            <Text style={styles.resultDetail}>- {t('pipeWeightCalculator.volume')}: {result.volumeCm3.toFixed(2)} cm3</Text>
            <CopyResultButton value={copyValue} />
          </View>
        )}

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>{t('pipeWeightCalculator.disclaimer1')}</Text>
          <Text style={styles.disclaimerText}>{t('pipeWeightCalculator.disclaimer2')}</Text>
          <Text style={styles.disclaimerText}>{t('pipeWeightCalculator.disclaimer3')}</Text>
        </View>
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
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
  },
  segmentBtnActive: {
    backgroundColor: Colors.accent,
  },
  segmentText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#111111',
    fontWeight: '700',
  },
  modeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  modeBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.inputBackground,
  },
  modeBtnActive: {
    borderColor: Colors.borderAccent,
    backgroundColor: '#F5C40022',
  },
  modeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  modeTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
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
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  unitWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  unitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.inputBackground,
  },
  unitBtnActive: {
    backgroundColor: Colors.accent,
  },
  unitText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  unitTextActive: {
    color: '#111111',
    fontWeight: '700',
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
    backgroundColor: '#1D3A24',
    borderWidth: 1,
    borderColor: '#2E6A3F',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
  },
  resultTitle: {
    ...Typography.bodyBold,
    color: '#D3FFE0',
    marginBottom: 4,
  },
  resultWeight: {
    ...Typography.h3,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultDetail: {
    ...Typography.caption,
    color: '#D6EEDA',
    lineHeight: 18,
  },
  disclaimerCard: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: 6,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
