import React, { useState, useEffect } from 'react';
import { TextInput, View, Image, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from '@components/Text';
import { useDiary } from '@libs/hooks/useDiary';
import { FLOWER_IMAGES, FLOWER_IMAGE_COUNT,TEXT_SIZE, LINE_HEIGHT, PADDING_TOP, HORIZONTAL_PADDING, NUMBER_OF_LINES, SMALL_IMAGE_SIZE, commentStyle, MIN_TEXT_HEIGHT, TEXT_AREA_PADDING_VERTICAL } from '@constants/normal';
import { KeyboardAccessoryBar } from '@/domain/diary/components/KeyboardAccessoryBar';
import { useAnimationStore } from '@store/animationStore';
import { DIARY_ANIMATION_CONSTANTS } from '@constants/DiaryAnimation';

export const TextBox = () => {
  const { currentComment, currentContent,setCurrentContent,isDiaryWrittenToday, currentFlowerIndex } = useDiary();
  const { transformScale } = useAnimationStore();
  const [text, setText] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  // 저장된 인덱스(1~4)를 소스에 매핑. 유효하지 않으면 1번 사용
  const flowerSource = FLOWER_IMAGES[(Math.max(1, Math.min((currentFlowerIndex || 1), FLOWER_IMAGE_COUNT))) - 1];
 
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
            onContentSizeChange={(e) => {
              const h = e.nativeEvent.contentSize.height;
              setContentHeight(h);
            }}
            editable={!isDiaryWrittenToday}
            selectTextOnFocus={false}
            caretHidden={isDiaryWrittenToday}
            style={{
              fontFamily: 'KyoboHandwriting2019',
              fontSize: TEXT_SIZE,
              lineHeight: LINE_HEIGHT,
              textAlignVertical: 'top',
              height: Math.max(MIN_TEXT_HEIGHT, contentHeight + PADDING_TOP + TEXT_AREA_PADDING_VERTICAL),
              paddingTop: PADDING_TOP,
              paddingBottom: TEXT_AREA_PADDING_VERTICAL,
              paddingHorizontal: HORIZONTAL_PADDING,
              ...(Platform.OS === 'android' && { includeFontPadding: false }),
            }}
          />

          {/* 작은 이미지 - TextInput 바로 밑 오른쪽에 배치 */}
          {isDiaryWrittenToday && transformScale === DIARY_ANIMATION_CONSTANTS.SCALE.OPENED && (
            <View
              pointerEvents="none"
              style={{
                alignSelf: 'flex-end',
                marginRight: HORIZONTAL_PADDING,
                marginTop: 8,
                width: SMALL_IMAGE_SIZE,
                height: SMALL_IMAGE_SIZE,
              }}
            >
              <Image
                source={flowerSource}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          )}

          {/* 코멘트 - 이미지 바로 밑에 배치 */}
          {currentComment && transformScale === DIARY_ANIMATION_CONSTANTS.SCALE.OPENED && (
            <View
              pointerEvents="box-none"
              style={{
                marginTop: isDiaryWrittenToday ? 8 : 16,
                paddingHorizontal: HORIZONTAL_PADDING,
              }}
            >
              <Text 
                text={currentComment} 
                type="kb2023" 
                className={commentStyle}
                style={{ transform: [{ rotate: '-1deg' }] }}
              />
            </View>
          )}
        </View>
       
      </KeyboardAwareScrollView>
       {/* 키보드 액세서리 바 */}
       <KeyboardAccessoryBar />

    </View>
  );
};