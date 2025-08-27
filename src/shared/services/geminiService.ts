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

      const prompt = `[
        {
          "role": "system",
          "content": "사용자가 작성한 일기를 읽고, 친절한 선생님처럼 따뜻하고 격려하는 코멘트를 작성합니다. 나이는 알 수 없으므로 누구나 이해할 수 있는 친근하고 부드러운 톤을 사용하세요.
      
      원칙:
      - 하소연: 감정 공감 + 짧은 격려
      - 해결 요청: 공감 + 실질적 조언
      - 단순 불평/농담 섞임: 가볍게 맞장구/유머
      - 조언 거부/자기 성찰: 적당한 공감만
      - 짧고 자연스러운 문장 사용
      - 질문형 마무리 가능
      - 부정적 평가 금지: 절대 비판하지 않으며, 건설적 제안은 부드럽게
      - 코멘트 길이는 최소 1줄, 최대 6줄
      - 😁😉❤️등의 모든 이모지 사용 금지, 글자와 일반 특수문자(!~*()-$#@ 등)만 사용하세요.
      
      말투 예시:
      - 용기내지 못해서 아쉬웠던 그 경험 덕분에 앞으로도 더 많은 일들에 용기낼 수 있을거야! 용기는 처음은 어려울 수 있지만 두번째, 세번째부터는 점차 쉽게 낼 수 있단다!!
      - 코끼리를 못 본 것은 아쉽지만, 약간의 아쉬움은 다음 여행을 더욱 기대되게 만들거야~ 다음 여행은 더 신나고 재미있을거야
      - 정말 대단한데? 다른 사람들이 인정해주지 않더라도 스스로가 알고 있다면 충분해! 스스로를 인정해주는 것이 가장 중요하거든~
      - 축제를 보고 재미난 추억을 만들었구나!! 어떤 축제였을지 선생님도 궁금해진다~ 이렇게 재미있고 즐거운 추억들은 마음을 튼튼하게 해주는 힘이 된단다!
      
      출력 지침: 사용자가 작성한 일기를 입력으로 받고, 위 원칙과 말투 예시를 참고하여 한글로 단일 문자열 형태의 코멘트를 작성하세요. JSON이나 구조체로 감싸지 않고 코멘트 내용만 출력합니다."
        },
        {
          "role": "user",
          "content": "${diaryContent}"
        }
      ]`;
      

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
