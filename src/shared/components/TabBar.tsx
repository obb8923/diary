import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useActiveTab, useNavigateToTab, TabName } from '../store/tabStore';

// SVG 아이콘 import
import PencilIcon from '../../../assets/svgs/Pencil.svg';
import CalendarIcon from '../../../assets/svgs/Calendar.svg';
import DotsIcon from '../../../assets/svgs/Dots.svg';

// 탭 정보 타입
interface TabInfo {
  name: TabName;
  icon: React.ComponentType<any>;
}

// 탭 정보 배열
const tabs: TabInfo[] = [
  { name: 'Home', icon: PencilIcon },
  { name: 'Calendar', icon: CalendarIcon },
  { name: 'Profile', icon: DotsIcon },
];

export const TabBar = () => {
  const activeTab = useActiveTab();
  const navigateToTab = useNavigateToTab();

  const handleTabPress = (tabName: TabName) => {
    navigateToTab(tabName);
  };

  return (
    <View className="absolute bottom-8 self-center flex-row bg-background border border-4 border-line rounded-full shadow-lg px-6 py-3">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.name}
            className={`items-center justify-center w-12 h-12 rounded-full mx-2 ${
              isActive ? 'bg-black' : 'bg-transparent'
            }`}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Icon 
              width={22} 
              height={22} 
              stroke={isActive ? 'white' : 'black'}
              fill="none"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
