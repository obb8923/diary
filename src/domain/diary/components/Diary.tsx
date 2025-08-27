import React, { useEffect, useState } from "react"
import { Keyboard, Dimensions, TouchableWithoutFeedback, View } from "react-native"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useAnimationStore } from "@store/animationStore"
import { DiaryCover } from "@/domain/diary/components/DiaryCover"
import { DiaryPaper } from "@/domain/diary/components/DiaryPaper"

const { height } = Dimensions.get('window')

export const Diary = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 애니메이션용 공유 값
  const rotateProgress = useSharedValue(0)
  const moveProgress = useSharedValue(0)
  const spreadProgress = useSharedValue(0)
  const scaleProgress = useSharedValue(0.4) // 처음에는 축소된 상태 (40%)

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -((height - 100) * moveProgress.value)
    const rotate = `${rotateProgress.value * 180}deg`
    const scale = (1 + 0.03 * spreadProgress.value) * scaleProgress.value
    return {
      transform: [
        { translateY },
        { rotate },
        { scale },
      ],
    }
  })

  const { saveSequenceId, runSave, startClosing, startOpening } = useAnimationStore()

  const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))
  
  // 터치 시 원래 크기로 복원 로직
  const handlePress = async () => {
    if (isExpanded) return // 이미 확장된 상태라면 무시
    
    setIsExpanded(true)
    
    // 1. 커버 열기
    startOpening()
    
    // 2. 0.3초 대기
    await sleep(300)
    
    // 3. 원래 크기(전체화면)로 복원
    scaleProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
  }
  const waitTiming = (sv: SharedValue<number>, to: number, duration: number) => new Promise<void>((resolve) => {
    sv.value = withTiming(to, { duration, easing: Easing.inOut(Easing.cubic) }, () => {
      runOnJS(resolve)()
    })
  })

  // useEffect(() => {
  //   if (!saveSequenceId || !runSave) return

  //   let isCancelled = false

  //   const run = async () => {
  //     const startedAt = Date.now()
  //     try {
  //       // 0. 저장 시작 (비동기 병렬)
  //       const savePromise = runSave()
  //       // 1. 키보드 닫기
  //       Keyboard.dismiss()
  //       // 2. 커버 닫기
  //       startClosing()
  //       await sleep(520)
  //       if (isCancelled) return

  //       // 3. 일기를 180도 회전 + 위로 이동 (동시)
  //       await Promise.all([
  //         waitTiming(rotateProgress, 1, 500),
  //         waitTiming(moveProgress, 1, 500),
  //       ])
  //       if (isCancelled) return

  //       // 4. 일기 펼치기
  //       await waitTiming(spreadProgress, 1, 320)
  //       if (isCancelled) return

  //       // 5. 저장 완료까지 대기 (최소 0.5초)
  //       try { await savePromise } catch {}
  //       const elapsed = Date.now() - startedAt
  //       if (elapsed < 500) await sleep(500 - elapsed)
  //       if (isCancelled) return

  //       // 6. 일기 닫기
  //       await waitTiming(spreadProgress, 0, 320)
  //       if (isCancelled) return

  //       // 7. 회전/위치 원복 (동시)
  //       await Promise.all([
  //         waitTiming(rotateProgress, 0, 500),
  //         waitTiming(moveProgress, 0, 500),
  //       ])
  //       if (isCancelled) return

  //       // 8. 커버 열기
  //       startOpening()
  //     } catch (e) {
  //       // 실패 시에도 커버는 열어 UX 회복
  //       startOpening()
  //     }
  //   }

  //   run()
  //   return () => { isCancelled = true }
  // }, [saveSequenceId, runSave, startClosing, startOpening])

  return (
      <Animated.View 
      // style={animatedStyle} 
      className='w-full h-full border border-line'
      onTouchEnd={handlePress}
      >
        <DiaryPaper />
        <DiaryCover />
      </Animated.View>
  )
}