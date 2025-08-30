import React, { useEffect, useState } from 'react';
import { Platform, View, Keyboard, InputAccessoryView, TouchableOpacity, KeyboardEvent } from 'react-native';
import Animated, { Layout, ZoomIn, ZoomOut, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Text } from '@components/Text';
import { useSaveDiaryFlow } from '@libs/hooks/useSaveDiaryFlow';
import { useAnimationStore } from '@store/animationStore';

export const KeyboardAccessoryBar= () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { charactersCount, canSave, isSaving, save } = useSaveDiaryFlow();
  const [showSave, setShowSave] = useState(canSave);
  const { startClosing, startOpening, startSaveSequence } = useAnimationStore();
  const bottomPosition = useSharedValue(0);

  useEffect(() => {
    setShowSave(canSave);
  }, [canSave]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
        bottomPosition.value = withTiming(event.endCoordinates.height, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        bottomPosition.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [bottomPosition]);

  const handleDismiss = () => {
    // 닫힘 애니메이션 트리거
    startClosing();
    Keyboard.dismiss();
  };

  const handleSave = async () => {
    if (!canSave) return;
    startSaveSequence(save);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: bottomPosition.value,
    };
  });


  const Bar = (
    <View
      className="bg-blue-100 h-12 px-4 flex-row items-center justify-between"
    >
      <Text text={`${charactersCount}자`} type="kb2023" className="text-text-blue" />

      <Animated.View layout={Layout.springify().stiffness(180).damping(16)} className="flex-row items-center">
        <TouchableOpacity
          onPress={handleDismiss}
          activeOpacity={0.8}
          className="h-8 px-3 mr-2 rounded-full border border-line justify-center items-center"
        >
          <Text text="키보드 내리기" type="kb2023" className="text-text-black" />
        </TouchableOpacity>

        {showSave && (
          <Animated.View 
          entering={ZoomIn.springify().stiffness(200).damping(16)} 
          exiting={ZoomOut}   
          style={{ zIndex: 1, overflow: 'visible' }}
          >
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.9}
              className={`h-8 px-4 rounded-full justify-center items-center ${isSaving ? 'bg-blue-300' : 'bg-blue-500'}`}
              disabled={isSaving}
            >
              <Text
                text={isSaving ? '저장중...' : '다 적었어요!'}
                type="semibold"
                className="text-background"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <>
        <InputAccessoryView nativeID={'DiaryAccessory'}>{Bar}</InputAccessoryView>
        {keyboardHeight === 0 && (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            {Bar}
          </View>
        )}
      </>
    );
  }

  return (
    <Animated.View 
      pointerEvents="box-none" 
      style={[
        { 
          position: 'absolute', 
          left: 0, 
          right: 0,
        },
        animatedStyle
      ]}
    >
      {Bar}
    </Animated.View>
  );
};

export default KeyboardAccessoryBar;


