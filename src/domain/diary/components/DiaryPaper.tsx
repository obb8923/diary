import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Text } from '@components/Text'
import { TextBox } from '@components/TextBox'
import { WeatherSelector } from './WeatherSelector'
import { useDiary } from '../../../shared/libs/hooks/useDiary'
import { formatSelectedDate } from '../../../shared/libs/date'
import { useAnimationStore } from '@store/animationStore'
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation'

export const DiaryPaper = () => {
  const { currentDate, isDiaryWrittenToday } = useDiary()
  const { year, month, day } = formatSelectedDate(currentDate)
  const dateStyle: string = 'text-text-black text-2xl'
  
  // 저장 시퀀스 관련 상태
  const { saveSequenceId, saveAnimationStep, runSave, setSaveAnimationStep } = useAnimationStore()
  
  // 저장 함수 실행 감지 및 처리
  useEffect(() => {
    const executeSave = async () => {
      if (saveAnimationStep === 'saving' && runSave) {
        const startTime = Date.now();
        try {
          await runSave();
          console.log('저장 완료!');
          
          // 최소 대기 시간 체크
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.MIN_WAIT_TIME_MS - elapsedTime);
          
          setTimeout(() => {
            // 저장 완료 후 역방향 애니메이션 시작 신호
            setSaveAnimationStep('reversing');
          }, remainingTime);
          
        } catch (error) {
          console.error('저장 실행 오류:', error);
          setSaveAnimationStep('idle');
        }
      }
    };
    
    executeSave();
  }, [saveSequenceId, saveAnimationStep, runSave, setSaveAnimationStep])
  return (
    <View className='flex-1'>
      {/* 날짜, 날씨 영역 */}
      <View className="flex-row items-center justify-center border-b border-line p-3">
          <Text text={`${year}`} type="kb2019" className={dateStyle}/>
          <Text text=' 년  ' type="black" className={dateStyle}/>
          <Text text={`${month}`} type="kb2019" className={dateStyle}/>
          <Text text=' 월  ' type="black" className={dateStyle}/>
          <Text text={`${day}`} type="kb2019" className={dateStyle}/>
          <Text text=' 일  ' type="black" className={dateStyle}/>
          <WeatherSelector textStyle={dateStyle} />
      </View>
      {/* 일기장 내용 - 실제 글을 작성하는 영역 */}
      <View className="flex-1">
        <TextBox />
      </View>
    </View>
  )
}


