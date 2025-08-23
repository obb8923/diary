import { TouchableOpacity } from "react-native"
import { useDiaryStore } from '@store/diaryStore';

// 날씨 SVG 아이콘들 import
import SunnyIcon from '@assets/svgs/weather/Sunny.svg';
import RainyIcon from '@assets/svgs/weather/Rainy.svg';
import CloudyIcon from '@assets/svgs/weather/Cloudy.svg';
import WindyIcon from '@assets/svgs/weather/Windy.svg';
import SnowyIcon from '@assets/svgs/weather/Snowy.svg';
import {Colors} from '@constants/Colors'
export const WeatherSelector = () => {
  // 전역 상태에서 현재 날씨 가져오기
  const currentWeather = useDiaryStore(state => state.currentWeather);
  const setCurrentWeather = useDiaryStore(state => state.setCurrentWeather);
  
  // 날씨 아이콘 배열 (0~4 인덱스)
  const weatherIcons = [
    SunnyIcon,   // 0: sunny
    RainyIcon,   // 1: rainy
    CloudyIcon,  // 2: cloudy
    WindyIcon,   // 3: windy
    SnowyIcon,   // 4: snowy
  ];
  
  // 날씨 클릭 시 다음 날씨로 변경
  const handleWeatherPress = () => {
    const nextWeather = (currentWeather + 1) % weatherIcons.length;
    setCurrentWeather(nextWeather as 0 | 1 | 2 | 3 | 4);
  };
  
  const WeatherIcon = weatherIcons[currentWeather] || weatherIcons[0]; // 안전장치
  
  return (
    <TouchableOpacity onPress={handleWeatherPress} >
      <WeatherIcon width={24} height={24} color={Colors.textBlack}/>
    </TouchableOpacity>
  );
};
