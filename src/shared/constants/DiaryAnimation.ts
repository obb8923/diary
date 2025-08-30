/**
 * 일기장 애니메이션 관련 상수들
 */
export const DIARY_ANIMATION_CONSTANTS = {
  // 스케일 관련
  SCALE: {
    CLOSED: 0.4,  // 닫힌 상태 스케일 (40%)
    OPENED: 1,    // 열린 상태 스케일 (100%)
  },
  
  // 커버 애니메이션 관련
  COVER: {
    DURATION_MS: 520,              // 커버 열림/닫힘 애니메이션 시간
    OPACITY: 0.7,                  // 커버 불투명도
    TOUCH_THRESHOLD: 0.1,          // 터치 차단 임계값 (10%)
    SCALE_CHANGE_DELAY_MS: 500,    // 스케일 변경 지연 시간
    CLOSE_DELAY_MS: 100,           // 커버 닫기 지연 시간
  },
  
  // 키보드 관련
  KEYBOARD: {
    ANIMATION_DURATION_MS: 250,    // 키보드 애니메이션 시간
  },
  
  // 스프링 애니메이션 관련
  SPRING: {
    LAYOUT_STIFFNESS: 180,         // 레이아웃 애니메이션 강성
    LAYOUT_DAMPING: 16,            // 레이아웃 애니메이션 감쇠
    SAVE_BUTTON_STIFFNESS: 200,    // 저장 버튼 애니메이션 강성
    SAVE_BUTTON_DAMPING: 16,       // 저장 버튼 애니메이션 감쇠
  },
  
  // 진행률 관련
  PROGRESS: {
    FULLY_CLOSED: 1 as number,    // 완전히 닫힌 상태
    FULLY_OPENED: 0 as number,    // 완전히 열린 상태
  },
} as const;
