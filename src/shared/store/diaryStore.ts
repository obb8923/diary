import { create } from 'zustand';
import { WeatherNumber } from '../constants/normal';

interface DiaryStore {
  // 현재 작성 중인 일기 상태
  currentDate: Date;
  currentContent: string;
  currentWeather: WeatherNumber; 
  isToday: boolean;
  // UI 상태
  isLoading: boolean;
  error: string | null;
  
  // 액션들
  setCurrentDate: (date: Date) => void;
  setCurrentContent: (content: string) => void;
  setCurrentWeather: (weather: WeatherNumber) => void;
  setIsToday: (isToday: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  // 초기 상태
  currentDate: new Date(),
  currentContent: '',
  currentWeather: 0,
  isToday: false,
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
  
  setIsToday: (isToday: boolean) => {
    set({ isToday });
  },
  
  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
}));