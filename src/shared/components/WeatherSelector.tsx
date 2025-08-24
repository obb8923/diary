import { TouchableOpacity } from "react-native"
import { useDiaryStore } from '@store/diaryStore';
import { Text } from '@components/Text';
import {Colors} from '@constants/Colors'
export const WeatherSelector = () => {
  // 전역 상태에서 현재 날씨 가져오기
  const currentWeather = useDiaryStore(state => state.currentWeather);
  const setCurrentWeather = useDiaryStore(state => state.setCurrentWeather);
  
  // 날씨 라벨 배열 (0~4 인덱스)
  const weatherLabels = [
    '맑음', // 0: sunny
    '비',   // 1: rainy
    '구름', // 2: cloudy
    '바람', // 3: windy
    '눈',   // 4: snowy
  ] as const;
  
  // 날씨 클릭 시 다음 날씨로 변경
  const handleWeatherPress = () => {
    const nextWeather = (currentWeather + 1) % weatherLabels.length;
    setCurrentWeather(nextWeather as 0 | 1 | 2 | 3 | 4);
  };
  
  const label = weatherLabels[currentWeather] || weatherLabels[0]; // 안전장치
  
  return (
    <TouchableOpacity onPress={handleWeatherPress} >
      <Text text={label} type='kb2019' className="text-text-black text-xl"/>
    </TouchableOpacity>
  );
};
