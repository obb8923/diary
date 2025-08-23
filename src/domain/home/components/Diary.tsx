import { View, TouchableOpacity } from "react-native"
import { Text } from "@components/Text"
import { TextBox } from "@components/TextBox"
import { WeatherSelector } from "../../../shared/components/WeatherSelector"
import { useDiary } from "../../../shared/libs/hooks/useDiary"
import { formatSelectedDate } from "../../../shared/libs/date"

export const Diary = () => {
  
  // useDiary 훅으로 상태와 액션 가져오기 (자동으로 init 처리됨)
  const { currentDate, currentContent, isToday, setCurrentContent } = useDiary();  
  const { year, month, day } = formatSelectedDate(currentDate);

  return (
    <View className='w-full h-full border border border-line'>
        {/* 날짜, 날씨 영역 */}
        <View className="flex-row items-center justify-center border-b border-line p-2">
            <Text text={`${year}년 ${month}월 ${day}일   날씨: `} type="black" className="text-text-black text-xl"/>
          <WeatherSelector />
        </View>
        
        <TextBox 
          value={currentContent}
          onChangeText={(text)=>{
            setCurrentContent(text);
          }}
        />
    </View>
  )
}