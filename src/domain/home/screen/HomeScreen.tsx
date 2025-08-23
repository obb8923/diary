import React from 'react';
import { View ,Text as RNText } from 'react-native';
import Right from '@assets/svgs/ChevronRight.svg';
import { Background } from '@components/Background';
import { Text } from '@components/Text';
import { Diary } from '@domain/home/components/Diary';

export const HomeScreen = () => {
  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
      <View className="flex-1 items-center justify-center">
      <Diary />
      </View>
    </Background>
  );
}