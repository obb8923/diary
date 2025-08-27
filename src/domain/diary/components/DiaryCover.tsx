import React from 'react';
import { Dimensions } from 'react-native';
import Animated, { Easing, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAnimationStore } from '@store/animationStore';

const { width, height } = Dimensions.get('window');

// 일기장 덮개: 왼쪽에서 오른쪽으로 단일 커버가 닫히고 열리는 애니메이션
export const DiaryCover = () => {
  // 0: 완전히 열림, 1: 완전히 닫힘
  const progress = useSharedValue(0);
  const durationMs = 520;

  const { direction, triggerId } = useAnimationStore();

  useAnimatedReaction(
    () => ({ direction, triggerId }),
    (state, prev) => {
      if (!state) return;
      if (prev && state.triggerId === prev.triggerId) return;
      const toValue = state.direction === 'close' ? 1 : 0;
      progress.value = withTiming(toValue, { duration: durationMs, easing: Easing.inOut(Easing.cubic) });
    }
  );

  // 단일 커버: 왼쪽에서 오른쪽으로 폭이 증가
  const coverStyle = useAnimatedStyle(() => {
    const animatedWidth = width * progress.value; // 0 → 열림, width → 닫힘
    return {
      width: animatedWidth,
      height,
      backgroundColor: 'rgba(0,0,0,0.7)'
    };
  });

  return (
    <Animated.View pointerEvents="none" className="absolute inset-0 overflow-hidden z-40">
      <Animated.View style={coverStyle} className="absolute left-0 top-0" />
    </Animated.View>
  );
};

