import { NativeModules, Platform } from 'react-native';

interface EnvironmentConfig {
  GEMINI_API_KEY: string;
}

// 개발 환경에서는 하드코딩된 값 사용 (실제 배포 시에는 빌드 시 주입)
const getEnvironmentConfig = (): EnvironmentConfig => {
  // React Native에서는 process.env가 기본적으로 지원되지 않으므로
  // react-native-dotenv 또는 다른 환경 변수 관리 방법을 사용해야 합니다.
  
  return {
    // TODO: 실제 API 키로 교체하거나 환경 변수로 관리
    GEMINI_API_KEY: __DEV__ 
      ? 'YOUR_DEVELOPMENT_GEMINI_API_KEY' 
      : 'YOUR_PRODUCTION_GEMINI_API_KEY'
  };
};

export const ENV = getEnvironmentConfig();
