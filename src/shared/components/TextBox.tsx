import React, { useState } from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import { Text } from '@components/Text';
import { useDiary } from '@libs/hooks/useDiary';

interface TextBoxProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  // 마지막 줄과 코멘트 사이 간격(px)
  footerSpacing?: number;
  // 줄 눈금(라인) 단위로 정렬할지 여부
  alignFooterToLine?: boolean;
  // 내부 텍스트의 바닥 위치 변경 콜백
  onContentBottomChange?: (positions: { bottomY: number; snappedBottomY: number }) => void;
}

export const TextBox = ({ 
  placeholder = "", 
  value, 
  onChangeText,
  footerSpacing = 8,
  alignFooterToLine = true,
  onContentBottomChange,
  ...props 
}: TextBoxProps) => {
  const [text, setText] = useState(value || '');
  const [contentHeight, setContentHeight] = useState(0);
  const { currentComment } = useDiary();

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onChangeText) {
      onChangeText(newText);
    }
  };

  // 일기장 라인을 위한 라인 개수 계산
  const numberOfLines = 20; // 기본 20줄
  const lineHeight = 24;
  const paddingTop = 12;

  const bottomY = paddingTop + contentHeight;
  const defaultSpacing = 40;
  const snappedBottomY = paddingTop + Math.ceil((contentHeight || 0) / lineHeight) * lineHeight + defaultSpacing;

  return (
    <View className="flex-1 relative">
      {/* 일기장 라인 배경 */}
      <View className="absolute inset-0" style={{ paddingTop: paddingTop, paddingLeft: 4, paddingRight: 4 }}>
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
        className="font-p-regular text-text-black text-base py-3 px-1 bg-transparent relative z-10"
        placeholder={placeholder}
        placeholderTextColor="#BAD5DD"
        value={text}
        onChangeText={handleTextChange}
        multiline
        onContentSizeChange={(e) => {
          const h = e.nativeEvent.contentSize.height;
          setContentHeight(h);
          if (onContentBottomChange) {
            const localBottomY = paddingTop + h;
            const localSnappedBottomY = paddingTop + Math.ceil((h || 0) / lineHeight) * lineHeight;
            onContentBottomChange({ bottomY: localBottomY, snappedBottomY: localSnappedBottomY });
          }
        }}
        style={{
          lineHeight: lineHeight,
          textAlignVertical: 'top',
          minHeight: numberOfLines * lineHeight + 24, // 패딩 포함
        }}
        {...props}
      />

      {currentComment ? (
        <View
          pointerEvents="box-none"
          className="absolute left-0 right-0 z-20 px-4"
          style={{ top: (alignFooterToLine ? snappedBottomY : bottomY) + footerSpacing }}
        >
          <Text 
            text={currentComment} 
            type="regular" 
            className="text-base font-p-regular text-text-blue leading-6"
          />
        </View>
      ) : null}
    </View>
  );
};