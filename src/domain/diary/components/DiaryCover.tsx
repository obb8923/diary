import React from 'react';
import { Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, { Easing, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAnimationStore } from '@store/animationStore';
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation';

// 일기장 덮개: 왼쪽에서 오른쪽으로 단일 커버가 닫히고 열리는 애니메이션
export const DiaryCover = () => {
  // 0: 완전히 열림, 1: 완전히 닫힘 (초기값: 닫힌 상태)
  const progress = useSharedValue(DIARY_ANIMATION_CONSTANTS.PROGRESS.FULLY_CLOSED);

  const { direction, triggerId } = useAnimationStore();

  const handleCoverTouch = () => {
    const { setTransformScale, startOpening } = useAnimationStore.getState()
    startOpening()
    setTimeout(() => {
      setTransformScale(DIARY_ANIMATION_CONSTANTS.SCALE.OPENED)
    }, DIARY_ANIMATION_CONSTANTS.COVER.SCALE_CHANGE_DELAY_MS)
  }

  useAnimatedReaction(
    () => ({ direction, triggerId }),
    (state, prev) => {
      if (!state) return;
      if (prev && state.triggerId === prev.triggerId) return;
      const toValue = state.direction === 'close' ? DIARY_ANIMATION_CONSTANTS.PROGRESS.FULLY_CLOSED : DIARY_ANIMATION_CONSTANTS.PROGRESS.FULLY_OPENED;
      progress.value = withTiming(toValue, { duration: DIARY_ANIMATION_CONSTANTS.COVER.DURATION_MS, easing: Easing.inOut(Easing.cubic) });
    }
  );

  // 단일 커버: 왼쪽에서 오른쪽으로 폭이 증가
  // 부모 컨테이너(Diary)의 크기를 100%로 사용
  const coverStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`, // 0% → 열림, 100% → 닫힘
    };
  });

  // 덮개가 완전히 열려있을 때(progress가 0에 가까울 때)는 터치 이벤트를 차단하지 않음
  const containerStyle = useAnimatedStyle(() => {
    const shouldBlockTouch = progress.value > DIARY_ANIMATION_CONSTANTS.COVER.TOUCH_THRESHOLD; // 임계값 이상 닫혀있을 때만 터치 차단
    return {
      pointerEvents: shouldBlockTouch ? 'auto' : 'none'
    };
  });

  return (
    <TouchableWithoutFeedback onPress={handleCoverTouch}>
      <Animated.View 
        className="absolute inset-0 overflow-hidden z-40"
        style={containerStyle}
      >
        <Animated.View style={coverStyle} className="absolute left-0 top-0 h-full bg-white" />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

