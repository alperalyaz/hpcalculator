import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedNumber } from './AnimatedNumber';
import { Colors, Typography, Spacing, Radius } from '../theme';

/**
 * Shared "inverted" result UI used across all calculator modules.
 * The result section is a bold yellow card (dark input vs. yellow output),
 * with dark hero cards carrying yellow numbers and black detail rows.
 */

export const ResultCard: React.FC<{
  title: string;
  live?: boolean;
  liveLabel?: string;
  footerNote?: string;
  empty?: boolean;
  emptyText?: string;
  children?: React.ReactNode;
}> = ({ title, live, liveLabel, footerNote, empty, emptyText, children }) => (
  <View style={styles.resultCard}>
    <View style={styles.resultHeaderRow}>
      <Text style={styles.resultHeaderTitle}>{title}</Text>
      {live ? (
        <View style={styles.liveBadge}>
          <Ionicons name="flash" size={12} color={Colors.background} />
          {liveLabel ? <Text style={styles.liveBadgeText}>{liveLabel}</Text> : null}
        </View>
      ) : null}
    </View>
    {empty ? (
      <Text style={styles.placeholder}>{emptyText}</Text>
    ) : (
      children
    )}
    {footerNote ? <Text style={styles.footerNote}>{footerNote}</Text> : null}
  </View>
);

export const HeroRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.heroRow}>{children}</View>
);

export const HeroStat: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  decimals?: number;
  unit?: string;
  label: string;
  primary?: boolean;
}> = ({ icon, value, decimals = 2, unit, label, primary }) => (
  <View style={[styles.heroCard, primary && styles.heroCardPrimary]}>
    <View style={styles.heroTopRow}>
      <View style={styles.heroIconWrap}>
        <Ionicons name={icon} size={16} color={Colors.accent} />
      </View>
      <Text style={styles.heroLabel} numberOfLines={2}>{label}</Text>
    </View>
    <View style={styles.heroValueRow}>
      <AnimatedNumber value={value} decimals={decimals} style={styles.heroValue} />
      {unit ? <Text style={styles.heroUnit}>{unit}</Text> : null}
    </View>
  </View>
);

export const ResultSection: React.FC<{
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

export const DetailRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, highlight && styles.detailLabelHot]} numberOfLines={2}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
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
    marginBottom: Spacing.sm,
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
    paddingVertical: Spacing.sm,
  },
  footerNote: {
    ...Typography.caption,
    color: '#00000099',
    lineHeight: 18,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#00000022',
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
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
  heroLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFFDD',
    lineHeight: 13,
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
  heroUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF99',
    marginBottom: 5,
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
  detailLabelHot: {
    color: '#000000',
    fontWeight: '800',
  },
  detailValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    fontVariant: ['tabular-nums'],
  },
});
