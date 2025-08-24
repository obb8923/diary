export interface DiaryEntry {
  weather: number; // 0~5
  content: string;
  comment: string;
  flowerIndex?: number; // 1~6 중 하나 (저장 이미지 선택)
}

export interface GeminiResponse {
  comment: string;
}
