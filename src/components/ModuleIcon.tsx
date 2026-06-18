import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect, G } from 'react-native-svg';

export type ModuleIconName =
  | 'hydraulicSystem'
  | 'advancedHydraulic'
  | 'bucklingShaft'
  | 'gearPump'
  | 'pipeRodWeight'
  | 'pneumaticCylinder'
  | 'hydraulicMotor'
  | 'threadPitch'
  | 'pipeConverter'
  | 'pressureConverter'
  | 'flowVelocity'
  | 'accumulator';

interface ModuleIconProps {
  name: ModuleIconName;
  size?: number;
  color: string;
}

/**
 * ISO 1219 style hydraulic / pneumatic schematic symbols, drawn as SVG.
 * Each symbol uses a 48x48 viewBox so stroke widths stay consistent.
 */
export const ModuleIcon: React.FC<ModuleIconProps> = ({ name, size = 26, color }) => {
  const s = {
    stroke: color,
    strokeWidth: 2.2,
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const fill = { fill: color };

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {renderSymbol(name, color, s, fill)}
    </Svg>
  );
};

type StrokeProps = {
  stroke: string;
  strokeWidth: number;
  fill: 'none';
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
};

const gearTeeth = (cx: number, cy: number, r: number, s: StrokeProps) => {
  const teeth = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    teeth.push(
      <Line
        key={i}
        x1={cx + Math.cos(a) * r}
        y1={cy + Math.sin(a) * r}
        x2={cx + Math.cos(a) * (r + 3)}
        y2={cy + Math.sin(a) * (r + 3)}
        {...s}
      />,
    );
  }
  return teeth;
};

function renderSymbol(
  name: ModuleIconName,
  color: string,
  s: StrokeProps,
  fill: { fill: string },
) {
  switch (name) {
    // Hydraulic pump: circle with solid triangle pointing OUT to the port
    case 'hydraulicSystem':
      return (
        <G>
          <Circle cx={24} cy={26} r={13} {...s} />
          <Line x1={24} y1={13} x2={24} y2={5} {...s} />
          <Polygon points="24,15 17,30 31,30" {...fill} />
        </G>
      );

    // Directional control valve: two spool boxes (crossed / parallel flow)
    case 'advancedHydraulic':
      return (
        <G>
          <Rect x={8} y={18} width={14} height={14} rx={1} {...s} />
          <Rect x={26} y={18} width={14} height={14} rx={1} {...s} />
          {/* crossed flow */}
          <Line x1={11} y1={21} x2={19} y2={29} {...s} />
          <Line x1={19} y1={21} x2={11} y2={29} {...s} />
          {/* straight flow */}
          <Line x1={30} y1={21} x2={30} y2={29} {...s} />
          <Line x1={36} y1={21} x2={36} y2={29} {...s} />
        </G>
      );

    // Buckled column under axial compression with fixed supports
    case 'bucklingShaft':
      return (
        <G>
          <Line x1={15} y1={9} x2={33} y2={9} {...s} />
          <Line x1={15} y1={39} x2={33} y2={39} {...s} />
          <Path d="M24 9 C 39 19, 39 29, 24 39" {...s} />
          <Polygon points="24,7 20,2 28,2" {...fill} />
          <Polygon points="24,41 20,46 28,46" {...fill} />
        </G>
      );

    // Gear pump: two meshing gears
    case 'gearPump':
      return (
        <G>
          <Circle cx={17} cy={24} r={6} {...s} />
          {gearTeeth(17, 24, 6, s)}
          <Circle cx={31} cy={24} r={6} {...s} />
          {gearTeeth(31, 24, 6, s)}
          <Circle cx={17} cy={24} r={1.4} {...fill} />
          <Circle cx={31} cy={24} r={1.4} {...fill} />
        </G>
      );

    // Pipe cross-section (annulus): outer wall + bore
    case 'pipeRodWeight':
      return (
        <G>
          <Circle cx={24} cy={24} r={14} {...s} />
          <Circle cx={24} cy={24} r={7.5} {...s} />
          <Line x1={24} y1={10} x2={24} y2={17} {...s} strokeWidth={1.2} />
        </G>
      );

    // Double-acting cylinder with piston + rod
    case 'pneumaticCylinder':
      return (
        <G>
          <Rect x={9} y={17} width={23} height={14} rx={1} {...s} />
          <Line x1={26} y1={17} x2={26} y2={31} {...s} strokeWidth={3} />
          <Line x1={26} y1={24} x2={43} y2={24} {...s} />
          <Line x1={14} y1={31} x2={14} y2={37} {...s} />
          <Line x1={27} y1={31} x2={27} y2={37} {...s} />
        </G>
      );

    // Hydraulic motor: circle with solid triangle pointing IN
    case 'hydraulicMotor':
      return (
        <G>
          <Circle cx={24} cy={26} r={13} {...s} />
          <Line x1={24} y1={13} x2={24} y2={5} {...s} />
          <Polygon points="24,37 17,22 31,22" {...fill} />
        </G>
      );

    // Bolt / thread: hex head + threaded shank
    case 'threadPitch':
      return (
        <G>
          <Rect x={7} y={16} width={9} height={16} rx={1} {...s} />
          <Rect x={16} y={20} width={25} height={8} {...s} />
          {[20, 25, 30, 35, 40].map((x, i) => (
            <Line key={i} x1={x} y1={20} x2={x - 4} y2={28} {...s} strokeWidth={1.4} />
          ))}
        </G>
      );

    // Pipe unit converter: pipe segment + opposing arrows
    case 'pipeConverter':
      return (
        <G>
          <Rect x={10} y={21} width={28} height={6} {...s} />
          <Line x1={15} y1={14} x2={31} y2={14} {...s} />
          <Polygon points="36,14 29,10 29,18" {...fill} />
          <Line x1={33} y1={34} x2={17} y2={34} {...s} />
          <Polygon points="12,34 19,30 19,38" {...fill} />
        </G>
      );

    // Pressure gauge / manometer
    case 'pressureConverter':
      return (
        <G>
          <Circle cx={24} cy={20} r={12} {...s} />
          <Line x1={24} y1={20} x2={31} y2={12} {...s} />
          <Circle cx={24} cy={20} r={1.8} {...fill} />
          <Line x1={24} y1={8} x2={24} y2={10} {...s} strokeWidth={1.4} />
          <Line x1={13} y1={20} x2={15} y2={20} {...s} strokeWidth={1.4} />
          <Line x1={33} y1={20} x2={35} y2={20} {...s} strokeWidth={1.4} />
          <Rect x={21} y={32} width={6} height={4} {...s} />
          <Line x1={24} y1={36} x2={24} y2={41} {...s} />
        </G>
      );

    // Flow through a pipe
    case 'flowVelocity':
      return (
        <G>
          <Line x1={8} y1={16} x2={40} y2={16} {...s} />
          <Line x1={8} y1={32} x2={40} y2={32} {...s} />
          <Line x1={13} y1={24} x2={31} y2={24} {...s} />
          <Polygon points="37,24 30,20 30,28" {...fill} />
        </G>
      );

    // Accumulator: capsule with gas/fluid divider + port
    case 'accumulator':
      return (
        <G>
          <Path d="M16 37 L16 16 Q16 8 24 8 Q32 8 32 16 L32 37 Z" {...s} />
          <Line x1={16} y1={18} x2={32} y2={18} {...s} />
          <Polyline points="19,13 22,15 25,12 28,14" {...s} strokeWidth={1.4} />
          <Line x1={24} y1={37} x2={24} y2={43} {...s} />
        </G>
      );

    default:
      return null;
  }
}
