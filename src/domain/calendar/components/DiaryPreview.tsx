import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Text as AppText } from '@components/Text';
import { DiaryEntry } from '@/shared/types/diary';
import { FLOWER_IMAGES } from '@constants/normal';
import { formatSelectedDate as splitSelectedDate } from '@libs/date';

const weatherLabels = ['맑음', '비', '구름', '바람', '눈'] as const;

type DiaryPreviewProps = { date: Date; entry: DiaryEntry };

export const DiaryPreview = ({ date, entry }: DiaryPreviewProps) => {
  const { year, month, day } = splitSelectedDate(date);
  const label = weatherLabels[entry.weather] ?? weatherLabels[0];
  const [containerWidth, setContainerWidth] = useState(0);
  const flowerIndex = entry.flowerIndex;
  const flowerSource = flowerIndex
    ? FLOWER_IMAGES[(Math.max(1, Math.min(flowerIndex, FLOWER_IMAGES.length)) - 1)]
    : undefined;
  const resolved = flowerSource ? Image.resolveAssetSource(flowerSource) : undefined;
  const horizontalPadding = 16;
  const availableWidth = Math.max(0, containerWidth - horizontalPadding * 2);
  const lineHeight = 24;
  const paddingTop = 12;
  const numberOfLines = 20;
  const imageAspectHeight = resolved?.width && resolved?.height
    ? ((availableWidth * resolved.height) / resolved.width)
    : 0;

  return (
    <View className="w-full border border border-line rounded-lg overflow-hidden mb-48">
      {/* 헤더: 날짜/날씨 */}
      <View className="flex-row items-center justify-center border-b border-line p-2">
        <View className="flex-row items-center justify-end flex-1">
          <AppText text={`${year}`} type="kb2019" className="text-text-black text-xl"/>
          <AppText text=' 년  ' type="black" className="text-text-black text-xl"/>
          <AppText text={`${month}`} type="kb2019" className="text-text-black text-xl"/>
          <AppText text=' 월  ' type="black" className="text-text-black text-xl"/>
          <AppText text={`${day}`} type="kb2019" className="text-text-black text-xl"/>
          <AppText text=' 일  ' type="black" className="text-text-black text-xl"/>
        </View>
        <View className="flex-row items-center justify-start w-5/12">
          <AppText text='날씨:  ' type="black" className="text-text-black text-xl"/>
          <AppText text={label} type='kb2019' className="text-text-black text-xl text-center w-10 "/>
        </View>
      </View>

      {/* 본문: 라인 배경 + 내용 */}
      <View className="relative" onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {/* 라인 배경 */}
        <View className="absolute inset-0" style={{ paddingTop: paddingTop, paddingLeft: 16, paddingRight: 16 }}>
          {Array.from({ length: numberOfLines }, (_, index) => (
            <View
              key={index}
              className="border-b border-line"
              style={{ height: lineHeight, marginBottom: 0 }}
            />
          ))}
        </View>

        {/* 꽃 이미지 오버레이 */}
        {flowerSource ? (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: horizontalPadding, right: horizontalPadding, top: paddingTop, height: imageAspectHeight, zIndex: 15 }}
          >
            <Image source={flowerSource} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
          </View>
        ) : null}

        {/* 내용 */}
        <View className="py-3 px-6">
          <AppText
            text={entry.content}
            type="kb2019"
            className="text-text-black text-base"
            style={{ lineHeight, textAlignVertical: 'top', minHeight: numberOfLines * lineHeight + 24 }}
          />
        </View>

        {/* 코멘트 */}
        {entry.comment ? (
          <View pointerEvents="none" className="px-6 pb-4">
            <AppText
              text={entry.comment}
              type="kb2023"
              className="text-text-blue text-xl"
              style={{ transform: [{ rotate: '-1deg' }] }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};
