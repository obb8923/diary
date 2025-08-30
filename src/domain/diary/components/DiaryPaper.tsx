import React from 'react'
import { View } from 'react-native'
import { Text } from '@components/Text'
import { TextBox } from '@components/TextBox'
import { WeatherSelector } from './WeatherSelector'
import { useDiary } from '../../../shared/libs/hooks/useDiary'
import { formatSelectedDate } from '../../../shared/libs/date'

export const DiaryPaper = () => {
  const { currentDate, isDiaryWrittenToday } = useDiary()
  const { year, month, day } = formatSelectedDate(currentDate)
  const dateStyle: string = 'text-text-black text-2xl'
  return (
    <View className='flex-1'>
      {/* 날짜, 날씨 영역 */}
      <View className="flex-row items-center justify-center border-b border-line p-2">
        <View className="flex-row items-center justify-end flex-1">
          <Text text={`${year}`} type="kb2019" className={dateStyle}/>
          <Text text=' 년  ' type="black" className={dateStyle}/>
          <Text text={`${month}`} type="kb2019" className={dateStyle}/>
          <Text text=' 월  ' type="black" className={dateStyle}/>
          <Text text={`${day}`} type="kb2019" className={dateStyle}/>
          <Text text=' 일  ' type="black" className={dateStyle}/>
        </View>
        <View className="flex-row items-center justify-start w-5/12">
          <WeatherSelector textStyle={dateStyle} />
        </View>
      </View>

      <View className="flex-1">
        <TextBox />
      </View>

      {isDiaryWrittenToday ? (
        <View
          className="absolute inset-0 z-50"
          pointerEvents="auto"
          onStartShouldSetResponder={() => true}
        />
      ) : null}
    </View>
  )
}


