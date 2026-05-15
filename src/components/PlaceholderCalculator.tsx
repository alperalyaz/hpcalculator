import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface FormulaItem {
  label: string;
  formula: string;
}

interface PlaceholderCalculatorProps {
  icon: keyof typeof Ionicons.glyphMap;
  formulas?: FormulaItem[];
  inputs?: string[];
  outputs?: string[];
}

export const PlaceholderCalculator: React.FC<PlaceholderCalculatorProps> = ({
  icon,
  formulas = [],
  inputs = [],
  outputs = [],
}) => {
  const { t } = useTranslation();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Coming Soon Banner */}
      <View style={styles.banner}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={40} color={Colors.accent} />
        </View>
        <Text style={styles.bannerTitle}>{t('common.comingSoon')}</Text>
        <Text style={styles.bannerSub}>{t('common.comingSoonBody')}</Text>
      </View>

      {/* Inputs Preview */}
      {inputs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('common.inputs')}</Text>
          <View style={styles.tagRow}>
            {inputs.map((inp, i) => (
              <View key={i} style={styles.tag}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={14}
                  color={Colors.accent}
                />
                <Text style={styles.tagText}>{inp}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Outputs Preview */}
      {outputs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('common.outputs')}</Text>
          <View style={styles.tagRow}>
            {outputs.map((out, i) => (
              <View key={i} style={[styles.tag, styles.tagOutput]}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color={Colors.success}
                />
                <Text style={[styles.tagText, { color: Colors.success }]}>
                  {out}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Formulas Preview */}
      {formulas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('common.formula')}</Text>
          {formulas.map((f, i) => (
            <View key={i} style={styles.formulaCard}>
              <Text style={styles.formulaLabel}>{f.label}</Text>
              <Text style={styles.formulaText}>{f.formula}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Calculate Button (disabled placeholder) */}
      <TouchableOpacity style={styles.calcButtonDisabled} disabled>
        <Ionicons name="calculator-outline" size={20} color={Colors.textMuted} />
        <Text style={styles.calcButtonText}>{t('common.calculate')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  banner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  bannerTitle: {
    ...Typography.h3,
    color: Colors.accent,
    marginBottom: Spacing.xs,
  },
  bannerSub: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagOutput: {
    borderColor: '#44BB4433',
  },
  tagText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '600',
  },
  formulaCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  formulaLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  formulaText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  calcButtonDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  calcButtonText: {
    ...Typography.bodyBold,
    color: Colors.textMuted,
  },
});
