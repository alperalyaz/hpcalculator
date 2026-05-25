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
import { Ionicons } from '@expo/vector-icons';
import { CopyResultButton } from '../components/CopyResultButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { InfoTooltip } from '../components/InfoTooltip';
import { Colors, Typography, Spacing, Radius } from '../theme';

const BANNER = require('../../assets/banner_advanced.jpg');

const MAX_STAGES = 6;
const OVERALL_EFFICIENCY = 0.85;

interface Cyl {
  id: string;
  group: number;
  bore: string;
  rod: string;
  stroke: string;
  speed: string;
  pressure: string;
}

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

let idCounter = 1;
const newCyl = (group = 1): Cyl => ({
  id: `c${idCounter++}`,
  group,
  bore: '',
  rod: '',
  stroke: '',
  speed: '',
  pressure: '',
});

export const AdvancedHydraulicScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [motorRpm, setMotorRpm] = useState('1450');
  const [cylinders, setCylinders] = useState<Cyl[]>([newCyl(1)]);

  const update = (id: string, patch: Partial<Cyl>) =>
    setCylinders((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const addCylinder = () => setCylinders((prev) => [...prev, newCyl(prev[prev.length - 1]?.group ?? 1)]);
  const removeCylinder = (id: string) =>
    setCylinders((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)));

  const result = useMemo(() => {
    const rpm = parseNum(motorRpm);

    const perCyl = cylinders.map((c) => {
      const b = parseNum(c.bore);
      const r = parseNum(c.rod);
      const s = parseNum(c.stroke);
      const v = parseNum(c.speed);
      const p = parseNum(c.pressure);

      const boreCm = b / 10;
      const rodCm = Number.isNaN(r) ? 0 : r / 10;
      const valid = !Number.isNaN(b) && b > 0 && !Number.isNaN(v) && v > 0 && !Number.isNaN(p) && p > 0;
      if (!valid) {
        return { id: c.id, group: c.group, valid: false as const };
      }

      const pistonArea = Math.PI * Math.pow(boreCm / 2, 2); // cm²
      const rodArea = rodCm > 0 ? Math.PI * Math.pow(rodCm / 2, 2) : 0;
      const effectiveArea = pistonArea - rodArea;

      const vCms = v / 10;
      // Extend (piston side) is the higher flow demand → size pump on it
      const flow = (pistonArea * vCms * 60) / 1000; // L/min
      const pushForce = pistonArea * p * 10.197; // kgf
      const pullForce = effectiveArea > 0 ? effectiveArea * p * 10.197 : 0;
      const power = (flow * p) / 600; // kW (hydraulic)
      const strokeCm = Number.isNaN(s) ? 0 : s / 10;
      const extTime = strokeCm > 0 ? strokeCm / vCms : 0;

      return {
        id: c.id,
        group: c.group,
        valid: true as const,
        flow,
        power,
        pressure: p,
        pushForce,
        pullForce,
        extTime,
      };
    });

    const validCyls = perCyl.filter((c) => c.valid) as Extract<(typeof perCyl)[number], { valid: true }>[];
    if (validCyls.length === 0) {
      return null;
    }

    const groupsMap = new Map<number, { flow: number; power: number; count: number }>();
    for (const c of validCyls) {
      const g = groupsMap.get(c.group) ?? { flow: 0, power: 0, count: 0 };
      g.flow += c.flow;
      g.power += c.power;
      g.count += 1;
      groupsMap.set(c.group, g);
    }

    const stages = Array.from(groupsMap.entries())
      .map(([group, v]) => ({ group, ...v }))
      .sort((a, b) => a.group - b.group);

    const requiredFlow = Math.max(...stages.map((s) => s.flow));
    const hydPower = Math.max(...stages.map((s) => s.power));
    const motorPower = hydPower / OVERALL_EFFICIENCY;
    const systemPressure = Math.max(...validCyls.map((c) => c.pressure));
    const governingStage = stages.reduce((a, b) => (b.flow > a.flow ? b : a)).group;
    const pumpDisplacement = !Number.isNaN(rpm) && rpm > 0 ? (requiredFlow * 1000) / rpm : NaN;
    const tankVolume = requiredFlow * 3;

    return {
      stages,
      requiredFlow,
      hydPower,
      motorPower,
      systemPressure,
      governingStage,
      pumpDisplacement,
      tankVolume,
      cylinderCount: validCyls.length,
    };
  }, [cylinders, motorRpm]);

  const copyText = useMemo(() => {
    if (!result) return '';
    const u = (k: string) => t(`advancedHydraulic.units.${k}`);
    const lines = [
      `${t('advancedHydraulic.requiredFlow')}: ${result.requiredFlow.toFixed(1)} ${u('flow')}`,
      `${t('advancedHydraulic.hero.pressure')}: ${result.systemPressure.toFixed(0)} ${u('pressure')}`,
      `${t('advancedHydraulic.motorPower')}: ${result.motorPower.toFixed(2)} ${u('power')}`,
      `${t('advancedHydraulic.hydPower')}: ${result.hydPower.toFixed(2)} ${u('power')}`,
      `${t('advancedHydraulic.tankNote')}: ${result.tankVolume.toFixed(0)} ${u('volume')}`,
    ];
    if (!Number.isNaN(result.pumpDisplacement)) {
      lines.push(`${t('advancedHydraulic.pumpDisplacement')}: ${result.pumpDisplacement.toFixed(1)} ${u('disp')}`);
    }
    result.stages.forEach((s) => {
      lines.push(`${t('advancedHydraulic.stage')} ${s.group}: ${s.flow.toFixed(1)} ${u('flow')} · ${s.count} ${t('advancedHydraulic.cylinderShort')}`);
    });
    return lines.join('\n');
  }, [result, t]);

  const u = (k: string) => t(`advancedHydraulic.units.${k}`);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader
        title={t('advancedHydraulic.title')}
        category={t('modules.advancedHydraulic.category')}
        bannerImage={BANNER}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Intro */}
        <View style={styles.intro}>
          <Ionicons name="layers-outline" size={16} color={Colors.accent} />
          <Text style={styles.introText}>{t('advancedHydraulic.intro')}</Text>
        </View>

        {/* Motor RPM */}
        <View style={styles.formCard}>
          <Text style={styles.label}>{t('advancedHydraulic.motorRpm')}</Text>
          <TextInput
            style={styles.input}
            value={motorRpm}
            onChangeText={setMotorRpm}
            keyboardType="decimal-pad"
            placeholder="1450"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.hintText}>{t('advancedHydraulic.motorRpmInfo')}</Text>
        </View>

        {/* Cylinder list */}
        {cylinders.map((c, idx) => (
          <View key={c.id} style={styles.cylCard}>
            <View style={styles.cylHeader}>
              <View style={styles.cylTitleWrap}>
                <Ionicons name="ellipse-outline" size={16} color={Colors.accent} />
                <Text style={styles.cylTitle}>{t('advancedHydraulic.cylinder')} {idx + 1}</Text>
              </View>
              {cylinders.length > 1 && (
                <TouchableOpacity onPress={() => removeCylinder(c.id)} hitSlop={8} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>

            {/* Stage chips */}
            <Text style={styles.stageLabel}>{t('advancedHydraulic.stage')}</Text>
            <View style={styles.stageRow}>
              {Array.from({ length: MAX_STAGES }, (_, i) => i + 1).map((g) => {
                const active = c.group === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.stageChip, active && styles.stageChipActive]}
                    onPress={() => update(c.id, { group: g })}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stageChipText, active && styles.stageChipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.inputGrid}>
              <Field
                label={t('advancedHydraulic.bore')}
                value={c.bore} onChange={(v) => update(c.id, { bore: v })}
                tooltipTitle={t('advancedHydraulic.bore')} tooltipBody={t('advancedHydraulic.info.bore')}
              />
              <Field
                label={t('advancedHydraulic.rod')}
                value={c.rod} onChange={(v) => update(c.id, { rod: v })} optional
                tooltipTitle={t('advancedHydraulic.rod')} tooltipBody={t('advancedHydraulic.info.rod')}
              />
              <Field
                label={t('advancedHydraulic.stroke')}
                value={c.stroke} onChange={(v) => update(c.id, { stroke: v })} optional
                tooltipTitle={t('advancedHydraulic.stroke')} tooltipBody={t('advancedHydraulic.info.stroke')}
              />
              <Field
                label={t('advancedHydraulic.speed')}
                value={c.speed} onChange={(v) => update(c.id, { speed: v })}
                tooltipTitle={t('advancedHydraulic.speed')} tooltipBody={t('advancedHydraulic.info.speed')}
              />
              <Field
                label={t('advancedHydraulic.pressure')}
                value={c.pressure} onChange={(v) => update(c.id, { pressure: v })}
                tooltipTitle={t('advancedHydraulic.pressure')} tooltipBody={t('advancedHydraulic.info.pressure')}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addCylinder} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={20} color={Colors.accent} />
          <Text style={styles.addBtnText}>{t('advancedHydraulic.addCylinder')}</Text>
        </TouchableOpacity>

        {/* Results */}
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{t('advancedHydraulic.resultTitle')}</Text>

          {!result ? (
            <Text style={styles.placeholder}>{t('advancedHydraulic.placeholder')}</Text>
          ) : (
            <>
              <View style={styles.heroRow}>
                <Hero icon="water" primary value={result.requiredFlow} decimals={1} unit={u('flow')} label={t('advancedHydraulic.hero.flow')} />
                <Hero icon="flash" primary value={result.motorPower} decimals={2} unit={u('power')} label={t('advancedHydraulic.hero.power')} />
              </View>
              <View style={styles.heroRow}>
                <Hero icon="speedometer" value={result.systemPressure} decimals={0} unit={u('pressure')} label={t('advancedHydraulic.hero.pressure')} />
                <Hero icon="cube" value={result.tankVolume} decimals={0} unit={u('volume')} label={t('advancedHydraulic.hero.tank')} />
              </View>

              {/* Pump / motor section */}
              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Ionicons name="cog" size={15} color={Colors.accent} />
                  <Text style={styles.detailTitle}>{t('advancedHydraulic.sections.pumpMotor')}</Text>
                </View>
                {!Number.isNaN(result.pumpDisplacement) && (
                  <DetailRow label={t('advancedHydraulic.pumpDisplacement')} value={`${result.pumpDisplacement.toFixed(1)} ${u('disp')}`} />
                )}
                <DetailRow label={t('advancedHydraulic.requiredFlow')} value={`${result.requiredFlow.toFixed(1)} ${u('flow')}`} />
                <DetailRow label={t('advancedHydraulic.hydPower')} value={`${result.hydPower.toFixed(2)} ${u('power')}`} />
                <DetailRow label={t('advancedHydraulic.motorPower')} value={`${result.motorPower.toFixed(2)} ${u('power')}`} />
                <DetailRow label={t('advancedHydraulic.governingStage')} value={`${t('advancedHydraulic.stage')} ${result.governingStage}`} />
              </View>

              {/* Stage breakdown */}
              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <Ionicons name="layers" size={15} color={Colors.accent} />
                  <Text style={styles.detailTitle}>{t('advancedHydraulic.sections.stages')}</Text>
                </View>
                {result.stages.map((s) => (
                  <DetailRow
                    key={s.group}
                    label={`${t('advancedHydraulic.stage')} ${s.group} · ${s.count} ${t('advancedHydraulic.cylinderShort')}`}
                    value={`${s.flow.toFixed(1)} ${u('flow')}`}
                    highlight={s.group === result.governingStage}
                  />
                ))}
              </View>

              <Text style={styles.tankNote}>{t('advancedHydraulic.tankNote')}: {result.tankVolume.toFixed(0)} {u('volume')} ({t('advancedHydraulic.tankRule')})</Text>

              <CopyResultButton value={copyText} />
            </>
          )}
          <Text style={styles.footerNote}>{t('advancedHydraulic.disclaimer')}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
  tooltipTitle?: string;
  tooltipBody?: string;
}> = ({ label, value, onChange, optional, tooltipTitle, tooltipBody }) => (
  <View style={styles.field}>
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel} numberOfLines={2}>
        {label}{optional ? ' *' : ''}
      </Text>
      {tooltipTitle && tooltipBody ? (
        <InfoTooltip title={tooltipTitle} body={tooltipBody} />
      ) : null}
    </View>
    <TextInput
      style={styles.fieldInput}
      value={value}
      onChangeText={onChange}
      keyboardType="decimal-pad"
    />
  </View>
);

const Hero: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  decimals: number;
  unit: string;
  label: string;
  primary?: boolean;
}> = ({ icon, value, decimals, unit, label, primary }) => (
  <View style={[styles.heroCard, primary && styles.heroCardPrimary]}>
    <View style={styles.heroTopRow}>
      <View style={[styles.heroIconWrap, primary && styles.heroIconWrapPrimary]}>
        <Ionicons name={icon} size={15} color={primary ? Colors.background : Colors.accent} />
      </View>
      <Text style={[styles.heroLabel, primary && styles.heroLabelPrimary]} numberOfLines={2}>{label}</Text>
    </View>
    <View style={styles.heroValueRow}>
      <AnimatedNumber value={value} decimals={decimals} style={[styles.heroValue, primary && styles.heroValuePrimary]} />
      <Text style={[styles.heroUnit, primary && styles.heroUnitPrimary]}>{unit}</Text>
    </View>
  </View>
);

const DetailRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, highlight && styles.detailLabelHot]} numberOfLines={2}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },
  intro: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    padding: Spacing.sm,
  },
  introText: { flex: 1, fontSize: 12, lineHeight: 17, color: Colors.textSecondary },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  label: { ...Typography.label, marginBottom: 6, color: Colors.textPrimary },
  hintText: { ...Typography.caption, color: Colors.textMuted, marginTop: 6, lineHeight: 16 },
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
  cylCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.borderAccent,
    padding: Spacing.md,
  },
  cylHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cylTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cylTitle: { ...Typography.bodyBold, color: Colors.textPrimary },
  deleteBtn: { padding: 2 },
  stageLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  stageRow: { flexDirection: 'row', gap: 6, marginBottom: Spacing.sm },
  stageChip: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  stageChipText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  stageChipTextActive: { color: Colors.background },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  field: { width: '47%', flexGrow: 1 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 2 },
  fieldLabel: { ...Typography.caption, color: Colors.textSecondary, flex: 1, lineHeight: 15 },
  fieldInput: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.sm,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 9,
    fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    borderStyle: 'dashed',
    paddingVertical: 14,
  },
  addBtnText: { ...Typography.bodyBold, color: Colors.accent },
  resultCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    borderTopWidth: 3,
    borderTopColor: Colors.accent,
    padding: Spacing.md,
  },
  resultTitle: { ...Typography.bodyBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  placeholder: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', paddingVertical: Spacing.md },
  heroRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  heroCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    gap: 8,
    justifyContent: 'space-between',
  },
  heroCardPrimary: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroIconWrap: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    backgroundColor: Colors.borderAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconWrapPrimary: { backgroundColor: '#00000022' },
  heroLabel: { flex: 1, fontSize: 11, fontWeight: '600', color: Colors.textSecondary, lineHeight: 13 },
  heroLabelPrimary: { color: '#000000CC' },
  heroValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  heroValue: { fontSize: 26, fontWeight: '800', color: Colors.accent, fontVariant: ['tabular-nums'], letterSpacing: -0.5 },
  heroValuePrimary: { color: Colors.background },
  heroUnit: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, marginBottom: 5 },
  heroUnitPrimary: { color: '#000000AA' },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.borderAccent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  detailTitle: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  detailLabel: { ...Typography.body, fontSize: 13, color: Colors.textSecondary, flex: 1 },
  detailLabelHot: { color: Colors.accent, fontWeight: '700' },
  detailValue: { fontSize: 13.5, fontWeight: '700', color: Colors.accent, fontVariant: ['tabular-nums'] },
  tankNote: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  footerNote: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
