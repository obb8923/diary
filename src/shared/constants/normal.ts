import { Dimensions} from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { getRandomIndex } from "../libs/random";

const { width, height } = Dimensions.get('window');

export const DEVICE_WIDTH = width;
export const DEVICE_HEIGHT = height;

// flower 이미지 리소스 모음 (정적 require 필요)
export const FLOWER_IMAGES = [
  require('../../../assets/pngs/flower1.png'),
  require('../../../assets/pngs/flower2.png'),
  require('../../../assets/pngs/flower3.png'),
  require('../../../assets/pngs/flower4.png'),
  require('../../../assets/pngs/flower5.png'),
] as const;

export const FLOWER_IMAGE_COUNT = FLOWER_IMAGES.length;

export const pickRandomFlower = () => {
  const index = getRandomIndex(FLOWER_IMAGES.length);
  return FLOWER_IMAGES[index];
}

// 텍스트 및 레이아웃 관련 상수
export const TEXT_SIZE = 20; 
export const LINE_HEIGHT = TEXT_SIZE * 1.4; // 텍스트 크기의 1.4배 (28)
export const PADDING_TOP = 12;
export const HORIZONTAL_PADDING = 16;
export const DEFAULT_SPACING = 40;
export const NUMBER_OF_LINES = 20;

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