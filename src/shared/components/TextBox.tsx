import React, { useState, useEffect } from 'react';
import { TextInput, View, Image, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from '@components/Text';
import { useDiary } from '@libs/hooks/useDiary';
import { FLOWER_IMAGES, FLOWER_IMAGE_COUNT,TEXT_SIZE, LINE_HEIGHT, PADDING_TOP, HORIZONTAL_PADDING, NUMBER_OF_LINES, SMALL_IMAGE_SIZE, commentStyle, MIN_TEXT_HEIGHT } from '@constants/normal';
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

  
  // 실제 텍스트 내용 바로 밑에 이미지가 오도록 위치 계산
  const textBottomY = PADDING_TOP + (contentHeight || 0); // 텍스트 바로 밑
  const commentTopY = textBottomY + SMALL_IMAGE_SIZE; // 이미지 바로 밑

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Platform.OS === 'android' ? 56 : 0 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <View className="flex-1 relative">
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
      
      <TextInput
        className="font-kb2019 text-text-black py-3 px-6 bg-transparent relative z-10"
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
          minHeight: MIN_TEXT_HEIGHT, // 라인 배경과 패딩을 고려한 정확한 최소 높이
        }}
      />
      {/* 작은 이미지 - 글 바로 밑 오른쪽에 배치 - scale이 1일 때만 표시 */}
      {isDiaryWrittenToday && transformScale === DIARY_ANIMATION_CONSTANTS.SCALE.OPENED ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: HORIZONTAL_PADDING,
            top: textBottomY,
            width: SMALL_IMAGE_SIZE,
            height: SMALL_IMAGE_SIZE,
            zIndex: 15,
          }}
        >
          <Image
            source={flowerSource}
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      ) : null}
  
        {currentComment && transformScale === DIARY_ANIMATION_CONSTANTS.SCALE.OPENED ? (
          <View
            pointerEvents="box-none"
            className="absolute left-0 right-0 z-20 px-6"
            style={{ top: commentTopY }}
          >
            <Text 
              text={currentComment} 
              type="kb2023" 
              className={commentStyle}
              style={{ transform: [{ rotate: '-1deg' }] }}
            />
          </View>
        ) : null}
        </View>
       
      </KeyboardAwareScrollView>
       {/* 키보드 액세서리 바 */}
       <KeyboardAccessoryBar />

    </View>
  );
};