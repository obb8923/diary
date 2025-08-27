import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "@/domain/diary/screen/HomeScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();
export type HomeStackParamList = {
  Home:undefined,  
}

export const HomeStack = () => {
  return (
    <Stack.Navigator 
    screenOptions={{headerShown:false}}
    initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen}/>
           
           </Stack.Navigator>
  );
};