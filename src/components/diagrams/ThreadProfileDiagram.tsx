import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Polygon, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

interface ThreadProfileDiagramProps {
  side?: 'external' | 'internal';
  pitchLabel?: string;
  diaLabel?: string;
}

const dim = Colors.textMuted;

export const ThreadProfileDiagram: React.FC<ThreadProfileDiagramProps> = ({
  side = 'external',
  pitchLabel = 'P',
  diaLabel = 'D',
}) => {
  const x0 = 56;
  const p = 26;
  const n = 6;
  const xEnd = x0 + n * p;
  const crestTop = 50;
  const rootTop = 66;
  const rootBot = 104;
  const crestBot = 120;

  // Build triangular V-thread outlines (top and bottom edges).
  const topPts: string[] = [`${x0 - 12},${rootTop}`, `${x0},${rootTop}`];
  const botPts: string[] = [`${x0 - 12},${rootBot}`, `${x0},${rootBot}`];
  for (let i = 0; i < n; i++) {
    topPts.push(`${x0 + i * p + p / 2},${crestTop}`, `${x0 + (i + 1) * p},${rootTop}`);
    botPts.push(`${x0 + i * p + p / 2},${crestBot}`, `${x0 + (i + 1) * p},${rootBot}`);
  }
  topPts.push(`${xEnd + 12},${rootTop}`);
  botPts.push(`${xEnd + 12},${rootBot}`);

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 300 150">
        {/* core body */}
        <Rect x={x0 - 12} y={rootTop} width={xEnd + 24 - x0} height={rootBot - rootTop}
          fill={Colors.surfaceElevated} opacity={0.6} />
        {/* thread crest profiles */}
        <Polyline points={topPts.join(' ')} fill="none" stroke={Colors.accent} strokeWidth={2} strokeLinejoin="round" />
        <Polyline points={botPts.join(' ')} fill="none" stroke={Colors.accent} strokeWidth={2} strokeLinejoin="round" />
        {/* centreline */}
        <Line x1={x0 - 18} y1={(rootTop + rootBot) / 2} x2={xEnd + 18} y2={(rootTop + rootBot) / 2}
          stroke={dim} strokeWidth={0.8} strokeDasharray="6 3" />

        {/* Pitch P — between two adjacent crests */}
        <G>
          <Line x1={x0 + p / 2} y1={38} x2={x0 + p / 2 + p} y2={38} stroke={dim} strokeWidth={1.2} />
          <Polygon points={`${x0 + p / 2},38 ${x0 + p / 2 + 6},35 ${x0 + p / 2 + 6},41`} fill={dim} />
          <Polygon points={`${x0 + p / 2 + p},38 ${x0 + p / 2 + p - 6},35 ${x0 + p / 2 + p - 6},41`} fill={dim} />
          {/* tick lines up to crests */}
          <Line x1={x0 + p / 2} y1={crestTop} x2={x0 + p / 2} y2={38} stroke={dim} strokeWidth={0.7} strokeDasharray="2 2" />
          <Line x1={x0 + p / 2 + p} y1={crestTop} x2={x0 + p / 2 + p} y2={38} stroke={dim} strokeWidth={0.7} strokeDasharray="2 2" />
          <SvgText x={x0 + p} y={32} fill={Colors.accent} fontSize={12} fontWeight="bold" textAnchor="middle">{pitchLabel}</SvgText>
        </G>

        {/* Major diameter D — vertical on left */}
        <G>
          <Line x1={34} y1={crestTop} x2={34} y2={crestBot} stroke={dim} strokeWidth={1.2} />
          <Polygon points={`34,${crestTop} 30,${crestTop + 7} 38,${crestTop + 7}`} fill={dim} />
          <Polygon points={`34,${crestBot} 30,${crestBot - 7} 38,${crestBot - 7}`} fill={dim} />
          <SvgText x={26} y={(crestTop + crestBot) / 2 + 4} fill={Colors.accent} fontSize={13} fontWeight="bold"
            textAnchor="middle" transform={`rotate(-90 26 ${(crestTop + crestBot) / 2})`}>{diaLabel}</SvgText>
        </G>

        {/* 60° flank angle annotation */}
        <SvgText x={xEnd + 4} y={(rootTop + rootBot) / 2 + 4} fill={dim} fontSize={10}>60°</SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 300 / 150,
    marginBottom: 8,
  },
});
