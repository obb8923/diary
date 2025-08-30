import React, { useEffect, useState, useCallback } from "react"
import { Keyboard, Dimensions, TouchableWithoutFeedback, View } from "react-native"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import Animated, { 
  Easing, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming
} from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useAnimationStore } from "@store/animationStore"
import { DiaryCover } from "@/domain/diary/components/DiaryCover"
import { DiaryPaper } from "@/domain/diary/components/DiaryPaper"
import { DIARY_ANIMATION_CONSTANTS } from "@constants/DiaryAnimation"


export const Diary = () => {
  const { saveSequenceId, saveAnimationStep, setSaveAnimationStep } = useAnimationStore();
  
  // 애니메이션 값들
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const startSaveAnimation = useCallback(async () => {
    try {
      // 1단계: 스케일 축소
      setSaveAnimationStep('scaling');
      scale.value = withTiming(DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.SMALL_SCALE, {
        duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.SCALE_DURATION_MS,
        easing: Easing.out(Easing.cubic)
      });
      
      // 2단계: 평면에서 180도 시계방향 회전 (아래가 위로)
      setTimeout(() => {
        setSaveAnimationStep('rotating');
        rotateZ.value = withTiming(DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.ROTATE_DEGREES, {
          duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.ROTATE_DURATION_MS,
          easing: Easing.inOut(Easing.cubic)
        });
      }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.STEP_DELAY_MS);
      
      // 3단계: 위로 리프트
      setTimeout(() => {
        setSaveAnimationStep('lifting');
        translateY.value = withTiming(DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.LIFT_OFFSET, {
          duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.LIFT_DURATION_MS,
          easing: Easing.out(Easing.cubic)
        });
      }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.STEP_DELAY_MS * 2);
      
      // 4단계: 저장 결과 대기 (최소 대기 시간)
      setTimeout(() => {
        setSaveAnimationStep('waiting_for_result');
      }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.STEP_DELAY_MS * 3);
      
    } catch (error) {
      console.error('저장 애니메이션 오류:', error);
      setSaveAnimationStep('idle');
    }
  }, [scale, rotateZ, translateY, setSaveAnimationStep]);

  const startReverseAnimation = useCallback(() => {
    setSaveAnimationStep('reversing');
    
    // 아래로 내리기
    translateY.value = withTiming(0, {
      duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.REVERSE_DURATION_MS / 3,
      easing: Easing.in(Easing.cubic)
    });
    
    // 회전 복구
    setTimeout(() => {
      rotateZ.value = withTiming(0, {
        duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.REVERSE_DURATION_MS / 3,
        easing: Easing.inOut(Easing.cubic)
      });
    }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.STEP_DELAY_MS);
    
    // 스케일 복구
    setTimeout(() => {
      scale.value = withTiming(1, {
        duration: DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.REVERSE_DURATION_MS / 3,
        easing: Easing.out(Easing.cubic)
      });
      
      // 결과 표시
      setTimeout(() => {
        setSaveAnimationStep('showing_result');
        
        // 애니메이션 완료 후 idle 상태로 복구
        setTimeout(() => {
          setSaveAnimationStep('idle');
        }, 1000);
      }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.STEP_DELAY_MS);
    }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.STEP_DELAY_MS * 2);
  }, [scale, rotateZ, translateY, setSaveAnimationStep]);

  // 저장 애니메이션 시퀀스 처리
  useEffect(() => {
    if (saveAnimationStep === 'saving') {
      startSaveAnimation();
    } else if (saveAnimationStep === 'reversing') {
      startReverseAnimation();
    }
  }, [saveSequenceId, saveAnimationStep, startSaveAnimation, startReverseAnimation]);

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