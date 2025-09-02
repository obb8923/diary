import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EtcScreen } from "@etc/screen/EtcScreen";
import { WebViewScreen } from "@etc/screen/WebViewScreen";

const Stack = createNativeStackNavigator<EtcStackParamList>();
export type EtcStackParamList = {
  Etc: undefined;
  // UserInfo: undefined;
  // TermsOfService: undefined;
  // PrivacyPolicy: undefined;
  WebView: {
    url: string;
    title?: string;
  };
};

export const EtcStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Etc" component={EtcScreen} />
      {/* <Stack.Screen name="UserInfo" component={UserInfoScreen} /> */}
    
      <Stack.Screen name="WebView" component={WebViewScreen} />
    </Stack.Navigator>
  );
};