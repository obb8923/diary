import { useCallback } from 'react';
import { useDiary } from './useDiary';
import { useGemini } from './useGemini';
import { getRandomInt } from '../random';

export const useSaveDiaryFlow = () => {
  const { initializeDiary, saveDiary, isLoading, currentContent, isDiaryWrittenToday } = useDiary();
  const { generateComment, isGenerating } = useGemini();

  const charactersCount = (currentContent || '').length;
  const canSave = charactersCount > 10 && !isDiaryWrittenToday;

  const save = useCallback(async () => {
    if (!canSave) return;
    const comment = await generateComment(currentContent);
    const flowerIndex = getRandomInt(1, 5); //1~4 사이의 랜덤 숫자 생성
    await saveDiary(comment, flowerIndex);
    await initializeDiary();
  }, [canSave, currentContent, generateComment, saveDiary, initializeDiary]);

  return {
    charactersCount,
    canSave,
    isSaving: isLoading || isGenerating,
    save,
  };
};


