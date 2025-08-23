// 날씨 타입을 숫자로 매핑 (0~4)
export const WEATHER_TYPES = {
  SUNNY: 0,
  RAINY: 1,
  CLOUDY: 2,
  WINDY: 3,
  SNOWY: 4,
} as const;

// 날씨 번호를 이름으로 변환하는 매핑
export const WEATHER_NAMES = {
  [WEATHER_TYPES.SUNNY]: 'sunny',
  [WEATHER_TYPES.RAINY]: 'rainy',
  [WEATHER_TYPES.CLOUDY]: 'cloudy',
  [WEATHER_TYPES.WINDY]: 'windy',
  [WEATHER_TYPES.SNOWY]: 'snowy',
} as const;

// 날씨 타입 (0~4)
export type WeatherNumber = 0 | 1 | 2 | 3 | 4;
