import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

type Dim = 'bore' | 'rod' | 'stroke' | null;

interface CylinderDiagramProps {
  highlight?: Dim;
  boreLabel?: string;
  rodLabel?: string;
  strokeLabel?: string;
}

const base = Colors.textSecondary;
const dim = Colors.textMuted;
const hot = Colors.accent;

export const CylinderDiagram: React.FC<CylinderDiagramProps> = ({
  highlight = null,
  boreLabel = 'D',
  rodLabel = 'd',
  strokeLabel = 'L',
}) => {
  const c = (d: Dim) => (highlight === d ? hot : base);
  const cd = (d: Dim) => (highlight === d ? hot : dim);
  const on = (d: Dim) => highlight === d;

  // Geometry (viewBox 0 0 320 180)
  const cavTop = 56;
  const cavBot = 120;
  const pistonRetractX = 44;
  const pistonW = 13;
  const pistonExtX = 150;
  const rodTop = 80;
  const rodBot = 96;
  const rodMid = (rodTop + rodBot) / 2;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 320 180">
        <Defs>
          <LinearGradient id="barrel" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#2C2C2C" />
            <Stop offset="0.5" stopColor="#1E1E1E" />
            <Stop offset="1" stopColor="#161616" />
          </LinearGradient>
          <LinearGradient id="rodGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#6E6E6E" />
            <Stop offset="0.5" stopColor="#9A9A9A" />
            <Stop offset="1" stopColor="#5A5A5A" />
          </LinearGradient>
        </Defs>

        {/* Barrel body */}
        <Rect x={30} y={46} width={168} height={84}
          rx={6} fill="url(#barrel)"
          stroke={c('bore')} strokeWidth={on('bore') ? 2.6 : 1.6} />

        {/* End cap (right) — rod gland */}
        <Rect x={188} y={46} width={12} height={84} rx={3}
          fill={Colors.surfaceElevated} stroke={dim} strokeWidth={1.4} />

        {/* Port stubs (top) */}
        <Rect x={44} y={38} width={9} height={10} fill={Colors.surfaceElevated} stroke={dim} strokeWidth={1} />
        <Rect x={170} y={38} width={9} height={10} fill={Colors.surfaceElevated} stroke={dim} strokeWidth={1} />

        {/* Stroke ghost: extended piston position (dashed) */}
        <Rect x={pistonExtX} y={cavTop} width={pistonW} height={cavBot - cavTop}
          fill="none" stroke={cd('stroke')} strokeWidth={1.4}
          strokeDasharray="4 3" opacity={on('stroke') ? 1 : 0.7} />

        {/* Piston (retracted, solid) */}
        <Rect x={pistonRetractX} y={cavTop} width={pistonW} height={cavBot - cavTop}
          rx={2} fill={on('stroke') ? hot : '#3A3A3A'}
          stroke={on('stroke') ? hot : base} strokeWidth={1.4} opacity={0.95} />

        {/* Rod (extends through cap, protrudes) */}
        <Rect x={pistonRetractX + pistonW} y={rodTop} width={244 - (pistonRetractX + pistonW)} height={rodBot - rodTop}
          rx={2} fill="url(#rodGrad)"
          stroke={c('rod')} strokeWidth={on('rod') ? 2.6 : 1.6} />
        {/* Clevis eye at rod tip */}
        <Circle cx={252} cy={rodMid} r={9} fill={Colors.surface} stroke={c('rod')} strokeWidth={on('rod') ? 2.4 : 1.6} />
        <Circle cx={252} cy={rodMid} r={3.4} fill={Colors.background} stroke={cd('rod')} strokeWidth={1.2} />

        {/* === Bore dimension D — left vertical === */}
        <G>
          <Line x1={18} y1={46} x2={18} y2={130} stroke={cd('bore')} strokeWidth={1.3} />
          <Polygon points="18,46 14,53 22,53" fill={cd('bore')} />
          <Polygon points="18,130 14,123 22,123" fill={cd('bore')} />
          <SvgText x={11} y={92} fill={c('bore')} fontSize={13} fontWeight="bold"
            textAnchor="middle" transform="rotate(-90 11 92)">{boreLabel}</SvgText>
        </G>

        {/* === Rod dimension d — vertical on rod === */}
        <G>
          <Line x1={224} y1={rodTop} x2={224} y2={rodBot} stroke={cd('rod')} strokeWidth={1.3} />
          <Polygon points={`224,${rodTop} 220,${rodTop + 4} 228,${rodTop + 4}`} fill={cd('rod')} />
          <Polygon points={`224,${rodBot} 220,${rodBot - 4} 228,${rodBot - 4}`} fill={cd('rod')} />
          <SvgText x={233} y={rodMid + 4} fill={c('rod')} fontSize={12} fontWeight="bold"
            textAnchor="start">{rodLabel}</SvgText>
        </G>

        {/* === Stroke dimension L — inside barrel (piston travel) === */}
        <G>
          <Line x1={pistonRetractX + pistonW} y1={66} x2={pistonExtX} y2={66}
            stroke={cd('stroke')} strokeWidth={1.4} />
          <Polygon points={`${pistonRetractX + pistonW},66 ${pistonRetractX + pistonW + 6},63 ${pistonRetractX + pistonW + 6},69`} fill={cd('stroke')} />
          <Polygon points={`${pistonExtX},66 ${pistonExtX - 6},63 ${pistonExtX - 6},69`} fill={cd('stroke')} />
          <SvgText x={(pistonRetractX + pistonW + pistonExtX) / 2} y={62}
            fill={c('stroke')} fontSize={11.5} fontWeight="bold" textAnchor="middle">{strokeLabel}</SvgText>
        </G>

        {/* Dead-length hint: rod portion outside barrel is NOT counted as stroke */}
        <Line x1={200} y1={150} x2={244} y2={150} stroke={dim} strokeWidth={1} strokeDasharray="3 2" />
        <Polygon points="200,150 204,147 204,153" fill={dim} />
        <Polygon points="244,150 240,147 240,153" fill={dim} />
        <SvgText x={222} y={165} fill={dim} fontSize={8.5} textAnchor="middle">ölü boy</SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 320 / 180,
    marginVertical: 4,
  },
});
