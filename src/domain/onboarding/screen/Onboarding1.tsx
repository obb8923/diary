import { View } from "react-native"
import { Text } from "@/shared/components/Text"

export const Onboarding1Screen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <View className="absolute top-20 z-50">
        <Text text="하나일기" type="extrabold" className="text-textBlack text-3xl" />
      </View>
    </View>
  )
}