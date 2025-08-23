import { View, Text } from "react-native"
import { Background } from "@components/Background" 
export const ProfileScreen = () => {
  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
      <View className="flex-1 items-center justify-center">
        <Text>Profile</Text>
      </View>
    </Background>
  )
}