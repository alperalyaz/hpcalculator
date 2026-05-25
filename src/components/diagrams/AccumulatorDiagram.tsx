import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

interface AccumulatorDiagramProps {
  gasLabel?: string;
  oilLabel?: string;
  prechargeLabel?: string;
  minLabel?: string;
  maxLabel?: string;
}

const muted = Colors.textMuted;

// Bladder accumulator at three operating states: gas fills from the top,
// oil enters from the bottom and compresses the gas as pressure rises.
const Shell: React.FC<{ cx: number; oilFrac: number; caption: string; pLabel: string }> = ({
  cx,
  oilFrac,
  caption,
  pLabel,
}) => {
  const top = 22;
  const bot = 104;
  const w = 46;
  const x = cx - w / 2;
  const h = bot - top;
  const sep = bot - h * oilFrac; // gas/oil boundary
  const r = w / 2;

  return (
    <G>
      {/* gas valve */}
      <Rect x={cx - 4} y={top - 8} width={8} height={8} fill={Colors.surfaceElevated} stroke={muted} strokeWidth={1} />

      {/* shell outline (capsule) */}
      <Path
        d={`M ${x},${top + r} a ${r},${r} 0 0 1 ${w},0 L ${x + w},${bot - r} a ${r},${r} 0 0 1 ${-w},0 Z`}
        fill={Colors.background}
        stroke={Colors.accent}
        strokeWidth={1.8}
      />
      {/* oil fill (bottom) */}
      {oilFrac > 0.001 && (
        <Path
          d={`M ${x},${Math.min(sep, bot - r)} L ${x + w},${Math.min(sep, bot - r)} L ${x + w},${bot - r} a ${r},${r} 0 0 1 ${-w},0 Z`}
          fill="url(#oilFill)"
          opacity={0.9}
        />
      )}
      {/* bladder separator */}
      <Path d={`M ${x + 2},${sep} q ${w / 4},6 ${w / 2},0 t ${w / 2},0`} fill="none" stroke={muted} strokeWidth={1.2} />
      {/* gas dots */}
      <Circle cx={cx - 8} cy={top + 16} r={2} fill={muted} />
      <Circle cx={cx + 7} cy={top + 22} r={2} fill={muted} />
      <Circle cx={cx} cy={top + 12} r={2} fill={muted} />

      <SvgText x={cx} y={120} fill={Colors.textSecondary} fontSize={10} textAnchor="middle">{caption}</SvgText>
      <SvgText x={cx} y={134} fill={Colors.accent} fontSize={11} fontWeight="bold" textAnchor="middle">{pLabel}</SvgText>
    </G>
  );
};

export const AccumulatorDiagram: React.FC<AccumulatorDiagramProps> = ({
  gasLabel = 'N₂',
  oilLabel = 'oil',
  prechargeLabel = 'Pre-charge',
  minLabel = 'Min',
  maxLabel = 'Max',
}) => (
  <View style={styles.wrap}>
    <Svg width="100%" height="100%" viewBox="0 0 300 150">
      <Defs>
        <LinearGradient id="oilFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={Colors.accent} />
          <Stop offset="1" stopColor={Colors.accentDark} />
        </LinearGradient>
      </Defs>

      <Shell cx={56} oilFrac={0} caption={prechargeLabel} pLabel="p₀" />
      <Shell cx={150} oilFrac={0.32} caption={minLabel} pLabel="p₁" />
      <Shell cx={244} oilFrac={0.62} caption={maxLabel} pLabel="p₂" />

      {/* legend */}
      <Circle cx={20} cy={144} r={3} fill={muted} />
      <SvgText x={28} y={147} fill={Colors.textMuted} fontSize={9}>{gasLabel}</SvgText>
      <Rect x={92} y={141} width={6} height={6} fill={Colors.accent} />
      <SvgText x={102} y={147} fill={Colors.textMuted} fontSize={9}>{oilLabel}</SvgText>
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 300 / 150,
    marginBottom: 8,
  },
});
