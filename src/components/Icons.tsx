import React from 'react';
import {View, StyleSheet} from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// 1. HOME ICON (Minimalist architectural outline)
export function HomeIcon({
  size = 20,
  color = '#171717',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      {/* Roof outline */}
      <View
        style={{
          width: s * 0.65,
          height: s * 0.65,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderColor: color,
          transform: [{rotate: '45deg'}],
          position: 'absolute',
          top: s * 0.12,
        }}
      />
      {/* Body container */}
      <View
        style={{
          width: s * 0.68,
          height: s * 0.52,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          position: 'absolute',
          bottom: s * 0.1,
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
        }}
      />
    </View>
  );
}

// 2. TEMPLATES ICON (4 Modular Grid Tiles)
export function TemplatesIcon({
  size = 20,
  color = '#171717',
}: IconProps): React.JSX.Element {
  const s = size;
  const tileSize = Math.round(s * 0.38);
  const gap = Math.max(2, Math.round(s * 0.1));
  return (
    <View style={{width: s, height: s, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'row', gap}}>
        <View style={{width: tileSize, height: tileSize, borderRadius: 1.5, backgroundColor: color}} />
        <View style={{width: tileSize, height: tileSize, borderRadius: 1.5, backgroundColor: color}} />
      </View>
      <View style={{flexDirection: 'row', gap, marginTop: gap}}>
        <View style={{width: tileSize, height: tileSize, borderRadius: 1.5, backgroundColor: color}} />
        <View style={{width: tileSize, height: tileSize, borderRadius: 1.5, backgroundColor: color}} />
      </View>
    </View>
  );
}

// 3. SAVED / BOOKMARK ICON (Clean ribbon stroke)
export function BookmarkIcon({
  size = 20,
  color = '#171717',
  strokeWidth = 1.6,
  filled = false,
}: IconProps & {filled?: boolean}): React.JSX.Element {
  const s = size;
  const w = Math.round(s * 0.65);
  const h = Math.round(s * 0.85);
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: strokeWidth,
          borderColor: color,
          backgroundColor: filled ? color : 'transparent',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        {/* Notch cutout */}
        <View
          style={{
            width: w * 0.7,
            height: w * 0.7,
            backgroundColor: filled ? color : '#FFFFFF',
            borderTopWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            transform: [{rotate: '45deg'}],
            marginBottom: -w * 0.35,
          }}
        />
      </View>
    </View>
  );
}

// 4. SETTINGS ICON (Minimalist Slider Controls / Sliders)
export function SettingsIcon({
  size = 20,
  color = '#171717',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, justifyContent: 'center', gap: 4, paddingHorizontal: 2}}>
      {/* Line 1 with knob */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: strokeWidth, backgroundColor: color}} />
        <View
          style={{
            width: 4.5,
            height: 4.5,
            borderRadius: 2.5,
            borderWidth: strokeWidth,
            borderColor: color,
            backgroundColor: '#FFFFFF',
            marginRight: 4,
          }}
        />
        <View style={{width: 3, height: strokeWidth, backgroundColor: color}} />
      </View>
      {/* Line 2 with knob */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 4, height: strokeWidth, backgroundColor: color}} />
        <View
          style={{
            width: 4.5,
            height: 4.5,
            borderRadius: 2.5,
            borderWidth: strokeWidth,
            borderColor: color,
            backgroundColor: '#FFFFFF',
            marginRight: 4,
          }}
        />
        <View style={{flex: 1, height: strokeWidth, backgroundColor: color}} />
      </View>
    </View>
  );
}

// 5. SHARE ICON (Minimal arrow pointing up out of base)
export function ShareIcon({
  size = 20,
  color = '#171717',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      {/* Arrow stem */}
      <View
        style={{
          width: strokeWidth,
          height: s * 0.5,
          backgroundColor: color,
          position: 'absolute',
          top: s * 0.15,
        }}
      />
      {/* Arrow head */}
      <View
        style={{
          width: s * 0.32,
          height: s * 0.32,
          borderTopWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [{rotate: '-45deg'}],
          position: 'absolute',
          top: s * 0.15,
        }}
      />
      {/* Base tray */}
      <View
        style={{
          width: s * 0.72,
          height: s * 0.35,
          borderBottomWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          position: 'absolute',
          bottom: s * 0.15,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        }}
      />
    </View>
  );
}

// 6. REFRESH ICON (Clean minimal reload arrow)
export function RefreshIcon({
  size = 18,
  color = '#171717',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: s * 0.75,
          height: s * 0.75,
          borderRadius: s * 0.4,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: 'transparent',
          transform: [{rotate: '30deg'}],
        }}
      />
      {/* Arrow cap */}
      <View
        style={{
          position: 'absolute',
          top: s * 0.12,
          right: s * 0.15,
          width: 0,
          height: 0,
          borderLeftWidth: 3,
          borderRightWidth: 3,
          borderTopWidth: 4,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          transform: [{rotate: '-45deg'}],
        }}
      />
    </View>
  );
}

// 7. SEARCH ICON (Minimalist magnifying glass)
export function SearchIcon({
  size = 18,
  color = '#6B6B6B',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  const circleSize = s * 0.55;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          position: 'absolute',
          top: s * 0.15,
          left: s * 0.15,
        }}
      />
      <View
        style={{
          width: strokeWidth,
          height: s * 0.35,
          backgroundColor: color,
          position: 'absolute',
          bottom: s * 0.15,
          right: s * 0.22,
          transform: [{rotate: '-45deg'}],
          borderRadius: 1,
        }}
      />
    </View>
  );
}

// 8. CLOSE / CLEAR ICON (Hairline cross)
export function CloseIcon({
  size = 16,
  color = '#6B6B6B',
  strokeWidth = 1.5,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: s * 0.65,
          height: strokeWidth,
          backgroundColor: color,
          position: 'absolute',
          transform: [{rotate: '45deg'}],
          borderRadius: 1,
        }}
      />
      <View
        style={{
          width: s * 0.65,
          height: strokeWidth,
          backgroundColor: color,
          position: 'absolute',
          transform: [{rotate: '-45deg'}],
          borderRadius: 1,
        }}
      />
    </View>
  );
}

// 9. CHEVRON RIGHT ICON
export function ChevronRightIcon({
  size = 16,
  color = '#8E8E8A',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: s * 0.38,
          height: s * 0.38,
          borderTopWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          transform: [{rotate: '45deg'}],
          marginRight: 2,
        }}
      />
    </View>
  );
}

// 10. CHEVRON LEFT / BACK ICON
export function ChevronLeftIcon({
  size = 18,
  color = '#171717',
  strokeWidth = 1.6,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: s * 0.38,
          height: s * 0.38,
          borderBottomWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderColor: color,
          transform: [{rotate: '45deg'}],
          marginLeft: 2,
        }}
      />
    </View>
  );
}

// 11. HEART / FAVORITE ICON (Clean minimal heart line / filled)
export function HeartIcon({
  size = 18,
  color = '#171717',
  filled = false,
  strokeWidth = 1.5,
}: IconProps & {filled?: boolean}): React.JSX.Element {
  const s = size;
  const lobeSize = s * 0.42;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: s * 0.8, height: s * 0.75, position: 'relative', marginTop: -2}}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            width: lobeSize,
            height: lobeSize,
            borderRadius: lobeSize / 2,
            backgroundColor: filled ? (color === '#171717' ? '#171717' : color) : 'transparent',
            borderWidth: filled ? 0 : strokeWidth,
            borderColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            width: lobeSize,
            height: lobeSize,
            borderRadius: lobeSize / 2,
            backgroundColor: filled ? (color === '#171717' ? '#171717' : color) : 'transparent',
            borderWidth: filled ? 0 : strokeWidth,
            borderColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: lobeSize * 0.35,
            left: s * 0.14,
            width: lobeSize * 1.25,
            height: lobeSize * 1.25,
            backgroundColor: filled ? (color === '#171717' ? '#171717' : color) : 'transparent',
            borderBottomWidth: filled ? 0 : strokeWidth,
            borderRightWidth: filled ? 0 : strokeWidth,
            borderColor: color,
            transform: [{rotate: '45deg'}],
          }}
        />
      </View>
    </View>
  );
}

// 12. TRASH / DELETE ICON
export function TrashIcon({
  size = 18,
  color = '#DC2626',
  strokeWidth = 1.5,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      {/* Lid */}
      <View
        style={{
          width: s * 0.75,
          height: strokeWidth,
          backgroundColor: color,
          marginBottom: 2,
          borderRadius: 1,
        }}
      />
      {/* Bin body */}
      <View
        style={{
          width: s * 0.58,
          height: s * 0.55,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderBottomWidth: strokeWidth,
          borderColor: color,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        }}
      />
    </View>
  );
}

// 13. CHECKMARK ICON
export function CheckIcon({
  size = 16,
  color = '#171717',
  strokeWidth = 1.8,
}: IconProps): React.JSX.Element {
  const s = size;
  return (
    <View style={{width: s, height: s, alignItems: 'center', justifyContent: 'center'}}>
      <View
        style={{
          width: s * 0.55,
          height: s * 0.32,
          borderBottomWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderColor: color,
          transform: [{rotate: '-45deg'}],
          marginTop: -s * 0.1,
        }}
      />
    </View>
  );
}
