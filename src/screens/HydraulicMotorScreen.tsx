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

type ActiveTab = 'torque' | 'speed';

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const HydraulicMotorScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('torque');

  const [displacement, setDisplacement] = useState('');
  const [pressure, setPressure] = useState('');
  const [torqueResult, setTorqueResult] = useState<null | { nm: number; kgfm: number }>(null);

  const [pumpDisplacement, setPumpDisplacement] = useState('');
  const [pumpSpeed, setPumpSpeed] = useState('');
  const [motorDisplacement, setMotorDisplacement] = useState('');
  const [speedResult, setSpeedResult] = useState<number | null>(null);

  const calculateTorque = () => {
    const d = parseNum(displacement);
    const p = parseNum(pressure);
    if (Number.isNaN(d) || Number.isNaN(p) || d <= 0 || p <= 0) {
      setTorqueResult(null);
      return;
    }
    const nm = (d * p) / (20 * Math.PI);
    const kgfm = nm / 9.81;
    setTorqueResult({ nm, kgfm });
  };

  const calculateSpeed = () => {
    const pd = parseNum(pumpDisplacement);
    const ps = parseNum(pumpSpeed);
    const md = parseNum(motorDisplacement);
    if (Number.isNaN(pd) || Number.isNaN(ps) || Number.isNaN(md) || pd <= 0 || ps <= 0 || md <= 0) {
      setSpeedResult(null);
      return;
    }
    setSpeedResult((pd * ps) / md);
  };

  const getTorqueEquivalent = () => {
    if (!torqueResult) return null;
    const kgfm = torqueResult.kgfm;
    const nm = torqueResult.nm;

    if (kgfm >= 50) {
      return t('hydraulicMotorCalc.dynamic.heavyEquipment', {
        kgfm: kgfm.toFixed(1),
        nm: nm.toFixed(1),
      });
    }
    if (kgfm >= 20) {
      return t('hydraulicMotorCalc.dynamic.wrench', {
        kgfm: kgfm.toFixed(1),
        nm: nm.toFixed(1),
        force: (kgfm / 0.5).toFixed(0),
      });
    }
    if (kgfm >= 5) {
      return t('hydraulicMotorCalc.dynamic.steering', {
        kgfm: kgfm.toFixed(1),
        nm: nm.toFixed(1),
      });
    }
    return t('hydraulicMotorCalc.dynamic.lightWork', {
      kgfm: kgfm.toFixed(1),
      nm: nm.toFixed(1),
    });
  };

  const torqueCopyValue = useMemo(() => {
    if (!torqueResult) {
      return '';
    }

    return [
      `${t('hydraulicMotorCalc.results.torque')}`,
      `${torqueResult.nm.toFixed(2)} Nm`,
      `${torqueResult.kgfm.toFixed(2)} kgf·m`,
    ].join('\n');
  }, [torqueResult, t]);

  const speedCopyValue = useMemo(() => {
    if (speedResult === null) {
      return '';
    }

    return `${t('hydraulicMotorCalc.results.speed')}\n${speedResult.toFixed(0)} d/d`;
  }, [speedResult, t]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title={t('hydraulicMotorCalc.title')}
        subtitle={t('modules.hydraulicMotor.description')}
        category={t('modules.hydraulicMotor.category')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'torque' && styles.tabBtnActive]}
            onPress={() => setActiveTab('torque')}
          >
            <Text style={[styles.tabText, activeTab === 'torque' && styles.tabTextActive]}>
              {t('hydraulicMotorCalc.tabs.torque')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'speed' && styles.tabBtnActive]}
            onPress={() => setActiveTab('speed')}
          >
            <Text style={[styles.tabText, activeTab === 'speed' && styles.tabTextActive]}>
              {t('hydraulicMotorCalc.tabs.speed')}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'torque' ? (
          <View style={styles.card}>
            <Text style={styles.label}>{t('hydraulicMotorCalc.inputs.displacement')}</Text>
            <TextInput style={styles.input} value={displacement} onChangeText={setDisplacement} keyboardType="decimal-pad" />

            <Text style={styles.label}>{t('hydraulicMotorCalc.inputs.pressure')}</Text>
            <TextInput style={styles.input} value={pressure} onChangeText={setPressure} keyboardType="decimal-pad" />

            <TouchableOpacity style={styles.calcButton} onPress={calculateTorque}>
              <Text style={styles.calcButtonText}>{t('hydraulicMotorCalc.actions.calcTorque')}</Text>
            </TouchableOpacity>

            <View style={styles.resultBox}>
              {torqueResult ? (
                <>
                  <Text style={styles.resultTitle}>{t('hydraulicMotorCalc.results.torque')}</Text>
                  <Text style={styles.resultLine}>{torqueResult.nm.toFixed(2)} Nm</Text>
                  <Text style={styles.resultLine}>{torqueResult.kgfm.toFixed(2)} kgf·m</Text>
                  <CopyResultButton value={torqueCopyValue} />
                </>
              ) : (
                <Text style={styles.placeholder}>{t('hydraulicMotorCalc.placeholders.torque')}</Text>
              )}
            </View>

            <View style={styles.exampleBox}>
              <Text style={styles.exampleTitle}>{t('hydraulicMotorCalc.examples.torqueTitle')}</Text>
              {torqueResult ? (
                <Text style={[styles.exampleLine, styles.dynamicLine]}>{getTorqueEquivalent()}</Text>
              ) : null}
              <Text style={styles.exampleLine}>{t('hydraulicMotorCalc.examples.torque1')}</Text>
              <Text style={styles.exampleLine}>{t('hydraulicMotorCalc.examples.torque2')}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>{t('hydraulicMotorCalc.inputs.pumpDisplacement')}</Text>
            <TextInput style={styles.input} value={pumpDisplacement} onChangeText={setPumpDisplacement} keyboardType="decimal-pad" />

            <Text style={styles.label}>{t('hydraulicMotorCalc.inputs.pumpSpeed')}</Text>
            <TextInput style={styles.input} value={pumpSpeed} onChangeText={setPumpSpeed} keyboardType="decimal-pad" />

            <Text style={styles.label}>{t('hydraulicMotorCalc.inputs.motorDisplacement')}</Text>
            <TextInput style={styles.input} value={motorDisplacement} onChangeText={setMotorDisplacement} keyboardType="decimal-pad" />

            <TouchableOpacity style={styles.calcButton} onPress={calculateSpeed}>
              <Text style={styles.calcButtonText}>{t('hydraulicMotorCalc.actions.calcSpeed')}</Text>
            </TouchableOpacity>

            <View style={styles.resultBox}>
              {speedResult !== null ? (
                <>
                  <Text style={styles.resultTitle}>{t('hydraulicMotorCalc.results.speed')}</Text>
                  <Text style={styles.resultLine}>{speedResult.toFixed(0)} d/d</Text>
                  <CopyResultButton value={speedCopyValue} />
                </>
              ) : (
                <Text style={styles.placeholder}>{t('hydraulicMotorCalc.placeholders.speed')}</Text>
              )}
            </View>

            <View style={styles.exampleBox}>
              <Text style={styles.exampleTitle}>{t('hydraulicMotorCalc.examples.speedTitle')}</Text>
              <Text style={styles.exampleLine}>{t('hydraulicMotorCalc.examples.speed1')}</Text>
              <Text style={styles.exampleLine}>{t('hydraulicMotorCalc.examples.speed2')}</Text>
              <Text style={styles.exampleLine}>{t('hydraulicMotorCalc.examples.speed3')}</Text>
            </View>
          </View>
        )}

        <Text style={styles.formulaText}>{t('hydraulicMotorCalc.disclaimer')}</Text>
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
  tabRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
  },
  tabBtnActive: {
    backgroundColor: '#2E6FA1',
  },
  tabText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
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
    backgroundColor: '#2E6FA1',
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  calcButtonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
  resultBox: {
    marginTop: Spacing.sm,
    backgroundColor: '#1B2C3A',
    borderWidth: 1,
    borderColor: '#2E6FA1',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    gap: 6,
  },
  resultTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  resultLine: {
    ...Typography.body,
    color: '#D9ECFF',
  },
  placeholder: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  exampleBox: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.inputBackground,
    borderLeftWidth: 3,
    borderLeftColor: '#2E6FA1',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: 6,
  },
  exampleTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  exampleLine: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  dynamicLine: {
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  formulaText: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
