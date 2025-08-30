import { create } from 'zustand';
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation';


interface AnimationStore {
  // 애니메이션 트리거 식별자: 값이 변경될 때마다 애니메이션 재생
  triggerId: number;
  // 애니메이션 진행 방향: open(열림) / close(닫힘)
  direction: 'open' | 'close' ;

  // Transform scale 관리
  transformScale: number;

  // 액션들
  startClosing: () => void;
  startOpening: () => void;
  setTransformScale: (scale: number) => void;
  animateToScale: (scale: number) => void;

  // 저장 애니메이션 시퀀스
  saveSequenceId: number;
  saveAnimationStep: 'idle' | 'saving' | 'scaling' | 'closing_cover' | 'rotating' | 'lifting' | 'waiting_for_result' | 'reversing' | 'reverse_lifting' | 'reverse_rotating' | 'opening_cover' | 'reverse_scaling' | 'showing_result';
  runSave: (() => Promise<void>) | null;
  startSaveSequence: (runSave: () => Promise<void>) => void;
  setSaveAnimationStep: (step: 'idle' | 'saving' | 'scaling' | 'closing_cover' | 'rotating' | 'lifting' | 'waiting_for_result' | 'reversing' | 'reverse_lifting' | 'reverse_rotating' | 'opening_cover' | 'reverse_scaling' | 'showing_result') => void;
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  triggerId: 0,
  direction: 'close',
  transformScale: DIARY_ANIMATION_CONSTANTS.SCALE.CLOSED, // 기본값: 닫힌 상태 스케일

  startClosing: () => {
    const nextId = get().triggerId + 1;
    set({ direction: 'close', triggerId: nextId });
  },

  startOpening: () => {
    const nextId = get().triggerId + 1;
    set({ direction: 'open', triggerId: nextId });
  },

  setTransformScale: (scale: number) => {
    set({ transformScale: scale });
  },

  animateToScale: (scale: number) => {
    // 애니메이션은 컴포넌트에서 처리
    set({ transformScale: scale });
  },

  // 저장 애니메이션 시퀀스 초기값
  saveSequenceId: 0,
  saveAnimationStep: 'idle',
  runSave: null,
  startSaveSequence: (runSave: () => Promise<void>) => {
    const seqId = get().saveSequenceId + 1;
    set({ runSave, saveSequenceId: seqId, saveAnimationStep: 'saving' });
  },
  setSaveAnimationStep: (step) => {
    set({ saveAnimationStep: step });
  },
}));


