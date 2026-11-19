// Kit d'interface partagé par les modules (style validé : fond lavande, cartes bordées,
// accents turquoise, bouton principal noir). Ne dépend d'aucun module métier.
import { router, type Href } from 'expo-router';
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
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Serene, Space } from '@/constants/design';


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
  const { c, styles } = useLook();
  const palette = {
    neutral: { bg: c.soft, fg: c.text, border: c.border },
    teal: { bg: c.tintMint, fg: c.link, border: 'transparent' },
    success: { bg: Serene.successContainer, fg: c.success, border: '#bbf7d0' },
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
  fallback = '/dashboard',
}: {
  title?: string;
  close?: boolean;
  right?: ReactNode;
  /** Écran ouvert si l'historique est vide (lien direct). */
  fallback?: Href;
}) {
  const { c, styles } = useLook();
  return (
    <View style={styles.topBar}>
      <Pressable
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={close ? 'Fermer' : 'Retour'}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}>
        <Icon name={close ? 'close' : 'arrow_back'} size={26} color={c.text} />
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
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}>
      <Icon name={icon} size={24} color={c.text} />
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
  const { c, styles } = useLook();
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
      {icon ? <Icon name={icon} size={22} color={c.solidText} /> : null}
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

/** Bouton de validation turquoise (réservé aux actions d'achèvement). */
export function ConfirmButton({ label, onPress, icon, style }: ButtonProps) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.confirm, pressed && styles.confirmPressed, style]}
      accessibilityRole="button"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={22} color={c.solidText} /> : null}
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
  const { c, styles } = useLook();
  const color = danger ? c.error : c.text;
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
  const { c, styles } = useLook();
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
      {icon ? <Icon name={icon} size={18} color={selected ? c.solidText : c.text} /> : null}
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
  const { c, styles } = useLook();
  return (
    <Pressable
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.check, square && styles.checkSquare, checked && styles.checkOn]}>
      {checked ? <Icon name="check" size={16} color={c.solidText} /> : null}
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
  const { styles } = useLook();
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
  const { styles } = useLook();
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
  const { c, styles } = useLook();
  const color = danger ? c.error : c.text;
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
      <Icon name="chevron_right" size={20} color={c.muted} />
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
  rightIcon = 'check_circle',
  leftIcon = 'schedule',
  rightColor,
  leftColor = '#ea580c',
}: {
  children: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightLabel: string;
  leftLabel: string;
  rightIcon?: string;
  leftIcon?: string;
  rightColor?: string;
  leftColor?: string;
}) {
  const { c, styles } = useLook();
  const rightTint = rightColor ?? c.link;
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
          { backgroundColor: direction === 'left' ? leftColor : rightTint },
          direction === null && styles.hidden,
        ]}>
        {direction === 'right' ? (
          <View style={styles.swipeHint}>
            <Icon name={rightIcon} size={22} color={c.solidText} filled />
            <Text style={styles.swipeHintText}>{rightLabel}</Text>
          </View>
        ) : null}
        <View style={styles.flex} />
        {direction === 'left' ? (
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>{leftLabel}</Text>
            <Icon name={leftIcon} size={22} color={c.solidText} />
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

function makeKitStyles(c: AppColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.page,
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
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 2,
    },
    cardPressed: {
      backgroundColor: c.soft,
    },
    sectionTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3,
      color: c.text,
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 17,
      lineHeight: 23,
      color: c.text,
    },
    muted: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
    },
    label: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
    },
    input: {
      minHeight: 54,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      // Champs blancs (couleur des cartes) pour bien ressortir sur le fond de page.
      backgroundColor: c.card,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    inputFocused: {
      borderColor: c.link,
      backgroundColor: c.card,
    },
    inputError: {
      borderColor: c.error,
      backgroundColor: c.card,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
  });
}

const KITSTYLES_SHEETS = { light: makeKitStyles(LIGHT), dark: makeKitStyles(DARK) };
/** Version claire (écrans pas encore convertis au mode sombre). */
export const kitStyles = KITSTYLES_SHEETS.light;

/** kitStyles du mode actuel. */
export function useKitStyles() {
  return useScopedColors().dark ? KITSTYLES_SHEETS.dark : KITSTYLES_SHEETS.light;
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
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
      color: c.text,
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
      backgroundColor: c.solid,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: 18,
      shadowColor: c.solid,
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
      backgroundColor: c.solidPressed,
      transform: [{ scale: 0.99 }],
    },
    primaryText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 17,
      lineHeight: 22,
      color: c.solidText,
    },
    confirm: {
      height: 56,
      borderRadius: 18,
      backgroundColor: c.link,
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
      borderColor: c.border,
      backgroundColor: c.card,
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
      backgroundColor: c.soft,
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
      borderColor: c.border,
      backgroundColor: c.card,
    },
    chipSelected: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    chipText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
      color: c.text,
    },
    chipTextSelected: {
      color: c.solidText,
    },
    chipCount: {
      minWidth: 20,
      height: 20,
      paddingHorizontal: 5,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
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
      color: c.text,
    },
    chipCountTextSelected: {
      color: c.solidText,
    },
    check: {
      width: 26,
      height: 26,
      borderRadius: Radius.full,
      borderWidth: 2,
      borderColor: '#b9c4d6',
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkSquare: {
      borderRadius: 7,
    },
    checkOn: {
      backgroundColor: c.link,
      borderColor: c.link,
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
      backgroundColor: c.text,
      shadowColor: c.text,
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
      color: c.solidText,
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
      backgroundColor: c.card,
      shadowColor: c.text,
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
      backgroundColor: c.border,
      marginBottom: 14,
    },
    sheetTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      color: c.text,
    },
    sheetSubtitle: {
      fontFamily: FontFamily.body,
      fontSize: 15,
      lineHeight: 21,
      color: c.muted,
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
      borderColor: c.border,
    },
    optionIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: c.soft,
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
      color: c.muted,
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
    swipeHint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    swipeHintText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.solidText,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
