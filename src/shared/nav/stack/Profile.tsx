import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "@Profile/screen/ProfileScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();
export type ProfileStackParamList = {
  Profile: undefined;
  // UserInfo: undefined;
  // TermsOfService: undefined;
  // PrivacyPolicy: undefined;
  // WebView: {
  //   url: string;
  // };
};

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* <Stack.Screen name="UserInfo" component={UserInfoScreen} /> */}
    
      {/* <Stack.Screen name="WebView" component={WebViewScreen} /> */}
    </Stack.Navigator>
  );
};