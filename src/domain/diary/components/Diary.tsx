import React, { useEffect } from "react"
import { View, Keyboard, Dimensions } from "react-native"
import { Text } from "@components/Text"
import { TextBox } from "@components/TextBox"
import { WeatherSelector } from "../../../shared/components/WeatherSelector"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import { formatSelectedDate } from "../../../shared/libs/date"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import { useAnimationStore } from "@store/animationStore"
import { DiaryCover } from "@/domain/diary/components/DiaryCover"

const { height } = Dimensions.get('window')

export const Diary = () => {
  
  // useDiary 훅으로 상태와 액션 가져오기 (자동으로 init 처리됨)
  const { currentDate, isDiaryWrittenToday } = useDiary();  
  const { year, month, day } = formatSelectedDate(currentDate);

  // 애니메이션용 공유 값
  const rotateProgress = useSharedValue(0)
  const moveProgress = useSharedValue(0)
  const spreadProgress = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -((height - 100) * moveProgress.value)
    const rotate = `${rotateProgress.value * 180}deg`
    const scale = 1 + 0.03 * spreadProgress.value
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
  const waitTiming = (sv: SharedValue<number>, to: number, duration: number) => new Promise<void>((resolve) => {
    sv.value = withTiming(to, { duration, easing: Easing.inOut(Easing.cubic) }, () => {
      runOnJS(resolve)()
    })
  })

  useEffect(() => {
    if (!saveSequenceId || !runSave) return

    let isCancelled = false

    const run = async () => {
      const startedAt = Date.now()
      try {
        // 0. 저장 시작 (비동기 병렬)
        const savePromise = runSave()
        // 1. 키보드 닫기
        Keyboard.dismiss()
        // 2. 커버 닫기
        startClosing()
        await sleep(520)
        if (isCancelled) return

        // 3. 일기를 180도 회전 + 위로 이동 (동시)
        await Promise.all([
          waitTiming(rotateProgress, 1, 500),
          waitTiming(moveProgress, 1, 500),
        ])
        if (isCancelled) return

        // 4. 일기 펼치기
        await waitTiming(spreadProgress, 1, 320)
        if (isCancelled) return

        // 5. 저장 완료까지 대기 (최소 0.5초)
        try { await savePromise } catch {}
        const elapsed = Date.now() - startedAt
        if (elapsed < 500) await sleep(500 - elapsed)
        if (isCancelled) return

        // 6. 일기 닫기
        await waitTiming(spreadProgress, 0, 320)
        if (isCancelled) return

        // 7. 회전/위치 원복 (동시)
        await Promise.all([
          waitTiming(rotateProgress, 0, 500),
          waitTiming(moveProgress, 0, 500),
        ])
        if (isCancelled) return

        // 8. 커버 열기
        startOpening()
      } catch (e) {
        // 실패 시에도 커버는 열어 UX 회복
        startOpening()
      }
    }

    run()
    return () => { isCancelled = true }
  }, [saveSequenceId, runSave, startClosing, startOpening])

  return (
    <Animated.View style={animatedStyle} className='w-full h-full border border border-line'>
        {/* 날짜, 날씨 영역 */}
        <View className="flex-row items-center justify-center border-b border-line p-2">
          <View className="flex-row items-center justify-end flex-1">
          <Text text={`${year}`} type="kb2019" className="text-text-black text-xl"/>
          <Text text=' 년  ' type="black" className="text-text-black text-xl"/>
          <Text text={`${month}`} type="kb2019" className="text-text-black text-xl"/>
          <Text text=' 월  ' type="black" className="text-text-black text-xl"/>
          <Text text={`${day}`} type="kb2019" className="text-text-black text-xl"/>
          <Text text=' 일  ' type="black" className="text-text-black text-xl"/>
          </View>
          <View className="flex-row items-center justify-start w-5/12">
          <WeatherSelector />
          </View>
        </View>
        
        <View className="flex-1">
          <TextBox />
        </View>

        {isDiaryWrittenToday ? (
          <View
            className="absolute inset-0 z-50"
            pointerEvents="auto"
            // 하위 터치 차단용
            onStartShouldSetResponder={() => true}
          />
        ) : null}
        {/* 덮개: Diary와 함께 회전/이동하도록 내부에 둠 */}
        <DiaryCover />
    </Animated.View>
  )
}