/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'p-regular': ['Pretendard-Regular'],
        'p-semibold': ['Pretendard-SemiBold'],
        'p-extrabold': ['Pretendard-ExtraBold'],
        'p-black': ['Pretendard-Black'],
        'kb2019': ['KyoboHandwriting2019'],
        'kb2023': ['KyoboHandwriting2023wsa'],
      },
      colors: {
        'background': '#FFFEFF',
        'white': '#fefefe',
        'ivory': '#D3E0E2',
        'black': '#191919',
        'text-black': '#3B3C32',
        'text-red': '#F13C56',
        'text-blue': '#062A8B',
        'line': '#BAD5DD',
        'blue-100':'#DDEAEE',
        // 'blue-200':'#BAD5DD',
        'blue-300':'#99C1CC',
        'blue-400':'#76ACBC',
        'blue-500':'#5497AB',
        'blue-600':'#437989',
        'blue-700':'#335B66',
        'blue-800':'#223C44',
        'blue-900':'#111E22',
        'yellow-100':'#ECECE9',
        'yellow-200':'#D4D5CD',
        'yellow-300':'#BDBEB1',
        'yellow-400':'#A5A795',
        'yellow-500':'#8E9079',
        'yellow-600':'#737561',
        'yellow-700':'#58594A',
        // 'yellow-800':'#3B3C32',
        'yellow-900':'#21211C',

      },

    },
  },
  plugins: [],
}; 
