// Éléments propres au module Tâches. Les composants génériques viennent du kit partagé.
import { StyleSheet, Text, View } from 'react-native';

import { useKitStyles, kitStyles } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

import { PRIORITY_LABELS } from '../data';
import type { TaskPriority } from '../types';

export {
  BottomSheet,
  CheckCircle,
  Chip,
  ConfirmButton,
  IconButton,
  PrimaryButton,
  SecondaryButton,
  SheetOption,
  SwipeRow,
  Tag,
  TopBar,
  UndoToast,
} from '@/components/ui/kit';

/** Styles partagés (alias du kit, conservé pour les écrans Tâches). */
export const taskStyles = kitStyles;
/** Styles communs du mode actuel (clair ou sombre). */
export const useTaskStyles = useKitStyles;

type PriorityTone = { bg: string; fg: string; dot: string };

/** Couleurs des 4 niveaux de priorité (mode clair). */
export const PRIORITY_COLORS: Record<TaskPriority, PriorityTone> = {
  4: { bg: '#fee2e2', fg: '#b91c1c', dot: '#dc2626' },
  3: { bg: '#ffedd5', fg: '#c2410c', dot: '#ea580c' },
  2: { bg: '#e0e7ff', fg: '#3730a3', dot: '#4f46e5' },
  1: { bg: '#eef0f3', fg: '#4b5563', dot: '#9ca3af' },
};

/** Mêmes niveaux en mode sombre : fonds foncés, textes clairs. */
const PRIORITY_COLORS_DARK: Record<TaskPriority, PriorityTone> = {
  4: { bg: '#3B1D24', fg: '#FCA5A5', dot: '#F87171' },
  3: { bg: '#3A2717', fg: '#FDBA74', dot: '#FB923C' },
  2: { bg: '#232A55', fg: '#A5B4FC', dot: '#818CF8' },
  1: { bg: '#1E2A40', fg: '#CBD5E1', dot: '#94A3B8' },
};

/** Couleurs de priorité du mode actuel. */
export function usePriorityColors(): Record<TaskPriority, PriorityTone> {
  return useScopedColors().dark ? PRIORITY_COLORS_DARK : PRIORITY_COLORS;
}

export function PriorityBadge({ priority, withDot }: { priority: TaskPriority; withDot?: boolean }) {
  const { styles } = useLook();
  const colors = usePriorityColors()[priority];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      {withDot ? <View style={[styles.badgeDot, { backgroundColor: colors.dot }]} /> : null}
      <Text style={[styles.badgeText, { color: colors.fg }]}>{PRIORITY_LABELS[priority]}</Text>
    </View>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    badgeDot: {
      width: 7,
      height: 7,
      borderRadius: Radius.full,
    },
    badgeText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 17,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
