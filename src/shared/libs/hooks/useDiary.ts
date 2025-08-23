import { useEffect, useCallback } from 'react';
import { useDiaryStore } from '../../store/diaryStore';
import { StorageService } from '../../services/storageService';
import { GeminiService } from '../../services/geminiService';
import { DiaryEntry } from '../../types/diary';
import { WeatherNumber } from '../../constants/normal';
import { formatDate } from '../date';


export const useDiary = () => {
  const store = useDiaryStore();
  
  // 초기화 로직
  useEffect(() => {
    const initializeDiary = async () => {
      try {
        const today = new Date();
        const todayString = formatDate(today);
        
        // 오늘 날짜의 일기가 있는지 확인
        const todayEntry = await StorageService.getDiary(todayString);
        
        if (todayEntry) {
          // 오늘 일기가 있으면 해당 내용으로 설정
          store.setCurrentDate(today);
          store.setCurrentContent(todayEntry.content);
          store.setCurrentWeather(todayEntry.weather as WeatherNumber);
          store.setIsToday(true);
        } 
        if(__DEV__) {
          console.log('다이어리가 초기화되었습니다. 오늘 날짜:', todayString);
        }
      } catch (error) {
        console.error('다이어리 초기화 오류:', error);
      }
    };
    
    initializeDiary();
  }, []); // 빈 의존성 배열로 한 번만 실행
  
  // 일기 저장 함수
  const saveDiary = useCallback(async () => {
    const { currentDate, currentContent, currentWeather } = store;
    
    store.setIsLoading(true);
    store.setError(null);
    
    try {
      if (!currentContent.trim()) {
        throw new Error('일기 내용을 입력해주세요.');
      }
      
      // Gemini API로 코멘트 생성
      const geminiResponse = await GeminiService.generateComment(currentContent);
      
      // 일기 엔트리 생성
      const dateString = formatDate(currentDate);
      
      const diaryEntry: DiaryEntry = {
        weather: currentWeather,
        content: currentContent.trim(),
        comment: geminiResponse.comment,
      };
      
      // AsyncStorage에 저장 (날짜를 키로 사용)
      await StorageService.saveDiary(dateString, diaryEntry);
      
      store.setIsLoading(false);
      
      if(__DEV__) {
        console.log('일기가 성공적으로 저장되었습니다:', diaryEntry);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '일기 저장 중 오류가 발생했습니다.';
      store.setError(errorMessage);
      store.setIsLoading(false);
      console.error('일기 저장 오류:', error);
    }
  }, [store]);
  
  return {
    // 상태
    currentDate: store.currentDate,
    currentContent: store.currentContent,
    currentWeather: store.currentWeather,
    isLoading: store.isLoading,
    error: store.error,
    
    // 액션
    setCurrentDate: store.setCurrentDate,
    setCurrentContent: store.setCurrentContent,
    setCurrentWeather: store.setCurrentWeather,
    saveDiary,
  };
};
