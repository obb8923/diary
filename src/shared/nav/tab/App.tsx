import React from 'react';
import {CalendarStack} from '../stack/Calendar';
import {HomeStack} from '../stack/Home';
import {ProfileStack} from '../stack/Profile';
import { useActiveTab } from '../../store/tabStore';

export const AppTab = () => {
  const activeTab = useActiveTab();

  // 현재 활성화된 탭에 따라 해당 스택을 렌더링
  switch (activeTab) {
    case 'Home':
      return <HomeStack />;
    case 'Calendar':
      return <CalendarStack />;
    case 'Profile':
      return <ProfileStack />;
    default:
      return <HomeStack />; // 기본값으로 Home 스택 렌더링
  }
};


