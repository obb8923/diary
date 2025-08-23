import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse } from '../types/diary';
import { AI_API_KEY } from '@env';

  
export class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null;
  
  // 환경 설정에서 API 키 가져오기
  private static readonly API_KEY = AI_API_KEY;
  
  private static getGenAI(): GoogleGenerativeAI {
    if (!this.genAI) {
      if (!this.API_KEY) {
        throw new Error('Gemini API 키가 설정되지 않았습니다.');
      }
      this.genAI = new GoogleGenerativeAI(this.API_KEY);
    }
    return this.genAI;
  }
  
  static async generateComment(diaryContent: string): Promise<GeminiResponse> {
    try {
      if (!diaryContent.trim()) {
        throw new Error('일기 내용이 비어있습니다.');
      }

      const prompt = `다음은 사용자가 작성한 일기입니다. 이 일기를 읽고 따뜻하고 공감적인 한 줄 코멘트를 작성해주세요. 
      코멘트는 격려적이고 긍정적인 톤으로 작성하되, 일기의 내용과 감정을 잘 반영해주세요.
      
      일기 내용:
      ${diaryContent}
      
      코멘트만 간단히 작성해주세요.`;

      const genAI = this.getGenAI();
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const comment = response.text()?.trim();
      
      if (!comment) {
        throw new Error('Gemini API에서 유효한 응답을 받지 못했습니다.');
      }
      return {
        comment
      };
    } catch (error) {
      console.error('Gemini API 오류:', error);
      
      // 기본 코멘트 반환
      return {
        comment: '이런 하루하루의 기록이 나중엔 큰 보물이 될 거야',
      };
    }
  }

}
