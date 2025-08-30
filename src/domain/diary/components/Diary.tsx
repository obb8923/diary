import React, { useEffect, useState, useCallback } from "react"
import { Keyboard, Dimensions, TouchableWithoutFeedback, View } from "react-native"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import Animated, { 
  Easing, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  runOnJS
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useAnimationStore } from "@store/animationStore"
import { DiaryCover } from "@/domain/diary/components/DiaryCover"
import { DiaryPaper } from "@/domain/diary/components/DiaryPaper"
import { DIARY_ANIMATION_CONSTANTS } from "@constants/DiaryAnimation"


export const Diary = () => {
  const { saveSequenceId, saveAnimationStep, setSaveAnimationStep, startClosing, startOpening } = useAnimationStore();
  
  // 애니메이션 값들
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // 정방향 애니메이션 단계별 함수들
  const startClosingCover = useCallback(() => {
    setSaveAnimationStep('closing_cover');
    startClosing(); // 커버 닫기 애니메이션 시작
  }, [setSaveAnimationStep, startClosing]);

  const startScaling = useCallback(() => {
    setSaveAnimationStep('scaling');
    scale.value = withTiming(DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.SMALL_SCALE, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.SCALE_DURATION_MS,
      easing: Easing.out(Easing.cubic)
    }, () => {
      runOnJS(startClosingCover)();
    });
  }, [scale, setSaveAnimationStep, startClosingCover]);

  const startRotating = useCallback(() => {
    setSaveAnimationStep('rotating');
    rotateZ.value = withTiming(DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.ROTATE_DEGREES, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.ROTATE_DURATION_MS,
      easing: Easing.inOut(Easing.cubic)
    }, () => {
      runOnJS(startLifting)();
    });
  }, [rotateZ, setSaveAnimationStep]);

  const startLifting = useCallback(() => {
    setSaveAnimationStep('lifting');
    translateY.value = withTiming(DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.LIFT_OFFSET, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.LIFT_DURATION_MS,
      easing: Easing.out(Easing.cubic)
    }, () => {
      runOnJS(setWaitingForResult)();
    });
  }, [translateY, setSaveAnimationStep]);

  const setWaitingForResult = useCallback(() => {
    setSaveAnimationStep('waiting_for_result');
  }, [setSaveAnimationStep]);

  const startSaveAnimation = useCallback(() => {
    try {
      // 1단계: 스케일 축소부터 시작 (동기적으로 연결됨)
      startScaling();
    } catch (error) {
      console.error('저장 애니메이션 오류:', error);
      setSaveAnimationStep('idle');
    }
  }, [startScaling, setSaveAnimationStep]);

  // 역방향 애니메이션 단계별 함수들 (5. 역순서)
  const showResult = useCallback(() => {
    setSaveAnimationStep('showing_result');
    // 애니메이션 완료 후 idle 상태로 복구
    setTimeout(() => {
      setSaveAnimationStep('idle');
    }, 1000);
  }, [setSaveAnimationStep]);

  const startReverseScaling = useCallback(() => {
    setSaveAnimationStep('reverse_scaling');
    // 5-4. 스케일 복구 (작은크기 → 원래크기)
    scale.value = withTiming(1, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.SCALE_DURATION_MS,
      easing: Easing.out(Easing.cubic)
    }, () => {
      runOnJS(showResult)();
    });
  }, [scale, setSaveAnimationStep, showResult]);

  const startOpeningCover = useCallback(() => {
    setSaveAnimationStep('opening_cover');
    // 5-3. 커버 열기
    startOpening();
  }, [setSaveAnimationStep, startOpening]);

  const startReverseRotating = useCallback(() => {
    setSaveAnimationStep('reverse_rotating');
    // 5-2. 회전 복구 (180도 → 0도)
    rotateZ.value = withTiming(0, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.ROTATE_DURATION_MS,
      easing: Easing.inOut(Easing.cubic)
    }, () => {
      runOnJS(startOpeningCover)();
    });
  }, [rotateZ, setSaveAnimationStep, startOpeningCover]);

  const startReverseLifting = useCallback(() => {
    setSaveAnimationStep('reverse_lifting');
    // 5-1. 디바이스 위에서 아래로 내리기
    translateY.value = withTiming(0, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.LIFT_DURATION_MS,
      easing: Easing.in(Easing.cubic)
    }, () => {
      runOnJS(startReverseRotating)();
    });
  }, [translateY, setSaveAnimationStep, startReverseRotating]);

  const startReverseAnimation = useCallback(() => {
    // 역방향 애니메이션 시작 (5. 역순서)
    startReverseLifting();
  }, [startReverseLifting]);

  // 저장 애니메이션 시퀀스 처리
  useEffect(() => {
    if (saveAnimationStep === 'saving') {
      startSaveAnimation();
    } else if (saveAnimationStep === 'closing_cover') {
      // 2. 커버 닫기 완료 후 회전 시작
      setTimeout(() => {
        startRotating();
      }, DIARY_ANIMATION_CONSTANTS.COVER.DURATION_MS);
    } else if (saveAnimationStep === 'opening_cover') {
      // 5-3. 커버 열기 완료 후 스케일 복구 시작
      setTimeout(() => {
        startReverseScaling();
      }, DIARY_ANIMATION_CONSTANTS.COVER.DURATION_MS);
    } else if (saveAnimationStep === 'reversing') {
      startReverseAnimation();
    }
  }, [saveSequenceId, saveAnimationStep, startSaveAnimation, startRotating, startReverseScaling, startReverseAnimation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
        { translateY: translateY.value }
      ],
    };
  });

  return (
    <Animated.View 
      style={animatedStyle}
      className='w-full h-full border border-line'
    >
      <DiaryPaper />
      <DiaryCover />
    </Animated.View>
  )
}