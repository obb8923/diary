import { Dimensions, Platform} from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { getRandomIndex } from "../libs/random";

const { width, height } = Dimensions.get('window');

// AsyncStorage 키 상수
export const STORAGE_KEYS = {
  FIRST_VISIT: '@diary_first_visit',
} as const;

export const DEVICE_WIDTH = width;
export const DEVICE_HEIGHT = height;

// flower 이미지 리소스 모음 (정적 require 필요)
export const FLOWER_IMAGES = [
  require('../../../assets/Flower/Flower1.png'),
  require('../../../assets/Flower/Flower2.png'),
  require('../../../assets/Flower/Flower3.png'),
  require('../../../assets/Flower/Flower4.png'),
] as const;

export const FLOWER_IMAGE_COUNT = FLOWER_IMAGES.length;

export const pickRandomFlower = () => {
  const index = getRandomIndex(FLOWER_IMAGES.length);
  return FLOWER_IMAGES[index];
}

// 텍스트 및 레이아웃 관련 상수
export const TEXT_SIZE = 20; 
// 플랫폼별 줄 간격 - Android는 폰트 렌더링으로 인해 약간 더 큰 간격 필요
export const LINE_HEIGHT = Platform.OS === 'android' ? TEXT_SIZE * 1.6 : TEXT_SIZE * 1.4; // Android: 30, iOS: 28
export const PADDING_TOP = 12;
export const HORIZONTAL_PADDING = 16;
export const DEFAULT_SPACING = 40;
export const NUMBER_OF_LINES = 20;

export const SMALL_IMAGE_SIZE = 80;

// 텍스트 영역의 최소 높이 계산 (라인 배경과 패딩 고려)
export const TEXT_AREA_PADDING_VERTICAL = 12; // py-3 = 12px (상하 각각)
export const MIN_TEXT_HEIGHT = PADDING_TOP + (NUMBER_OF_LINES * LINE_HEIGHT) + TEXT_AREA_PADDING_VERTICAL;

export const dateStyle: string = 'text-text-black text-2xl'
export const commentStyle: string = 'text-text-blue text-xl'

// 키보드 액세서리 바 관련 상수
export const KEYBOARD_ACCESSORY_BAR_HEIGHT = 48; // h-12 = 48px

// Safe Area Inset을 고려한 높이 계산 함수
export const getAvailableHeight = (insets: EdgeInsets): number => {
  return DEVICE_HEIGHT - insets.top - insets.bottom;
};

// 다이어리 크기 계산 함수
export const getDiaryDimensions = (insets: EdgeInsets, isOpened: boolean) => {
  const availableHeight = getAvailableHeight(insets);
  
  if (isOpened) {
    // 열린 상태: 화면에 꽉 차게 (Safe Area Inset 고려)
    return {
      width: DEVICE_WIDTH,
      height: availableHeight
    };
  } else {
    // 닫힌 상태: 1:1.414 비율 유지 (Safe Area Inset 고려)
    const maxWidth = DEVICE_WIDTH * 0.9; // 화면 너비의 90%
    const maxHeight = availableHeight * 0.8; // 사용 가능한 화면 높이의 80%
    
    if (maxWidth * 1.414 <= maxHeight) {
      // 너비 기준으로 높이 계산
      return {
        width: maxWidth,
        height: maxWidth * 1.414
      };
    } else {
      // 높이 기준으로 너비 계산
      return {
        width: maxHeight / 1.414,
        height: maxHeight
      };
    }
  }
};