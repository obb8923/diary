import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types/diary';

export class StorageService {
  private static readonly DIARY_KEY_PREFIX = '@diary_';
  
  /**
   * 일기를 저장합니다
   * @param date YYYY-MM-DD 형식
   * @param entry DiaryEntry 객체
   */
  static async saveDiary(date: string, entry: DiaryEntry): Promise<void> {
    try {
      const key = this.DIARY_KEY_PREFIX + date;
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('일기 저장 오류:', error);
      throw new Error('일기를 저장하는 중 오류가 발생했습니다.');
    }
  }
  
  /**
   * 특정 날짜의 일기를 가져옵니다
   * @param date YYYY-MM-DD 형식
   */
  static async getDiary(date: string): Promise<DiaryEntry | null> {
    try {
      const key = this.DIARY_KEY_PREFIX + date;
      const entryJson = await AsyncStorage.getItem(key);
      return entryJson ? JSON.parse(entryJson) : null;
    } catch (error) {
      console.error('일기 조회 오류:', error);
      return null;
    }
  }
  
  /**
   * 모든 일기를 가져옵니다 (날짜별 키 구조에서)
   */
  static async getAllDiaries(): Promise<{date: string, entry: DiaryEntry}[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const diaryKeys = allKeys.filter(key => key.startsWith(this.DIARY_KEY_PREFIX));
      
      const entries = await Promise.all(
        diaryKeys.map(async (key) => {
          const entryJson = await AsyncStorage.getItem(key);
          const date = key.replace(this.DIARY_KEY_PREFIX, '');
          return {
            date,
            entry: entryJson ? JSON.parse(entryJson) : null
          };
        })
      );
      
      return entries.filter(item => item.entry !== null);
    } catch (error) {
      console.error('일기 목록 조회 오류:', error);
      return [];
    }
  }
  
  /**
   * 특정 날짜의 일기를 삭제합니다
   * @param date YYYY-MM-DD 형식
   */
  static async deleteDiary(date: string): Promise<void> {
    try {
      const key = this.DIARY_KEY_PREFIX + date;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('일기 삭제 오류:', error);
      throw new Error('일기를 삭제하는 중 오류가 발생했습니다.');
    }
  }
  
  /**
   * 모든 일기를 삭제합니다 (초기화)
   */
  static async clearAllDiaries(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const diaryKeys = allKeys.filter(key => key.startsWith(this.DIARY_KEY_PREFIX));
      await AsyncStorage.multiRemove(diaryKeys);
    } catch (error) {
      console.error('일기 전체 삭제 오류:', error);
      throw new Error('일기를 초기화하는 중 오류가 발생했습니다.');
    }
  }
}
