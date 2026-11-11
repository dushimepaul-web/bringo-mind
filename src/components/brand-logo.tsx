// Logo Bringo Mind : le « b » (barre arrondie + anneau) et le point turquoise, dans une tuile arrondie.
// Redessiné en formes simples d'après le logo officiel (assets/images/brand/) : net à toutes les tailles.
// Coordonnées d'origine sur une tuile de 1024 px, mises à l'échelle avec `size`.
import { StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/design';

export const BRAND = {
  navy: '#131c2d',
  teal: '#2fd5c1',
  tealDark: '#006a61',
  mint: '#86f2e4',
  white: '#ffffff',
} as const;

type Variant = 'dark' | 'light';

/**
 * Tuile du logo.
 * - `dark` (par défaut) : tuile bleu nuit, « b » blanc, point turquoise vif.
 * - `light` : tuile blanche, « b » bleu nuit, point vert foncé (pour un fond sombre).
 */
export function BrandLogo({ size = 40, variant = 'dark', shadow = true }: { size?: number; variant?: Variant; shadow?: boolean }) {
  const s = size / 1024;
  const tile = variant === 'dark' ? BRAND.navy : BRAND.white;
  const ink = variant === 'dark' ? BRAND.white : BRAND.navy;
  const dot = variant === 'dark' ? BRAND.teal : BRAND.tealDark;
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.225,
          backgroundColor: tile,
        },
        shadow && styles.shadow,
        shadow && { shadowOpacity: size >= 56 ? 0.25 : 0.16, shadowRadius: size >= 56 ? 12 : 6 },
      ]}
      accessibilityRole="image"
      accessibilityLabel="Bringo Mind">
      {/* Anneau du « b » */}
      <View
        style={{
          position: 'absolute',
          left: 296 * s,
          top: 373 * s,
          width: 464 * s,
          height: 464 * s,
          borderRadius: 232 * s,
          borderWidth: 129 * s,
          borderColor: ink,
        }}
      />
      {/* Barre du « b » */}
      <View
        style={{
          position: 'absolute',
          left: 265 * s,
          top: 187 * s,
          width: 127 * s,
          height: 648 * s,
          borderRadius: 63.5 * s,
          backgroundColor: ink,
        }}
      />
      {/* Point */}
      <View
        style={{
          position: 'absolute',
          left: 661 * s,
          top: 183 * s,
          width: 162 * s,
          height: 162 * s,
          borderRadius: 81 * s,
          backgroundColor: dot,
        }}
      />
    </View>
  );
}

/** Logo complet : tuile + « bringo mind ». `onDark` pour un fond bleu nuit. */
export function BrandWordmark({ size = 40, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Bringo Mind">
      <BrandLogo size={size} variant={onDark ? 'light' : 'dark'} shadow={!onDark} />
      <Text style={[styles.word, { fontSize: size * 0.62, lineHeight: size * 0.8, marginLeft: size * 0.3 }]}>
        <Text style={{ color: onDark ? BRAND.white : BRAND.navy }}>bringo </Text>
        <Text style={[styles.mind, { color: onDark ? BRAND.mint : BRAND.tealDark }]}>mind</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: BRAND.navy,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    fontFamily: FontFamily.headingBold,
    letterSpacing: -0.5,
  },
  mind: {
    fontFamily: FontFamily.bodySemiBold,
  },
});
