import React, { useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useActiveTab, TabName, useSetActiveTab } from '@store/tabStore';
import { Button } from '@components/Button';
import { useDiary } from '@libs/hooks/useDiary';
import { useGemini } from '@libs/hooks/useGemini';
import { Text } from '@components/Text';
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
  { name: 'Home', icon: PencilIcon },
  { name: 'Calendar', icon: CalendarIcon },
  // { name: 'Profile', icon: DotsIcon },
];

export const TabBar = () => {
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();
  const { initializeDiary, saveDiary, isLoading, error: diaryError, currentContent,isDiaryWrittenToday } = useDiary();
  const { generateComment, isGenerating, error: geminiError } = useGemini();

  const handleTabPress = (tabName: TabName) => {
    setActiveTab(tabName);
  };

  const handleSavePress = async () => {
    try {
      // 단계 1: AI 코멘트 생성
      const comment = await generateComment(currentContent);
      // 단계 2: 일기 저장
      await saveDiary(comment);
      // 단계 3: 오늘 날짜 초기화
      await initializeDiary();
      // 저장 성공 피드백 (AI 코멘트 포함)
      Alert.alert(
        '저장 완료✨', 
        `하루하루의 기록이 큰 보물이 될 거에요`,
        [{ text: '확인', style: 'default' }]
      );
      
    } catch (error) {
      console.error('저장 오류:', error);
    }
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
    {/* 저장하기 버튼 */}
     {/* Home 탭일 때만 구분선과 저장하기 버튼 표시 */}
     {activeTab === 'Home' && currentContent.length > 10 && !isDiaryWrittenToday && (
        <>                  
           <TouchableOpacity
            onPress={handleSavePress}
            className={`w-auto h-16 rounded-full px-4 py-2 justify-center items-center bg-blue-500`}
            >
            <Text 
              text={
                    isGenerating ? "AI가 분석중..." :
                    isLoading ? "저장중..." : 
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
