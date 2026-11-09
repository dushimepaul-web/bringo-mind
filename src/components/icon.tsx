import { Text, type TextStyle } from 'react-native';

import { FontFamily, Serene } from '@/constants/design';

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: TextStyle;
};

export function Icon({ name, size = 20, color = Serene.onSurface, filled, style }: IconProps) {
  return (
    <Text
      selectable={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        {
          fontFamily: filled ? FontFamily.iconFilled : FontFamily.icon,
          fontSize: size,
          lineHeight: size,
          color,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}>
      {name}
    </Text>
  );
}
