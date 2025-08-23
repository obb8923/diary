import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Background } from '@components/Background';
import { Calendar } from '../components/Calendar';

export const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const formatSelectedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <Background isStatusBarGap={true} isTabBarGap={true}>
      <ScrollView className="flex-1 px-4 py-6">
        {/* 헤더 */}
        <View className="mb-6">
          <Text className="text-2xl font-p-semibold text-text-black mb-2">
            캘린더
          </Text>
          {selectedDate && (
            <Text className="text-base text-gray-600">
              선택된 날짜: {formatSelectedDate(selectedDate)}
            </Text>
          )}
        </View>

        {/* 캘린더 컴포넌트 */}
        <Calendar
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />

        {/* 선택된 날짜 정보 */}
        {selectedDate && (
          <View className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Text className="text-lg font-p-semibold text-blue-800 mb-2">
              {formatSelectedDate(selectedDate)}
            </Text>
            <Text className="text-sm text-blue-600">
              이 날짜에 일기를 작성해보세요!
            </Text>
          </View>
        )}
      </ScrollView>
    </Background>
  );
};