import { WeatherNumber } from '../constants/Weather';

export interface DiaryEntry {
  weather: WeatherNumber; // 0~4
  content: string;
  comment: string;
  flowerIndex?: number; // 1~4 중 하나 (저장 이미지 선택)
}

export interface GeminiResponse {
  comment: string;
}
