import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

interface BucklingDiagramProps {
  /** Currently selected effective-length factor K (2 / 1 / 0.7 / 0.5). */
  kValue: number;
}

const base = Colors.textSecondary;
const muted = Colors.textMuted;
const hot = Colors.accent;

const TOP = 26;
const BOT = 112;

// Hatched clamp (fixed support) centred on x at vertical y, drawn as a bar
// with diagonal ticks. `above` flips it for a top clamp.
const Clamp: React.FC<{ x: number; y: number; color: string; above?: boolean }> = ({ x, y, color, above }) => {
  const w = 26;
  const dir = above ? -1 : 1;
  const ticks = [0, 1, 2, 3, 4];
  return (
    <G>
      <Line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={color} strokeWidth={2} />
      {ticks.map((i) => {
        const tx = x - w / 2 + (i * w) / 4;
        return <Line key={i} x1={tx} y1={y} x2={tx - 5} y2={y + dir * 6} stroke={color} strokeWidth={1.2} />;
      })}
    </G>
  );
};

// Pin support: small triangle sitting under the point.
const Pin: React.FC<{ x: number; y: number; color: string; above?: boolean }> = ({ x, y, color, above }) => {
  const h = 9;
  const dir = above ? -1 : 1;
  return (
    <Polygon
      points={`${x},${y} ${x - 6},${y + dir * h} ${x + 6},${y + dir * h}`}
      fill="none"
      stroke={color}
      strokeWidth={1.4}
    />
  );
};

interface CaseDef {
  k: number;
  cx: number;
  path: string;          // buckled centreline
  topKind: 'free' | 'pin' | 'clamp';
  botKind: 'pin' | 'clamp';
}

export const BucklingDiagram: React.FC<BucklingDiagramProps> = ({ kValue }) => {
  const cxs = [44, 122, 200, 278];

  const cases: CaseDef[] = [
    // Fixed–Free (K=2): clamped base, free top sways to the side
    { k: 2.0, cx: cxs[0], topKind: 'free', botKind: 'clamp',
      path: `M ${cxs[0]},${BOT} C ${cxs[0]},${TOP + 50} ${cxs[0] + 16},${TOP + 26} ${cxs[0] + 20},${TOP}` },
    // Pinned–Pinned (K=1): both ends pinned, single bow
    { k: 1.0, cx: cxs[1], topKind: 'pin', botKind: 'pin',
      path: `M ${cxs[1]},${BOT} C ${cxs[1] + 22},${BOT - 30} ${cxs[1] + 22},${TOP + 30} ${cxs[1]},${TOP}` },
    // Fixed–Pinned (K=0.7): clamped base (vertical tangent), pinned top
    { k: 0.7, cx: cxs[2], topKind: 'pin', botKind: 'clamp',
      path: `M ${cxs[2]},${BOT} C ${cxs[2]},${BOT - 32} ${cxs[2] + 20},${TOP + 28} ${cxs[2]},${TOP}` },
    // Fixed–Fixed (K=0.5): both ends clamped, double curvature (S)
    { k: 0.5, cx: cxs[3], topKind: 'clamp', botKind: 'clamp',
      path: `M ${cxs[3]},${BOT} C ${cxs[3] + 16},${BOT - 24} ${cxs[3] - 16},${TOP + 24} ${cxs[3]},${TOP}` },
  ];

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 320 150">
        {cases.map((c) => {
          const active = Math.abs(kValue - c.k) < 0.001;
          const col = active ? hot : muted;
          const lineCol = active ? hot : base;
          return (
            <G key={c.k}>
              {/* reference (undeflected) axis */}
              <Line x1={c.cx} y1={TOP} x2={c.cx} y2={BOT}
                stroke={muted} strokeWidth={1} strokeDasharray="2 3" opacity={active ? 0.5 : 0.35} />
              {/* buckled column */}
              <Path d={c.path} fill="none" stroke={lineCol} strokeWidth={active ? 3 : 1.8}
                strokeLinecap="round" opacity={active ? 1 : 0.8} />
              {/* base support */}
              {c.botKind === 'clamp'
                ? <Clamp x={c.cx} y={BOT} color={col} />
                : <Pin x={c.cx} y={BOT} color={col} />}
              {/* top support */}
              {c.topKind === 'clamp' && <Clamp x={c.cx} y={TOP} color={col} above />}
              {c.topKind === 'pin' && <Pin x={c.cx} y={TOP} color={col} above />}
              {c.topKind === 'free' && (
                <Polygon points={`${c.cx + 20},${TOP} ${c.cx + 26},${TOP + 4} ${c.cx + 24},${TOP - 4}`} fill={col} />
              )}
              {/* K label */}
              <SvgText x={c.cx} y={138} fill={col} fontSize={11}
                fontWeight={active ? 'bold' : 'normal'} textAnchor="middle">
                K={c.k}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 320 / 150,
    marginBottom: 8,
  },
});
