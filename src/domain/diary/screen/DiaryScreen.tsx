import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Background } from '@components/Background';
import { Diary } from '@/domain/diary/components/Diary';
import { useAnimationStore } from '@/shared/store/animationStore';
import {TabBar} from '@/shared/components/TabBar';
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation';

export const DiaryScreen = () => {
  const transformScale = useAnimationStore(state => state.transformScale);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value * transformScale, { duration: 300 }) }],
    };
  });

  return (
    <Background isStatusBarGap={true} isTabBarGap={true} isImage={true}>
      {transformScale !== 1 && <TabBar />}
      <Animated.View 
        style={[
          animatedStyle,
          {
            flex: 1,
            // 열린 상태에서는 전체 화면, 닫힌 상태에서는 중앙 정렬
            ...(transformScale === DIARY_ANIMATION_CONSTANTS.SCALE.OPENED 
              ? {} 
              : { justifyContent: 'center', alignItems: 'center' }
            )
          }
        ]}
      >
        <Diary />
      </Animated.View>
    </Background>
  );
}