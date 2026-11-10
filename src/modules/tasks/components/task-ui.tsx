// Éléments propres au module Tâches. Les composants génériques viennent du kit partagé.
import { StyleSheet, Text, View } from 'react-native';

import { kitStyles } from '@/components/ui/kit';
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

/** Couleurs des 4 niveaux de priorité. */
export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; fg: string; dot: string }> = {
  4: { bg: '#fee2e2', fg: '#b91c1c', dot: '#dc2626' },
  3: { bg: '#ffedd5', fg: '#c2410c', dot: '#ea580c' },
  2: { bg: '#e0e7ff', fg: '#3730a3', dot: '#4f46e5' },
  1: { bg: '#eef0f3', fg: '#4b5563', dot: '#9ca3af' },
};

export function PriorityBadge({ priority, withDot }: { priority: TaskPriority; withDot?: boolean }) {
  const colors = PRIORITY_COLORS[priority];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      {withDot ? <View style={[styles.badgeDot, { backgroundColor: colors.dot }]} /> : null}
      <Text style={[styles.badgeText, { color: colors.fg }]}>{PRIORITY_LABELS[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
