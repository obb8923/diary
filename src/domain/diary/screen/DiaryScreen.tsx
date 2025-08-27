import React from 'react';
import { Background } from '@components/Background';
import { Diary } from '@/domain/diary/components/Diary';

export const DiaryScreen = () => {
  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
          <Diary />
    </Background>
  );
}