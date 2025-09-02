import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@components/Text';
import { CalendarBottomPanel } from './CalendarBottomPanel';
import { DiaryEntry } from '@/shared/types/diary';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  selectedDiary?: DiaryEntry | null | undefined;
}

export const Calendar = ({ onDateSelect, selectedDate, selectedDiary }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 월의 첫 번째 날을 가져오기
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  
  // 월의 마지막 날을 가져오기
  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  
  // 월의 첫 번째 날이 무슨 요일인지 가져오기 (0: 일요일)
  const getFirstDayOfWeek = (date: Date) => {
    return getFirstDayOfMonth(date).getDay();
  };
  
  // 캘린더 주별 구조로 날짜 배열 생성
  const generateCalendarWeeks = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const firstDayOfWeek = getFirstDayOfWeek(currentDate);
    const daysInMonth = lastDay.getDate();
    
    const weeks = [];
    let currentWeek = [];
    
    // 이전 달의 마지막 날들로 빈 공간 채우기
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      
      // 주말(토요일)이거나 마지막 날이면 주를 완성
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }
    
    // 마지막 주가 7일이 안 되면 다음 달 날짜로 채우기
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };
  
  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };
  
  // 날짜가 선택된 날짜인지 확인
  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };
  
  // 오늘 날짜인지 확인
  const isDiaryWrittenToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };
  
  // 요일에 따른 텍스트 색상 결정
  const getDateTextColor = (date: Date, dayIndex: number) => {
    if (isSelectedDate(date)) {
      return 'text-white';
    }
    if (isDiaryWrittenToday(date)) {
      return 'text-blue-600 font-semibold';
    }
    if (dayIndex === 0) { // 일요일
      return 'text-red-500';
    }
    if (dayIndex === 6) { // 토요일
      return 'text-blue-500';
    }
    return 'text-gray-800';
  };
  
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  
  const weeks = generateCalendarWeeks();
  
  return (
    <View className="bg-background p-4 rounded-lg border-2 border-line mb-32">
      {/* 헤더 - 월/년 표시 및 네비게이션 */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={goToPreviousMonth}
          className="p-2"
        >
          <Text text="‹" type="semibold" className="text-xl text-gray-600" />
        </TouchableOpacity>
        
        <Text text={`${currentDate.getFullYear()}년 ${monthNames[currentDate.getMonth()]}`} type="semibold" className="text-lg text-text-black" />
        
        <TouchableOpacity
          onPress={goToNextMonth}
          className="p-2"
        >
          <Text text="›" type="semibold" className="text-xl text-gray-600" />
        </TouchableOpacity>
      </View>
      
      {/* 요일 헤더 */}
      <View className="flex-row mb-3">
        {dayNames.map((day, index) => (
          <View key={index} className="flex-1 items-center py-2">
            <Text text={day} type="semibold" className={`text-sm font-medium ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`} />
          </View>
        ))}
      </View>
      
      {/* 캘린더 그리드 - 주별로 구성 */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
          {week.map((date, dayIndex) => (
            <View key={dayIndex} className="flex-1 h-12 justify-center items-center">
              {date ? (
                <TouchableOpacity
                  onPress={() => handleDateSelect(date)}
                  className={`w-10 h-10 justify-center items-center rounded-lg ${
                    isSelectedDate(date)
                      ? 'bg-blue-500'
                      : isDiaryWrittenToday(date)
                      ? 'bg-blue-100'
                      : 'bg-transparent'
                  }`}
                >
                  <Text text={date.getDate().toString()} type="semibold" className={getDateTextColor(date, dayIndex)} />
                </TouchableOpacity>
              ) : (
                <View className="w-10 h-10" />
              )}
            </View>
          ))}
        </View>
      ))}
      
      {/* CalendarBottomPanel 추가 */}
      <CalendarBottomPanel
        selectedDate={selectedDate || null}
        selectedDiary={selectedDiary}
      />
    </View>
  );
};
