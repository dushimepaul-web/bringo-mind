// Briques des écrans de réglages (profil, préférences, notifications, confidentialité).
// Partagées par plusieurs modules : ne dépendent d'aucun module métier.
import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { DARK, LIGHT, useScopedColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius } from '@/constants/design';

/** Titre de groupe + carte qui contient les lignes. */
export function SettingsSection({
  title,
  icon,
  children,
  footer,
}: {
  title: string;
  icon?: string;
  children: ReactNode;
  footer?: string;
}) {
  const { c, styles } = useLook();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        {icon ? <Icon name={icon} size={18} color={c.muted} /> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.card}>{children}</View>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
}

/** Ligne de réglage : icône, titre, sous-titre et élément à droite (flèche, interrupteur, badge). */
export function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
  danger,
  disabled,
  first,
  tint,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  /** Première ligne de la carte : pas de séparateur au-dessus. */
  first?: boolean;
  /** Carré de couleur derrière l'icône (icône blanche), comme les réglages du téléphone. */
  tint?: string;
}) {
  const { c, styles } = useLook();
  const color = danger ? c.error : c.text;
  const content = (
    <>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger, tint ? { backgroundColor: tint } : null]}>
        <Icon name={icon} size={20} color={tint ? '#FFFFFF' : color} filled={!!tint} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron_right" size={22} color={c.muted} /> : null)}
    </>
  );
  const style = [styles.row, !first && styles.rowBorder, disabled && styles.disabled];
  if (!onPress) return <View style={style}>{content}</View>;
  return (
    <Pressable
      style={({ pressed }) => [...style, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      disabled={disabled}
      onPress={onPress}>
      {content}
    </Pressable>
  );
}

/** Interrupteur aux couleurs de l'app (turquoise quand il est activé). */
export function ToggleSwitch({
  value,
  onValueChange,
  label,
  disabled,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  const { c } = useLook();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#c3cfe0', true: c.link }}
      thumbColor={c.card}
      {...(Platform.OS === 'web' ? { activeThumbColor: c.card } : {})}
      ios_backgroundColor="#c3cfe0"
      accessibilityLabel={label}
    />
  );
}

/** Ligne à choix unique (langue, fuseau…) : rond noir coché, comme les puces validées. */
export function RadioRow({
  title,
  subtitle,
  badge,
  selected,
  onPress,
  first,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
  first?: boolean;
}) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.row, !first && styles.rowBorder, pressed && styles.pressed]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? <Icon name="check" size={16} color={c.solidText} /> : null}
      </View>
    </Pressable>
  );
}

/** Libellé d'un groupe de puces à l'intérieur d'une carte. */
export function FieldLabel({ children }: { children: string }) {
  const { styles } = useLook();
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

function makeSettingsStyles(c: AppColors) {
  return StyleSheet.create({
    inset: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 8,
    },
    insetBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    chips: {
      gap: 8,
    },
  });
}

const SETTINGSSTYLES_SHEETS = { light: makeSettingsStyles(LIGHT), dark: makeSettingsStyles(DARK) };
/** Version claire (écrans pas encore convertis au mode sombre). */
export const settingsStyles = SETTINGSSTYLES_SHEETS.light;

/** settingsStyles du mode actuel. */
export function useSettingsStyles() {
  return useScopedColors().dark ? SETTINGSSTYLES_SHEETS.dark : SETTINGSSTYLES_SHEETS.light;
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    section: {
      marginTop: 22,
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: c.muted,
    },
    card: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      overflow: 'hidden',
    },
    footer: {
      marginTop: 8,
      paddingHorizontal: 4,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 60,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    rowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.border,
    },
    pressed: {
      backgroundColor: c.soft,
    },
    disabled: {
      opacity: 0.45,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowIconDanger: {
      backgroundColor: '#fee2e2',
    },
    rowText: {
      flex: 1,
      minWidth: 0,
    },
    rowTitle: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    rowSubtitle: {
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 18,
      color: c.muted,
    },
    badge: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: c.soft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontFamily: FontFamily.bodyBold,
      fontSize: 13,
      lineHeight: 17,
      color: c.text,
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
      backgroundColor: c.solid,
      borderColor: c.solid,
    },
    fieldLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
      color: c.muted,
    },
  });
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (sombre seulement dans un module converti). */
function useLook() {
  const c = useScopedColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}
