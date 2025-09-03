import "./global.css"
import React, { useEffect } from 'react';
import { StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {RootStack} from './src/shared/nav/stack/Root';
import { useFirstVisitStore } from './src/shared/store/firstVisitStore';
// import {OnboardingStack} from '@nav/stack/Onboarding';
export default function App() {
  const { checkFirstVisit } = useFirstVisitStore();

  // 앱 시작 시 첫 방문 여부 확인
  useEffect(() => {
    checkFirstVisit();
  }, [checkFirstVisit]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}} edges={[ 'left', 'right']} >
              <NavigationContainer>
                <StatusBar barStyle="dark-content" translucent={true}/>
                {/* {!isLoading && isFirstVisit && <OnboardingStack/>} */}
                {/* {!isLoading && !isFirstVisit && <RootStack/>} */}
                <RootStack/>
              </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}