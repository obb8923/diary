/**
 * 오늘 날짜를 객체 형태로 반환하는 함수
 * @returns {object} 오늘 날짜 객체
 */
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return {
    year,
    month,
    day,
    formatted: `${year}.${month}.${day}`
  };
};


export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};