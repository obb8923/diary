import { View, TouchableOpacity } from "react-native"
import { Text } from "@components/Text"
import { TextBox } from "@components/TextBox"
import { WeatherSelector } from "../../../shared/components/WeatherSelector"
import { useDiary } from "../../../shared/libs/hooks/useDiary"

export const Diary = () => {
  
  // useDiary 훅으로 상태와 액션 가져오기 (자동으로 init 처리됨)
  const { currentDate, currentContent, setCurrentContent } = useDiary();
  
  // 선택된 날짜를 포맷팅
  const formatSelectedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return { year, month, day };
  };
  
  const { year, month, day } = formatSelectedDate(currentDate);
  
  const handleContentChange = (text: string) => {
    setCurrentContent(text);
  };

  return (
    <View className='w-full h-full border border border-line'>
        {/* 날짜, 날씨 영역 */}
        <View className="flex-row items-center justify-center border-b border-line p-2">
          <TouchableOpacity onPress={()=>{}}>
            <Text text={`${year}년 ${month}월 ${day}일   날씨:`} type="black" className="text-text-black-2 text-xl underline"/>
          </TouchableOpacity>
          <WeatherSelector />
        </View>
        
        <TextBox 
          value={currentContent}
          onChangeText={handleContentChange}
          placeholder="오늘 하루는 어땠나요? 자유롭게 적어보세요..."
        />
    </View>
  )
}