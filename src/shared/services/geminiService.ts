import { GeminiResponse } from '../types/diary';
import { ENV } from '../config/environment';

export class GeminiService {
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  // 환경 설정에서 API 키 가져오기
  private static readonly API_KEY = ENV.GEMINI_API_KEY;
  
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

      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API 오류: ${response.status}`);
      }

      const data = await response.json();
      const comment = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (!comment) {
        throw new Error('Gemini API에서 유효한 응답을 받지 못했습니다.');
      }

      // 간단한 감정 분석 (키워드 기반)
      const sentiment = this.analyzeSentiment(comment);

      return {
        comment,
        sentiment
      };
    } catch (error) {
      console.error('Gemini API 오류:', error);
      
      // 기본 코멘트 반환
      return {
        comment: '오늘도 소중한 하루를 기록해주셨네요. 당신의 이야기는 언제나 의미가 있어요! ✨',
        sentiment: 'positive'
      };
    }
  }

  private static analyzeSentiment(comment: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['좋', '훌륭', '멋진', '대단', '행복', '기쁨', '감사', '사랑', '희망', '성장', '발전', '성공'];
    const negativeWords = ['힘든', '어려운', '슬픈', '걱정', '불안', '스트레스', '실망', '후회'];
    
    const lowerComment = comment.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}
