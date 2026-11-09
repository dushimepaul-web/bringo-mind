import { StyleSheet, Text, View } from 'react-native';

import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

/** Logo Bringo Mind : « K » blanc sur bleu nuit, avec le trait turquoise. */
export function BrandLogo({ size = 40 }: { size?: number }) {
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          shadowOpacity: size >= 56 ? 0.25 : 0.18,
          shadowRadius: size >= 56 ? 12 : 8,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Text
        style={[
          styles.letter,
          { fontSize: Math.round(size * 0.59), lineHeight: Math.round(size * 0.69) },
        ]}>
        K
      </Text>
      <View
        style={[
          styles.swoosh,
          {
            bottom: Math.round(size * 0.19),
            right: Math.round(size * 0.125),
            width: Math.round(size * 0.47),
            height: Math.max(3, Math.round(size * 0.11)),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: Tint.navy,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  letter: {
    fontFamily: FontFamily.headingBold,
    color: Serene.onPrimary,
  },
  swoosh: {
    position: 'absolute',
    borderRadius: Radius.full,
    backgroundColor: Tint.primary,
    transform: [{ rotate: '-18deg' }],
  },
});
