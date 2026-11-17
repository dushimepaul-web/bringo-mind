// Anneaux de couleur unie (maquette validée : pas de dégradé hors du logo).
// Partagés : anneau de progression, contour d'avatar, bouton central de la barre d'onglets.
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/** Turquoise de la maquette (anneaux, bouton « Voir mon planning », accents). */
export const TURQUOISE = '#01D7C3';

/** Anneau uni autour d'un contenu (avatar, bouton). `size` = diamètre extérieur. */
export function OutlineRing({
  size,
  stroke = 3,
  color = TURQUOISE,
  children,
  style,
}: {
  size: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        styles.center,
        { width: size, height: size, borderRadius: size / 2, borderWidth: stroke, borderColor: color },
        style,
      ]}>
      {children}
    </View>
  );
}

/** Anneau de progression (0 → 1) uni sur un rail clair ; le contenu s'affiche au centre. */
export function ProgressRing({
  size,
  stroke = 12,
  progress,
  color = TURQUOISE,
  track = '#D9F8F8',
  children,
}: {
  size: number;
  stroke?: number;
  progress: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(1, progress));
  return (
    <View style={[{ width: size, height: size }, styles.center]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - value)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
