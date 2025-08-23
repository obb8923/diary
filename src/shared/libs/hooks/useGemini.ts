import { useState, useCallback } from 'react';
import { GeminiService } from '../../services/geminiService';

export const useGemini = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gemini 코멘트 생성 함수
  const generateComment = useCallback(async (content: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (!content.trim()) {
        throw new Error('일기 내용을 입력해주세요.');
      }
      
      // Gemini API로 코멘트 생성
      const geminiResponse = await GeminiService.generateComment(content);
      
      setIsGenerating(false);
      
      if(__DEV__) {
        console.log('Gemini 코멘트가 생성되었습니다:', geminiResponse.comment);
      }
      
      return geminiResponse.comment;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI 코멘트 생성 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsGenerating(false);
      console.error('Gemini 코멘트 생성 오류:', error);
      throw error;
    }
  }, []);

  return {
    // 상태
    isGenerating,
    error,
    
    // 액션
    generateComment,
    setError,
  };
};
