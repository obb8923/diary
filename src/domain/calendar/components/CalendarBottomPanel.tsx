import React from 'react';
import { View, Text } from 'react-native';
import { DiaryPreview } from './DiaryPreview';
import { DiaryEntry } from '@/shared/types/diary';

interface CalendarBottomPanelProps {
  selectedDate: Date | null;
  selectedDiary: DiaryEntry | null | undefined;
}

export const CalendarBottomPanel = ({ 
  selectedDate, 
  selectedDiary 
}: CalendarBottomPanelProps) => {
  const formatSelectedDateLabel = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  if (!selectedDate) {
    return null;
  }

  return (
    <View className="mt-4 border-t border-line border-dashed">
      {selectedDiary ? (
        <DiaryPreview date={selectedDate} entry={selectedDiary} />
      ) : (
        <View className="p-4 rounded-lg">
          <Text className="text-lg font-p-semibold text-blue-800 mb-2">
            {formatSelectedDateLabel(selectedDate)}
          </Text>
          <Text className="text-md text-blue-600 font-p-medium">
            이 날짜에 일기를 작성해보세요!
          </Text>
        </View>
      )}
    </View>
  );
};
