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
import { THREAD_DATABASE, ThreadSide, ThreadStandard, ThreadSpec } from '../data/threadDatabase';
import { Callouts, Colors, Spacing } from '../theme';

type FilterType = 'all' | ThreadStandard;

interface ThreadMatch extends ThreadSpec {
  score: number;
  diff: number;
}

const FILTER_OPTIONS: Array<{ value: FilterType; labelKey: string }> = [
  { value: 'all', labelKey: 'all' },
  { value: 'metric', labelKey: 'metric' },
  { value: 'bspp', labelKey: 'bspp' },
  { value: 'npt', labelKey: 'npt' },
  { value: 'unf', labelKey: 'unf' },
  { value: 'unc', labelKey: 'unc' },
];

export const ThreadPitchScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [threadSide, setThreadSide] = useState<ThreadSide>('external');
  const [measured, setMeasured] = useState('');
  const [pitch, setPitch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [matches, setMatches] = useState<ThreadMatch[]>([]);
  const [error, setError] = useState<string | null>(null);

  const measuredValue = useMemo(() => Number.parseFloat(measured), [measured]);
  const pitchValue = useMemo(() => Number.parseFloat(pitch), [pitch]);

  const identifyThread = () => {
    setError(null);
    setMatches([]);

    if (Number.isNaN(measuredValue)) {
      setError(t('threadPitchCalc.errors.invalidDiameter'));
      return;
    }

    if (measuredValue < 1 || measuredValue > 100) {
      setError(t('threadPitchCalc.errors.invalidRange', { measured: measuredValue.toFixed(2) }));
      return;
    }

    const db = THREAD_DATABASE[threadSide];
    const dataset =
      filterType === 'all'
        ? [...db.metric, ...db.bspp, ...db.npt, ...db.unf, ...db.unc]
        : db[filterType];

    const list = dataset
      .map((item) => {
        const diameterDiff = Math.abs(measuredValue - item.diameter);
        let score = 100 - diameterDiff * 10;

        if (!Number.isNaN(pitchValue)) {
          const pitchDiff = Math.abs(pitchValue - item.pitch);
          score -= pitchDiff * 20;
        }

        return {
          ...item,
          score: Math.max(0, score),
          diff: diameterDiff,
        };
      })
      .filter((item) => item.score >= 80)
      .sort((a, b) => b.score - a.score);

    if (list.length === 0) {
      setError(t('threadPitchCalc.errors.notFound', { measured: measuredValue.toFixed(2) }));
      return;
    }

    setMatches(list);
  };

  const top = matches[0];
  const alternatives = matches.slice(1, 4);
  const copyValue = useMemo(() => {
    if (!top) {
      return '';
    }

    const diameterLabel =
      threadSide === 'external'
        ? t('threadPitchCalc.result.diameter')
        : t('threadPitchCalc.result.holeDiameter');
    const lines = [
      `${t('threadPitchCalc.result.bestMatch')} ${top.name}`,
      `${diameterLabel}: ${top.diameter.toFixed(3)} mm`,
      `${t('threadPitchCalc.result.diff')}: ${top.diff.toFixed(2)} mm`,
    ];

    if (!Number.isNaN(pitchValue)) {
      lines.push(`${t('threadPitchCalc.result.pitch')}: ${top.pitch.toFixed(3)} mm`);
    }

    lines.push(`${t('threadPitchCalc.result.score')}: ${Math.round(top.score)}%`);
    return lines.join('\n');
  }, [top, threadSide, pitchValue, t]);

  const getScoreStyle = (score: number) => {
    if (score > 90) return styles.scoreHigh;
    if (score > 75) return styles.scoreMedium;
    return styles.scoreLow;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('threadPitchCalc.title')}
        subtitle={t('modules.threadPitch.description')}
        category={t('modules.threadPitch.category')}
      />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Spacing.xxl + insets.bottom }]} keyboardShouldPersistTaps="handled">
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, threadSide === 'external' && styles.tabActive]}
            onPress={() => setThreadSide('external')}
          >
            <Text style={[styles.tabLabel, threadSide === 'external' && styles.tabLabelActive]}>
              {t('threadPitchCalc.tabs.external')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, threadSide === 'internal' && styles.tabActive]}
            onPress={() => setThreadSide('internal')}
          >
            <Text style={[styles.tabLabel, threadSide === 'internal' && styles.tabLabelActive]}>
              {t('threadPitchCalc.tabs.internal')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            {threadSide === 'external'
              ? t('threadPitchCalc.labels.measuredDiameter')
              : t('threadPitchCalc.labels.measuredHoleDiameter')}
          </Text>
          <TextInput
            style={styles.input}
            value={measured}
            onChangeText={setMeasured}
            keyboardType="numeric"
            placeholder={t('threadPitchCalc.placeholders.measured')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('threadPitchCalc.labels.pitchOptional')}</Text>
          <TextInput
            style={styles.input}
            value={pitch}
            onChangeText={setPitch}
            keyboardType="numeric"
            placeholder={t('threadPitchCalc.placeholders.pitch')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('threadPitchCalc.labels.threadType')}</Text>
          <View style={styles.filterWrap}>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.filterChip, filterType === option.value && styles.filterChipActive]}
                onPress={() => setFilterType(option.value)}
              >
                <Text style={[styles.filterChipLabel, filterType === option.value && styles.filterChipLabelActive]}>
                  {t(`threadPitchCalc.filters.${option.labelKey}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={identifyThread}>
          <Text style={styles.buttonText}>{t('threadPitchCalc.identify')}</Text>
        </TouchableOpacity>

        {error ? (
          <View style={Callouts.error.container}>
            <Text style={Callouts.error.title}>{t('threadPitchCalc.result.errorTitle')}</Text>
            <Text style={Callouts.error.text}>{error}</Text>
          </View>
        ) : null}

        {top ? (
          <View style={Callouts.result.container}>
            <Text style={Callouts.result.title}>{t('threadPitchCalc.result.bestMatch')}</Text>
            <View style={styles.matchCard}>
              <Text style={styles.matchName}>{top.name}</Text>
              <Text style={styles.matchLine}>
                {threadSide === 'external'
                  ? t('threadPitchCalc.result.diameter')
                  : t('threadPitchCalc.result.holeDiameter')}
                : {top.diameter.toFixed(3)} mm
              </Text>
              <Text style={styles.matchLine}>
                {t('threadPitchCalc.result.diff')}: {top.diff.toFixed(2)} mm
              </Text>
              {!Number.isNaN(pitchValue) ? (
                <Text style={styles.matchLine}>
                  {t('threadPitchCalc.result.pitch')}: {top.pitch.toFixed(3)} mm
                </Text>
              ) : null}
              <Text style={styles.matchLine}>
                {t('threadPitchCalc.result.score')}:{' '}
                <Text style={getScoreStyle(top.score)}>{Math.round(top.score)}%</Text>
              </Text>
            </View>

            {alternatives.length > 0 ? (
              <View style={styles.altWrap}>
                <Text style={styles.altTitle}>{t('threadPitchCalc.result.alternatives')}</Text>
                {alternatives.map((item) => (
                  <View key={item.name} style={styles.altCard}>
                    <Text style={styles.altName}>{item.name}</Text>
                    <Text style={styles.altLine}>
                      {t('threadPitchCalc.result.diameter')}: {item.diameter.toFixed(3)} mm
                    </Text>
                    <Text style={styles.altLine}>
                      {t('threadPitchCalc.result.diff')}: {item.diff.toFixed(2)} mm
                    </Text>
                    <Text style={styles.altLine}>
                      {t('threadPitchCalc.result.score')}:{' '}
                      <Text style={getScoreStyle(item.score)}>{Math.round(item.score)}%</Text>
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
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
    padding: 16,
    gap: 12,
    paddingBottom: 36,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.accent,
  },
  tabLabel: {
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#111',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
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
  filterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBackground,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.borderAccent,
  },
  filterChipLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipLabelActive: {
    color: Colors.accent,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 14,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
  },
  matchName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  matchLine: {
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  altWrap: {
    gap: 8,
  },
  altTitle: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  altCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
  },
  altName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 6,
  },
  altLine: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  scoreHigh: {
    color: '#0d652d',
    fontWeight: '800',
  },
  scoreMedium: {
    color: '#f9ab00',
    fontWeight: '800',
  },
  scoreLow: {
    color: '#ea4335',
    fontWeight: '800',
  },
});
