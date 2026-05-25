import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../theme';

type Dim = 'bore' | 'rod' | 'stroke' | null;

interface CylinderDiagramProps {
  highlight?: Dim;
}

const base = Colors.textSecondary;
const dim = Colors.textMuted;
const hot = Colors.accent;

export const CylinderDiagram: React.FC<CylinderDiagramProps> = ({ highlight = null }) => {
  const c = (d: Dim) => (highlight === d ? hot : base);
  const cd = (d: Dim) => (highlight === d ? hot : dim);

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 300 150">
        {/* Barrel */}
        <Rect x={24} y={42} width={160} height={66} rx={4}
          fill={Colors.surfaceElevated} stroke={c('bore')} strokeWidth={highlight === 'bore' ? 2.5 : 1.6} />
        {/* Piston */}
        <Rect x={150} y={48} width={12} height={54} fill={c('stroke')} opacity={0.85} />
        {/* Rod */}
        <Rect x={162} y={68} width={104} height={14} rx={2}
          fill={Colors.surface} stroke={c('rod')} strokeWidth={highlight === 'rod' ? 2.5 : 1.6} />
        {/* Rod tip */}
        <Rect x={262} y={66} width={8} height={18} rx={2} fill={c('rod')} opacity={0.5} />

        {/* Port lines (decorative) */}
        <Line x1={40} y1={42} x2={40} y2={28} stroke={dim} strokeWidth={1.4} />
        <Line x1={40} y1={28} x2={52} y2={28} stroke={dim} strokeWidth={1.4} />

        {/* Bore dimension (D) — left vertical */}
        <G>
          <Line x1={14} y1={42} x2={14} y2={108} stroke={cd('bore')} strokeWidth={1.2} />
          <Polygon points="14,42 11,49 17,49" fill={cd('bore')} />
          <Polygon points="14,108 11,101 17,101" fill={cd('bore')} />
          <SvgText x={8} y={79} fill={c('bore')} fontSize={13} fontWeight="bold"
            textAnchor="middle" transform="rotate(-90 8 79)">D</SvgText>
        </G>

        {/* Rod dimension (d) — right vertical */}
        <G>
          <Line x1={284} y1={68} x2={284} y2={82} stroke={cd('rod')} strokeWidth={1.2} />
          <Polygon points="284,68 281,72 287,72" fill={cd('rod')} />
          <Polygon points="284,82 281,78 287,78" fill={cd('rod')} />
          <SvgText x={293} y={79} fill={c('rod')} fontSize={12} fontWeight="bold"
            textAnchor="middle">d</SvgText>
        </G>

        {/* Stroke dimension (L) — bottom horizontal */}
        <G>
          <Line x1={162} y1={128} x2={262} y2={128} stroke={cd('stroke')} strokeWidth={1.2} />
          <Polygon points="162,128 168,125 168,131" fill={cd('stroke')} />
          <Polygon points="262,128 256,125 256,131" fill={cd('stroke')} />
          <SvgText x={212} y={143} fill={c('stroke')} fontSize={12} fontWeight="bold"
            textAnchor="middle">L (stroke)</SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: 300 / 150,
    marginVertical: 4,
  },
});
