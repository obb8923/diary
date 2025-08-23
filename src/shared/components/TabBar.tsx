import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useActiveTab, useNavigateToTab, TabName } from '../store/tabStore';
import { Button } from './Button';
import { useDiary } from '../libs/hooks/useDiary';
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
  // { name: 'Profile', icon: DotsIcon },
];

export const TabBar = () => {
  const activeTab = useActiveTab();
  const navigateToTab = useNavigateToTab();
  const { saveDiary, isLoading, error } = useDiary();

  const handleTabPress = (tabName: TabName) => {
    navigateToTab(tabName);
  };

  const handleSavePress = async () => {
    try {
      // 일기 저장 실행
      await saveDiary();
      // 저장 성공 피드백
      Alert.alert(
        '저장 완료!', 
        '일기가 성공적으로 저장되었습니다. ✨',
        [{ text: '확인', style: 'default' }]
      );
      
    } catch (error) {
      // 에러는 store에서 이미 처리되므로 여기서는 추가 피드백만
      console.error('저장 오류:', error);
    }
  };
  
  // 에러가 있으면 Alert로 표시
  useEffect(() => {
    if (error) {
      Alert.alert(
        '저장 실패', 
        error,
        [
          { text: '확인', onPress: () => {} }
        ]
      );
    }
  }, [error]);

  return (
    <View className="absolute bottom-8 self-center flex-row bg-text-black/80  rounded-full shadow-lg px-6 py-3 items-center">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.name}
            className={`items-center justify-center w-12 h-12 rounded-full mx-2 ${
              isActive ? 'bg-white/20' : 'bg-transparent'
            }`}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <Icon 
              width={22} 
              height={22} 
              fill={isActive ? '#D1D5DB' : '#D1D5DB'}
              color={isActive ? 'black' : '#D1D5DB'}
            />
          </TouchableOpacity>
        );
      })}
      
      {/* Home 탭일 때만 구분선과 저장하기 버튼 표시 */}
      {activeTab === 'Home' && (
        <>
          {/* 구분선 */}
          <View className="w-px h-8 bg-gray-300 mx-3" />
          
          {/* 저장하기 버튼 */}
          <View className="justify-center items-center max-w-1/2"> 
          <Button
            text={isLoading ? "저장중..." : "다 적었어요"}
            onPress={handleSavePress}
            textType="black"
            className={`rounded-full w-auto px-4 ${isLoading ? 'opacity-50' : ''}`}
            textClassName="text-text-black"
            disabled={isLoading}
          />
          </View>
        </>
      )}
    </View>
  );
};
