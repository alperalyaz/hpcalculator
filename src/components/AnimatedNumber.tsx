import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  style?: StyleProp<TextStyle>;
  suffix?: string;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 2,
  style,
  suffix = '',
  duration = 650,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const from = display;
    anim.setValue(0);
    const id = anim.addListener(({ value: t }) => {
      setDisplay(from + (value - from) * t);
    });
    Animated.timing(anim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Text style={[styles.text, style]}>
      {display.toFixed(decimals)}
      {suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontVariant: ['tabular-nums'],
  },
});
