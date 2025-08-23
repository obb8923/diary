import { View } from "react-native"
import { Text } from "@components/Text"
import { getTodayDate } from "../../../shared/libs/date"
import { TextBox } from "@components/TextBox"
export const Diary = () => {
  const { year, month, day } = getTodayDate();
  
  return (
    <View className='w-full h-full border border border-line'>
        {/* 날짜, 날씨 영역 */}
        <View className="flex-row items-center justify-center border-b border-line p-2">
                <Text text={`${year}년 ${month}월 ${day}일   날씨:`} type="black" className="text-text-black-2 text-xl"/>
        </View>
        <TextBox />
    </View>
  )
}