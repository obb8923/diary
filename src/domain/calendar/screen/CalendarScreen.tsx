import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Background } from '@components/Background';
import { Calendar } from '../components/Calendar';
import { DiaryPreview } from '../components/DiaryPreview';
import { StorageService } from '@services/storageService';
import { DiaryEntry } from '@/shared/types/diary';
import { formatDate } from '@libs/date';
import {TabBar} from '@/shared/components/TabBar';

export const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null | undefined>(undefined);


  const formatSelectedDateLabel = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  useEffect(() => {
    const loadDiary = async () => {
      if (!selectedDate) {
        setSelectedDiary(undefined);
        return;
      }
      const key = formatDate(selectedDate);
      const entry = await StorageService.getDiary(key);
      setSelectedDiary(entry);
    };
    loadDiary();
  }, [selectedDate]);

  return (
    <Background isStatusBarGap={true} isTabBarGap={true} isImage={2}>
      <TabBar />

      <ScrollView className="flex-1 px-4 py-6">
        {/* 캘린더 컴포넌트 */}
        <Calendar
          onDateSelect={(date) => setSelectedDate(date)}
          selectedDate={selectedDate}
        />

        {/* 선택된 날짜 정보 */}
        {selectedDate && (
          <View className="mt-6">
            {selectedDiary ? (
              <DiaryPreview date={selectedDate} entry={selectedDiary} />
            ) : (
              <View className="p-4 bg-blue-50 rounded-lg">
                <Text className="text-lg font-p-semibold text-blue-800 mb-2">
                  {formatSelectedDateLabel(selectedDate)}
                </Text>
                <Text className="text-sm text-blue-600">
                  이 날짜에 일기를 작성해보세요!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Background>
  );
};