import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useActiveTab, useNavigateToTab, TabName } from '../store/tabStore';

// 탭 정보 타입
interface TabInfo {
  name: TabName;
  label: string;
  icon?: string;
}

// 탭 정보 배열
const tabs: TabInfo[] = [
  { name: 'Home', label: '홈' },
  { name: 'Calendar', label: '캘린더' },
  { name: 'Profile', label: '프로필' },
];

export const TabBar = () => {
  const activeTab = useActiveTab();
  const navigateToTab = useNavigateToTab();

  const handleTabPress = (tabName: TabName) => {
    navigateToTab(tabName);
  };

  return (
    <View className="flex-row bg-white border-t border-gray-200 pb-5 pt-2.5 px-4 shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        
        return (
          <TouchableOpacity
            key={tab.name}
            className={`flex-1 items-center py-2 px-3 rounded-lg ${
              isActive ? 'bg-gray-100' : ''
            }`}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-medium ${
              isActive ? 'text-black font-semibold' : 'text-gray-600'
            }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
