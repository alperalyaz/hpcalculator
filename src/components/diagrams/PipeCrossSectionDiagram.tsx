import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, Polygon, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

interface PipeCrossSectionDiagramProps {
  mode: 'pipe' | 'rod';
  odLabel?: string;
  idLabel?: string;
  wallLabel?: string;
}

const base = Colors.textSecondary;
const dim = Colors.textMuted;

export const PipeCrossSectionDiagram: React.FC<PipeCrossSectionDiagramProps> = ({
  mode,
  odLabel = 'D',
  idLabel = 'd',
  wallLabel = 't',
}) => {
  const cx = 110;
  const cy = 82;
  const rOuter = 58;
  const rInner = mode === 'pipe' ? 34 : 0;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 220 170">
        <Defs>
          <RadialGradient id="metal" cx="0.4" cy="0.35" r="0.8">
            <Stop offset="0" stopColor="#3A3A3A" />
            <Stop offset="0.7" stopColor="#262626" />
            <Stop offset="1" stopColor="#181818" />
          </RadialGradient>
        </Defs>

        {/* Outer body */}
        <Circle cx={cx} cy={cy} r={rOuter} fill="url(#metal)" stroke={Colors.accent} strokeWidth={2} />
        {/* Bore (hole) for pipe */}
        {mode === 'pipe' && (
          <Circle cx={cx} cy={cy} r={rInner} fill={Colors.background} stroke={Colors.accent} strokeWidth={1.6} />
        )}
        {/* Centre mark */}
        <Line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke={dim} strokeWidth={1} />
        <Line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke={dim} strokeWidth={1} />

        {/* OD dimension — vertical on the left */}
        <G>
          <Line x1={20} y1={cy - rOuter} x2={20} y2={cy + rOuter} stroke={dim} strokeWidth={1.2} />
          <Polygon points={`20,${cy - rOuter} 16,${cy - rOuter + 7} 24,${cy - rOuter + 7}`} fill={dim} />
          <Polygon points={`20,${cy + rOuter} 16,${cy + rOuter - 7} 24,${cy + rOuter - 7}`} fill={dim} />
          <SvgText x={12} y={cy + 4} fill={Colors.accent} fontSize={13} fontWeight="bold"
            textAnchor="middle" transform={`rotate(-90 12 ${cy})`}>{odLabel}</SvgText>
        </G>

        {/* ID dimension — horizontal across the bore */}
        {mode === 'pipe' && (
          <G>
            <Line x1={cx - rInner} y1={cy} x2={cx + rInner} y2={cy} stroke={base} strokeWidth={1.2} />
            <Polygon points={`${cx - rInner},${cy} ${cx - rInner + 6},${cy - 3} ${cx - rInner + 6},${cy + 3}`} fill={base} />
            <Polygon points={`${cx + rInner},${cy} ${cx + rInner - 6},${cy - 3} ${cx + rInner - 6},${cy + 3}`} fill={base} />
            <SvgText x={cx} y={cy - 6} fill={Colors.accent} fontSize={12} fontWeight="bold" textAnchor="middle">{idLabel}</SvgText>
          </G>
        )}

        {/* Wall thickness — top radial */}
        {mode === 'pipe' && (
          <G>
            <Line x1={cx + 78} y1={cy - rOuter} x2={cx + 78} y2={cy - rInner} stroke={dim} strokeWidth={1.2} />
            <Line x1={cx} y1={cy - rOuter} x2={cx + 78} y2={cy - rOuter} stroke={dim} strokeWidth={0.8} strokeDasharray="2 2" />
            <Line x1={cx} y1={cy - rInner} x2={cx + 78} y2={cy - rInner} stroke={dim} strokeWidth={0.8} strokeDasharray="2 2" />
            <SvgText x={cx + 84} y={cy - (rOuter + rInner) / 2 + 4} fill={Colors.accent} fontSize={12} fontWeight="bold">{wallLabel}</SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 220 / 170,
    maxHeight: 180,
    alignSelf: 'center',
    marginBottom: 8,
  },
});
