import React, { useState, useEffect } from 'react';
import { TextInput, View, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDiary } from '@libs/hooks/useDiary';
import { TEXT_SIZE, LINE_HEIGHT, PADDING_TOP, HORIZONTAL_PADDING, NUMBER_OF_LINES } from '@constants/normal';
import { KeyboardAccessoryBar } from '@/domain/diary/components/KeyboardAccessoryBar';

export const TextBox = () => {
  const { currentContent, setCurrentContent, isDiaryWrittenToday } = useDiary();
  const [text, setText] = useState('');
 
  const handleTextChange = (newText: string) => {
    setText(newText);
    setCurrentContent(newText);
  };

  // 스토리지 초기화 후(currentContent 변경 시) 내부 상태 동기화
  useEffect(() => {
    setText(currentContent || '');
  }, [currentContent]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'android' ? 56 : 0 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <View className="flex-1">
          {/* 일기장 라인 배경 */}
          <View className="absolute inset-0" style={{ paddingTop: PADDING_TOP, paddingLeft: HORIZONTAL_PADDING, paddingRight: HORIZONTAL_PADDING }}>
            {Array.from({ length: NUMBER_OF_LINES }, (_, index) => (
              <View
                key={index}
                className="border-b border-line"
                style={{
                  height: LINE_HEIGHT,
                  marginBottom: 0,
                }}
              />
            ))}
          </View>
          
          {/* TextInput 영역 */}
          <TextInput
            className="font-kb2019 text-text-black bg-transparent px-6"
            inputAccessoryViewID={'DiaryAccessory'}
            value={text}
            onChangeText={handleTextChange}
            multiline
            selectionColor="rgba(0, 0, 0, 0.3)"
            editable={!isDiaryWrittenToday}
            selectTextOnFocus={false}
            style={{
              fontFamily: 'KyoboHandwriting2019',
              fontSize: TEXT_SIZE,
              lineHeight: LINE_HEIGHT,
              textAlignVertical: 'top',
              flex: 1,
              paddingTop: PADDING_TOP,
              paddingHorizontal: HORIZONTAL_PADDING,
              ...(Platform.OS === 'android' && { includeFontPadding: false }),
            }}
          />
        </View>
       
      </KeyboardAwareScrollView>
       {/* 키보드 액세서리 바 */}
       <KeyboardAccessoryBar />

    </View>
  );
};