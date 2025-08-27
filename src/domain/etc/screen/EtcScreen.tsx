import { View, Text } from "react-native"
import { Background } from "@components/Background" 
export const EtcScreen = () => {
  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
      <View className="flex-1 items-center justify-center">
        <Text>Etc</Text>
      </View>
    </Background>
  )
}