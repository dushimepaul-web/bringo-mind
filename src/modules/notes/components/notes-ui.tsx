// Éléments d'interface du module Notes, en clair et en sombre (palette useAppColors).
import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/components/brand-logo';
import { Icon } from '@/components/icon';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

import type { NoteColor } from '../store';

/** Couleur de chaque note : trait (identique) et fond de pastille (selon le mode). */
export const NOTE_COLORS: Record<NoteColor, { bar: string; tint: 'tintBlue' | 'tintMint' | 'tintLime' | 'soft'; label: string }> = {
  blue: { bar: BRAND.blue, tint: 'tintBlue', label: 'Bleu' },
  mint: { bar: '#0FB5A3', tint: 'tintMint', label: 'Menthe' },
  lime: { bar: '#5BB81E', tint: 'tintLime', label: 'Citron' },
  navy: { bar: '#5B6B8C', tint: 'soft', label: 'Ardoise' },
};

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du module pour le mode actuel. */
export function useNotesUi() {
  const c = useAppColors();
  return { c, ui: c.dark ? STYLES.dark : STYLES.light };
}

/** En-tête : retour (ou fermer), titre, action à droite. */
export function NotesHeader({ title, close, right, fallback = '/dashboard' }: { title: string; close?: boolean; right?: ReactNode; fallback?: Href }) {
  const { c, ui } = useNotesUi();
  return (
    <View style={ui.header}>
      <Pressable
        style={({ pressed }) => [ui.iconButton, pressed && ui.pressed]}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={close ? 'Fermer' : 'Retour'}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}>
        <Icon name={close ? 'close' : 'arrow_back'} size={26} color={c.text} />
      </Pressable>
      <Text style={ui.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={ui.headerRight}>{right}</View>
    </View>
  );
}

export function NotesIconButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  const { c, ui } = useNotesUi();
  return (
    <Pressable style={({ pressed }) => [ui.iconButton, pressed && ui.pressed]} hitSlop={4} accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      <Icon name={icon} size={26} color={c.text} />
    </Pressable>
  );
}

/** Bouton plein foncé en clair, clair en sombre (estompé si désactivé). */
export function NotesButton({ label, icon, onPress, disabled, danger }: { label: string; icon?: string; onPress: () => void; disabled?: boolean; danger?: boolean }) {
  const { c, ui } = useNotesUi();
  const color = danger ? (c.dark ? '#F87171' : '#B91C1C') : c.solidText;
  return (
    <Pressable
      style={({ pressed }) => [danger ? ui.dangerButton : ui.button, disabled && ui.disabled, pressed && !disabled && ui.pressed]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}>
      {icon ? <Icon name={icon} size={22} color={color} /> : null}
      <Text style={[ui.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.page },
    content: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
    pressed: { opacity: 0.8 },
    header: { height: 56, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
    headerTitle: { flex: 1, fontFamily: FontFamily.headingBold, fontSize: 20, lineHeight: 26, color: c.text },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    iconButton: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
    card: {
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      shadowColor: '#0C1A37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 12,
      elevation: 2,
    },
    cardPressed: { opacity: 0.85 },
    title: { fontFamily: FontFamily.headingBold, fontSize: 17, lineHeight: 23, color: c.text },
    label: { fontFamily: FontFamily.bodySemiBold, fontSize: 15, lineHeight: 20, color: c.text },
    muted: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20, color: c.muted },
    input: {
      minHeight: 54,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.input,
      fontFamily: FontFamily.body,
      fontSize: 16,
      lineHeight: 22,
      color: c.text,
      outlineWidth: 0,
      outlineStyle: 'solid',
    },
    inputFocused: { borderColor: c.link },
    button: {
      minHeight: 56,
      borderRadius: 16,
      backgroundColor: c.solid,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    dangerButton: {
      minHeight: 52,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.dark ? '#5B2A2A' : '#FECACA',
      backgroundColor: c.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    disabled: { opacity: 0.4 },
    buttonText: { fontFamily: FontFamily.bodySemiBold, fontSize: 16, lineHeight: 21 },
  });
}
