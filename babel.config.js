module.exports = {
  presets: ['module:@react-native/babel-preset','nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // 별칭 기준 경로
        alias: {
          '@': './src', // @ 를 src 폴더로 매핑
          '@assets': './assets',
          '@domain': './src/domain',
          '@components': './src/shared/components',
          '@constants': './src/shared/constants',
          '@libs': './src/shared/libs',
          '@store': './src/shared/store',
          '@Home': './src/domain/Home',
          '@Calendar': './src/domain/Calendar',
          '@Profile': './src/domain/Profile',
        },
      },
    ],
  ],
};
