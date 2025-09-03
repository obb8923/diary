import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../types/diary';
import { STORAGE_KEYS } from '../constants/normal';

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
   * 특정 월의 일기들을 가져옵니다
   * @param year 연도 (예: 2024)
   * @param month 월 (1-12)
   */
  static async getMonthlyDiaries(year: number, month: number): Promise<{date: string, entry: DiaryEntry}[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const diaryKeys = allKeys.filter(key => key.startsWith(this.DIARY_KEY_PREFIX));
      
      // 해당 월의 키만 필터링 (YYYY-MM 형식으로 시작하는 키들)
      const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
      const monthlyKeys = diaryKeys.filter(key => {
        const date = key.replace(this.DIARY_KEY_PREFIX, '');
        return date.startsWith(monthPrefix);
      });
      
      const entries = await Promise.all(
        monthlyKeys.map(async (key) => {
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
      console.error('월별 일기 조회 오류:', error);
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

  /**
   * 모든 일기 데이터를 JSON 문자열로 백업합니다
   */
  static async exportAllDiaries(): Promise<string> {
    try {
      const allDiaries = await this.getAllDiaries();
      
      const backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalEntries: allDiaries.length,
        diaries: allDiaries
      };

      return JSON.stringify(backupData, null, 2);
    } catch (error) {
      console.error('일기 백업 오류:', error);
      throw new Error('일기를 백업하는 중 오류가 발생했습니다.');
    }
  }

  /**
   * JSON 문자열에서 일기 데이터를 복원합니다
   * @param jsonData 백업된 JSON 문자열
   * @param overwrite 기존 데이터 덮어쓰기 여부 (기본값: false)
   */
  static async importDiaries(jsonData: string, overwrite: boolean = false): Promise<{
    success: number;
    skipped: number;
    errors: number;
  }> {
    try {
      const backupData = JSON.parse(jsonData);
      
      // 데이터 형식 검증
      if (!backupData.diaries || !Array.isArray(backupData.diaries)) {
        throw new Error('올바르지 않은 백업 데이터 형식입니다.');
      }

      let success = 0;
      let skipped = 0;
      let errors = 0;

      for (const item of backupData.diaries) {
        try {
          const { date, entry } = item;
          
          // 데이터 유효성 검증
          if (!date || !entry || typeof entry.content !== 'string') {
            errors++;
            continue;
          }

          // 기존 데이터 확인
          if (!overwrite) {
            const existingEntry = await this.getDiary(date);
            if (existingEntry) {
              skipped++;
              continue;
            }
          }

          // 일기 저장
          await this.saveDiary(date, entry);
          success++;
        } catch (error) {
          console.error(`일기 복원 오류 (${item.date}):`, error);
          errors++;
        }
      }

      return { success, skipped, errors };
    } catch (error) {
      console.error('일기 복원 오류:', error);
      if (error instanceof SyntaxError) {
        throw new Error('올바르지 않은 JSON 형식입니다.');
      }
      throw new Error('일기를 복원하는 중 오류가 발생했습니다.');
    }
  }

  /**
   * 앱 첫 방문 여부를 확인합니다
   * @returns 첫 방문이면 true, 아니면 false
   */
  static async isFirstVisit(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
      return value === null; // 값이 없으면 첫 방문
    } catch (error) {
      console.error('첫 방문 확인 오류:', error);
      return true; // 오류 시 첫 방문으로 간주
    }
  }

  /**
   * 첫 방문 완료 상태로 설정합니다
   */
  static async setFirstVisitCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_VISIT, 'completed');
    } catch (error) {
      console.error('첫 방문 설정 오류:', error);
      throw new Error('첫 방문 설정 중 오류가 발생했습니다.');
    }
  }

  /**
   * 첫 방문 상태를 초기화합니다 (테스트용)
   */
  static async resetFirstVisit(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FIRST_VISIT);
    } catch (error) {
      console.error('첫 방문 초기화 오류:', error);
      throw new Error('첫 방문 초기화 중 오류가 발생했습니다.');
    }
  }
}
