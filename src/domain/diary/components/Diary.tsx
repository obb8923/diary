import React, { useEffect, useState } from "react"
import { Keyboard, Dimensions, TouchableWithoutFeedback, View } from "react-native"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useAnimationStore } from "@store/animationStore"
import { DiaryCover } from "@/domain/diary/components/DiaryCover"
import { DiaryPaper } from "@/domain/diary/components/DiaryPaper"


export const Diary = () => {
  return (
      <Animated.View 
      // style={animatedStyle} 
      className='w-full h-full border border-line'
      >
        <DiaryPaper />
        <DiaryCover />
      </Animated.View>
  )
}