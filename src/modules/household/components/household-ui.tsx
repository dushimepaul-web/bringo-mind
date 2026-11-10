// Composants communs aux écrans du Foyer.
import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Tag } from '@/components/ui/kit';
import { FontFamily, Radius, Serene, Tint } from '@/constants/design';

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
  return (
    <View
      style={[styles.avatar, { width: size, height: size, backgroundColor: kora ? Tint.black : color }]}
      accessibilityElementsHidden
      importantForAccessibility="no">
      {kora ? (
        <Icon name="auto_awesome" size={size * 0.45} color={Tint.glow} />
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
  return (
    <Pressable
      style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}>
      {icon ? (
        <View style={styles.choiceIcon}>
          <Icon name={icon} size={20} color={Tint.navy} />
        </View>
      ) : null}
      <View style={styles.flex}>
        <Text style={styles.choiceTitle}>{title}</Text>
        {hint ? <Text style={styles.choiceHint}>{hint}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? <Icon name="check" size={16} color={Serene.onPrimary} /> : null}
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
  const color = variant === 'dark' ? Serene.onPrimary : variant === 'danger' ? Serene.error : Tint.navy;
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

export const householdStyles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: Tint.soft,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: Tint.navy,
  },
});

const styles = StyleSheet.create({
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
    color: Serene.onPrimary,
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
    color: Tint.navy,
  },
  countPill: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: Radius.full,
    backgroundColor: Tint.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: Tint.navy,
  },
  link: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Tint.primary,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Tint.border,
    backgroundColor: Serene.surfaceContainerLowest,
  },
  choiceSelected: {
    borderWidth: 2,
    borderColor: Tint.black,
    padding: 13,
  },
  choiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Tint.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    lineHeight: 21,
    color: Tint.navy,
  },
  choiceHint: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 18,
    color: Serene.onSurfaceVariant,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#b9c4d6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: Tint.black,
    borderColor: Tint.black,
  },
  small: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Tint.black,
  },
  smallLight: {
    backgroundColor: Serene.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Tint.border,
  },
  smallDanger: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  smallText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
  },
});
