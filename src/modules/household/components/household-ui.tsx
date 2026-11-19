// Composants communs aux écrans du Foyer.
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Tag } from '@/components/ui/kit';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

import { ROLE_LABELS, initials } from '../data';
import { householdActions, useHouseholdState } from '../store';
import type { HouseholdRole } from '../types';

export function Avatar({
  name,
  color,
  size = 44,
  kora,
}: {
  name: string;
  color: string;
  size?: number;
  kora?: boolean;
}) {
  const { c, styles } = useLook();
  return (
    <View
      style={[
        styles.avatar,
        // Kora : pastille bleu nuit ; en sombre, un fin contour garde chaque avatar visible.
        { width: size, height: size, backgroundColor: kora ? '#0C1A37' : color },
        c.dark && styles.avatarDark,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no">
      {kora ? (
        <Icon name="auto_awesome" size={size * 0.45} color="#2FD5C1" />
      ) : (
        <Text style={[styles.avatarText, { fontSize: size * 0.36, lineHeight: size * 0.46 }]}>{initials(name)}</Text>
      )}
    </View>
  );
}

export function RoleTag({ role }: { role: HouseholdRole }) {
  return (
    <Tag
      label={ROLE_LABELS[role]}
      icon={role === 'owner' ? 'workspace_premium' : role === 'child' ? 'child_care' : undefined}
      tone={role === 'owner' ? 'teal' : 'neutral'}
    />
  );
}

export function SectionHeader({
  title,
  count,
  action,
  href,
}: {
  title: string;
  count?: number;
  action?: string;
  href?: Href;
}) {
  const { styles } = useLook();
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {count != null ? (
        <View style={styles.countPill}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
      <View style={styles.flex} />
      {action && href ? (
        <Pressable hitSlop={8} accessibilityRole="link" onPress={() => router.push(href)}>
          <Text style={styles.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Carte de choix (rôle, membre…) : sélection en noir, comme les puces validées. */
export function ChoiceCard({
  title,
  hint,
  icon,
  selected,
  onPress,
}: {
  title: string;
  hint?: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}>
      {icon ? (
        <View style={styles.choiceIcon}>
          <Icon name={icon} size={20} color={c.text} />
        </View>
      ) : null}
      <View style={styles.flex}>
        <Text style={styles.choiceTitle}>{title}</Text>
        {hint ? <Text style={styles.choiceHint}>{hint}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? <Icon name="check" size={16} color={c.solidText} /> : null}
      </View>
    </Pressable>
  );
}

/** Petit bouton noir compact (cartes, suggestions). */
export function SmallButton({
  label,
  icon,
  onPress,
  variant = 'dark',
}: {
  label: string;
  icon?: string;
  onPress: () => void;
  variant?: 'dark' | 'light' | 'danger';
}) {
  const { c, styles } = useLook();
  const color = variant === 'dark' ? c.solidText : variant === 'danger' ? c.error : c.text;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.small,
        variant === 'light' && styles.smallLight,
        variant === 'danger' && styles.smallDanger,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Text style={[styles.smallText, { color }]}>{label}</Text>
    </Pressable>
  );
}

/** Récupère le message laissé par un autre écran (ex. « Invitation envoyée »). */
export function useFlashToast() {
  const { flash } = useHouseholdState();
  const [toast, setToast] = useState<{ text: string; undo?: () => void } | null>(null);
  useFocusEffect(
    useCallback(() => {
      if (flash) {
        setToast(flash);
        householdActions.setFlash(null);
      }
    }, [flash]),
  );
  return [toast, setToast] as const;
}

function makeHouseholdStyles(c: AppColors) {
  return StyleSheet.create({
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.soft,
      borderWidth: 1,
      borderColor: c.border,
    },
    noteText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.text,
    },
  });
}

const HOUSEHOLDSTYLES_SHEETS = { light: makeHouseholdStyles(LIGHT), dark: makeHouseholdStyles(DARK) };
/** Version claire (écrans pas encore convertis au mode sombre). */
export const householdStyles = HOUSEHOLDSTYLES_SHEETS.light;

/** householdStyles du mode actuel. */
export function useHouseholdStyles() {
  return useScopedColors().dark ? HOUSEHOLDSTYLES_SHEETS.dark : HOUSEHOLDSTYLES_SHEETS.light;
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    pressed: {
      opacity: 0.8,
    },
    avatar: {
      borderRadius: Radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: FontFamily.headingBold,
      color: '#FFFFFF',
    },
    avatarDark: {
      borderWidth: 1.5,
      borderColor: '#3B5079',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 26,
      marginBottom: 10,
    },
    sectionTitle: {
      fontFamily: FontFamily.headingBold,
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.3,
      color: c.text,
    },
    countPill: {
      minWidth: 24,
      height: 24,
      paddingHorizontal: 7,
      borderRadius: Radius.full,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    countText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
    },
    link: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.link,
    },
    choice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 64,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    choiceSelected: {
      borderWidth: 2,
      borderColor: c.solid,
      padding: 13,
    },
    choiceIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    choiceTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    choiceHint: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    radio: {
      width: 26,
      height: 26,
      borderRadius: Radius.full,
      borderWidth: 2,
      borderColor: c.dark ? '#3B5079' : '#b9c4d6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: {
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    small: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: c.solid,
    },
    smallLight: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    smallDanger: {
      backgroundColor: c.dark ? '#3B1D24' : '#fff5f5',
      borderWidth: 1,
      borderColor: c.dark ? '#5B2A33' : '#fecaca',
    },
    smallText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
