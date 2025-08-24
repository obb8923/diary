import React, { useState, useEffect } from 'react';
import { TextInput, View, Image } from 'react-native';
import { Text } from '@components/Text';
import { useDiary } from '@libs/hooks/useDiary';
import { DEVICE_WIDTH, pickRandomFlower } from '@constants/normal';
export const TextBox = () => {
  const { currentComment, currentContent,setCurrentContent,isDiaryWrittenToday } = useDiary();
  const [text, setText] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(DEVICE_WIDTH);
  const [flowerSource] = useState(pickRandomFlower()); // 최초 1회 랜덤 고정
  const resolved = Image.resolveAssetSource(flowerSource);//원본 크기 추출하기 위함
  const horizontalPadding = 16;
  const availableWidth = Math.max(0, containerWidth - horizontalPadding * 2);

  const handleTextChange = (newText: string) => {
    setText(newText);
    setCurrentContent(newText);
  };

  // 스토리지 초기화 후(currentContent 변경 시) 내부 상태 동기화
  useEffect(() => {
    setText(currentContent || '');
  }, [currentContent]);

  // 일기장 라인을 위한 라인 개수 계산
  const numberOfLines = 20; // 기본 20줄
  const lineHeight = 24;
  const paddingTop = 12;
  const defaultSpacing = 40;
  // 이미지 크기를 절반으로 축소하여 렌더(가로는 컨테이너 기준, 세로는 비율 유지 후 0.5배)
  const imageAspectHeight = (resolved?.width && resolved?.height)
    ? ((availableWidth * resolved.height) / resolved.width) * 1
    : 0;
  const baseHeightForSnap = isDiaryWrittenToday
    ? Math.max(contentHeight || 0, imageAspectHeight)
    : (contentHeight || 0);
  const snappedBottomY = paddingTop + Math.ceil(baseHeightForSnap / lineHeight) * lineHeight + defaultSpacing;

  return (
    <View className="flex-1 relative" onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {/* 일기장 라인 배경 */}
      <View className="absolute inset-0" style={{ paddingTop: paddingTop, paddingLeft: 16, paddingRight: 16 }}>
        {Array.from({ length: numberOfLines }, (_, index) => (
          <View
            key={index}
            className="border-b border-line"
            style={{
              height: lineHeight,
              marginBottom: 0,
            }}
          />
        ))}
      </View>
      
      <TextInput
        className="font-kb2019 text-text-black text-base py-3 px-6 bg-transparent relative z-10"
        placeholder=""
        placeholderTextColor="#BAD5DD"
        autoFocus={!isDiaryWrittenToday}
        value={text}
        onChangeText={handleTextChange}
        multiline
        onContentSizeChange={(e) => {
          const h = e.nativeEvent.contentSize.height;
          setContentHeight(h);
        }}
        style={{
          fontFamily: 'KyoboHandwriting2019',
          lineHeight: lineHeight,
          textAlignVertical: 'top',
          minHeight: numberOfLines * lineHeight + 24, // 패딩 포함
        }}
      />

      {isDiaryWrittenToday ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: horizontalPadding,
            right: horizontalPadding,
            top: paddingTop,
            height: imageAspectHeight,
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

      {currentComment ? (
        <View
          pointerEvents="box-none"
          className="absolute left-0 right-0 z-20 px-6"
          style={{ top: snappedBottomY  }}
        >
          <Text 
            text={currentComment} 
            type="kb2023" 
            className="text-text-blue text-xl"
            style={{ transform: [{ rotate: '-1deg' }] }}
          />
        </View>
      ) : null}
    </View>
  );
};