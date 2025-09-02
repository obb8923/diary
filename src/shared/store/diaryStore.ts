import { create } from 'zustand';
import { WeatherNumber } from '../constants/Weather';

interface DiaryStore {
  // 현재 작성 중인 일기 상태
  currentDate: Date;
  currentContent: string;
  currentWeather: WeatherNumber; 
  currentComment: string; 
  currentFlowerIndex?: number; // 1~4
  isDiaryWrittenToday: boolean;
  // UI 상태
  isLoading: boolean;
  error: string | null;
  
  // 액션들
  setCurrentDate: (date: Date) => void;
  setCurrentContent: (content: string) => void;
  setCurrentWeather: (weather: WeatherNumber) => void;
  setCurrentComment: (comment: string) => void; 
  setCurrentFlowerIndex: (index: number | undefined) => void;
  setisDiaryWrittenToday: (isDiaryWrittenToday: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  // 초기 상태
  currentDate: new Date(),
  currentContent: '',
  currentWeather: 0,
  currentComment: '', // AI 코멘트 초기값 추가
  currentFlowerIndex: undefined,
  isDiaryWrittenToday: false,
  isLoading: false,
  error: null,
  
  // 현재 상태 설정
  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
  },
  
  setCurrentContent: (content: string) => {
    set({ currentContent: content });
  },
  
  setCurrentWeather: (weather: WeatherNumber) => {
    set({ currentWeather: weather });
  },
  
  setCurrentComment: (comment: string) => {
    set({ currentComment: comment });
  },
  
  setCurrentFlowerIndex: (index?: number) => {
    set({ currentFlowerIndex: index });
  },
  
  setisDiaryWrittenToday: (isDiaryWrittenToday: boolean) => {
    set({ isDiaryWrittenToday });
  },
  
  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
}));