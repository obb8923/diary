import { View } from "react-native"
import { Text } from "@components/Text"
import { TextBox } from "@components/TextBox"
import { WeatherSelector } from "../../../shared/components/WeatherSelector"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import { formatSelectedDate } from "../../../shared/libs/date"

export const Diary = () => {
  
  // useDiary 훅으로 상태와 액션 가져오기 (자동으로 init 처리됨)
  const { currentDate, isDiaryWrittenToday } = useDiary();  
  const { year, month, day } = formatSelectedDate(currentDate);

  return (
    <View className='w-full h-full border border border-line'>
        {/* 날짜, 날씨 영역 */}
        <View className="flex-row items-center justify-center border-b border-line p-2">
          <Text text={`${year}`} type="kb2019" className="text-text-black text-xl"/>
          <Text text=' 년  ' type="black" className="text-text-black text-xl"/>

          <Text text={`${month}`} type="kb2019" className="text-text-black text-xl"/>
          <Text text=' 월  ' type="black" className="text-text-black text-xl"/>
          <Text text={`${day}`} type="kb2019" className="text-text-black text-xl"/>
          <Text text=' 일  ' type="black" className="text-text-black text-xl"/>
          <Text text='날씨:  ' type="black" className="text-text-black text-xl"/>
          <WeatherSelector />
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
    </View>
  )
}