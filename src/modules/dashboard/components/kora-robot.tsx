// Petit robot de Kora (bandeau « Conseil de Kora » de l'accueil), aux couleurs du logo.
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { BRAND } from '@/components/brand-logo';

export function KoraRobot({ width = 96 }: { width?: number }) {
  const height = width * 1.12;
  return (
    <Svg width={width} height={height} viewBox="0 0 100 112" accessibilityLabel="Kora">
      {/* Antennes lumineuses */}
      <Line x1="28" y1="14" x2="34" y2="22" stroke={BRAND.lime} strokeWidth="4" strokeLinecap="round" />
      <Line x1="50" y1="8" x2="50" y2="19" stroke={BRAND.lime} strokeWidth="4" strokeLinecap="round" />
      <Line x1="72" y1="14" x2="66" y2="22" stroke={BRAND.lime} strokeWidth="4" strokeLinecap="round" />
      {/* Oreilles */}
      <Rect x="5" y="38" width="12" height="26" rx="6" fill={BRAND.mint} />
      <Rect x="83" y="38" width="12" height="26" rx="6" fill={BRAND.mint} />
      {/* Tête */}
      <Rect x="13" y="26" width="74" height="50" rx="22" fill="#FFFFFF" />
      <Rect x="22" y="34" width="56" height="34" rx="15" fill={BRAND.navy} />
      {/* Yeux souriants */}
      <Path d="M33 54 Q38 47 43 54" stroke={BRAND.mint} strokeWidth="4" strokeLinecap="round" fill="none" />
      <Path d="M57 54 Q62 47 67 54" stroke={BRAND.mint} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Corps */}
      <Path d="M22 112 Q22 82 50 82 Q78 82 78 112 Z" fill="#FFFFFF" />
      <Circle cx="50" cy="99" r="9" fill="none" stroke={BRAND.mint} strokeWidth="4" />
    </Svg>
  );
}
