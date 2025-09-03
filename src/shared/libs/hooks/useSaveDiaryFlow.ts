import { useCallback } from 'react';
import { useDiary } from './useDiary';
import { useGemini } from './useGemini';
import { getRandomInt } from '../random';

export const useSaveDiaryFlow = () => {
  const { initializeDiary, saveDiary, isLoading, currentContent, isDiaryWrittenToday, currentDate } = useDiary();
  const { generateComment, isGenerating } = useGemini();

  const charactersCount = (currentContent || '').length;
  const canSave = charactersCount > 10 && !isDiaryWrittenToday;

  const save = useCallback(async () => {
    if (!canSave) return;
    const comment = await generateComment(currentContent);
    const flowerIndex = getRandomInt(1, 5); //1~4 사이의 랜덤 숫자 생성
    await saveDiary(comment, flowerIndex);
    // 현재 날짜로 다시 초기화하여 저장된 상태를 반영
    await initializeDiary(currentDate);
  }, [canSave, currentContent, generateComment, saveDiary, initializeDiary, currentDate]);

  return {
    charactersCount,
    canSave,
    isSaving: isLoading || isGenerating,
    save,
  };
};


