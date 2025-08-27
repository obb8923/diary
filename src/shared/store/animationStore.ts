import { create } from 'zustand';

type AnimationDirection = 'open' | 'close' | null;

interface AnimationStore {
  // 애니메이션 트리거 식별자: 값이 변경될 때마다 애니메이션 재생
  triggerId: number;
  // 애니메이션 진행 방향: open(열림) / close(닫힘)
  direction: AnimationDirection;

  // 액션들
  startClosing: () => void;
  startOpening: () => void;
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  triggerId: 0,
  direction: null,

  startClosing: () => {
    const nextId = get().triggerId + 1;
    set({ direction: 'close', triggerId: nextId });
  },

  startOpening: () => {
    const nextId = get().triggerId + 1;
    set({ direction: 'open', triggerId: nextId });
  },
}));


