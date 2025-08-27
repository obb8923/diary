import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Background } from '@components/Background';
import { Diary } from '@/domain/diary/components/Diary';
import { useAnimationStore } from '@/shared/store/animationStore';
import {TabBar} from '@/shared/components/TabBar';
export const DiaryScreen = () => {
  const transformScale = useAnimationStore(state => state.transformScale);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value * transformScale, { duration: 300 }) }],
    };
  });

  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
      <Animated.View style={animatedStyle}>
        <Diary />
      </Animated.View>
      <TabBar />
    </Background>
  );
}