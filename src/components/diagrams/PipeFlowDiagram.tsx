import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, G, Line, LinearGradient, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

interface PipeFlowDiagramProps {
  diaLabel?: string;
  velLabel?: string;
  flowLabel?: string;
}

const dim = Colors.textMuted;

export const PipeFlowDiagram: React.FC<PipeFlowDiagramProps> = ({
  diaLabel = 'D',
  velLabel = 'v',
  flowLabel = 'Q',
}) => {
  const top = 42;
  const bot = 92;
  const x1 = 40;
  const x2 = 268;
  const midY = (top + bot) / 2;
  const arrowYs = [top + 12, midY, bot - 12];

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 300 130">
        <Defs>
          <LinearGradient id="fluid" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={Colors.accentDark} stopOpacity={0.25} />
            <Stop offset="1" stopColor={Colors.accent} stopOpacity={0.25} />
          </LinearGradient>
        </Defs>

        {/* fluid body */}
        <Rect x={x1} y={top} width={x2 - x1} height={bot - top} fill="url(#fluid)" />
        {/* pipe walls */}
        <Line x1={x1 - 6} y1={top} x2={x2 + 6} y2={top} stroke={Colors.accent} strokeWidth={2.4} />
        <Line x1={x1 - 6} y1={bot} x2={x2 + 6} y2={bot} stroke={Colors.accent} strokeWidth={2.4} />

        {/* flow arrows */}
        {arrowYs.map((y, i) => (
          <G key={i}>
            <Line x1={x1 + 24} y1={y} x2={x2 - 34} y2={y} stroke={Colors.accent} strokeWidth={2} />
            <Polygon points={`${x2 - 26},${y} ${x2 - 38},${y - 5} ${x2 - 38},${y + 5}`} fill={Colors.accent} />
          </G>
        ))}

        {/* velocity label */}
        <SvgText x={(x1 + x2) / 2} y={top - 6} fill={Colors.accent} fontSize={12} fontWeight="bold" textAnchor="middle">
          {velLabel} →
        </SvgText>

        {/* inlet flow Q label */}
        <SvgText x={x1 - 10} y={midY - 8} fill={dim} fontSize={11} textAnchor="middle">{flowLabel}</SvgText>

        {/* Diameter D — vertical dimension on left */}
        <G>
          <Line x1={22} y1={top} x2={22} y2={bot} stroke={dim} strokeWidth={1.2} />
          <Polygon points={`22,${top} 18,${top + 7} 26,${top + 7}`} fill={dim} />
          <Polygon points={`22,${bot} 18,${bot - 7} 26,${bot - 7}`} fill={dim} />
          <SvgText x={14} y={midY + 4} fill={Colors.accent} fontSize={13} fontWeight="bold"
            textAnchor="middle" transform={`rotate(-90 14 ${midY})`}>{diaLabel}</SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 300 / 130,
    marginBottom: 8,
  },
});
