import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Modal, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from '@components/Text'
import { TextBox } from '@components/TextBox'
import { WeatherSelector } from './WeatherSelector'
import { useDiary } from '../../../shared/libs/hooks/useDiary'
import { formatSelectedDate } from '../../../shared/libs/date'
import { useAnimationStore } from '@store/animationStore'
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation'
import { dateStyle } from '@constants/normal'

export const DiaryPaper = () => {
  const { currentDate, isDiaryWrittenToday, changeDate } = useDiary()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { year, month, day } = formatSelectedDate(currentDate)
  
  // 저장 시퀀스 관련 상태
  const { saveSequenceId, saveAnimationStep, runSave, setSaveAnimationStep } = useAnimationStore()
  
  // 날짜 선택 처리
  const handleDatePress = () => {
    setShowDatePicker(true)
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      changeDate(selectedDate)
    }
    
    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowDatePicker(false)
    }
  }

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
        <TouchableOpacity 
          onPress={handleDatePress}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Text text={`${year}`} type="kb2019" className={dateStyle}/>
          <Text text=' 년  ' type="black" className={dateStyle}/>
          <Text text={`${month}`} type="kb2019" className={dateStyle}/>
          <Text text=' 월  ' type="black" className={dateStyle}/>
          <Text text={`${day}`} type="kb2019" className={dateStyle}/>
          <Text text=' 일  ' type="black" className={dateStyle}/>
        </TouchableOpacity>
        <WeatherSelector textStyle={dateStyle} disabled={isDiaryWrittenToday} />
      </View>

      {/* 날짜 선택기 */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text text="취소" type="regular" className="text-blue-500 text-lg" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text text="완료" type="regular" className="text-blue-500 text-lg font-semibold" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )
      )}
      {/* 일기장 내용 - 실제 글을 작성하는 영역 */}
      <View className="flex-1">
        <TextBox />
      </View>
      
   
    </View>
  )
}


