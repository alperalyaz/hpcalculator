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
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResultCard, HeroRow, HeroStat } from '../components/Result';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { GEAR_PUMP_DATA, GearPumpItem } from '../data/gearPumpData';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const parseNum = (value: string): number => {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return NaN;
  return parseFloat(normalized);
};

export const GearPumpScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [searchCode, setSearchCode] = useState('');
  const [minCC, setMinCC] = useState('');
  const [maxCC, setMaxCC] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [filteredData, setFilteredData] = useState<GearPumpItem[]>(GEAR_PUMP_DATA);
  const [showHorizontalHint, setShowHorizontalHint] = useState(true);

  const columns = useMemo(
    () => [
      t('gearPumpGuide.columns.code'),
      t('gearPumpGuide.columns.cc'),
      t('gearPumpGuide.columns.flow'),
      t('gearPumpGuide.columns.tank'),
      t('gearPumpGuide.columns.power'),
    ],
    [t]
  );

  const promoCodes = useMemo(
    () =>
      GEAR_PUMP_DATA.filter((x) => x.note && x.note.trim().length > 0).map((x) => x.code),
    []
  );

  const applyFilters = () => {
    const minCCVal = parseNum(minCC);
    const maxCCVal = parseNum(maxCC);
    const minPowerVal = parseNum(minPower);
    const maxPowerVal = parseNum(maxPower);

    const data = GEAR_PUMP_DATA.filter((item) => {
      const codeMatch = item.code.toLowerCase().includes(searchCode.toLowerCase().trim());
      const ccMinOk = Number.isNaN(minCCVal) ? true : item.cc >= minCCVal;
      const ccMaxOk = Number.isNaN(maxCCVal) ? true : item.cc <= maxCCVal;
      const pMinOk = Number.isNaN(minPowerVal) ? true : item.power >= minPowerVal;
      const pMaxOk = Number.isNaN(maxPowerVal) ? true : item.power <= maxPowerVal;
      return codeMatch && ccMinOk && ccMaxOk && pMinOk && pMaxOk;
    });

    setFilteredData(data);
  };

  const resetFilters = () => {
    setSearchCode('');
    setMinCC('');
    setMaxCC('');
    setMinPower('');
    setMaxPower('');
    setFilteredData(GEAR_PUMP_DATA);
  };

  const exportCsv = async () => {
    if (filteredData.length === 0) {
      Alert.alert(t('gearPumpGuide.export.emptyTitle'), t('gearPumpGuide.export.emptyBody'));
      return;
    }

    const header = 'HEMA KODU,CC/DEV,L/DK,TANK HACMI (L),MOTOR GUCU (kW)\n';
    const rows = filteredData
      .map((item) =>
        [
          item.code,
          item.cc.toString(),
          item.flow.toFixed(4),
          Math.floor(item.tank).toString(),
          item.power.toString(),
        ]
          .map((cell) => (cell.includes(',') ? `"${cell}"` : cell))
          .join(',')
      )
      .join('\n');

    const csv = `${header}${rows}\n`;
    const path = `${FileSystem.cacheDirectory}hema_pompa_motor_kombinasyonlari.csv`;
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(t('gearPumpGuide.export.unavailableTitle'), t('gearPumpGuide.export.unavailableBody'));
      return;
    }

    await Sharing.shareAsync(path, {
      mimeType: 'text/csv',
      dialogTitle: t('gearPumpGuide.export.dialogTitle'),
      UTI: 'public.comma-separated-values-text',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('gearPumpGuide.title')}
        subtitle={t('modules.gearPump.description')}
        category={t('modules.gearPump.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.filterCard}>
          <Text style={styles.label}>{t('gearPumpGuide.searchCode')}</Text>
          <TextInput
            style={styles.input}
            value={searchCode}
            onChangeText={setSearchCode}
            placeholder={t('gearPumpGuide.searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <View style={styles.row2}>
            <View style={styles.half}>
              <Text style={styles.label}>{t('gearPumpGuide.minCC')}</Text>
              <TextInput style={styles.input} value={minCC} onChangeText={setMinCC} keyboardType="decimal-pad" />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>{t('gearPumpGuide.maxCC')}</Text>
              <TextInput style={styles.input} value={maxCC} onChangeText={setMaxCC} keyboardType="decimal-pad" />
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.half}>
              <Text style={styles.label}>{t('gearPumpGuide.minPower')}</Text>
              <TextInput style={styles.input} value={minPower} onChangeText={setMinPower} keyboardType="decimal-pad" />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>{t('gearPumpGuide.maxPower')}</Text>
              <TextInput style={styles.input} value={maxPower} onChangeText={setMaxPower} keyboardType="decimal-pad" />
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnPrimary} onPress={applyFilters}>
              <Text style={styles.btnPrimaryText}>{t('gearPumpGuide.filter')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={resetFilters}>
              <Text style={styles.btnGhostText}>{t('gearPumpGuide.reset')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={exportCsv}>
              <Text style={styles.btnGhostText}>{t('gearPumpGuide.exportCsv')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ResultCard title={t('gearPumpGuide.title')}>
          <HeroRow>
            <HeroStat
              icon="search"
              primary
              value={filteredData.length}
              decimals={0}
              label={t('gearPumpGuide.matchCount', { count: filteredData.length })}
            />
          </HeroRow>

          <View style={styles.tableWrap}>
            {showHorizontalHint ? (
              <View style={styles.scrollHint}>
                <Text style={styles.scrollHintText}>{t('gearPumpGuide.scrollHint')}</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.background} />
              </View>
            ) : null}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                const vw = e.nativeEvent.layoutMeasurement.width;
                const cw = e.nativeEvent.contentSize.width;
                const canScroll = cw > vw + 8;
                const atEnd = x + vw >= cw - 12;
                setShowHorizontalHint(canScroll && !atEnd);
              }}
              scrollEventThrottle={16}
            >
              <View style={styles.table}>
                <View style={styles.headerRow}>
                  {columns.map((c) => (
                    <Text key={c} style={[styles.cell, styles.headerCell]}>
                      {c}
                    </Text>
                  ))}
                </View>

                {filteredData.map((item, idx) => (
                  <View key={`${item.code}-${idx}`} style={[styles.dataRow, idx % 2 === 1 && styles.altRow]}>
                    <Text style={styles.cell}>{item.code}</Text>
                    <Text style={styles.cell}>{item.cc}</Text>
                    <Text style={styles.cell}>{item.flow.toFixed(4)}</Text>
                    <Text style={styles.cell}>{Math.floor(item.tank)}</Text>
                    <Text style={styles.cell}>{item.power}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            {showHorizontalHint ? <View pointerEvents="none" style={styles.rightFade} /> : null}
          </View>
        </ResultCard>

        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>{t('gearPumpGuide.promo.title')}</Text>
          <Text style={styles.promoText}>{t('gearPumpGuide.promo.body')}</Text>
          {promoCodes.map((code) => (
            <Text key={code} style={styles.promoCode}>
              • {code}
            </Text>
          ))}
        </View>

        <View style={styles.assumptionCard}>
          <Text style={styles.assumptionTitle}>{t('gearPumpGuide.assumptions.title')}</Text>
          <Text style={styles.assumptionText}>{t('gearPumpGuide.assumptions.flow1500')}</Text>
          <Text style={styles.assumptionText}>{t('gearPumpGuide.assumptions.power160')}</Text>
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
  filterCard: {
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
  row2: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  half: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  btnPrimary: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  btnPrimaryText: {
    ...Typography.caption,
    color: '#111111',
    fontWeight: '700',
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.inputBackground,
  },
  btnGhostText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  table: {
    borderWidth: 1,
    borderColor: '#00000026',
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  tableWrap: {
    position: 'relative',
  },
  scrollHint: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#00000033',
    backgroundColor: '#00000014',
  },
  scrollHintText: {
    ...Typography.caption,
    color: Colors.background,
    fontWeight: '700',
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 36,
    bottom: 0,
    width: 24,
    backgroundColor: '#00000022',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
  },
  dataRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#00000018',
  },
  altRow: {
    backgroundColor: '#00000012',
  },
  cell: {
    width: 190,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    color: '#000000CC',
    fontSize: 12,
  },
  headerCell: {
    color: Colors.accent,
    fontWeight: '700',
  },
  promoCard: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    backgroundColor: '#F5C40011',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 4,
  },
  promoTitle: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '700',
  },
  promoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  promoCode: {
    ...Typography.caption,
    color: Colors.textPrimary,
  },
  assumptionCard: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 6,
  },
  assumptionTitle: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  assumptionText: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
