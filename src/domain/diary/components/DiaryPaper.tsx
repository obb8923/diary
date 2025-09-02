import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Text } from '@components/Text'
import { TextBox } from '@components/TextBox'
import { WeatherSelector } from './WeatherSelector'
import { useDiary } from '../../../shared/libs/hooks/useDiary'
import { formatSelectedDate } from '../../../shared/libs/date'
import { useAnimationStore } from '@store/animationStore'
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation'
import { dateStyle, commentStyle } from '@constants/normal'

export const DiaryPaper = () => {
  const { currentDate, isDiaryWrittenToday } = useDiary()
  const { year, month, day } = formatSelectedDate(currentDate)
  
  // 저장 시퀀스 관련 상태
  const { saveSequenceId, saveAnimationStep, runSave, setSaveAnimationStep } = useAnimationStore()
  
  // 저장 함수 실행 감지 및 처리
  useEffect(() => {
    const executeSave = async () => {
      if (saveAnimationStep === 'saving' && runSave) {
        try {
          await runSave();
        } catch (error) {
          console.error('저장 실행 오류:', error);
          setSaveAnimationStep('idle');
        }
      }
    };
    
    executeSave();
  }, [saveSequenceId, saveAnimationStep, runSave, setSaveAnimationStep]);

  // 애니메이션 완료 후 대기 처리
  useEffect(() => {
    if (saveAnimationStep === 'waiting_for_result') {
      // 애니메이션이 완료된 후 최소 대기 시간 후 역방향 애니메이션 시작
      setTimeout(() => {
        setSaveAnimationStep('reversing');
      }, DIARY_ANIMATION_CONSTANTS.SAVE_ANIMATION.MIN_WAIT_TIME_MS);
    }
  }, [saveAnimationStep, setSaveAnimationStep]);
  return (
    <View className='flex-1 border border-line bg-background'>
      {/* 날짜, 날씨 영역 */}
      <View className="flex-row items-center justify-center border-b border-line p-3">
          <Text text={`${year}`} type="kb2019" className={dateStyle}/>
          <Text text=' 년  ' type="black" className={dateStyle}/>
          <Text text={`${month}`} type="kb2019" className={dateStyle}/>
          <Text text=' 월  ' type="black" className={dateStyle}/>
          <Text text={`${day}`} type="kb2019" className={dateStyle}/>
          <Text text=' 일  ' type="black" className={dateStyle}/>
          <WeatherSelector textStyle={dateStyle} disabled={isDiaryWrittenToday} />
      </View>
      {/* 일기장 내용 - 실제 글을 작성하는 영역 */}
      <View className="flex-1">
        <TextBox />
      </View>
      
      {/* 일기가 이미 작성된 경우 모든 상호작용을 차단하는 투명한 오버레이 */}
      {isDiaryWrittenToday && (
        <View 
          className="absolute inset-0 z-30"
          pointerEvents="auto"
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </View>
  )
}


