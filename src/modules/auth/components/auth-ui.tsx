// Éléments visuels partagés par les écrans d'authentification.
// Style de référence : l'écran de connexion validé (fond lavande, accents turquoise, bouton noir).
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { BrandFullLogo } from '@/components/brand-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Icon } from '@/components/icon';
import { DARK, LIGHT, useAppColors, type AppColors } from '@/constants/app-colors';
import { FontFamily, Radius, Serene, Space } from '@/constants/design';

/** Fond décoratif : reflet turquoise en haut, vagues lavande en bas. */
export function AuthBackground() {
  const { c, styles } = useLook();
  return (
    <View style={styles.decor} pointerEvents="none">
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <View style={styles.blobTop} />
      <View style={styles.waveBottom} />
      <View style={styles.waveBottomInner} />
    </View>
  );
}

type AuthScreenProps = {
  children: ReactNode;
  /** Bouton soleil/lune en haut à droite (désactivé si l'écran a sa propre barre du haut). */
  toggle?: boolean;
  /** Affiche la flèche retour en haut à gauche. */
  back?: boolean;
  /** Centre verticalement le contenu (écrans de succès, démarrage). */
  centered?: boolean;
  /** Contenu fixé en bas de l'écran, hors défilement. */
  footer?: ReactNode;
};

/** Cadre commun : zone sûre, fond, clavier, défilement et largeur maximale. */
export function AuthScreen({ children, back, centered, footer, toggle = true }: AuthScreenProps) {
  const { styles } = useLook();
  return (
    <SafeAreaView style={styles.safe}>
      <AuthBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, centered && styles.contentCentered]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {back || toggle ? (
            <View style={styles.topBar}>
              {back ? <BackButton /> : <View />}
              {toggle ? <ThemeToggle /> : null}
            </View>
          ) : null}
          {children}
        </ScrollView>
        {footer ? <View style={styles.fixedFooter}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function BackButton() {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.backButton, pressed && styles.pressedIcon]}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel="Retour"
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}>
      <Icon name="arrow_back" size={26} color={c.text} />
    </Pressable>
  );
}

/** Logo et nom de l'application. `compact` : petit carré seul. */
export function AuthBrand({ compact, large }: { compact?: boolean; large?: boolean }) {
  const { c, styles } = useLook();
  const height = compact ? 34 : large ? 56 : 46;
  return (
    <View style={[styles.brandRow, large && styles.brandColumn]}>
      <BrandFullLogo height={height} onDark={c.dark} />
    </View>
  );
}

type AuthTitleProps = {
  lead: string;
  accent: string;
  subtitle?: ReactNode;
  centered?: boolean;
};

/** Titre sur deux lignes, la seconde en turquoise et soulignée. */
export function AuthTitle({ lead, accent, subtitle, centered }: AuthTitleProps) {
  const { styles } = useLook();
  return (
    <View style={[styles.titleBlock, centered && styles.titleBlockCentered]}>
      <Text style={[styles.title, centered && styles.textCentered]}>
        {lead} <Text style={styles.accent}>{accent}</Text>
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, centered && styles.textCentered]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

/** Haut des écrans d'accès sans retour : logo complet à gauche, bouton soleil/lune à droite (comme la Connexion). */
export function AuthTopBar() {
  const { c, styles } = useLook();
  return (
    <View style={styles.topBrand}>
      <BrandFullLogo height={46} onDark={c.dark} />
      <ThemeToggle />
    </View>
  );
}

/** Pictogramme dans un carré turquoise clair. */
export function AuthIconTile({ name, size = 64 }: { name: string; size?: number }) {
  const { c, styles } = useLook();
  return (
    <View style={[styles.iconTile, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Icon name={name} size={Math.round(size * 0.48)} color={c.link} filled />
    </View>
  );
}

export function AuthCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { styles } = useLook();
  return <View style={[styles.card, style]}>{children}</View>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Bouton principal noir. */
export function PrimaryButton({
  label,
  onPress,
  icon = 'arrow_forward',
  disabled,
  loading,
  loadingLabel,
  style,
}: ButtonProps) {
  const { c, styles } = useLook();
  const inactive = disabled || loading;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && !inactive && styles.primaryButtonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}>
      {loading ? (
        <>
          <ActivityIndicator color={c.solidText} />
          <Text style={styles.primaryButtonText}>{loadingLabel ?? label}</Text>
        </>
      ) : (
        <>
          <Text style={[styles.primaryButtonText, disabled && styles.primaryButtonTextDisabled]}>
            {label}
          </Text>
          {icon ? (
            <Icon
              name={icon}
              size={22}
              color={c.solidText}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

/** Bouton secondaire blanc bordé. */
export function SecondaryButton({ label, onPress, icon, style }: ButtonProps) {
  const { c, styles } = useLook();
  return (
    <Pressable
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed, style]}
      accessibilityRole="button"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={20} color={c.text} /> : null}
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

type LinkProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  /** Icône placée après le texte. */
  trailingIcon?: string;
  muted?: boolean;
};

/** Lien texte turquoise en gras (ou gris si `muted`). */
export function TextLink({ label, onPress, icon, trailingIcon, muted }: LinkProps) {
  const { c, styles } = useLook();
  const color = muted ? c.muted : c.link;
  return (
    <Pressable
      style={({ pressed }) => [styles.link, pressed && styles.pressedLink]}
      hitSlop={8}
      accessibilityRole="link"
      onPress={onPress}>
      {icon ? <Icon name={icon} size={18} color={color} /> : null}
      <Text style={[styles.linkText, { color }]}>{label}</Text>
      {trailingIcon ? <Icon name={trailingIcon} size={18} color={color} /> : null}
    </Pressable>
  );
}

/** Note d'information discrète. */
export function InfoNote({
  icon,
  iconColor,
  children,
  tone = 'neutral',
}: {
  icon: string;
  iconColor?: string;
  children: ReactNode;
  tone?: 'neutral' | 'success';
}) {
  const { c, styles } = useLook();
  return (
    <View style={[styles.note, tone === 'success' && styles.noteSuccess]}>
      <Icon name={icon} size={20} color={iconColor ?? c.muted} />
      <Text style={[styles.noteText, tone === 'success' && styles.noteTextSuccess]}>{children}</Text>
    </View>
  );
}

/** Message d'erreur sous un formulaire (réponse du serveur, réseau…). Rien si `message` est vide. */
export function FormError({ message }: { message?: string | null }) {
  const formStyles = useFormStyles();
  const { c } = useLook();
  if (!message) return null;
  return (
    <View style={formStyles.errorRow} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Icon name="error" size={16} color={c.error} />
      <Text style={formStyles.errorText}>{message}</Text>
    </View>
  );
}

/** Séparateur « ou ». */
export function Divider({ label }: { label: string }) {
  const { styles } = useLook();
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

/** Styles de formulaire communs (libellés, champs, erreurs, pied de page). */
function makeFormStyles(c: AppColors) {
  return StyleSheet.create({
    fieldLabel: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 15,
      lineHeight: 20,
      color: c.text,
      marginBottom: 10,
    },
    fieldLabelSpaced: {
      marginTop: 20,
    },
    required: {
      color: c.error,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      height: 54,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
    },
    inputRowFocused: {
      borderColor: c.link,
      backgroundColor: c.card,
    },
    inputRowError: {
      borderColor: c.error,
      backgroundColor: c.card,
    },
    input: {
      height: 54,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
      fontFamily: FontFamily.body,
      fontSize: 16,
      color: c.text,
      outlineWidth: 0,
    },
    inputInline: {
      flex: 1,
      minWidth: 0,
      outlineWidth: 0,
      fontFamily: FontFamily.body,
      fontSize: 16,
      color: c.text,
      paddingVertical: 0,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    errorText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      color: c.error,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: Space.lg,
    },
    footerText: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 19,
      color: c.muted,
    },
    centerRow: {
      alignItems: 'center',
      marginTop: Space.md,
    },
  });
}

const FORM_STYLES = { light: makeFormStyles(LIGHT), dark: makeFormStyles(DARK) };

/** Styles de formulaire communs (libellés, champs, erreurs, pied de page) du mode actuel. */
export function useFormStyles() {
  return useAppColors().dark ? FORM_STYLES.dark : FORM_STYLES.light;
}

const STYLES = { light: makeStyles(LIGHT), dark: makeStyles(DARK) };

/** Couleurs et styles du mode actuel (clair ou sombre). */
function useLook() {
  const c = useAppColors();
  return { c, styles: c.dark ? STYLES.dark : STYLES.light };
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.page,
    },
    flex: {
      flex: 1,
    },
    content: {
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: Space.md,
      paddingBottom: 40,
    },
    contentCentered: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    fixedFooter: {
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingBottom: Space.lg,
      paddingTop: Space.sm,
    },
    decor: {
      ...StyleSheet.absoluteFill,
      overflow: 'hidden',
    },
    blobTop: {
      position: 'absolute',
      top: -120,
      right: -110,
      width: 300,
      height: 300,
      borderRadius: Radius.full,
      backgroundColor: c.glow,
      opacity: 0.28,
    },
    waveBottom: {
      position: 'absolute',
      bottom: -260,
      left: -80,
      right: -80,
      height: 330,
      borderRadius: 400,
      backgroundColor: c.soft,
      opacity: 0.9,
    },
    waveBottomInner: {
      position: 'absolute',
      bottom: -300,
      right: -160,
      width: 420,
      height: 340,
      borderRadius: Radius.full,
      backgroundColor: c.glow,
      opacity: 0.25,
    },
    topBar: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Space.sm,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -10,
    },
    pressedIcon: {
      opacity: 0.55,
    },
    pressedLink: {
      opacity: 0.65,
    },
    topBrand: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    brandColumn: {
      flexDirection: 'column',
      gap: 18,
    },
    brandTextCentered: {
      alignItems: 'center',
    },
    accent: {
      color: c.link,
    },
    titleBlock: {
      marginTop: 28,
      marginBottom: 18,
    },
    titleBlockCentered: {
      alignItems: 'center',
    },
    title: {
      fontFamily: FontFamily.headingBold,
      fontSize: 26,
      lineHeight: 32,
      letterSpacing: -0.5,
      color: c.text,
    },
    textCentered: {
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: FontFamily.body,
      fontSize: 14,
      lineHeight: 20,
      color: c.muted,
      marginTop: 6,
    },
    iconTile: {
      backgroundColor: c.tintMint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      marginTop: Space.lg,
      padding: 16,
      borderRadius: 22,
      backgroundColor: c.card,
      shadowColor: c.text,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.07,
      shadowRadius: 24,
      elevation: 4,
    },
    primaryButton: {
      height: 56,
      borderRadius: 18,
      backgroundColor: c.solid,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 22,
      shadowColor: c.solid,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.22,
      shadowRadius: 16,
      elevation: 8,
    },
    primaryButtonDisabled: {
      // Bouton noir estompé : reste reconnaissable comme bouton, sans se confondre avec un champ.
      opacity: 0.3,
      shadowOpacity: 0,
      elevation: 0,
    },
    primaryButtonPressed: {
      backgroundColor: c.solidPressed,
      transform: [{ scale: 0.99 }],
    },
    primaryButtonText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 18,
      lineHeight: 23,
      color: c.solidText,
    },
    primaryButtonTextDisabled: {
      color: c.solidText,
    },
    secondaryButton: {
      height: 56,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 12,
    },
    secondaryPressed: {
      backgroundColor: c.soft,
      transform: [{ scale: 0.99 }],
    },
    secondaryButtonText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 16,
      lineHeight: 21,
      color: c.text,
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    linkText: {
      fontFamily: FontFamily.bodySemiBold,
      fontSize: 14,
      lineHeight: 19,
    },
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginTop: Space.lg,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.soft,
    },
    noteSuccess: {
      borderColor: '#bbf7d0',
      backgroundColor: Serene.successContainer,
    },
    noteText: {
      flex: 1,
      fontFamily: FontFamily.body,
      fontSize: 13,
      lineHeight: 19,
      color: c.muted,
    },
    noteTextSuccess: {
      fontFamily: FontFamily.bodyMedium,
      color: c.success,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 28,
      marginBottom: 18,
    },
    dividerLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.border,
    },
    dividerText: {
      fontFamily: FontFamily.bodyMedium,
      fontSize: 14,
      lineHeight: 18,
      color: c.muted,
    },
  });
}
