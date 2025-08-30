import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useActiveTab, TabName, useSetActiveTab } from '@store/tabStore';
import { useDiary } from '@libs/hooks/useDiary';
// SVG 아이콘 import
import PencilIcon from '@assets/svgs/Pencil.svg';
import CalendarIcon from '@assets/svgs/Calendar.svg';
import DotsIcon from '@assets/svgs/Dots.svg';
import {Colors} from '@constants/Colors';

// 탭 정보 타입
interface TabInfo {
  name: TabName;
  icon: React.ComponentType<any>;
}

// 탭 정보 배열
const tabs: TabInfo[] = [
  { name: 'Diary', icon: PencilIcon },
  { name: 'Calendar', icon: CalendarIcon },
  // { name: 'Profile', icon: DotsIcon },
];

export const TabBar = () => {
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();
  const { error: diaryError } = useDiary();
  const geminiError = null; // 훅 내부에서 처리되므로 외부 에러 합산 제거

  const handleTabPress = (tabName: TabName) => {
    setActiveTab(tabName);
  };
  
  // 에러가 있으면 Alert로 표시
  useEffect(() => {
    const error = diaryError || geminiError;
    if (error) {
      Alert.alert(
        '오류가 발생했어요', 
        error,
        [
          { text: '확인', onPress: () => {} }
        ]
      );
    }
  }, [diaryError, geminiError]);

  return (
    // 전체 컨테이너 (위치)
    <View className="w-11/12 flex-row justify-between items-center absolute bottom-12 px-16">
      {/* 탭 컨테이너 */}
    <View className="w-5/12 flex-row bg-blue-500 rounded-full px-3 py-2 items-center justify-evenly">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.name}
            className={`items-center justify-center w-12 h-12 rounded-full ${
              isActive ? 'bg-background' : 'bg-transparent'
            }`}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Icon 
              width={22} 
              height={22} 
              color={isActive ? Colors.blue500 : Colors.background}
            />
          </TouchableOpacity>
        );
      })}
      </View>
    </View>
  );
};
