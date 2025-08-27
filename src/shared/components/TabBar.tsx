import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useActiveTab, TabName, useSetActiveTab } from '@store/tabStore';
import { Button } from '@components/Button';
import { useDiary } from '@libs/hooks/useDiary';
import { useSaveDiaryFlow } from '@libs/hooks/useSaveDiaryFlow';
import { Text } from '@components/Text';
// SVG 아이콘 import
import PencilIcon from '@assets/svgs/Pencil.svg';
import CalendarIcon from '@assets/svgs/Calendar.svg';
import DotsIcon from '@assets/svgs/Dots.svg';
import {Colors} from '@constants/Colors';
import { getRandomInt } from '@libs/random';
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
  const { canSave, isSaving, save } = useSaveDiaryFlow();
  const geminiError = null; // 훅 내부에서 처리되므로 외부 에러 합산 제거

  const handleTabPress = (tabName: TabName) => {
    setActiveTab(tabName);
  };

  const handleSavePress = async () => {
    await save();
    Alert.alert(
      '저장 완료✨', 
      `하루하루의 기록이 큰 보물이 될 거에요`,
      [{ text: '확인', style: 'default' }]
    );
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
     {activeTab === 'Diary' && canSave && (
        <>                  
           <TouchableOpacity
            onPress={handleSavePress}
            className={`w-auto h-16 rounded-full px-4 py-2 justify-center items-center bg-blue-500`}
            >
            <Text 
              text={
                    isSaving ? "저장중..." : 
                    "다 적었어요!"
                  } 
              type="black" 
              className={`text-center font-extrabold text-md text-background`}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
