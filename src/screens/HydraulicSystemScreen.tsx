import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
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
import { Ionicons } from '@expo/vector-icons';
import { CopyResultButton } from '../components/CopyResultButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';

const EFFICIENCY = 0.93;

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const HydraulicSystemScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [pumpDisplacement, setPumpDisplacement] = useState('');
  const [motorRPM, setMotorRPM] = useState('');
  const [pressure, setPressure] = useState('');
  const [bore, setBore] = useState('');
  const [rod, setRod] = useState('');
  const [stroke, setStroke] = useState('');
  const [isResultFullscreen, setIsResultFullscreen] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const result = useMemo(() => {
    const pump = parseNum(pumpDisplacement);
    const rpm = parseNum(motorRPM);
    const p = parseNum(pressure);

    const b = parseNum(bore);
    const r = parseNum(rod);
    const s = parseNum(stroke);

    const boreCm = Number.isNaN(b) ? 0 : b / 10;
    const rodCm = Number.isNaN(r) ? 0 : r / 10;
    const strokeCm = Number.isNaN(s) ? 0 : s;

    const hasRequired = !Number.isNaN(pump) && !Number.isNaN(rpm) && !Number.isNaN(p);
    if (!hasRequired || pump <= 0 || rpm <= 0 || p <= 0) {
      return null;
    }

    const theoreticalFlowRate = (pump * rpm) / 1000;
    const actualFlowRate = theoreticalFlowRate * EFFICIENCY;
    const motorPower = (1.1 * 0.0022 * theoreticalFlowRate * p) / 1.34;

    let cylinder: null | {
      pistonArea: number;
      rodArea: number;
      effectiveArea: number;
      extForce: number;
      retForce: number;
      extVolume: number;
      retVolume: number;
      extTime: number;
      retTime: number;
      cycleTime: number;
      extSpeedMm: number;
      retSpeedMm: number;
      hasRod: boolean;
    } = null;

    if (boreCm > 0 && strokeCm > 0) {
      const pistonArea = Math.PI * Math.pow(boreCm / 2, 2);
      const rodArea = rodCm > 0 ? Math.PI * Math.pow(rodCm / 2, 2) : 0;
      const effectiveArea = pistonArea - rodArea;
      const hasRod = rodCm > 0 && effectiveArea > 0;

      const extForce = pistonArea * p;
      const retForce = hasRod ? effectiveArea * p : 0;

      const extVolume = (pistonArea * strokeCm) / 1000;
      const retVolume = hasRod ? (effectiveArea * strokeCm) / 1000 : 0;

      const flowPerSec = actualFlowRate / 60;
      const extTime = extVolume / flowPerSec;
      const retTime = hasRod ? retVolume / flowPerSec : 0;
      const cycleTime = extTime + retTime;

      const extSpeedCm = (actualFlowRate * 1000) / (60 * pistonArea);
      const retSpeedCm = hasRod ? (actualFlowRate * 1000) / (60 * effectiveArea) : 0;

      cylinder = {
        pistonArea,
        rodArea,
        effectiveArea,
        extForce,
        retForce,
        extVolume,
        retVolume,
        extTime,
        retTime,
        cycleTime,
        extSpeedMm: extSpeedCm * 10,
        retSpeedMm: retSpeedCm * 10,
        hasRod,
      };
    }

    return {
      theoreticalFlowRate,
      actualFlowRate,
      motorPower,
      cylinder,
    };
  }, [pumpDisplacement, motorRPM, pressure, bore, rod, stroke]);

  const resultCopyText = useMemo(() => {
    if (!result) {
      return '';
    }

    const lines = [
      `${t('hydraulicCalculator.results.theoreticalFlow')} ${result.theoreticalFlowRate.toFixed(2)} ${t('hydraulicCalculator.units.flow')}`,
      `${t('hydraulicCalculator.results.actualFlow')} ${result.actualFlowRate.toFixed(2)} ${t('hydraulicCalculator.units.flow')}`,
      `${t('hydraulicCalculator.results.motorPower')} ${result.motorPower.toFixed(2)} ${t('hydraulicCalculator.units.power')}`,
    ];

    if (result.cylinder) {
      lines.push(
        `${t('hydraulicCalculator.results.pistonArea')} ${result.cylinder.pistonArea.toFixed(2)} cm²`,
        `${t('hydraulicCalculator.results.extForce')} ${result.cylinder.extForce.toFixed(2)} kg`,
        `${t('hydraulicCalculator.results.extVolume')} ${result.cylinder.extVolume.toFixed(3)} L`,
        `${t('hydraulicCalculator.results.extSpeed')} ${result.cylinder.extSpeedMm.toFixed(2)} mm/s`,
        `${t('hydraulicCalculator.results.extTime')} ${result.cylinder.extTime.toFixed(3)} s`,
      );

      if (result.cylinder.hasRod) {
        lines.push(
          `${t('hydraulicCalculator.results.rodArea')} ${result.cylinder.rodArea.toFixed(2)} cm²`,
          `${t('hydraulicCalculator.results.effectiveArea')} ${result.cylinder.effectiveArea.toFixed(2)} cm²`,
          `${t('hydraulicCalculator.results.retForce')} ${result.cylinder.retForce.toFixed(2)} kg`,
          `${t('hydraulicCalculator.results.retVolume')} ${result.cylinder.retVolume.toFixed(3)} L`,
          `${t('hydraulicCalculator.results.retSpeed')} ${result.cylinder.retSpeedMm.toFixed(2)} mm/s`,
          `${t('hydraulicCalculator.results.retTime')} ${result.cylinder.retTime.toFixed(3)} s`,
          `${t('hydraulicCalculator.results.cycleTime')} ${result.cylinder.cycleTime.toFixed(3)} s`,
        );
      }
    }

    return lines.join('\n');
  }, [result, t]);

  useEffect(() => {
    if (!result) return;
    glowAnim.setValue(0);
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 160, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 360, useNativeDriver: false }),
    ]).start();
  }, [result, glowAnim]);

  const resultBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F5C40033', '#F5C400AA'],
  });

  const renderResultContent = (showDisclaimer: boolean) => {
    if (!result) {
      return <Text style={styles.placeholder}>{t('hydraulicCalculator.placeholder')}</Text>;
    }

    return (
      <>
        <Text style={styles.sectionTitle}>{t('hydraulicCalculator.sections.pump')}</Text>
        <Text style={styles.resultLine}>
          {t('hydraulicCalculator.results.theoreticalFlow')} <Text style={styles.value}>{result.theoreticalFlowRate.toFixed(2)} {t('hydraulicCalculator.units.flow')}</Text>
        </Text>
        <Text style={styles.resultLine}>
          {t('hydraulicCalculator.results.actualFlow')} <Text style={styles.value}>{result.actualFlowRate.toFixed(2)} {t('hydraulicCalculator.units.flow')}</Text>
        </Text>
        <Text style={styles.resultLine}>
          {t('hydraulicCalculator.results.motorPower')} <Text style={styles.value}>{result.motorPower.toFixed(2)} {t('hydraulicCalculator.units.power')}</Text>
        </Text>

        {result.cylinder && (
          <>
            <Text style={styles.sectionTitle}>{t('hydraulicCalculator.sections.cylinder')}</Text>
            <Text style={styles.resultLine}>
              {t('hydraulicCalculator.results.pistonArea')} <Text style={styles.value}>{result.cylinder.pistonArea.toFixed(2)} cm²</Text>
            </Text>
            {result.cylinder.hasRod && (
              <>
                <Text style={styles.resultLine}>
                  {t('hydraulicCalculator.results.rodArea')} <Text style={styles.value}>{result.cylinder.rodArea.toFixed(2)} cm²</Text>
                </Text>
                <Text style={styles.resultLine}>
                  {t('hydraulicCalculator.results.effectiveArea')} <Text style={styles.value}>{result.cylinder.effectiveArea.toFixed(2)} cm²</Text>
                </Text>
              </>
            )}
            <Text style={styles.resultLine}>
              {t('hydraulicCalculator.results.extForce')} <Text style={styles.value}>{result.cylinder.extForce.toFixed(2)} kg</Text>
            </Text>
            {result.cylinder.hasRod && (
              <Text style={styles.resultLine}>
                {t('hydraulicCalculator.results.retForce')} <Text style={styles.value}>{result.cylinder.retForce.toFixed(2)} kg</Text>
              </Text>
            )}
            <Text style={styles.resultLine}>
              {t('hydraulicCalculator.results.extVolume')} <Text style={styles.value}>{result.cylinder.extVolume.toFixed(3)} L</Text>
            </Text>
            {result.cylinder.hasRod && (
              <Text style={styles.resultLine}>
                {t('hydraulicCalculator.results.retVolume')} <Text style={styles.value}>{result.cylinder.retVolume.toFixed(3)} L</Text>
              </Text>
            )}

            <Text style={styles.sectionTitle}>{t('hydraulicCalculator.sections.speed')}</Text>
            <Text style={styles.resultLine}>
              {t('hydraulicCalculator.results.extSpeed')} <Text style={styles.value}>{result.cylinder.extSpeedMm.toFixed(2)} mm/s</Text>
            </Text>
            {result.cylinder.hasRod && (
              <Text style={styles.resultLine}>
                {t('hydraulicCalculator.results.retSpeed')} <Text style={styles.value}>{result.cylinder.retSpeedMm.toFixed(2)} mm/s</Text>
              </Text>
            )}

            <Text style={styles.sectionTitle}>{t('hydraulicCalculator.sections.time')}</Text>
            <Text style={styles.resultLine}>
              {t('hydraulicCalculator.results.extTime')} <Text style={styles.value}>{result.cylinder.extTime.toFixed(3)} s</Text>
            </Text>
            {result.cylinder.hasRod && (
              <>
                <Text style={styles.resultLine}>
                  {t('hydraulicCalculator.results.retTime')} <Text style={styles.value}>{result.cylinder.retTime.toFixed(3)} s</Text>
                </Text>
                <Text style={styles.resultLine}>
                  {t('hydraulicCalculator.results.cycleTime')} <Text style={styles.value}>{result.cylinder.cycleTime.toFixed(3)} s</Text>
                </Text>
              </>
            )}
          </>
        )}
        {showDisclaimer ? <Text style={styles.footerNote}>{t('hydraulicCalculator.disclaimer')}</Text> : null}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('hydraulicCalculator.title')}
        subtitle={t('modules.hydraulicSystem.description')}
        category={t('modules.hydraulicSystem.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <Text style={styles.label}>{t('hydraulicCalculator.pumpDisplacement')}</Text>
          <TextInput
            style={styles.input}
            value={pumpDisplacement}
            onChangeText={setPumpDisplacement}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>{t('hydraulicCalculator.motorRpm')}</Text>
          <TextInput
            style={styles.input}
            value={motorRPM}
            onChangeText={setMotorRPM}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>{t('hydraulicCalculator.pressure')}</Text>
          <TextInput
            style={styles.input}
            value={pressure}
            onChangeText={setPressure}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>
            {t('hydraulicCalculator.bore')} <Text style={styles.optional}>({t('hydraulicCalculator.optional')})</Text>
          </Text>
          <TextInput style={styles.input} value={bore} onChangeText={setBore} keyboardType="decimal-pad" />

          <Text style={styles.label}>
            {t('hydraulicCalculator.rod')} <Text style={styles.optional}>({t('hydraulicCalculator.optional')})</Text>
          </Text>
          <TextInput style={styles.input} value={rod} onChangeText={setRod} keyboardType="decimal-pad" />

          <Text style={styles.label}>
            {t('hydraulicCalculator.stroke')} <Text style={styles.optional}>({t('hydraulicCalculator.optional')})</Text>
          </Text>
          <TextInput style={styles.input} value={stroke} onChangeText={setStroke} keyboardType="decimal-pad" />
        </View>

        <Animated.View style={[styles.resultCard, { borderColor: result ? resultBorderColor : Colors.border }]}>
          <TouchableOpacity
            style={styles.resultHeaderRow}
            activeOpacity={0.85}
            onPress={() => setIsResultFullscreen(true)}
          >
            <Text style={styles.resultHeaderTitle}>{t('hydraulicCalculator.resultTitle')}</Text>
            <View style={styles.resultHeaderRight}>
              <Ionicons name="expand-outline" size={17} color={Colors.textMuted} />
              {result ? (
                <View style={styles.liveBadge}>
                  <Ionicons name="flash-outline" size={12} color={Colors.accent} />
                  <Text style={styles.liveBadgeText}>{t('hydraulicCalculator.live')}</Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>

          {renderResultContent(true)}
          {result ? <CopyResultButton value={resultCopyText} /> : null}
        </Animated.View>
      </ScrollView>

      <Modal visible={isResultFullscreen} animationType="slide" onRequestClose={() => setIsResultFullscreen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Ionicons name="flash-outline" size={16} color={Colors.accent} />
              <Text style={styles.modalTitle}>{t('hydraulicCalculator.resultTitle')}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsResultFullscreen(false)} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalCard}>{renderResultContent(true)}</View>
          </ScrollView>
        </View>
      </Modal>
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
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  pageTitle: {
    ...Typography.h3,
    marginBottom: 2,
    paddingHorizontal: Spacing.xs,
  },
  label: {
    ...Typography.label,
    marginBottom: 6,
    marginTop: Spacing.sm,
    color: Colors.textPrimary,
  },
  optional: {
    ...Typography.caption,
    color: Colors.textMuted,
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
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    padding: Spacing.md,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  resultHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  resultHeaderTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  liveBadge: {
    backgroundColor: '#F5C40022',
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveBadgeText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  placeholder: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.accent,
    marginTop: Spacing.sm,
    marginBottom: 6,
  },
  resultLine: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  value: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  footerNote: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  modalTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: Spacing.md,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    padding: Spacing.md,
  },
});
