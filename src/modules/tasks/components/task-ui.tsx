// Éléments visuels partagés par les écrans du module Tâches (style validé :
// fond lavande, cartes bordées, accents turquoise, bouton principal noir).
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { FontFamily, Radius, Serene, Space, Tint } from '@/constants/design';

import { PRIORITY_LABELS } from '../data';
import type { TaskPriority } from '../types';

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

/** Petite pastille neutre (statut, partage…). */
export function Tag({
  icon,
  label,
  tone = 'neutral',
}: {
  icon?: string;
  label: string;
  tone?: 'neutral' | 'teal' | 'success' | 'danger';
}) {
  const palette = {
    neutral: { bg: Tint.soft, fg: Tint.navy, border: Tint.border },
    teal: { bg: Serene.secondaryContainer, fg: Serene.onSecondaryContainer, border: 'transparent' },
    success: { bg: Serene.successContainer, fg: Serene.success, border: '#bbf7d0' },
    danger: { bg: '#fee2e2', fg: '#b91c1c', border: 'transparent' },
  }[tone];
  return (
    <View style={[styles.tag, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      {icon ? <Icon name={icon} size={14} color={palette.fg} /> : null}
      <Text style={[styles.tagText, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

/** En-tête d'écran secondaire : flèche retour (ou fermer), titre, action à droite. */
export function TopBar({
  title,
  close,
  right,
}: {
  title?: string;
  close?: boolean;
  right?: ReactNode;
}) {
  return (
    <View style={styles.topBar}>
      <Pressable
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={close ? 'Fermer' : 'Retour'}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/tasks'))}>
        <Icon name={close ? 'close' : 'arrow_back'} size={26} color={Tint.navy} />
      </Pressable>
      {title ? (
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.flex} />
      )}
      <View style={styles.topBarRight}>{right}</View>
    </View>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}>
      <Icon name={icon} size={24} color={Tint.navy} />
    </Pressable>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Bouton principal noir (estompé quand il est désactivé). */
export function PrimaryButton({ label, onPress, icon, disabled, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.primary,
        disabled && styles.primaryDisabled,
        pressed && !disabled && styles.primaryPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}>
      {icon ? <Icon name={icon} size={22} color={Serene.onPrimary} /> : null}
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

/** Bouton de validation turquoise (réservé aux actions d'achèvement). */
export function ConfirmButton({ label, onPress, icon, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.confirm, pressed && styles.confirmPressed, style]}
      accessibilityRole="button"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={22} color={Serene.onPrimary} /> : null}
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

/** Bouton secondaire blanc bordé. */
export function SecondaryButton({
  label,
  onPress,
  icon,
  danger,
  style,
}: ButtonProps & { danger?: boolean }) {
  const color = danger ? Serene.error : Tint.navy;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.secondary,
        danger && styles.secondaryDanger,
        pressed && styles.secondaryPressed,
        style,
      ]}
      accessibilityRole="button"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={20} color={color} /> : null}
      <Text style={[styles.secondaryText, { color }]}>{label}</Text>
    </Pressable>
  );
}

/** Puce sélectionnable (filtres, catégories, dates rapides). */
export function Chip({
  label,
  selected,
  onPress,
  icon,
  count,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: string;
  count?: number;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && !selected && styles.secondaryPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}>
      {icon ? <Icon name={icon} size={18} color={selected ? Serene.onPrimary : Tint.navy} /> : null}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
      {count != null ? (
        <View style={[styles.chipCount, selected && styles.chipCountSelected]}>
          <Text style={[styles.chipCountText, selected && styles.chipCountTextSelected]}>
            {count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** Case à cocher ronde (tâche) ou carrée (sous-tâche). */
export function CheckCircle({
  checked,
  onPress,
  label,
  square,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
  square?: boolean;
}) {
  return (
    <Pressable
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.check, square && styles.checkSquare, checked && styles.checkOn]}>
      {checked ? <Icon name="check" size={16} color={Serene.onPrimary} /> : null}
    </Pressable>
  );
}

/** Message temporaire en bas d'écran, avec « Annuler ». */
export function UndoToast({
  text,
  onUndo,
  onHide,
  bottom = 96,
}: {
  text: string;
  onUndo?: () => void;
  onHide: () => void;
  bottom?: number;
}) {
  const [opacity] = useState(() => new Animated.Value(0));
  const hideRef = useRef(onHide);

  useEffect(() => {
    hideRef.current = onHide;
  }, [onHide]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
    const timer = setTimeout(() => hideRef.current(), 4500);
    return () => clearTimeout(timer);
  }, [opacity, text]);

  return (
    <Animated.View
      style={[styles.toast, { bottom, opacity }]}
      accessibilityLiveRegion="polite"
      pointerEvents="box-none">
      <Icon name="check_circle" size={20} color={Serene.secondaryFixed} filled />
      <Text style={styles.toastText} numberOfLines={2}>
        {text}
      </Text>
      {onUndo ? (
        <Pressable
          hitSlop={10}
          accessibilityRole="button"
          onPress={() => {
            onUndo();
            hideRef.current();
          }}>
          <Text style={styles.toastAction}>Annuler</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

/** Feuille qui monte du bas de l'écran. */
export function BottomSheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel="Fermer"
        onPress={onClose}
      />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Space.md) + 8 }]}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sheetSubtitle}>{subtitle}</Text> : null}
        <View style={styles.sheetBody}>{children}</View>
      </View>
    </Modal>
  );
}

/** Ligne d'action dans une feuille. */
export function SheetOption({
  icon,
  label,
  hint,
  danger,
  onPress,
}: {
  icon: string;
  label: string;
  hint?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  const color = danger ? Serene.error : Tint.navy;
  return (
    <Pressable
      style={({ pressed }) => [styles.option, pressed && styles.secondaryPressed]}
      accessibilityRole="button"
      onPress={onPress}>
      <View style={[styles.optionIcon, danger && styles.optionIconDanger]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.optionLabel, { color }]}>{label}</Text>
        {hint ? <Text style={styles.optionHint}>{hint}</Text> : null}
      </View>
      <Icon name="chevron_right" size={20} color={Serene.onSurfaceVariant} />
    </Pressable>
  );
}

/**
 * Ligne de liste à balayer : vers la droite pour terminer, vers la gauche pour reporter.
 * Les gestes s'ajoutent aux boutons : chaque action reste accessible sans balayage.
 */
export function SwipeRow({
  children,
  onSwipeRight,
  onSwipeLeft,
  rightLabel,
  leftLabel,
}: {
  children: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightLabel: string;
  leftLabel: string;
}) {
  const [offset] = useState(() => new Animated.Value(0));
  const start = useRef<{ x: number; y: number } | null>(null);
  const horizontal = useRef(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const THRESHOLD = 90;

  const reset = () => {
    Animated.spring(offset, {
      toValue: 0,
      useNativeDriver: Platform.OS !== 'web',
      bounciness: 6,
    }).start();
    setDirection(null);
  };

  return (
    <View style={styles.swipeWrap}>
      <View
        style={[
          styles.swipeBg,
          direction === 'left' ? styles.swipeBgLeft : styles.swipeBgRight,
          direction === null && styles.hidden,
        ]}>
        {direction === 'right' ? (
          <View style={styles.swipeHint}>
            <Icon name="check_circle" size={22} color={Serene.onPrimary} filled />
            <Text style={styles.swipeHintText}>{rightLabel}</Text>
          </View>
        ) : null}
        <View style={styles.flex} />
        {direction === 'left' ? (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>{leftLabel}</Text>
            <Icon name="schedule" size={22} color={Serene.onPrimary} />
          </View>
        ) : null}
      </View>
      <Animated.View
        style={{ transform: [{ translateX: offset }] }}
        onTouchStart={(event) => {
          start.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
          horizontal.current = false;
        }}
        onTouchMove={(event) => {
          if (!start.current) return;
          const dx = event.nativeEvent.pageX - start.current.x;
          const dy = event.nativeEvent.pageY - start.current.y;
          if (!horizontal.current && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            horizontal.current = true;
          }
          if (!horizontal.current) return;
          const allowed = (dx > 0 && onSwipeRight) || (dx < 0 && onSwipeLeft);
          if (!allowed) return;
          offset.setValue(Math.max(-140, Math.min(140, dx)));
          setDirection(dx > 0 ? 'right' : 'left');
        }}
        onTouchEnd={(event) => {
          const origin = start.current;
          start.current = null;
          if (!origin || !horizontal.current) {
            reset();
            return;
          }
          const dx = event.nativeEvent.pageX - origin.x;
          if (dx > THRESHOLD && onSwipeRight) onSwipeRight();
          else if (dx < -THRESHOLD && onSwipeLeft) onSwipeLeft();
          reset();
        }}
        onTouchCancel={() => {
          start.current = null;
          reset();
        }}>
        {children}
      </Animated.View>
    </View>
  );
}

export const taskStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Tint.softer,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Space.gutter,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: Tint.soft,
  },
  sectionTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    color: Tint.navy,
  },
  title: {
    fontFamily: FontFamily.headingBold,
    fontSize: 17,
    lineHeight: 23,
    color: Tint.navy,
  },
  muted: {
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Serene.onSurfaceVariant,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.navy,
  },
  input: {
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Tint.soft,
    fontFamily: FontFamily.body,
    fontSize: 16,
    lineHeight: 22,
    color: Tint.navy,
    outlineWidth: 0,
  },
  inputFocused: {
    borderColor: Tint.primary,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  inputError: {
    borderColor: Serene.error,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
  pressed: {
    opacity: 0.55,
  },
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
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    lineHeight: 17,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  topBarTitle: {
    flex: 1,
    fontFamily: FontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    color: Tint.navy,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Tint.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
    shadowColor: Tint.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryDisabled: {
    opacity: 0.3,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryPressed: {
    backgroundColor: Tint.blackPressed,
    transform: [{ scale: 0.99 }],
  },
  primaryText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 17,
    lineHeight: 22,
    color: Serene.onPrimary,
  },
  confirm: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Tint.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },
  confirmPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  secondary: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  secondaryDanger: {
    borderColor: '#fecaca',
    backgroundColor: '#fff5f5',
  },
  secondaryPressed: {
    backgroundColor: Tint.soft,
  },
  secondaryText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  chipSelected: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  chipText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Tint.navy,
  },
  chipTextSelected: {
    color: Serene.onPrimary,
  },
  chipCount: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCountSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chipCountText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    color: Tint.navy,
  },
  chipCountTextSelected: {
    color: Serene.onPrimary,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#b9c4d6',
    backgroundColor: Serene.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSquare: {
    borderRadius: 7,
  },
  checkOn: {
    backgroundColor: Tint.primary,
    borderColor: Tint.primary,
  },
  toast: {
    position: 'absolute',
    left: Space.gutter,
    right: Space.gutter,
    alignSelf: 'center',
    maxWidth: 528,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Tint.navy,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  toastText: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
  toastAction: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.secondaryFixed,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Serene.surfaceContainerLowest,
    shadowColor: Tint.navy,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: Tint.border,
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: FontFamily.headingBold,
    fontSize: 20,
    lineHeight: 26,
    color: Tint.navy,
  },
  sheetSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 15,
    lineHeight: 21,
    color: Serene.onSurfaceVariant,
    marginTop: 4,
  },
  sheetBody: {
    marginTop: 14,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconDanger: {
    backgroundColor: '#fee2e2',
  },
  optionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
  },
  optionHint: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  swipeWrap: {
    position: 'relative',
  },
  swipeBg: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swipeBgRight: {
    backgroundColor: Tint.primary,
  },
  swipeBgLeft: {
    backgroundColor: '#ea580c',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swipeHintText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Serene.onPrimary,
  },
});
