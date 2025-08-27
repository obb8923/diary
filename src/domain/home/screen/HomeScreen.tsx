import React from 'react';
import { Background } from '@components/Background';
import { Diary } from '@domain/home/components/Diary';
import { DiaryCover } from '@components/DiaryCover';

export const HomeScreen = () => {
  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
      <DiaryCover />
      <Diary />
    </Background>
  );
}