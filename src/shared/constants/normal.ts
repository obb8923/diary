import { Dimensions} from "react-native";
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
  require('../../../assets/pngs/flower6.png'),
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