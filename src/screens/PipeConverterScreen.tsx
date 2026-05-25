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
import { CopyResultButton } from '../components/CopyResultButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { ResultCard, ResultSection, DetailRow } from '../components/Result';
import { Callouts, Colors, Spacing } from '../theme';

type ConversionType = 'dnToInch' | 'inchToDn' | 'inchToMm' | 'mmToInch';

const DN_TO_INCH: Record<number, string> = {
  15: '1/2"',
  20: '3/4"',
  25: '1"',
  32: '1 1/4"',
  40: '1 1/2"',
  50: '2"',
  65: '2 1/2"',
  80: '3"',
  100: '4"',
  125: '5"',
  150: '6"',
  200: '8"',
  250: '10"',
  300: '12"',
};

const INCH_TO_DN: Record<number, string> = {
  0.5: 'DN15',
  0.75: 'DN20',
  1: 'DN25',
  1.25: 'DN32',
  1.5: 'DN40',
  2: 'DN50',
  2.5: 'DN65',
  3: 'DN80',
  4: 'DN100',
  5: 'DN125',
  6: 'DN150',
  8: 'DN200',
  10: 'DN250',
  12: 'DN300',
};

const PIPE_TABLE = [
  { dn: 'DN15', inch: '1/2"', mm: '21.3 mm' },
  { dn: 'DN20', inch: '3/4"', mm: '26.9 mm' },
  { dn: 'DN25', inch: '1"', mm: '33.7 mm' },
  { dn: 'DN32', inch: '1 1/4"', mm: '42.4 mm' },
  { dn: 'DN40', inch: '1 1/2"', mm: '48.3 mm' },
  { dn: 'DN50', inch: '2"', mm: '60.3 mm' },
  { dn: 'DN65', inch: '2 1/2"', mm: '76.1 mm' },
  { dn: 'DN80', inch: '3"', mm: '88.9 mm' },
  { dn: 'DN100', inch: '4"', mm: '114.3 mm' },
  { dn: 'DN125', inch: '5"', mm: '139.7 mm' },
  { dn: 'DN150', inch: '6"', mm: '168.3 mm' },
  { dn: 'DN200', inch: '8"', mm: '219.1 mm' },
];

export const PipeConverterScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const [conversionType, setConversionType] = useState<ConversionType>('dnToInch');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const value = useMemo(() => Number.parseFloat(inputValue), [inputValue]);

  const convertUnits = () => {
    setError(null);
    setResult(null);
    if (Number.isNaN(value)) {
      setError(t('pipeConverterCalc.errors.invalidNumber'));
      return;
    }

    if (conversionType === 'dnToInch') {
      const converted = DN_TO_INCH[value];
      setResult(
        converted
          ? t('pipeConverterCalc.results.dnToInchMatch', { input: value, result: converted })
          : t('pipeConverterCalc.results.dnToInchMissing', { input: value }),
      );
      return;
    }

    if (conversionType === 'inchToDn') {
      const converted = INCH_TO_DN[value];
      setResult(
        converted
          ? t('pipeConverterCalc.results.inchToDnMatch', { input: value, result: converted })
          : t('pipeConverterCalc.results.inchToDnMissing', { input: value }),
      );
      return;
    }

    if (conversionType === 'inchToMm') {
      setResult(t('pipeConverterCalc.results.inchToMm', { input: value, result: (value * 25.4).toFixed(2) }));
      return;
    }

    setResult(t('pipeConverterCalc.results.mmToInch', { input: value, result: (value / 25.4).toFixed(4) }));
  };

  const conversionOptions: Array<{ key: ConversionType; label: string }> = [
    { key: 'dnToInch', label: t('pipeConverterCalc.types.dnToInch') },
    { key: 'inchToDn', label: t('pipeConverterCalc.types.inchToDn') },
    { key: 'inchToMm', label: t('pipeConverterCalc.types.inchToMm') },
    { key: 'mmToInch', label: t('pipeConverterCalc.types.mmToInch') },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('pipeConverterCalc.title')}
        subtitle={t('modules.pipeConverter.description')}
        category={t('modules.pipeConverter.category')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.label}>{t('pipeConverterCalc.inputLabel')}</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={t('pipeConverterCalc.inputPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.label}>{t('pipeConverterCalc.typeLabel')}</Text>
          <View style={styles.typeWrap}>
            {conversionOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.typeChip, conversionType === option.key && styles.typeChipActive]}
                onPress={() => setConversionType(option.key)}
              >
                <Text style={[styles.typeText, conversionType === option.key && styles.typeTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={convertUnits}>
            <Text style={styles.buttonText}>{t('pipeConverterCalc.convert')}</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={Callouts.error.container}>
            <Text style={Callouts.error.text}>{error}</Text>
          </View>
        ) : null}

        {result ? (
          <ResultCard title={t('pipeConverterCalc.resultTitle')}>
            <ResultSection
              icon="swap-horizontal"
              title={conversionOptions.find((o) => o.key === conversionType)?.label ?? ''}
            >
              <DetailRow
                label={conversionOptions.find((o) => o.key === conversionType)?.label ?? ''}
                value={result}
                highlight
              />
            </ResultSection>
            <CopyResultButton value={result} />
          </ResultCard>
        ) : null}

        <Text style={styles.tableTitle}>{t('pipeConverterCalc.table.title')}</Text>
        <View style={styles.tableWrap}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colDn]}>{t('pipeConverterCalc.table.dn')}</Text>
            <Text style={[styles.th, styles.colInch]}>{t('pipeConverterCalc.table.inch')}</Text>
            <Text style={[styles.th, styles.colMm]}>{t('pipeConverterCalc.table.mm')}</Text>
          </View>
          {PIPE_TABLE.map((row, idx) => (
            <View key={row.dn} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
              <Text style={[styles.td, styles.colDn]}>{row.dn}</Text>
              <Text style={[styles.td, styles.colInch]}>{row.inch}</Text>
              <Text style={[styles.td, styles.colMm]}>{row.mm}</Text>
            </View>
          ))}
        </View>

        <View style={Callouts.warning.container}>
          <Text style={Callouts.warning.text}>{t('pipeConverterCalc.note')}</Text>
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
    padding: 16,
    paddingBottom: 30,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 2,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  typeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  typeChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.borderAccent,
  },
  typeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  typeTextActive: {
    color: Colors.accent,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '800',
  },
  tableTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  tableWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
  },
  tableRowAlt: {
    backgroundColor: Colors.inputBackground,
  },
  th: {
    color: '#fff',
    fontWeight: '800',
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  td: {
    color: Colors.textSecondary,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  colDn: {
    flex: 1.1,
  },
  colInch: {
    flex: 0.8,
  },
  colMm: {
    flex: 1.6,
  },
});
