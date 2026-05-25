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
import { InfoTooltip } from '../components/InfoTooltip';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { CylinderDiagram } from '../components/diagrams/CylinderDiagram';
import { Colors, Typography, Spacing, Radius } from '../theme';

const BANNER = require('../../assets/banner_hydraulic.jpg');

type CylDim = 'bore' | 'rod' | 'stroke' | null;

const HeroStat: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  decimals: number;
  unit: string;
  label: string;
  primary?: boolean;
}> = ({ icon, value, decimals, unit, label, primary = false }) => (
  <View style={[styles.heroCard, primary && styles.heroCardPrimary]}>
    <View style={styles.heroTopRow}>
      <View style={[styles.heroIconWrap, primary && styles.heroIconWrapPrimary]}>
        <Ionicons name={icon} size={16} color={Colors.accent} />
      </View>
      <Text style={[styles.heroLabel, primary && styles.heroLabelPrimary]} numberOfLines={2}>{label}</Text>
    </View>
    <View style={styles.heroValueRow}>
      <AnimatedNumber
        value={value}
        decimals={decimals}
        style={[styles.heroValue, primary && styles.heroValuePrimary]}
      />
      <Text style={[styles.heroUnit, primary && styles.heroUnitPrimary]}>{unit}</Text>
    </View>
  </View>
);

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
  const [focusedDim, setFocusedDim] = useState<CylDim>(null);
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
    const strokeCm = Number.isNaN(s) ? 0 : s / 10;

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

      // 1 bar = 10.197 kgf/cm²
      const extForce = pistonArea * p * 10.197;
      const retForce = hasRod ? effectiveArea * p * 10.197 : 0;

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

  const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const SectionCard: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    children: React.ReactNode;
  }> = ({ icon, title, children }) => (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <Ionicons name={icon} size={15} color={Colors.background} />
        <Text style={styles.detailTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const renderResultContent = (showDisclaimer: boolean) => {
    if (!result) {
      return <Text style={styles.placeholder}>{t('hydraulicCalculator.placeholder')}</Text>;
    }

    const cyl = result.cylinder;

    return (
      <>
        {/* Hero stats */}
        <View style={styles.heroRow}>
          <HeroStat
            icon="water"
            value={result.actualFlowRate}
            decimals={1}
            unit={t('hydraulicCalculator.units.flow')}
            label={t('hydraulicCalculator.heroLabels.actualFlow')}
          />
          <HeroStat
            icon="flash"
            primary
            value={result.motorPower}
            decimals={2}
            unit={t('hydraulicCalculator.units.power')}
            label={t('hydraulicCalculator.heroLabels.motorPower')}
          />
        </View>

        {cyl && (
          <View style={styles.heroRow}>
            <HeroStat
              icon="arrow-forward-circle"
              primary
              value={cyl.extForce}
              decimals={0}
              unit="kgf"
              label={t('hydraulicCalculator.heroLabels.extForce')}
            />
            {cyl.hasRod && (
              <HeroStat
                icon="arrow-back-circle"
                value={cyl.retForce}
                decimals={0}
                unit="kgf"
                label={t('hydraulicCalculator.heroLabels.retForce')}
              />
            )}
          </View>
        )}

        {/* Pump detail */}
        <SectionCard icon="cog" title={t('hydraulicCalculator.sections.pump')}>
          <DetailRow
            label={t('hydraulicCalculator.results.theoreticalFlow')}
            value={`${result.theoreticalFlowRate.toFixed(2)} ${t('hydraulicCalculator.units.flow')}`}
          />
          <DetailRow
            label={t('hydraulicCalculator.results.actualFlow')}
            value={`${result.actualFlowRate.toFixed(2)} ${t('hydraulicCalculator.units.flow')}`}
          />
          <DetailRow
            label={t('hydraulicCalculator.results.motorPower')}
            value={`${result.motorPower.toFixed(2)} ${t('hydraulicCalculator.units.power')}`}
          />
        </SectionCard>

        {cyl && (
          <>
            <SectionCard icon="ellipse-outline" title={t('hydraulicCalculator.sections.cylinder')}>
              <DetailRow label={t('hydraulicCalculator.results.pistonArea')} value={`${cyl.pistonArea.toFixed(2)} cm²`} />
              {cyl.hasRod && (
                <>
                  <DetailRow label={t('hydraulicCalculator.results.rodArea')} value={`${cyl.rodArea.toFixed(2)} cm²`} />
                  <DetailRow label={t('hydraulicCalculator.results.effectiveArea')} value={`${cyl.effectiveArea.toFixed(2)} cm²`} />
                </>
              )}
              <DetailRow label={t('hydraulicCalculator.results.extVolume')} value={`${cyl.extVolume.toFixed(3)} L`} />
              {cyl.hasRod && (
                <DetailRow label={t('hydraulicCalculator.results.retVolume')} value={`${cyl.retVolume.toFixed(3)} L`} />
              )}
            </SectionCard>

            <SectionCard icon="speedometer" title={t('hydraulicCalculator.sections.speed')}>
              <DetailRow label={t('hydraulicCalculator.results.extSpeed')} value={`${cyl.extSpeedMm.toFixed(2)} mm/s`} />
              {cyl.hasRod && (
                <DetailRow label={t('hydraulicCalculator.results.retSpeed')} value={`${cyl.retSpeedMm.toFixed(2)} mm/s`} />
              )}
            </SectionCard>

            <SectionCard icon="time" title={t('hydraulicCalculator.sections.time')}>
              <DetailRow label={t('hydraulicCalculator.results.extTime')} value={`${cyl.extTime.toFixed(3)} s`} />
              {cyl.hasRod && (
                <>
                  <DetailRow label={t('hydraulicCalculator.results.retTime')} value={`${cyl.retTime.toFixed(3)} s`} />
                  <DetailRow label={t('hydraulicCalculator.results.cycleTime')} value={`${cyl.cycleTime.toFixed(3)} s`} />
                </>
              )}
            </SectionCard>
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
        bannerImage={BANNER}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('hydraulicCalculator.pumpDisplacement')}</Text>
            <InfoTooltip title={t('hydraulicCalculator.pumpDisplacement')} body={t('hydraulicCalculator.info.pumpDisplacement')} />
          </View>
          <TextInput
            style={styles.input}
            value={pumpDisplacement}
            onChangeText={setPumpDisplacement}
            keyboardType="decimal-pad"
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('hydraulicCalculator.motorRpm')}</Text>
            <InfoTooltip title={t('hydraulicCalculator.motorRpm')} body={t('hydraulicCalculator.info.motorRpm')} />
          </View>
          <TextInput
            style={styles.input}
            value={motorRPM}
            onChangeText={setMotorRPM}
            keyboardType="decimal-pad"
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('hydraulicCalculator.pressure')}</Text>
            <InfoTooltip title={t('hydraulicCalculator.pressure')} body={t('hydraulicCalculator.info.pressure')} />
          </View>
          <TextInput
            style={styles.input}
            value={pressure}
            onChangeText={setPressure}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Cylinder inputs with diagram */}
        <View style={styles.formCard}>
          <View style={styles.cylHeader}>
            <Ionicons name="construct-outline" size={16} color={Colors.accent} />
            <Text style={styles.cylHeaderText}>{t('hydraulicCalculator.sections.cylinder')}</Text>
            <Text style={styles.optional}>({t('hydraulicCalculator.optional')})</Text>
          </View>

          <CylinderDiagram
            highlight={focusedDim}
            boreLabel={t('hydraulicCalculator.diagram.bore')}
            rodLabel={t('hydraulicCalculator.diagram.rod')}
            strokeLabel={t('hydraulicCalculator.diagram.stroke')}
          />
          <View style={styles.diagramHint}>
            <Ionicons name="information-circle-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.diagramHintText}>{t('hydraulicCalculator.diagram.hint')}</Text>
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('hydraulicCalculator.bore')}</Text>
            <InfoTooltip title={t('hydraulicCalculator.bore')} body={t('hydraulicCalculator.info.bore')} />
          </View>
          <TextInput
            style={[styles.input, focusedDim === 'bore' && styles.inputActive]}
            value={bore}
            onChangeText={setBore}
            onFocus={() => setFocusedDim('bore')}
            onBlur={() => setFocusedDim(null)}
            keyboardType="decimal-pad"
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('hydraulicCalculator.rod')}</Text>
            <InfoTooltip title={t('hydraulicCalculator.rod')} body={t('hydraulicCalculator.info.rod')} />
          </View>
          <TextInput
            style={[styles.input, focusedDim === 'rod' && styles.inputActive]}
            value={rod}
            onChangeText={setRod}
            onFocus={() => setFocusedDim('rod')}
            onBlur={() => setFocusedDim(null)}
            keyboardType="decimal-pad"
          />

          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('hydraulicCalculator.stroke')}</Text>
            <InfoTooltip title={t('hydraulicCalculator.stroke')} body={t('hydraulicCalculator.info.stroke')} />
          </View>
          <TextInput
            style={[styles.input, focusedDim === 'stroke' && styles.inputActive]}
            value={stroke}
            onChangeText={setStroke}
            onFocus={() => setFocusedDim('stroke')}
            onBlur={() => setFocusedDim(null)}
            keyboardType="decimal-pad"
          />
        </View>

        <Animated.View style={[styles.resultCard, { borderColor: result ? resultBorderColor : Colors.border }]}>
          <TouchableOpacity
            style={styles.resultHeaderRow}
            activeOpacity={0.85}
            onPress={() => setIsResultFullscreen(true)}
          >
            <Text style={styles.resultHeaderTitle}>{t('hydraulicCalculator.resultTitle')}</Text>
            <View style={styles.resultHeaderRight}>
              <Ionicons name="expand-outline" size={17} color={Colors.background} />
              {result ? (
                <View style={styles.liveBadge}>
                  <Ionicons name="flash" size={12} color={Colors.background} />
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  inputActive: {
    borderColor: Colors.accent,
  },
  cylHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  cylHeaderText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  // Result section is inverted (yellow card). Non-primary heroes are
  // dark cards floating on yellow; primary heroes are deep-black cards
  // with white labels — maximum punch against the yellow.
  heroCard: {
    flex: 1,
    backgroundColor: '#1A1A1AEE',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#00000033',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    gap: 8,
    justifyContent: 'space-between',
  },
  heroCardPrimary: {
    backgroundColor: Colors.background,
    borderColor: '#000000',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroIconWrap: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    backgroundColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconWrapPrimary: {
    backgroundColor: Colors.borderAccent,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.accent,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  heroValuePrimary: {
    color: Colors.accent,
  },
  heroUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF99',
    marginBottom: 5,
  },
  heroUnitPrimary: {
    color: '#FFFFFF99',
  },
  heroLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFFDD',
    lineHeight: 13,
  },
  heroLabelPrimary: {
    color: '#FFFFFFEE',
  },
  diagramHint: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    marginBottom: Spacing.xs,
  },
  diagramHintText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textSecondary,
  },
  detailCard: {
    backgroundColor: '#00000018',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#00000026',
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  detailTitle: {
    ...Typography.caption,
    color: '#1A1A1A',
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#00000022',
  },
  detailLabel: {
    ...Typography.body,
    fontSize: 13,
    color: '#000000B0',
    flex: 1,
    paddingRight: Spacing.sm,
  },
  detailValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    fontVariant: ['tabular-nums'],
  },
  resultCard: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.accentDark,
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
    color: '#000000',
    fontWeight: '800',
  },
  liveBadge: {
    backgroundColor: '#0000001A',
    borderWidth: 1,
    borderColor: '#00000033',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveBadgeText: {
    ...Typography.caption,
    color: '#000000',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  placeholder: {
    ...Typography.body,
    color: '#000000AA',
    textAlign: 'center',
  },
  footerNote: {
    ...Typography.caption,
    color: '#00000099',
    lineHeight: 18,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#00000022',
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
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.accentDark,
    padding: Spacing.md,
  },
});
