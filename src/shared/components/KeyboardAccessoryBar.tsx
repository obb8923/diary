import React, { useEffect, useState } from 'react';
import { Platform, View, Keyboard, InputAccessoryView, TouchableOpacity, Alert } from 'react-native';
import Animated, { Layout, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@components/Text';
import { useSaveDiaryFlow } from '@libs/hooks/useSaveDiaryFlow';
import { useAnimationStore } from '@store/animationStore';

export const KeyboardAccessoryBar: React.FC = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { charactersCount, canSave, isSaving, save } = useSaveDiaryFlow();
  const [showSave, setShowSave] = useState(canSave);
  const { startClosing, startOpening } = useAnimationStore();

  useEffect(() => {
    setShowSave(canSave);
  }, [canSave]);

  const handleDismiss = () => {
    // 닫힘 애니메이션 트리거
    startClosing();
    Keyboard.dismiss();
  };

  const handleSave = async () => {
    if (!canSave) return;
    await save();
    Alert.alert('저장 완료✨', '하루하루의 기록이 큰 보물이 될 거에요', [{ text: '확인', style: 'default' }]);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const onShow = (e: any) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    };
    const onHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };
    const subscriptions = Platform.select({
      ios: [
        Keyboard.addListener('keyboardWillShow', onShow),
        Keyboard.addListener('keyboardWillHide', onHide),
      ],
      default: [
        Keyboard.addListener('keyboardDidShow', onShow),
        Keyboard.addListener('keyboardDidHide', onHide),
      ],
    });
    return () => {
      subscriptions?.forEach((sub) => sub.remove());
    };
  }, []);

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

        {showSave ? (
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
        ) : null}

        {__DEV__ ? (
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={startClosing}
              activeOpacity={0.9}
              className="h-8 px-3 mr-2 rounded-full border border-blue-400 justify-center items-center"
            >
              <Text text="닫힘 재생" type="kb2023" className="text-text-blue" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={startOpening}
              activeOpacity={0.9}
              className="h-8 px-3 rounded-full border border-green-400 justify-center items-center"
            >
              <Text text="열림 재생" type="kb2023" className="text-green-600" />
            </TouchableOpacity>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );

  if (Platform.OS === 'ios') {
    return <InputAccessoryView nativeID={'DiaryAccessory'}>{Bar}</InputAccessoryView>;
  }

  return isKeyboardVisible ? (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: keyboardHeight }}>
      {Bar}
    </View>
  ) : null;
};

export default KeyboardAccessoryBar;


