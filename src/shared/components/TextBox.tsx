import React, { useState } from 'react';
import { TextInput, View, TextInputProps } from 'react-native';

interface TextBoxProps extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const TextBox = ({ 
  placeholder = "", 
  value, 
  onChangeText,
  ...props 
}: TextBoxProps) => {
  const [text, setText] = useState(value || '');

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onChangeText) {
      onChangeText(newText);
    }
  };

  // 일기장 라인을 위한 라인 개수 계산
  const numberOfLines = 20; // 기본 20줄
  const lineHeight = 24;

  return (
    <View className="flex-1 relative">
      {/* 일기장 라인 배경 */}
      <View className="absolute inset-0" style={{ paddingTop: 12, paddingLeft: 4, paddingRight: 4 }}>
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
        style={{
          lineHeight: lineHeight,
          textAlignVertical: 'top',
          minHeight: numberOfLines * lineHeight + 24, // 패딩 포함
        }}
        {...props}
      />
    </View>
  );
};