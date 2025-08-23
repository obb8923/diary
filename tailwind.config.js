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
      },
      colors: {
        'background': '#FFFEFF',
        'white': '#fefefe',
        'ivory': '#D3E0E2',
        'black': '#191919',
        'text-black': '#3B3C32',
        'line': '#BAD5DD',

      },

    },
  },
  plugins: [],
}; 
