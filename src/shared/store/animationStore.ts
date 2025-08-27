import { create } from 'zustand';


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

  // 저장 시퀀스
  saveSequenceId: number;
  runSave: (() => Promise<void>) | null;
  startSaveSequence: (runSave: () => Promise<void>) => void;
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  triggerId: 0,
  direction: 'close',
  transformScale: 0.4, // 기본값 40%

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

  // 저장 시퀀스 초기값
  saveSequenceId: 0,
  runSave: null,
  startSaveSequence: (runSave: () => Promise<void>) => {
    const seqId = get().saveSequenceId + 1;
    set({ runSave, saveSequenceId: seqId });
  },
}));


