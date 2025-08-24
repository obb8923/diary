// 범위 내 정수 난수 생성 유틸리티
// min 이상, max 미만 정수 반환
export const getRandomInt = (min: number, max: number): number => {
  const ceilMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  if (floorMax <= ceilMin) return ceilMin;
  return Math.floor(Math.random() * (floorMax - ceilMin)) + ceilMin;
};

// 0 이상 length 미만 인덱스 반환
export const getRandomIndex = (length: number): number => {
  return getRandomInt(0, Math.max(0, length));
};


