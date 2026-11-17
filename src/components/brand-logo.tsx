// Logo officiel Bringo Mind : le « B » en bulle de dialogue (dégradé cyan → vert) dans une tuile bleu nuit,
// et le nom « BringoMind » (« Bringo » bleu nuit, « Mind » en dégradé).
// Images dans assets/images/brand/ ; la tuile est dessinée en vue pour rester nette à toutes les tailles.
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

/** Couleurs mesurées sur le logo officiel (assets/images/brand/bringo-mind-logo.jpg). */
export const BRAND = {
  navy: '#0C1A37',
  cyan: '#02DFF8',
  blue: '#016EDE',
  mint: '#14E5AA',
  emerald: '#0CA07C',
  lime: '#A9F423',
  green: '#9BE83A',
  teal: '#2fd5c1',
  tealDark: '#006a61',
  white: '#ffffff',
} as const;

export const BRAND_IMAGES = {
  symbol: require('@/assets/images/brand/bringo-mind-symbol.png'),
  wordmark: require('@/assets/images/brand/bringo-mind-wordmark.png'),
  wordmarkDark: require('@/assets/images/brand/bringo-mind-wordmark-dark.png'),
  full: require('@/assets/images/brand/bringo-mind-logo-auth.png'),
  fullDark: require('@/assets/images/brand/bringo-mind-logo-auth-dark.png'),
} as const;

/** Rapport largeur / hauteur du logo complet (assets/images/logo-auth.jpeg, détouré). */
export const FULL_LOGO_RATIO = 2798 / 596;

/** Rapport largeur / hauteur de l'image du nom. */
export const WORDMARK_RATIO = 3123 / 636;
/** Place du symbole dans la tuile (comme sur le logo officiel). */
export const SYMBOL_RATIO = 0.88;

type Variant = 'dark' | 'light';

/**
 * Tuile du logo.
 * - `dark` (par défaut) : tuile bleu nuit, comme le logo officiel.
 * - `light` : tuile blanche (sur un fond bleu nuit).
 */
export function BrandLogo({ size = 40, variant = 'dark', shadow = true }: { size?: number; variant?: Variant; shadow?: boolean }) {
  const symbol = size * SYMBOL_RATIO;
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.225,
          backgroundColor: variant === 'dark' ? BRAND.navy : BRAND.white,
        },
        shadow && styles.shadow,
        shadow && { shadowOpacity: size >= 56 ? 0.25 : 0.16, shadowRadius: size >= 56 ? 12 : 6 },
      ]}
      accessibilityRole="image"
      accessibilityLabel="Bringo Mind">
      <Image source={BRAND_IMAGES.symbol} style={{ width: symbol, height: symbol }} contentFit="contain" />
    </View>
  );
}

/** Logo officiel complet (tuile + « BringoMind ») en une image ; `onDark` = « Bringo » en blanc. */
export function BrandFullLogo({ height = 44, onDark = false }: { height?: number; onDark?: boolean }) {
  return (
    <Image
      source={onDark ? BRAND_IMAGES.fullDark : BRAND_IMAGES.full}
      style={{ width: height * FULL_LOGO_RATIO, height }}
      contentFit="contain"
      accessibilityRole="image"
      accessibilityLabel="Bringo Mind"
    />
  );
}

/** Nom officiel « BringoMind » (image) ; `height` en points, `onDark` pour un fond bleu nuit. */
export function BrandName({ height = 30, onDark = false }: { height?: number; onDark?: boolean }) {
  return (
    <Image
      source={onDark ? BRAND_IMAGES.wordmarkDark : BRAND_IMAGES.wordmark}
      style={{ width: height * WORDMARK_RATIO, height }}
      contentFit="contain"
      accessibilityRole="image"
      accessibilityLabel="Bringo Mind"
    />
  );
}

/** Logo complet : tuile + nom « BringoMind ». `onDark` pour un fond bleu nuit. */
export function BrandWordmark({ size = 40, onDark = false }: { size?: number; onDark?: boolean }) {
  const height = size * 0.62;
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Bringo Mind">
      <BrandLogo size={size} shadow={!onDark} />
      <Image
        source={onDark ? BRAND_IMAGES.wordmarkDark : BRAND_IMAGES.wordmark}
        style={{ width: height * WORDMARK_RATIO, height, marginLeft: size * 0.3 }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
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
});
