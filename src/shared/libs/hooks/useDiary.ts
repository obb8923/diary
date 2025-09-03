import { useEffect, useCallback } from 'react';
import { useDiaryStore } from '../../store/diaryStore';
import { StorageService } from '../../services/storageService';
import { DiaryEntry } from '../../types/diary';
import { WeatherNumber } from '../../constants/Weather';
import { formatDate } from '../date';


export const useDiary = () => {
  const store = useDiaryStore();
  const initializeDiary = async (targetDate?: Date) => {
    try {
      const dateToUse = targetDate || new Date();
      const dateString = formatDate(dateToUse);
      
      // 해당 날짜의 일기가 있는지 확인
      const diaryEntry = await StorageService.getDiary(dateString);
      
      if (diaryEntry) {
        // 일기가 있으면 해당 내용으로 설정
        store.setCurrentDate(dateToUse);
        store.setCurrentContent(diaryEntry.content);
        store.setCurrentWeather(diaryEntry.weather as WeatherNumber);
        store.setCurrentComment(diaryEntry.comment || ''); // AI 코멘트도 설정
        store.setCurrentFlowerIndex(diaryEntry.flowerIndex);
        store.setisDiaryWrittenToday(true);
      } else {
        // 일기가 없으면 해당 날짜로 새로운 일기 상태로 설정
        store.setCurrentDate(dateToUse);
        store.setCurrentContent('');
        store.setCurrentWeather(0);
        store.setCurrentComment('');
        store.setCurrentFlowerIndex(1);
        store.setisDiaryWrittenToday(false);
      }
      
      if(__DEV__) {
        console.log('다이어리가 초기화되었습니다. 날짜:', dateString);
      }
    } catch (error) {
      console.error('다이어리 초기화 오류:', error);
    }
  };
  // 초기화 로직 - 처음 한 번만 오늘 날짜로 초기화
  useEffect(() => {
    // 현재 날짜가 초기값(오늘)이고 내용이 비어있을 때만 초기화
    const today = new Date();
    const currentDateString = formatDate(store.currentDate);
    const todayString = formatDate(today);
    
    // 초기 상태인지 확인 (오늘 날짜이고 내용이 비어있음)
    const isInitialState = currentDateString === todayString && 
                          !store.currentContent && 
                          !store.currentComment && 
                          !store.isDiaryWrittenToday;
    
    if (isInitialState) {
      initializeDiary();
    }
  }, []); // 빈 의존성 배열로 한 번만 실행
  
  // 일기 저장 함수
  const saveDiary = useCallback(async (comment: string, flowerIndex: number) => {
    const { currentDate, currentContent, currentWeather } = store;
    
    store.setIsLoading(true);
    store.setError(null);
    
    try {
      // 일기 엔트리 생성
      const dateString = formatDate(currentDate);
      
      const diaryEntry: DiaryEntry = {
        weather: currentWeather,
        content: currentContent.trim(),
        comment: comment,
        flowerIndex: flowerIndex,
      };
      
      // AsyncStorage에 저장 (날짜를 키로 사용)
      await StorageService.saveDiary(dateString, diaryEntry);
      
      // 현재 상태에도 저장
      store.setCurrentComment(comment);
      store.setCurrentFlowerIndex(flowerIndex);
      store.setisDiaryWrittenToday(true); // 저장 후 일기 작성 완료 상태로 변경
      
      store.setIsLoading(false);
      
      if(__DEV__) {
        console.log('일기가 성공적으로 저장되었습니다:', diaryEntry);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '일기 저장 중 오류가 발생했습니다.';
      store.setError(errorMessage);
      store.setIsLoading(false);
      console.error('일기 저장 오류:', error);
      throw error;
    }
  }, [store]);
  
  // 날짜 변경 함수 추가
  const changeDate = useCallback(async (newDate: Date) => {
    try {
      const dateString = formatDate(newDate);
      
      // 해당 날짜의 일기가 있는지 확인
      const diaryEntry = await StorageService.getDiary(dateString);
      
      // 날짜 설정
      store.setCurrentDate(newDate);
      
      if (diaryEntry) {
        // 일기가 있으면 기존 내용으로 설정
        store.setCurrentContent(diaryEntry.content);
        store.setCurrentWeather(diaryEntry.weather as WeatherNumber);
        store.setCurrentComment(diaryEntry.comment || '');
        store.setCurrentFlowerIndex(diaryEntry.flowerIndex);
        store.setisDiaryWrittenToday(true);
      } else {
        // 일기가 없으면 새로운 일기 상태로 초기화
        store.setCurrentContent('');
        store.setCurrentWeather(0); // 기본값: 맑음
        store.setCurrentComment('');
        store.setCurrentFlowerIndex(1);
        store.setisDiaryWrittenToday(false);
      }
      
      if(__DEV__) {
        console.log('날짜가 변경되었습니다:', dateString);
      }
    } catch (error) {
      console.error('날짜 변경 오류:', error);
    }
  }, [store]);
  
  return {
    // 상태
    currentDate: store.currentDate,
    currentContent: store.currentContent,
    currentWeather: store.currentWeather,
    currentComment: store.currentComment, // AI 코멘트 추가
    currentFlowerIndex: store.currentFlowerIndex,
    isDiaryWrittenToday: store.isDiaryWrittenToday,
    isLoading: store.isLoading,
    error: store.error,
    
    // 액션
    setCurrentDate: store.setCurrentDate,
    setCurrentContent: store.setCurrentContent,
    setCurrentWeather: store.setCurrentWeather,
    setCurrentComment: store.setCurrentComment, // AI 코멘트 설정 액션 추가
    setCurrentFlowerIndex: store.setCurrentFlowerIndex,
    initializeDiary,
    saveDiary,
    changeDate, // 새로 추가
  };
};
